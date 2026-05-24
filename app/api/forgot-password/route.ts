import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 1. Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı." }, { status: 404 });
    }

    // 2. Rastgele 64 karakterli gizli bilet (token) üret
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Tam 1 saat (3.600.000 ms) geçerli

    // 3. Bileti veritabanına kaydet (🚀 TypeScript hatasını çözen sihirli yama: as any)
    (user as any).resetToken = resetToken;
    (user as any).resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // 4. MAİL KURYEMİZİ HAZIRLIYORUZ (Şefim buradaki şifreyi kendi info şifrenle değiştirmelisin)
    const transporter = nodemailer.createTransport({
      host: "smtp.bilginpcmarket.com", // cPanel veya sunucu sağlayıcının SMTP adresi
      port: 465, // Güvenli port
      secure: true,
      auth: {
        user: "info@bilginpcmarket.com",
        pass: "BURAYA_INFO_MAILININ_SIFRESINI_YAZ", // 🚨 DİKKAT: Info mailinin şifresi
      },
    });

    // 5. Müşteriye gidecek linki ve maili hazırla
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/yeni-sifre?token=${resetToken}`;
    
    const mailOptions = {
      from: '"Bilgin PC Market" <info@bilginpcmarket.com>',
      to: email,
      subject: "Şifre Sıfırlama Talebi - Bilgin PC Market",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050814; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #00e5ff; text-align: center;">Şifre Sıfırlama Talebi</h2>
          <p style="color: #e2e8f0; font-size: 16px;">Merhaba,</p>
          <p style="color: #e2e8f0; font-size: 16px;">Bilgin PC Market hesabınız için bir şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00e5ff; color: #000000; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">Yeni Şifre Belirle</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">Eğer bu talebi siz yapmadıysanız, bu e-postayı güvenle silebilirsiniz. Şifreniz değiştirilmeyecektir.</p>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">Saygılarımızla,<br>Bilgin PC Market Ekibi</p>
        </div>
      `,
    };

    // 6. Maili gönder
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." }, { status: 200 });

  } catch (error) {
    console.error("Mail Gönderme Hatası:", error);
    return NextResponse.json({ message: "Mail gönderilirken bir hata oluştu." }, { status: 500 });
  }
}