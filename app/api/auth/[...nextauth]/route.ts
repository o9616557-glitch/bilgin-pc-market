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

// 📍 HARİTA YARDIMCISI
async function konumuBul(ip: string) {
  try {
    if (ip === "127.0.0.1" || ip === "::1" || ip.includes("192.168") || ip === "Bilinmeyen IP") return "Yerel Ağ (Localhost)";
    const res = await fetch(`http://ip-api.com/json/${ip}?lang=tr`);
    if (!res.ok) return "Bilinmeyen Konum";
    const data = await res.json();
    if (data.status === "success") return `${data.city}, ${data.country}`;
    return "Bilinmeyen Konum";
  } catch {
    return "Bilinmeyen Konum";
  }
}

// 📱 CİHAZ TERCÜMANI
function cihazBilgisiCevir(cihazStr: string) {
  let os = "Bilinmeyen OS";
  if (cihazStr.includes("Windows")) os = "Windows PC";
  else if (cihazStr.includes("Mac")) os = "Macintosh";
  else if (cihazStr.includes("iPhone")) os = "iPhone";
  else if (cihazStr.includes("Android")) os = "Android Telefon";

  let browser = "Bilinmeyen Tarayıcı";
  if (cihazStr.includes("Edg")) browser = "Microsoft Edge";
  else if (cihazStr.includes("Chrome")) browser = "Google Chrome";
  else if (cihazStr.includes("Firefox")) browser = "Mozilla Firefox";
  else if (cihazStr.includes("Safari") && !cihazStr.includes("Chrome")) browser = "Apple Safari";

  return `${os} - ${browser}`;
}

