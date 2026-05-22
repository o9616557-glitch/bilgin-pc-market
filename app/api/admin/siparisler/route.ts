import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    const siparisler = await db.collection("orders").find({}).sort({ tarih: -1 }).toArray();
    
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
    const { id, yeniDurum, adminNotu } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // ŞEFİM: Sadece durum gelirse durumu, sadece not gelirse notu günceller!
    const guncellenecekler: any = {};
    if (yeniDurum !== undefined) guncellenecekler.durum = yeniDurum;
    if (adminNotu !== undefined) guncellenecekler.adminNotu = adminNotu;

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: guncellenecekler }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş güncellenirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}