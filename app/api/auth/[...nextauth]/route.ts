import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User"; 
import nodemailer from "nodemailer";
import crypto from "crypto";
import { headers } from "next/headers"; 

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
      async authorize(credentials, req) {
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

        if (user.twoFactorEmail) {
          const musteriKodu = (credentials.code === "undefined" || !credentials.code) ? "" : credentials.code;

          if (musteriKodu === "") {
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorCode = generatedCode;
            user.twoFactorExpires = new Date(Date.now() + 3 * 60 * 1000);
            await user.save();

            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
              },
            });

            const mailOptions = {
              from: `"Bilgin PC Güvenlik" <${process.env.EMAIL_USER}>`, 
              to: credentials.email,
              subject: "Güvenlik Kodunuz - Bilgin PC Market",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050814; color: #ffffff; border-radius: 10px; border: 1px solid #1e293b;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #3b82f6; margin: 0; letter-spacing: 2px;">BİLGİN PC</h2>
                  </div>
                  <h3 style="color: #e2e8f0; text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">İki Adımlı Doğrulama</h3>
                  <p style="color: #94a3b8; font-size: 16px; text-align: center;">Hesabınıza giriş yapmak için güvenlik kodunuz oluşturuldu.</p>
                  <div style="text-align: center; margin: 40px 0;">
                    <div style="display: inline-block; background-color: #020617; border: 2px dashed #3b82f6; color: #ffffff; padding: 20px 40px; font-weight: 900; border-radius: 15px; font-size: 36px; letter-spacing: 15px; text-shadow: 0 0 10px rgba(59,130,246,0.5);">
                      ${generatedCode}
                    </div>
                  </div>
                  <p style="color: #ef4444; font-size: 13px; text-align: center; font-weight: bold;">Bu kod 3 dakika içinde geçerliliğini yitirecektir.</p>
                </div>
              `,
            };

            try {
              await transporter.sendMail(mailOptions);
            } catch (error: any) {
              throw new Error("GMAIL_HATASI: " + error.message);
            }

            throw new Error("2FA_REQUIRED");
          }

          if (musteriKodu !== "") {
            const girilenKod = musteriKodu.trim(); 
            const gercekKod = user.twoFactorCode;

            if (gercekKod !== girilenKod) {
              throw new Error("Geçersiz veya süresi dolmuş bir kod girdiniz.");
            }
            
            user.twoFactorCode = undefined;
            user.twoFactorExpires = undefined;
          }
        }

        const userAgent = req?.headers?.["user-agent"] || "Bilinmeyen Cihaz";
        const ipAddress = req?.headers?.["x-forwarded-for"] || "Bilinmeyen IP";
        const newDeviceId = crypto.randomUUID();

        user.activeDevices.push({
          deviceId: newDeviceId,
          deviceInfo: userAgent,
          ipAddress: ipAddress,
          lastActive: new Date()
        });

        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          deviceId: newDeviceId 
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
          }
          
          const dbUser = await User.findOne({ email: user.email });
          
          if (dbUser) {
            // 🚀 İŞTE HATAYI ÇÖZDÜĞÜMÜZ YER: "await" EKLENDİ!
            const headersList = await headers(); 
            
            const userAgent = headersList.get("user-agent") || "Bilinmeyen Cihaz";
            const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Bilinmeyen IP";
            const newDeviceId = crypto.randomUUID();

            dbUser.activeDevices.push({
              deviceId: newDeviceId,
              deviceInfo: userAgent,
              ipAddress: ipAddress,
              lastActive: new Date()
            });

            await dbUser.save();
            
            (user as any).deviceId = newDeviceId;
          }
        } catch (error) {
          console.error("VIP Radar Hatası:", error);
        }
      }
      return true; 
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.deviceId = (user as any).deviceId; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).deviceId = token.deviceId; 
      }
      return session;
    }
  },
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