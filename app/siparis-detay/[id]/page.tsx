import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SiparisDetayClient from "./SiparisDetayClient"; // Artık bu dosyayı bulabilecek!

export const dynamic = "force-dynamic";

export default async function SiparisDetaySayfasi({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login"); 
  }

  // Next.js 15 uyumluluğu için params id'sini güvenle alıyoruz
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  let matchedOrder = null;

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    let queryId: any;
    try {
      queryId = new mongoose.Types.ObjectId(orderId);
    } catch (e) {
      queryId = orderId;
    }

    const rawOrder = await db.collection("orders").findOne({ _id: queryId as any });

    if (rawOrder) {
      matchedOrder = JSON.parse(JSON.stringify(rawOrder));
    }
  } catch (error) {
    console.error("Sipariş detayı çekilirken hata oluştu:", error);
  }

  return <SiparisDetayClient initialOrder={matchedOrder} />;
}