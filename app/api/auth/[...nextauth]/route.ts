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

async function konumuBul(ip: string) {
  try {
    if (ip === "127.0.0.1" || ip === "::1" || ip.includes("192.168") || ip === "Bilinmeyen IP") return "Yerel Ağ (Localhost)";
    const res = await fetch(`http://ip-api.com/json/${ip}?lang=tr`);
    if (!res.ok) return "Bilinmeyen Konum";
    const data = await res.json();
    if (data.status === "success") return `${data.city}, ${data.country}`;
    return "Bilinmeyen Konum";
  } catch { return "Bilinmeyen Konum"; }
}

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

async function guardMailiGonder(email: string, anlasilirCihaz: string, konum: string, ip: string, onayToken: string, alarmTipi: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://bilginpcmarket.com";
  const dateStr = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });

  const isKarantina = alarmTipi === "TAM_KARANTINA";
  const mailBaslik = isKarantina ? "Giriş Onayı Gerekiyor" : "Yeni Cihaz Doğrulaması";
  const konuBasligi = isKarantina ? "Bilgin PC - Giriş Onayı" : "Bilgin PC - Yeni Cihaz Doğrulaması";

  const mailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; background-color: #020617; color: #f8fafc; border-radius: 10px; border: 1px solid #1e293b; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
      <h2 style="text-align: center; margin-top: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">
        <span style="color: #ffffff;">BİLGİN</span> <span style="color: #3b82f6;">PC</span>
      </h2>
      <h3 style="text-align: center; margin-bottom: 20px; font-weight: 600; font-size: 18px; color: #ffffff; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">${mailBaslik}</h3>
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; text-align: center; margin-bottom: 20px;">
        Hesabınıza aşağıdaki cihaz üzerinden bir giriş isteği yapılmıştır. Devam etmek için lütfen işlemi onaylayın.
      </p>
      <div style="background-color: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
        <p style="margin: 6px 0; font-size: 14px; color: #94a3b8;"><strong>Tarih:</strong> <span style="color: #ffffff;">${dateStr}</span></p>
        <p style="margin: 6px 0; font-size: 14px; color: #94a3b8;"><strong>Cihaz:</strong> <span style="color: #3b82f6; font-weight: bold;">${anlasilirCihaz}</span></p>
        <p style="margin: 6px 0; font-size: 14px; color: #94a3b8;"><strong>Konum:</strong> <span style="color: #ffffff;">${konum}</span></p>
        <p style="margin: 6px 0; font-size: 14px; color: #94a3b8;"><strong>IP Adresi:</strong> <span style="color: #ffffff;">${ip}</span></p>
      </div>
      <p style="font-size: 13px; text-align: center; color: #94a3b8; margin-bottom: 20px;">
        Eğer bu işlemi siz yapmadıysanız, hesabınızı korumak için işlemi reddedin.
      </p>
      <div style="text-align: center; margin-bottom: 25px;">
        <a href="${baseUrl}/api/auth/device-action?token=${onayToken}&action=approve" style="display: inline-block; width: 44%; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 0; border-radius: 6px; font-weight: bold; font-size: 14px; margin-right: 2%;">Onayla</a>
        <a href="${baseUrl}/api/auth/device-action?token=${onayToken}&action=reject" style="display: inline-block; width: 44%; background-color: #f43f5e; color: #ffffff; text-decoration: none; padding: 12px 0; border-radius: 6px; font-weight: bold; font-size: 14px; margin-left: 2%;">Reddet</a>
      </div>
      <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 15px;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">Bu onay bağlantısı <strong style="color: #94a3b8;">15 dakika</strong> geçerlidir.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({ from: `"Bilgin PC" <${process.env.EMAIL_USER}>`, to: email, subject: konuBasligi, html: mailHtml });
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID as string, clientSecret: process.env.GOOGLE_CLIENT_SECRET as string }),
    FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID as string, clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Sifre", type: "password" }, code: { label: "2FA", type: "text" } },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) throw new Error("Lütfen e-posta ve şifre girin.");
        if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.");

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) throw new Error("Şifre hatalı, lütfen tekrar deneyin.");

        // 🚀 BİRİNCİ AŞAMA: ÖNCE CİHAZ VE KARANTİNA KONTROL MOTORU
        const userAgent = req?.headers?.["user-agent"] || "Bilinmeyen Cihaz";
        const ipAddress = req?.headers?.["x-forwarded-for"] || "Bilinmeyen IP";
        const anlasilirCihaz = cihazBilgisiCevir(userAgent);
        const konumBilgisi = await konumuBul(ipAddress);

        const suAnkiZaman = new Date();
        const biletVarMi = user.karantinaPass && user.karantinaPass > suAnkiZaman;

        if (!biletVarMi) {
          const bildirimTercihi = user.notificationPreference || 'new_device';
          const cihazTanindikMi = user.trustedDevices && user.trustedDevices.includes(anlasilirCihaz);
          
          let alarmVer = false;
          let alarmTipi = "";

          if (bildirimTercihi === 'all') { alarmVer = true; alarmTipi = "TAM_KARANTINA"; } 
          else if (bildirimTercihi === 'new_device' && !cihazTanindikMi) { alarmVer = true; alarmTipi = "AKILLI_MUHAFIZ"; }

          if (alarmVer) {
            const onayToken = crypto.randomBytes(32).toString('hex');
            user.pendingDeviceToken = onayToken;
            user.pendingDeviceExpires = new Date(Date.now() + 15 * 60 * 1000);
            user.pendingDeviceInfo = { cihaz: anlasilirCihaz, ip: ipAddress, konum: konumBilgisi, rawAgent: userAgent };
            await user.save();
            await guardMailiGonder(user.email, anlasilirCihaz, konumBilgisi, ipAddress, onayToken, alarmTipi);

            const ekrandakiHata = alarmTipi === "TAM_KARANTINA" 
              ? "TAM_KARANTINA: Giriş için e-postanıza gönderilen onayı verin." 
              : "Cihaz onayı gerekiyor. Lütfen e-postanızı kontrol edin.";
            throw new Error(ekrandakiHata); 
          }
        }

        // 🚀 İKİNCİ AŞAMA: 2FA MOTORU
        if (user.twoFactorEmail) {
          const musteriKodu = (credentials.code === "undefined" || !credentials.code) ? "" : credentials.code;
          if (musteriKodu === "") {
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorCode = generatedCode; user.twoFactorExpires = new Date(Date.now() + 3 * 60 * 1000);
            await user.save();
            const transporter = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }});
            await transporter.sendMail({ from: `"Bilgin PC" <${process.env.EMAIL_USER}>`, to: credentials.email, subject: "Güvenlik Kodunuz", html: `<p>Kodunuz: <strong>${generatedCode}</strong></p>` });
            throw new Error("2FA_REQUIRED");
          }
          if (musteriKodu !== "" && user.twoFactorCode !== musteriKodu.trim()) throw new Error("Geçersiz kod.");
          user.twoFactorCode = undefined; user.twoFactorExpires = undefined; 
        }

        // 🎯 HER İKİ GÜVENLİK DE GEÇİLDİ: BİLETİ ŞİMDİ YIRTIYORUZ!
        user.karantinaPass = undefined; 

        const newDeviceId = crypto.randomUUID();
        user.activeDevices.push({ deviceId: newDeviceId, deviceInfo: userAgent, ipAddress: ipAddress, location: konumBilgisi, lastActive: new Date(), isActive: true });
        await user.save();
        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image, deviceId: newDeviceId };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

        // 🧊 İŞTE DÜZELTTİĞİMİZ BUZ ÇÖZME MOTORU
        if (user && user.email) {
          const hamKullanici = await mongoose.connection.db!.collection("users").findOne({ email: user.email });

          if (hamKullanici && hamKullanici.isActive === false) {
            await mongoose.connection.db!.collection("users").updateOne(
              { email: user.email },
              { $set: { isActive: true } }
            );
            
            await mongoose.connection.db!.collection("reviews").updateMany(
              { email: user.email },
              { $set: { isVisible: true } }
            );
            
            console.log("Zincirler kırıldı! Adam ve yorumları dükkana geri döndü!");
          }
        }

        // 🚀 KARANTİNA KONTROLÜ
        if (account?.provider === "google" || account?.provider === "facebook") {
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            const headersList = await headers(); 
            const userAgent = headersList.get("user-agent") || "Bilinmeyen Cihaz";
            const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Bilinmeyen IP";
            const anlasilirCihaz = cihazBilgisiCevir(userAgent);
            const konumBilgisi = await konumuBul(ipAddress);

            const suAnkiZaman = new Date();
            const biletVarMi = dbUser.karantinaPass && dbUser.karantinaPass > suAnkiZaman;

            if (!biletVarMi) {
              const bildirimTercihi = dbUser.notificationPreference || 'new_device';
              const cihazTanindikMi = dbUser.trustedDevices && dbUser.trustedDevices.includes(anlasilirCihaz);
              
              let alarmVer = false; let alarmTipi = "";
              if (bildirimTercihi === 'all') { alarmVer = true; alarmTipi = "TAM_KARANTINA"; } 
              else if (bildirimTercihi === 'new_device' && !cihazTanindikMi) { alarmVer = true; alarmTipi = "AKILLI_MUHAFIZ"; }

              if (alarmVer) {
                const onayToken = crypto.randomBytes(32).toString('hex');
                dbUser.pendingDeviceToken = onayToken; dbUser.pendingDeviceExpires = new Date(Date.now() + 15 * 60 * 1000);
                dbUser.pendingDeviceInfo = { cihaz: anlasilirCihaz, ip: ipAddress, konum: konumBilgisi, rawAgent: userAgent };
                await dbUser.save();
                await guardMailiGonder(dbUser.email, anlasilirCihaz, konumBilgisi, ipAddress, onayToken, alarmTipi);
                
                const urlHata = alarmTipi === "TAM_KARANTINA" ? "Tam+Karantina+Aktif:+E-postanizi+onaylayin." : "Cihaz+onayi+gerekiyor.+E-postanizi+kontrol+edin.";
                
                const userMailEnc = encodeURIComponent(dbUser.email);
                return `/giris?error=${urlHata}&provider=${account.provider}&userMail=${userMailEnc}`;
              }
            }
            
            dbUser.karantinaPass = undefined;
            const newDeviceId = crypto.randomUUID();
            dbUser.activeDevices.push({ deviceId: newDeviceId, deviceInfo: userAgent, ipAddress: ipAddress, location: konumBilgisi, lastActive: new Date(), isActive: true });
            await dbUser.save(); (user as any).deviceId = newDeviceId;
          }
        }
      } catch (error) { 
        console.error("Giriş İşlemi Hatası:", error); 
      }
      return true; 
    },

    // 🚀 BİNGO: İŞTE KATİLİ YOK ETTİĞİMİZ YER BURASI! (ID yerine Email ile arama yapıyoruz)
    async jwt({ token, user }) {
      if (user) { 
        token.id = user.id; 
        token.deviceId = (user as any).deviceId; 
      }

      // 🚨 Eski kod burada 'token.id' kullanıyordu ve Google ID'sinde patlıyordu. 
      // Artık 'token.email' kullanıyoruz ki MongoDB asla şaşırmasın!
      if (!user && token?.email && token?.deviceId) {
        try {
          if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
          
          // 🚀 JİLET GİBİ ÇÖZÜM: findById yerine findOne({ email }) kullanıyoruz!
          const dbUser = await User.findOne({ email: token.email }).select("activeDevices");
          
          if (dbUser) {
            const buCihaz = dbUser.activeDevices.find((c: any) => c.deviceId === token.deviceId);
            if (!buCihaz || buCihaz.isActive === false) {
              return { ...token, isLoggedOut: true }; 
            }
          }
        } catch (err) { console.error("Cihaz kontrol hatası:", err); }
      }
      return token;
    },

   // 🚀 ÖLÜM DAMGALI ADAMI SİSTEMDEN ATAN MOTOR
    async session({ session, token }) {
      if (token.isLoggedOut) {
         (session as any).error = "KickedOut";
      } else if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).deviceId = token.deviceId;
      }
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      try {
        if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
        if (token?.id && token?.deviceId) await User.updateOne({ _id: token.id, "activeDevices.deviceId": token.deviceId }, { $set: { "activeDevices.$.isActive": false } });
      } catch (error) { console.error("Çıkış hatası:", error); }
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, 
  pages: { signIn: '/giris' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };