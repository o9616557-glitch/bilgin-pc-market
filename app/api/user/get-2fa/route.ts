import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem." }, { status: 401 });
    }

    // 🚀 VİTRİNDEN GELEN ŞARTELLERİ VE MAİL AYARINI ALIYORUZ
    const { twoFactorEmail, twoFactorSms, notificationPreference } = await req.json();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 🚀 DEPOYA (VERİTABANINA) YENİ AYARLARI ÇAKIYORUZ
    await User.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          twoFactorEmail: twoFactorEmail || false,
          twoFactorSms: twoFactorSms || false,
          notificationPreference: notificationPreference || 'new_device' 
        } 
      }
    );

    return NextResponse.json({ message: "Güvenlik ayarları başarıyla kaydedildi." }, { status: 200 });

  } catch (error) {
    console.error("2FA ve Şartel Güncelleme Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}