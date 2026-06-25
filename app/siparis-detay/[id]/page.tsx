import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SiparisDetayClient from "./SiparisDetayClient";
import { ObjectId } from "mongodb";

// Sayfayı her defasında taze taze çekmesi için
export const dynamic = "force-dynamic";

export default async function SiparisDetaySayfasi({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/giris"); 
  }

  const orderId = params.id;
  let matchedOrder = null;

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // ID'yi MongoDB formatına çevir
    let queryId: any;
    try {
      queryId = new ObjectId(orderId);
    } catch (e) {
      queryId = orderId;
    }

    // 🚀 BİNGO: TypeScript'in nazını "as any" ile eziyoruz! 
    const rawOrder = await db.collection("orders").findOne({ _id: queryId as any });

    if (rawOrder) {
      // MongoDB'nin garip tarih ve ID formatlarını Next.js'in anlayacağı düz metne çeviriyoruz
      matchedOrder = JSON.parse(JSON.stringify(rawOrder));
    }

  } catch (error) {
    console.error("Sipariş detayı çekilirken hata:", error);
  }

  // Yemeği hazırladık, şimdi vitrine (Client) hazır halde servis ediyoruz! 
  return <SiparisDetayClient initialOrder={matchedOrder} />;
}