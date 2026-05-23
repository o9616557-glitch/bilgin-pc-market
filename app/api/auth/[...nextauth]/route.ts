import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        // 1. Gelen verileri kontrol et
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifrenizi girin.");
        }

        // 2. Veritabanına bağlan ve müşteriyi ara
        const client = await clientPromise;
        const db = client.db("bilginpcmarket");
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Bu e-posta ile kayıtlı bir müşteri bulunamadı şefim.");
        }

        // 3. Şifreyi Kripto motoruyla karşılaştır
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordMatch) {
          throw new Error("Şifre hatalı, lütfen tekrar deneyin.");
        }

        // 4. Giriş başarılıysa müşteri kimliğini teslim et
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
    maxAge: 30 * 24 * 60 * 60, // Müşteri 30 gün boyunca sistemde giriş yapılı kalır
  },
  secret: "BilginPcMarketGizliAnahtar2026", // Şifreleme kalkanı anahtarı
  pages: {
    signIn: "/giris", // Müşteri yetkisiz bir yere girerse buraya postalanır
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };