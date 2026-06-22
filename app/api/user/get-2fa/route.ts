import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 🚀 GİZLİ ANAHTAR GELDİ
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    // 🚀 Anahtarı buraya da verdik ki kimin ayarına bakacağını görevli bilsin
    const session = await getServerSession(authOptions); 
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem." }, { status: 401 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // 🚀 İŞTE VİTRİNE GİDEN PAKET (Kuryenin Cebini Genişlettik)
   // 🚀 İŞTE VİTRİNE GİDEN PAKET (Kuryenin Cebini Genişlettik)
    return NextResponse.json({
      twoFactorEmail: user.twoFactorEmail || false,
      twoFactorSms: user.twoFactorSms || false,
      activeDevices: user.activeDevices || [], // 🚀 ŞEFİM EKSİK OLAN RADAR KABLOSU BU!
      notificationPreference: user.notificationPreference || 'new_device' // 🚀 ŞEFİN YENİ GÜVENLİK ŞARTELİ KURYEYE VERİLDİ!
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}