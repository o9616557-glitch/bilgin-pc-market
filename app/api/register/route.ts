import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 1. Kullanıcı zaten var mı kontrolü
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "Bu e-posta adresi zaten kayıtlı!" }, { status: 400 });
    }

    // 2. Şifreyi şifrele
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Rastgele e-posta onay bileti (Token) üret
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 4. Kullanıcıyı ONAYSIZ olarak veritabanına kaydet
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false, 
      verificationToken,
    });
    
    // ADAM VERİTABANINA KAYDEDİLDİ!
    await newUser.save();

    // 5. GMAIL POSTACISI BÖLÜMÜ (ÖZEL KALKANLI)
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // Şefim buraya process.env.EMAIL_USER ve process.env.EMAIL_PASS yazman daha sağlıklıdır ama şimdilik orijinalini bozmadım
          user: "o9616557@gmail.com", 
          pass: "vfph bxkd gzsv enpg", 
        },
      });

      const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/eposta-onayla?token=${verificationToken}`;

      const mailOptions = {
        from: '"Bilgin PC Market" <o9616557@gmail.com>',
        to: email,
        subject: "Hesabınızı Onaylayın - Bilgin PC Market",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050814; color: #ffffff; border-radius: 10px;">
            <h2 style="color: #3b82f6; text-align: center;">Bilgin PC Market'e Hoş Geldiniz!</h2>
            <p style="color: #e2e8f0; font-size: 16px;">Merhaba ${name},</p>
            <p style="color: #e2e8f0; font-size: 16px;">Hesabınızı aktifleştirmek ve güvenli alışverişe başlamak için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background-color: #3b82f6; color: #000000; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">Hesabımı Onayla</a>
            </div>
            <p style="color: #94a3b8; font-size: 14px;">Eğer bu kaydı siz yapmadıysanız, bu e-postayı dikkate almayabilirsiniz.</p>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">Saygılarımızla,<br>Bilgin PC Market Ekibi</p>
          </div>
        `,
      };

      // Maili fırlat
      await transporter.sendMail(mailOptions);

    } catch (mailError) {
      // 🚀 BİNGO: GERİ VİTES (ROLLBACK) MOTORU
      // Eğer Gmail bir sebepten maili atamazsa, az önce kaydettiğimiz adamı veritabanından siliyoruz ki hayalet olarak kalmasın!
      await User.deleteOne({ email: email });
      console.error("Mail Gönderme Hatası:", mailError);
      return NextResponse.json({ message: "Sistemde e-posta gönderim hatası var. Google şifrenizi kontrol edin." }, { status: 500 });
    }

    return NextResponse.json({ message: "Kayıt başarılı! Lütfen e-posta adresinize gönderilen onay linkine tıklayın." }, { status: 201 });

  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json({ message: "Kayıt oluşturulurken bir hata meydana geldi." }, { status: 500 });
  }
}