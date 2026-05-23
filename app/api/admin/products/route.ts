import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GIZLI_ANAHTAR = "Bilgin123";

// 1. ÜRÜNLERİ GETİRME MOTORU
export async function GET(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // Veritabanındaki products (ürünler) klasöründen hepsini çekiyoruz
    const urunler = await db.collection("products").find({}).toArray();
    
    return new NextResponse(JSON.stringify({ success: true, urunler }), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Ürünler çekilirken hata:", error);
    return NextResponse.json({ error: "Ürünler getirilemedi." }, { status: 500 });
  }
}

// 2. ÜRÜN GÜNCELLEME VE YENİ ÜRÜN EKLEME MOTORU
export async function PUT(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isim, fiyat, stokDurumu, resim, kategori } = body;

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Eğer ID varsa mevcut ürünü GÜNCELLE
    if (id) {
      await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isim, 
            fiyat: Number(fiyat), 
            stokDurumu, 
            resim, 
            kategori 
          } 
        }
      );
      return NextResponse.json({ success: true, mesaj: "Ürün başarıyla güncellendi!" });
    } 
    // ID yoksa YENİ ÜRÜN EKLE
    else {
      if (!isim || !fiyat) {
        return NextResponse.json({ error: "İsim ve fiyat alanları zorunludur." }, { status: 400 });
      }
      
      const yeniUrun = {
        isim,
        fiyat: Number(fiyat),
        stokDurumu: stokDurumu || "Stokta Var",
        resim: resim || "/placeholder.png",
        kategori: kategori || "Bilgisayar",
        tarih: new Date()
      };

      await db.collection("products").insertOne(yeniUrun);
      return NextResponse.json({ success: true, mesaj: "Yeni ürün başarıyla eklendi şefim! 🚀" });
    }

  } catch (error) {
    console.error("Ürün işlem hatası:", error);
    return NextResponse.json({ error: "Sistemsel hata oluştu." }, { status: 500 });
  }
}

// 3. ÜRÜN SİLME MOTORU
export async function DELETE(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Ürün ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}