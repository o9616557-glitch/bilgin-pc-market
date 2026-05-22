import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ŞEFİM: İŞTE SİHİRLİ KOD BU! Next.js'in hafıza tutmasını tamamen yasaklar.
export const dynamic = "force-dynamic";

// Tüm siparişleri en yenisi en üstte olacak şekilde getirir
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    const siparisler = await db.collection("orders").find({}).sort({ tarih: -1 }).toArray();
    
    return NextResponse.json({ success: true, siparisler });
  } catch (error) {
    console.error("Siparişleri çekerken hata:", error);
    return NextResponse.json({ error: "Siparişler getirilemedi." }, { status: 500 });
  }
}

// Siparişin durumunu günceller
export async function PUT(request: Request) {
  try {
    const { id, yeniDurum } = await request.json();
    
    if (!id || !yeniDurum) {
      return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { durum: yeniDurum } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş güncellenirken hata:", error);
    return NextResponse.json({ error: "Durum güncellenemedi." }, { status: 500 });
  }
}