/// 📧 GUARD ONAY MAİLİ GÖNDERİCİSİ
async function guardMailiGonder(email: string, anlasilirCihaz: string, konum: string, ip: string, onayToken: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://bilginpcmarket.com";
  const dateStr = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });

  const mailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #020617; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
      
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #06b6d4; margin: 0; letter-spacing: 3px; font-size: 28px;">BİLGİN PC</h2>
        <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Güvenlik Merkezi</p>
      </div>

      <h3 style="color: #f8fafc; text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-top: 0;">🛡️ Yeni Cihaz Onayı</h3>
      
      <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; text-align: center;">
        Hesabınıza daha önce kullanılmamış yeni bir cihazdan giriş yapılmaya çalışılıyor. Güvenliğiniz için bu işlemi onaylamanız gerekmektedir.
      </p>
      
      <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #334155;">
        <p style="margin: 8px 0; color: #94a3b8;"><strong>Tarih/Saat:</strong> <span style="color: #f8fafc;">${dateStr}</span></p>
        <p style="margin: 8px 0; color: #94a3b8;"><strong>Cihaz:</strong> <span style="color: #06b6d4; font-weight: bold;">${anlasilirCihaz}</span></p>
        <p style="margin: 8px 0; color: #94a3b8;"><strong>Konum:</strong> <span style="color: #10b981;">${konum}</span></p>
        <p style="margin: 8px 0; color: #94a3b8;"><strong>IP Adresi:</strong> <span style="color: #f8fafc;">${ip}</span></p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <div style="margin-bottom: 15px;">
          <a href="${baseUrl}/api/auth/device-action?token=${onayToken}&action=approve" style="display: inline-block; width: 250px; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 6px; font-weight: bold; font-size: 15px; letter-spacing: 1px;">✅ GİRİŞİ ONAYLA</a>
        </div>
        <div>
          <a href="${baseUrl}/api/auth/device-action?token=${onayToken}&action=reject" style="display: inline-block; width: 250px; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 6px; font-weight: bold; font-size: 15px; letter-spacing: 1px;">🚨 BEN DEĞİLİM (KİLİTLE)</a>
        </div>
      </div>
      
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 35px; border-top: 1px solid #1e293b; padding-top: 15px;">
        Eğer bu işlemi siz yapmadıysanız, derhal kırmızı butona basarak hesabınızı güvence altına alın.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Bilgin PC Güvenlik" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🛡️ Yeni Cihaz Onayı Gerekiyor - Bilgin PC",
    html: mailHtml
  });
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
        if (!credentials?.email || !credentials?.password) throw new Error("Lütfen e-posta ve şifre girin.");
        if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.");

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) throw new Error("Şifre hatalı, lütfen tekrar deneyin.");

        // --- BÖLÜM 1: 2FA KOD MOTORU ---
        if (user.twoFactorEmail) {
          const musteriKodu = (credentials.code === "undefined" || !credentials.code) ? "" : credentials.code;

          if (musteriKodu === "") {
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorCode = generatedCode;
            user.twoFactorExpires = new Date(Date.now() + 3 * 60 * 1000);
            await user.save();

            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com", port: 465, secure: true,
              auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            });

            await transporter.sendMail({
              from: `"Bilgin PC Güvenlik" <${process.env.EMAIL_USER}>`, 
              to: credentials.email,
              subject: "Güvenlik Kodunuz - Bilgin PC Market",
              html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050814; color: #ffffff; border-radius: 10px; border: 1px solid #1e293b;">
                  <div style="text-align: center; margin-bottom: 20px;"><h2 style="color: #3b82f6; margin: 0; letter-spacing: 2px;">BİLGİN PC</h2></div>
                  <h3 style="color: #e2e8f0; text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">İki Adımlı Doğrulama</h3>
                  <p style="color: #94a3b8; font-size: 16px; text-align: center;">Güvenlik kodunuz: <strong style="color: #10b981; font-size: 24px;">${generatedCode}</strong></p>
                </div>`
            });
            throw new Error("2FA_REQUIRED");
          }

          if (musteriKodu !== "") {
            const girilenKod = musteriKodu.trim(); 
            if (user.twoFactorCode !== girilenKod) throw new Error("Geçersiz veya süresi dolmuş bir kod girdiniz.");
            user.twoFactorCode = undefined;
            user.twoFactorExpires = undefined;
          }
        }

        // --- BÖLÜM 2: STEAM GUARD (CİHAZ ONAY) MOTORU ---
        const userAgent = req?.headers?.["user-agent"] || "Bilinmeyen Cihaz";
        const ipAddress = req?.headers?.["x-forwarded-for"] || "Bilinmeyen IP";
        const anlasilirCihaz = cihazBilgisiCevir(userAgent);
        const konumBilgisi = await konumuBul(ipAddress);

        const bildirimTercihi = user.notificationPreference || 'new_device';
        const cihazTanindikMi = user.trustedDevices && user.trustedDevices.includes(anlasilirCihaz);

        // Eğer ayar "Akıllı Muhafız" ise ve cihaz tanınmıyorsa KAPIDA BEKLET
       if (bildirimTercihi === 'all' || (bildirimTercihi === 'new_device' && !cihazTanindikMi)) {
          const onayToken = crypto.randomBytes(32).toString('hex');
          
          user.pendingDeviceToken = onayToken;
          user.pendingDeviceExpires = new Date(Date.now() + 15 * 60 * 1000); // Token 15 dk geçerli
          user.pendingDeviceInfo = { cihaz: anlasilirCihaz, ip: ipAddress, konum: konumBilgisi, rawAgent: userAgent };
          await user.save();

          await guardMailiGonder(user.email, anlasilirCihaz, konumBilgisi, ipAddress, onayToken);

          // Ekrana düşecek uyarı mesajı
          throw new Error("Güvenliğiniz için cihaz onayı gerekiyor. Lütfen e-postanıza gönderilen bağlantıya tıklayın.");
        }

        // --- BÖLÜM 3: GİRİŞ ONAYLANDI (Cihazı kaydet ve içeri al) ---
        const newDeviceId = crypto.randomUUID();
        user.activeDevices.push({
          deviceId: newDeviceId,
          deviceInfo: userAgent,
          ipAddress: ipAddress,
          location: konumBilgisi,
          lastActive: new Date(),
          isActive: true
        });

        await user.save();

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image, deviceId: newDeviceId };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
          const dbUser = await User.findOne({ email: user.email });
          
          if (dbUser) {
            const headersList = await headers(); 
            const userAgent = headersList.get("user-agent") || "Bilinmeyen Cihaz";
            const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Bilinmeyen IP";
            const anlasilirCihaz = cihazBilgisiCevir(userAgent);
            const konumBilgisi = await konumuBul(ipAddress);

            const bildirimTercihi = dbUser.notificationPreference || 'new_device';
            const cihazTanindikMi = dbUser.trustedDevices && dbUser.trustedDevices.includes(anlasilirCihaz);

            if (bildirimTercihi === 'new_device' && !cihazTanindikMi) {
              const onayToken = crypto.randomBytes(32).toString('hex');
              dbUser.pendingDeviceToken = onayToken;
              dbUser.pendingDeviceExpires = new Date(Date.now() + 15 * 60 * 1000);
              dbUser.pendingDeviceInfo = { cihaz: anlasilirCihaz, ip: ipAddress, konum: konumBilgisi, rawAgent: userAgent };
              await dbUser.save();

              await guardMailiGonder(dbUser.email, anlasilirCihaz, konumBilgisi, ipAddress, onayToken);
              
              // Sosyal girişi durdur
             return '/giris?error=Cihaz+onayi+gerekiyor.+E-postanizi+kontrol+edin.';
            }

            const newDeviceId = crypto.randomUUID();
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
          console.error("VIP Guard Hatası:", error);
        }
      }
      return true; 
    },
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.deviceId = (user as any).deviceId; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { (session.user as any).id = token.id; (session.user as any).deviceId = token.deviceId; }
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      try {
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI as string);
        }
        
        if (token?.id && token?.deviceId) {
          await User.updateOne(
            { _id: token.id, "activeDevices.deviceId": token.deviceId },
            { $set: { "activeDevices.$.isActive": false } }
          );
        }
      } catch (error) {
        console.error("Veritabanından cihaz çıkışı silinirken hata:", error);
      }
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, 
 pages: { signIn: '/giris' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };