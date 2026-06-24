import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 1. Bu gizli bilete (token) sahip ve süresi henüz dolmamış (1 saati geçmemiş) kullanıcıyı bul
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, 
    });

    if (!user) {
      return NextResponse.json(
        { message: "Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş." },
        { status: 400 }
      );
    }

    // 🚀 AKILLI RADAR 1: Adam şu an kullandığı şifrenin aynısını mı yazdı?
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return NextResponse.json(
        { message: "Güvenliğiniz için lütfen mevcut şifrenizden farklı bir şifre belirleyiniz." },
        { status: 400 }
      );
    }

    // 🚀 AKILLI RADAR 2: Adamın yazdığı şifre, geçmişteki (son 3) şifreleriyle eşleşiyor mu?
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const oldHashedPassword of user.passwordHistory) {
        const isMatched = await bcrypt.compare(newPassword, oldHashedPassword);
        if (isMatched) {
          return NextResponse.json(
            { message: "Güvenliğiniz için lütfen daha önce kullandığınız şifrelerden farklı bir şifre belirleyiniz." },
            { status: 400 }
          );
        }
      }
    }

    // 🚀 RADARLARDAN TEMİZ GEÇTİ: Şu anki eski şifreyi arşive kaldır (Geçmiş hafızasına ekle)
    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }
    user.passwordHistory.push(user.password);
    
    // Hafızanın şişmemesi için sadece son 3 şifreyi tut, en eskisini sil
    if (user.passwordHistory.length > 3) {
      user.passwordHistory.shift(); 
    }

    // 2. Yeni şifreyi kriptola (Güvenlik için Hash'le)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Kullanıcının şifresini güncelle ve kullandığı bileti çöpe at
    user.password = hashedPassword;
    (user as any).resetToken = undefined;
    (user as any).resetTokenExpiry = undefined;
    
    await user.save();

    return NextResponse.json({ message: "Şifreniz başarıyla güncellendi." }, { status: 200 });
  } catch (error) {
    console.error("Şifre Sıfırlama Hatası:", error);
    return NextResponse.json({ message: "Şifre güncellenirken sunucu hatası oluştu." }, { status: 500 });
  }
}