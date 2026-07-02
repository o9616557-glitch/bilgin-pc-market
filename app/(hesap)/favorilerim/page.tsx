import mongoose from "mongoose";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
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

  // Veritabanından Özkan'ın favori ID'lerini alıyoruz
  const user = await User.findOne({ email: session.user.email }).lean();
  const favoriteIds = user?.favorites || [];

  let matchedProducts: any[] = [];

  // 🚀 İŞTE YENİ NESİL MOTOR: Bütün dükkanı değil, SADECE favori ürünleri veritabanından çekiyoruz!
  if (favoriteIds.length > 0) {
    try {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");

      // ID'leri MongoDB'nin anladığı formata çeviriyoruz
      const objectIdArray = favoriteIds.map((id: string) => {
        try { return new mongoose.Types.ObjectId(id); } catch(e) { return id; }
      });

      // Çırak sadece "ID'si bu listede olanları" getiriyor, hamallık bitti!
      const rawUrunler = await db.collection("products").find({
        $or: [
          { _id: { $in: objectIdArray } },
          { id: { $in: favoriteIds } }
        ]
      }).toArray();

      matchedProducts = rawUrunler.map(urun => ({
        ...urun,
        _id: urun._id.toString()
      }));

    } catch (error) {
      console.error("Favori ürünler çekilirken hata:", error);
    }
  }
  
  // Veriler milisaniyede hazır, hayalet (skeleton) çıkmaya fırsat bile bulamayacak!
  return <FavoriClient initialFavorites={matchedProducts} />;
}