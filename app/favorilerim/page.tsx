import React from "react";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FavoriYoneticisi from "./FavoriYoneticisi";

// 🚀 BÜYÜLÜ SATIR: Sayfayı hafızadan (cache) okumayı yasaklar, her girişte en güncel veriyi çeker!
export const dynamic = "force-dynamic";

export default async function FavorilerSayfasi() {
  // 1. Kullanıcı giriş yapmış mı kontrol et
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  // 2. Veritabanına Jet Hızıyla Bağlan
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // 3. Kullanıcının favori ID'lerini bul
  const user = await User.findOne({ email: session.user.email }).lean();
  const favoriteIds = user?.favorites || [];

  let matchedProducts = [];

  // 4. Eğer favorisi varsa, ürünleri API'den çek
  if (favoriteIds.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    try {
      const res = await fetch(`${baseUrl}/api/products`
        , { cache: 'no-store' });
      if (res.ok) {
        const prodData = await res.json();
        const allProducts = prodData.products || prodData || [];
        
        matchedProducts = allProducts.filter((urun: any) => 
          favoriteIds.includes(String(urun._id)) || favoriteIds.includes(String(urun.id))
        );
      }
    } catch (error) {
      console.error("Ürünler sunucuda çekilirken hata:", error);
    }
  }
  
  // 5. Veriyi Client bileşeninin anlayacağı düz objeye çevir
  const serializedProducts = JSON.parse(JSON.stringify(matchedProducts));

  return (
    <FavoriYoneticisi initialFavorites={serializedProducts} />
  );
}