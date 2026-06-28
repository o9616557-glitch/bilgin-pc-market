import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth"; // 🚀 AKILLI RADAR SİLİNMEDİ
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function GET(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 🛡️ AKILLI RADAR: Hata vermemesi için korumaya alındı
    try {
      const session = await getServerSession(authOptions);
      if (session && session.user?.email) {
        const loggedInUser = await User.findOne({ email: session.user.email });
        if (loggedInUser && loggedInUser.isVerified) {
          return NextResponse.json({ message: "Hesabınız zaten onaylı. Alışverişe devam edebilirsiniz." }, { status: 200 });
        }
      }
    } catch (radarError) {
      // Radar tökezlerse sistemi çökertmez, sessizce alttaki koda geçer
      console.log("Radar atlandı, normal onaya geçiliyor.");
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Geçersiz veya eksik onay kodu." }, { status: 400 });
    }

    // Önce token ile ara (Çift tıklama hatasını çözen kısım)
    const userByToken = await User.findOne({ verificationToken: token });

    if (userByToken) {
      userByToken.isVerified = true;
      (userByToken as any).verificationToken = undefined;
      await userByToken.save();

      return NextResponse.json({ message: "Hesabınız başarıyla onaylandı!" }, { status: 200 });
    }

    // Token bulunamadıysa zaten onaylanmıştır
    return NextResponse.json({ message: "Bu bağlantı daha önce kullanılmış veya geçersiz." }, { status: 400 });

  } catch (error) {
    console.error("E-posta Onay Hatası:", error);
    return NextResponse.json({ message: "Onaylama esnasında sunucu hatası oluştu." }, { status: 500 });
  }
}