import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
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
  },
  
  // 🚀 ŞEFİM İŞTE HAYAT KURTARAN GÜMRÜK KAPISI BURASI!
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    }
  },
  // Hata olursa Vercel loglarında kabak gibi göstersin diye radar açtık
  debug: true, 
};

// NextAuth'un çalışması için zorunlu dışa aktarım (Export) işlemi
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };