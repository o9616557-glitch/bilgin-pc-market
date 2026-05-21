import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { musteri, sepet, odemeYontemi, toplamTutar } = body;

    if (!musteri || !sepet || !odemeYontemi || !toplamTutar) {
      return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Siparişe benzersiz bir sipariş kodu üret (Örn: BPC-168492)
    const siparisKodu = `BPC-${Math.floor(100000 + Math.random() * 900000)}`;

    const yeniSiparis = {
      siparisKodu,
      musteri,
      sepet,
      odemeYontemi,
      toplamTutar,
      durum: "Beklemede",
      tarih: new Date()
    };

    // "orders" koleksiyonuna siparişi kaydet
    await db.collection("orders").insertOne(yeniSiparis);

    return NextResponse.json({ success: true, siparisKodu });

  } catch (error: any) {
    console.error("SİPARİŞ API HATASI:", error);
    return NextResponse.json({ error: "Sipariş işlenirken bir hata oluştu." }, { status: 500 });
  }
}