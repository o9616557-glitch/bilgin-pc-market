import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Geçersiz veya eksik onay kodu." },
        { status: 400 }
      );
    }

    // Önce token ile ara
    const userByToken = await User.findOne({ verificationToken: token });

    if (userByToken) {
      // Token bulundu → onaylanmamış kullanıcı, onaylayalım
      userByToken.isVerified = true;
      (userByToken as any).verificationToken = undefined;
      await userByToken.save();

      return NextResponse.json(
        { message: "Hesabınız başarıyla onaylandı!" },
        { status: 200 }
      );
    }

    // Token bulunamadı → ya zaten onaylandı ya da token geçersiz
    return NextResponse.json(
      { message: "Bu bağlantı daha önce kullanılmış veya geçersiz." },
      { status: 400 }
    );
  } catch (error) {
    console.error("E-posta Onay Hatası:", error);
    return NextResponse.json(
      { message: "Onaylama esnasında sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}