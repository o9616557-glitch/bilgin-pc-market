import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SiparisDetayClient from "./SiparisDetayClient";

// Sayfayı her defasında taze taze çekmesi için
export const dynamic = "force-dynamic";

export default async function SiparisDetaySayfasi({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // Senin sistemindeki orijinal login yönlendirmesi
  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  // Veritabanı bağlantısını sağlama alıyoruz (Favorilerdeki gibi)
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  const orderId = params.id;
  let matchedOrder = null;

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Mongoose kullanarak güvenli ID dönüşümü
    let queryId: any;
    try {
      queryId = new mongoose.Types.ObjectId(orderId);
    } catch (e) {
      queryId = orderId;
    }

    // TS Hatalarından kaçınmak için "as any" ile MongoDB'den çekiyoruz
    const rawOrder = await db.collection("orders").findOne({ _id: queryId as any });

    if (rawOrder) {
      // BİNGO: React'in çökmemesi için veriyi temizle
      matchedOrder = JSON.parse(JSON.stringify(rawOrder));
    }

  } catch (error) {
    console.error("Sipariş detayı çekilirken hata oluştu:", error);
  }

  // Veri vitrine servis ediliyor
  return <SiparisDetayClient initialOrder={matchedOrder} />;
}