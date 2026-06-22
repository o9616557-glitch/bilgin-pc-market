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

// 🚀 HARİTA DEDEKTİFİ YARDIMCI MOTORU
async function konumuBul(ip: string) {
  try {
    if (ip === "127.0.0.1" || ip === "::1" || ip.includes("192.168") || ip === "Bilinmeyen IP") {
      return "Yerel Ağ (Localhost)";
    }
    const res = await fetch(`http://ip-api.com/json/${ip}?lang=tr`);
    if (!res.ok) return "Bilinmeyen Konum";
    const data = await res.json();
    if (data.status === "success") {
      return `${data.city}, ${data.country}`;
    }
    return "Bilinmeyen Konum";
  } catch {
    return "Bilinmeyen Konum";
  }
}

// 🚀 POSTACI MOTORU: ALARM DURUMUNDA ŞEFE MAİL ATAR
async function guvenlikMailiGonder(email: string, alarmTipi: string, konum: string, ip: string, cihaz: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dateStr = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #020617; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #06b6d4; margin: 0; letter-spacing: 2px;">BİLGİN PC</h2>
        </div>
        <h3 style="color: #ef4444; text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-top: 0;">🚨 GÜVENLİK ALARMI</h3>
        <p style="color: #e2e8f0; text-align: center; font-size: 16px; font-weight: bold;">${alarmTipi}</p>
        <p style="color: #94a3b8; text-align: center; font-size: 14px;">Hesabınıza aşağıdaki bilgilerle bir giriş yapıldı.</p>
        
        <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin-top: 25px; border: 1px solid #334155;">
          <p style="margin: 8px 0; color: #94a3b8;"><strong>Tarih/Saat:</strong> <span style="color: #fff;">${dateStr}</span></p>
          <p style="margin: 8px 0; color: #94a3b8;"><strong>Tahmini Konum:</strong> <span style="color: #10b981;">${konum}</span></p>
          <p style="margin: 8px 0; color: #94a3b8;"><strong>IP Adresi:</strong> <span style="color: #fff;">${ip}</span></p>
          <p style="margin: 8px 0; color: #94a3b8;"><strong>Cihaz Bilgisi:</strong> <span style="color: #fff; font-size: 12px;">${cihaz}</span></p>
        </div>
        
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 25px; line-height: 1.5;">
          Bu işlemi siz yapmadıysanız, derhal Bilgin PC Güvenlik Merkezi'ne gidip <strong>"Diğer Tüm Cihazlardan Çıkış Yap"</strong> butonuna basın ve şifrenizi değiştirin.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Bilgin PC Güvenlik" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🚨 Hesabınıza Giriş Yapıldı!",
      html: mailHtml
    });
  } catch (error) {
    console.error("Postacı Motoru Arıza Yaptı:", error);
  }
}

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

        // --- 2FA MOTORU ---
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
                  <p style="color: #94a3b8; font-size: 16px; text-align: center;">Güvenlik kodunuz: <strong style="color: #10b981; font-size: 24px;">${generatedCode}</strong></p>
                </div>
              `,
            };

            try { await transporter.sendMail(mailOptions); } catch (error: any) { throw new Error("GMAIL_HATASI: " + error.message); }
            throw new Error("2FA_REQUIRED");
          }

          if (musteriKodu !== "") {
            const girilenKod = musteriKodu.trim(); 
            const gercekKod = user.twoFactorCode;
            if (gercekKod !== girilenKod) { throw new Error("Geçersiz veya süresi dolmuş bir kod girdiniz."); }
            user.twoFactorCode = undefined;
            user.twoFactorExpires = undefined;
          }
        }

        // 🚀 NORMAL KAPI RADARI VE HARİTA SORGUSU
        const userAgent = req?.headers?.["user-agent"] || "Bilinmeyen Cihaz";
        const ipAddress = req?.headers?.["x-forwarded-for"] || "Bilinmeyen IP";
        const newDeviceId = crypto.randomUUID();
        
        const konumBilgisi = await konumuBul(ipAddress);

        // 🕵️‍♂️ ŞEFİN DEDEKTİF MOTORU BAŞLIYOR (Cihazı kaydetmeden önce bakar)
        const dahaOnceGirmisMi = user.activeDevices && user.activeDevices.some((c: any) => c.deviceInfo === userAgent);
        const bildirimTercihi = user.notificationPreference || 'new_device';

        let alarmVer = false;
        let alarmMesaji = "";

        if (bildirimTercihi === 'all') {
          alarmVer = true;
          alarmMesaji = "Yeni Bir Giriş İşlemi Gerçekleşti (Tam Karantina)";
        } else if (bildirimTercihi === 'new_device' && !dahaOnceGirmisMi) {
          alarmVer = true;
          alarmMesaji = "Tanınmayan Yeni Bir Cihazdan Giriş Yapıldı (Akıllı Muhafız)";
        }

        if (alarmVer) {
          // Postacıyı yola çıkar (Arkada çalışır, kullanıcının girişini yavaşlatmaz)
          guvenlikMailiGonder(user.email, alarmMesaji, konumBilgisi, ipAddress, userAgent);
        }
        // 🕵️‍♂️ DEDEKTİF MOTORU BİTTİ

        user.activeDevices.push({
          deviceId: newDeviceId,
          deviceInfo: userAgent,
          ipAddress: ipAddress,
          location: konumBilgisi,
          lastActive: new Date(),
          isActive: true
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
    // 🚀 VIP KAPISI RADARI VE HARİTA SORGUSU (Google/Facebook)
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          if (mongoose.connection.readyState !== 1) { await mongoose.connect(process.env.MONGODB_URI as string); }
          const dbUser = await User.findOne({ email: user.email });
          
          if (dbUser) {
            const headersList = await headers(); 
            const userAgent = headersList.get("user-agent") || "Bilinmeyen Cihaz";
            const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Bilinmeyen IP";
            const newDeviceId = crypto.randomUUID();

            const konumBilgisi = await konumuBul(ipAddress);

            // 🕵️‍♂️ VIP KAPI DEDEKTİFİ BAŞLIYOR
            const dahaOnceGirmisMi = dbUser.activeDevices && dbUser.activeDevices.some((c: any) => c.deviceInfo === userAgent);
            const bildirimTercihi = dbUser.notificationPreference || 'new_device';

            let alarmVer = false;
            let alarmMesaji = "";

            if (bildirimTercihi === 'all') {
              alarmVer = true;
              alarmMesaji = `${account.provider.toUpperCase()} Hesabı İle Giriş Yapıldı (Tam Karantina)`;
            } else if (bildirimTercihi === 'new_device' && !dahaOnceGirmisMi) {
              alarmVer = true;
              alarmMesaji = `${account.provider.toUpperCase()} Üzerinden Yabancı Cihazla Giriş (Akıllı Muhafız)`;
            }

            if (alarmVer) {
              guvenlikMailiGonder(dbUser.email, alarmMesaji, konumBilgisi, ipAddress, userAgent);
            }
            // 🕵️‍♂️ VIP DEDEKTİF BİTTİ

            dbUser.activeDevices.push({
              deviceId: newDeviceId,
              deviceInfo: userAgent,
              ipAddress: ipAddress,
              location: konumBilgisi,
              lastActive: new Date(),
              isActive: true
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
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, 
  pages: { signIn: '/login' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };