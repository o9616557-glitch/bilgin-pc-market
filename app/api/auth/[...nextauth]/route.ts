import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User"; 

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. GOOGLE BAĞLANTI ADAPTÖRÜ
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // 2. FACEBOOK BAĞLANTI ADAPTÖRÜ
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    // 3. E-POSTA VE ŞİFRE ADAPTÖRÜ (BURASI GÜNCELLENDİ 🚀)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Sifre", type: "password" },
        // 🚀 ŞEFİM YENİ EKLENDİ: Görevlinin adama soracağı 2FA kodu kutusu
        code: { label: "2FA Kodu", type: "text" } 
      },
      async authorize(credentials) {
        // A. Boş giriş kontrolü
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifre girin.");
        }

        // B. MongoDB Bağlantı Kontrolü
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // C. Kullanıcıyı Veritabanında Bulma
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.");
        }

        // D. Şifre Doğrulama (bcrypt ile)
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Şifre hatalı, lütfen tekrar deneyin.");
        }

        // ==========================================
        // 🚀 YENİ MOTOR: İKİ ADIMLI DOĞRULAMA (2FA) 
        // ==========================================
        if (user.twoFactorEmail) {
          
          // DURUM 1: Adam şifreyi girmiş ama KODU henüz girmemiş (İlk Tıklama)
          if (!credentials.code) {
            
            // 1. Rastgele 6 haneli kod üret (Örn: 482910)
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

            // 2. Kodu müşterinin defterine yaz ve 3 dakika ömür biç
            user.twoFactorCode = generatedCode;
            user.twoFactorExpires = new Date(Date.now() + 3 * 60 * 1000);
            await user.save();

            // 3. KURYEYİ ÇAĞIRMA (E-Posta Gönderimi)
            // 🚨 ŞEFİM DİKKAT: Şifremi unuttum kısmında kullandığın o mail gönderme 
            // kodunu (kuryeni) tam olarak bu satıra yapıştırıp adamın e-postasına 
            // 'generatedCode' değişkenini yollayacaksın.
            
            console.log(`[GİZLİ SİSTEM MESAJI] ${user.email} adresine şu kod gönderildi: ${generatedCode}`);

            // 4. Görevliye "Kapıyı açma, adama 2FA sor" emrini veriyoruz
            throw new Error("2FA_REQUIRED");
          }

          // DURUM 2: Adam e-postasındaki kodu alıp gelmiş (İkinci Tıklama)
          if (credentials.code) {
            // Kod defterdekiyle aynı mı ve süresi (3 dk) dolmamış mı?
            if (user.twoFactorCode !== credentials.code || user.twoFactorExpires < new Date()) {
              throw new Error("Geçersiz veya süresi dolmuş bir kod girdiniz.");
            }
            
            // Kod doğruysa, güvenlik için eski kodu defterden sil
            user.twoFactorCode = undefined;
            user.twoFactorExpires = undefined;
            await user.save();
          }
        }
        // ==========================================

        // E. Her şey başarılıysa kullanıcı bilgisini döndür (İçeri Al!)
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