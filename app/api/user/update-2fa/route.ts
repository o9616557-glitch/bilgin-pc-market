import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 🚀 GİZLİ ANAHTAR GELDİ
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 🚀 Anahtarı içeriye teslim ettik, artık session boşa çıkmayacak
    const session = await getServerSession(authOptions); 
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem. Lütfen giriş yapınız." }, { status: 401 });
    }

    const body = await req.json();
    const { twoFactorEmail, twoFactorSms } = body;

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    user.twoFactorEmail = twoFactorEmail;
    user.twoFactorSms = twoFactorSms;
    await user.save();

    return NextResponse.json({ message: "Güvenlik ayarlarınız başarıyla kaydedildi!" }, { status: 200 });

  } catch (error) {
    console.error("2FA güncelleme motorunda arıza:", error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}