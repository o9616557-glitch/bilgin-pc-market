import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FavoriClient from "./FavoriClient";

// Sayfayı her defasında taze tutması için Next.js'e emir veriyoruz
export const dynamic = "force-dynamic";

export default async function FavorilerSayfasi() {
  // 🔐 GÜVENLİK KONTROLÜ: Kullanıcı giriş yapmadıysa kapıdan çeviriyoruz
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  // 🚀 JET MOTORU AKTİF: Ağır veritabanı sorguları ve fetch işlemleri çöpe gitti!
  // Artık sadece istemciyi tetikliyoruz, veriler zaten Context kapısında hazır bekliyor.
  return <FavoriClient />;
}