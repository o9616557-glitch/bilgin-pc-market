import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth"; // 🚀 AKILLI RADAR: Oturum kontrolcüsü
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 🚀 AKILLI RADAR: Güvenlik ayarları

export async function GET(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 🚀 AKILLI RADAR DEVREDE: Adam zaten içeride mi diye kapıya bakıyoruz
    const session = await getServerSession(authOptions);

    if (session && session.user?.email) {
      const loggedInUser = await User.findOne({ email: session.user.email });
      // ŞEFİM BİNGO: Adam zaten içerideyse ve hesabı çoktan onaylanmışsa, ona "süresi dolmuş" deme!
      if (loggedInUser && loggedInUser.isVerified) {
        return NextResponse.json({ message: "Hesabınız zaten onaylı. Alışverişe devam edebilirsiniz." }, { status: 200 });
      }
    }

    // --- SENİN KUSURSUZ ÇALIŞAN ESKİ KODUN (Buradan aşağısına hiç dokunulmadı) ---
    
    // Linkteki ?token=... kısmını yakalıyoruz
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Geçersiz veya eksik onay kodu." }, { status: 400 });
    }

    // 1. Bu onay biletine sahip kullanıcıyı bul
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ message: "Bu onay bağlantısı geçersiz veya süresi dolmuş." }, { status: 400 });
    }

    // 2. Hesabı aktifleştir ve bilet kodunu sil
    user.isVerified = true;
    (user as any).verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Hesabınız başarıyla onaylandı!" }, { status: 200 });
  } catch (error) {
    console.error("E-posta Onay Hatası:", error);
    return NextResponse.json({ message: "Onaylama esnasında sunucu hatası oluştu." }, { status: 500 });
  }
}