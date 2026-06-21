import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User"; 
import nodemailer from "nodemailer"; // 🚀 KURYEMİZİ DÜKKANA ALDIK

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Sifre", type: "password" },
        code: { label: "2FA Kodu", type: "text" } 
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifre girin.");
        }

        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI as string);
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Şifre hatalı, lütfen tekrar deneyin.");
        }

        // ==========================================
        // 🚀 İKİ ADIMLI DOĞRULAMA MOTORU VE KURYESİ
        // ==========================================
        if (user.twoFactorEmail) {
          
          // DURUM 1: Adam şifreyi girmiş ama KODU henüz girmemiş (Kuryeyi Yolla)
          if (!credentials.code) {
            
            // 1. 6 Haneli Şifre Üret
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

            // 2. Şifreyi 3 dakikalığına müşterinin hesabına kazı
            user.twoFactorCode = generatedCode;
            user.twoFactorExpires = new Date(Date.now() + 3 * 60 * 1000);
            await user.save();

            // 3. 🚀 SENİN GMAIL KURYEN ÇALIŞIYOR
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: "o9616557@gmail.com", 
                pass: "vfph bxkd gzsv enpg", 
              },
            });

            const mailOptions = {
              from: '"Bilgin PC Güvenlik" <o9616557@gmail.com>',
              to: credentials.email,
              subject: "Güvenlik Kodunuz - Bilgin PC Market",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050814; color: #ffffff; border-radius: 10px; border: 1px solid #1e293b;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #3b82f6; margin: 0; letter-spacing: 2px;">BİLGİN PC</h2>
                  </div>
                  <h3 style="color: #e2e8f0; text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">İki Adımlı Doğrulama</h3>
                  <p style="color: #94a3b8; font-size: 16px; text-align: center;">Hesabınıza giriş yapmak için güvenik kodunuz oluşturuldu.</p>
                  
                  <div style="text-align: center; margin: 40px 0;">
                    <div style="display: inline-block; background-color: #020617; border: 2px dashed #3b82f6; color: #ffffff; padding: 20px 40px; font-weight: 900; border-radius: 15px; font-size: 36px; letter-spacing: 15px; text-shadow: 0 0 10px rgba(59,130,246,0.5);">
                      ${generatedCode}
                    </div>
                  </div>
                  
                  <p style="color: #ef4444; font-size: 13px; text-align: center; font-weight: bold;">Bu kod 3 dakika içinde geçerliliğini yitirecektir.</p>
                  <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;">Eğer bu girişi siz yapmadıysanız, lütfen şifrenizi hemen değiştirin.</p>
                </div>
              `,
            };

            await transporter.sendMail(mailOptions);

            // 4. Kapıyı kapat ve vitrine "KOD LAZIM" diye bağır
            throw new Error("2FA_REQUIRED");
          }

          // DURUM 2: Adam e-postasındaki kodu alıp gelmiş (Doğrulama)
          if (credentials.code) {
            if (user.twoFactorCode !== credentials.code || user.twoFactorExpires < new Date()) {
              throw new Error("Geçersiz veya süresi dolmuş bir kod girdiniz.");
            }
            
            // Kod doğruysa temizliği yap
            user.twoFactorCode = undefined;
            user.twoFactorExpires = undefined;
            await user.save();
          }
        }
        // ==========================================

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt", 
  },
  secret: process.env.NEXTAUTH_SECRET, 
  pages: {
    signIn: '/login', 
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };