import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Veritabanına Bağlan (Eğer zaten bağlıysa tekrar bağlanmaz)
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 2. Bu e-posta daha önce kullanılmış mı diye kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    // 3. Şifreyi şifrele (Kriptola)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Yeni kullanıcıyı veritabanına kaydet
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json(
      { message: "Kayıt sırasında sunucu kaynaklı bir hata oluştu." },
      { status: 500 }
    );
  }
}