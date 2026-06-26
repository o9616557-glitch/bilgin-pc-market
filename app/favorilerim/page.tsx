import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FavoriClient from "./FavoriClient";

// Sayfayı her defasında taze taze çekmesi için Next.js'e emir veriyoruz
export const dynamic = "force-dynamic";

export default async function FavorilerSayfasi() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  // 🚀 OPERASYON TAMAMLANDI: Ağır veritabanı hamallığını (Mongoose, lean, clientPromise, toArray) tamamen söküp attık!
  // Sayfa artık F5 atılsa bile milisaniyede açılacak, kilitlenme sıfır olacak.
  // İçerideki "Sessiz Çırak" backend'den verileri getirip ekrana tereyağından kıl çeker gibi dizecek.
  return <FavoriClient />;
}