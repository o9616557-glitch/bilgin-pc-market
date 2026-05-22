import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ŞEFİM: Next.js önbelleğini tamamen kapatır ve her saniye sıfırdan istek attırır
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // Şefim, tarayıcıların önbellek kurnazlığını bozmak için benzersiz bir url parametresiyle çekiyoruz
    const { searchParams } = new URL(request.url);
    const v = searchParams.get("v"); 

    const siparisler = await db.collection("orders").find({}).sort({ tarih: -1 }).toArray();
    
    // Her ihtimale karşı tarayıcıya "asla kaydetme" başlıkları (headers) basıyoruz
    return new NextResponse(JSON.stringify({ success: true, siparisler }), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Siparişleri çekerken hata:", error);
    return NextResponse.json({ error: "Siparişler getirilemedi." }, { status: 500 });
  }
}

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