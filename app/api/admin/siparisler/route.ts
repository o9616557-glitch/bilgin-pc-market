import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GIZLI_ANAHTAR = "Bilgin123"; 

export async function GET(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

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
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const { id, yeniDurum, musteriMesaji } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    const guncellenecekler: any = {};
    if (yeniDurum !== undefined) guncellenecekler.durum = yeniDurum;
    if (musteriMesaji !== undefined) guncellenecekler.musteriMesaji = musteriMesaji;

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

// ŞEFİM: İŞTE YENİ SİLME MOTORUMUZ!
export async function DELETE(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // Veritabanından o siparişi kökünden siliyoruz
    await db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş silinirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}