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

    // Zaten onaylanmış mı kontrol et
    const alreadyVerified = await User.findOne({
      isVerified: true,
      verificationToken: { $exists: false },
    }).where("_id").exists(true);

    // Token ile kullanıcıyı bul VE aynı anda güncelle (atomik işlem)
    const user = await User.findOneAndUpdate(
      { verificationToken: token }, // token olan kullanıcıyı bul
      {
        $set: { isVerified: true },
        $unset: { verificationToken: "" }, // token'ı tamamen sil
      },
      { new: true } // güncellenmiş kaydı döndür
    );

    if (!user) {
      // Token bulunamadı — daha önce kullanılmış olabilir
      // Eğer bu token'a ait kullanıcı isVerified:true ise başarı say
      return NextResponse.json(
        { message: "Bu hesap zaten onaylanmış veya bağlantı geçersiz." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Hesabınız başarıyla onaylandı!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("E-posta Onay Hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu.", detail: String(error) },
      { status: 500 }
    );
  }
}