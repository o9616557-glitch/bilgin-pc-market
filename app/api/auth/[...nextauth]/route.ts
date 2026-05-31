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

    // 3. E-POSTA VE ŞİFRE ADAPTÖRÜ
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Sifre", type: "password" }
      },
      async authorize(credentials) {
        // A. Boş giriş kontrolü
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifre girin.");
        }

        // B. MongoDB Bağlantı Kontrolü (Eğer bağlı değilse bağlanır)
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

        // E. Her şey başarılıysa kullanıcı bilgisini döndür
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt", // App Router'da JWT stratejisi en sağlıklısıdır
  },
  secret: process.env.NEXTAUTH_SECRET, // Güvenlik anahtarın (.env dosyasında olmalı)
  pages: {
    signIn: '/login', // Eğer özel bir giriş sayfan varsa buraya yönlendirir
  }
};

// 🚀 İŞTE EKSİK OLAN HAYATİ KISIM (APP ROUTER MOTORU)
const handler = NextAuth(authOptions);

// Next.js App Router'ın API'yi okuyabilmesi için GET ve POST olarak dışa aktarıyoruz
export { handler as GET, handler as POST };