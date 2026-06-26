import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import mongoose from "mongoose";
import User from "@/models/User";
import FavoriClient from "./FavoriClient"; 

export const dynamic = "force-dynamic";

export default async function FavorilerimPage() {
  let hazirFavoriler: any[] = [];

  try {
    // 1. Müşteri daha kapıdayken kimliğini al
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      // 2. Veritabanı kapısını aç
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
      }

      const db = mongoose.connection.db;
      const user = await User.findOne({ email: session.user.email }).lean();

      // 3. Adamın favorileri varsa, ışık hızında depodan çek
      if (user && user.favorites && user.favorites.length > 0) {
        const objectIdArray = user.favorites.map((id: string) => {
          try { return new mongoose.Types.ObjectId(id); } catch(e) { return id; }
        });

        const rawUrunler = await db!.collection("products").find({
          $or: [
            { _id: { $in: objectIdArray } },
            { id: { $in: user.favorites } }
          ]
        }).toArray();

        hazirFavoriler = rawUrunler.map(urun => ({
          ...urun,
          _id: urun._id.toString()
        }));
      }
    }
  } catch (error) {
    console.error("Ana sayfa favorileri önceden hazırlarken hata aldı:", error);
  }

  // 🚀 BİNGO: Mallar vitrine (Client'a) hazır olarak gidiyor! Yüklenme (Loading) SIFIR!
  return <FavoriClient initialFavorites={hazirFavoriler} />;
}