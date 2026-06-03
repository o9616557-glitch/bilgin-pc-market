import mongoose from "mongoose";
import User from "@/models/User";
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

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  // Veritabanından favorileri alıyoruz
  const user = await User.findOne({ email: session.user.email }).lean();
  const favoriteIds = user?.favorites || [];

  let matchedProducts = [];

  // API'den ürünleri çekiyoruz (BU ESNADA EKRANDA HAYALET ÇIKACAK)
  if (favoriteIds.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    try {
      const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
      if (res.ok) {
        const prodData = await res.json();
        const allProducts = prodData.products || prodData || [];
        
        matchedProducts = allProducts.filter((urun: any) => 
          favoriteIds.includes(String(urun._id)) || favoriteIds.includes(String(urun.id))
        );
      }
    } catch (error) {
      console.error("Ürünler çekilirken hata:", error);
    }
  }
  
  const serializedProducts = JSON.parse(JSON.stringify(matchedProducts));

  // Veriler hazır olduğunda hayalet kapanır ve bu İstemci dosyası ekrana basılır!
  return <FavoriClient initialFavorites={serializedProducts} />;
}