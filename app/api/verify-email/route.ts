import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // Linkteki ?token=... kısmını yakalıyoruz
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Geçersiz veya eksik onay kodu." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
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