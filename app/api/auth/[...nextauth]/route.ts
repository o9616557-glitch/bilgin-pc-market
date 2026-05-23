import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    // 1. GOOGLE BAĞLANTI ADAPTÖRÜ
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
    // 2. FACEBOOK BAĞLANTI ADAPTÖRÜ
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),

    // 3. E-POSTA VE ŞİFRE ADAPTÖRÜ
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifrenizi girin.");
        }

        const client = await clientPromise;
        const db = client.db("bilginpcmarket");
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordMatch) {
          throw new Error("Şifre hatalı, lütfen tekrar deneyin.");
        }

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email 
        };
      }
    })
  ],
  session: { 
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 Gün açık kalır
  },
  secret: process.env.NEXTAUTH_SECRET || "BilginPcMarketGizliAnahtar2026",
  pages: {
    signIn: "/giris",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };