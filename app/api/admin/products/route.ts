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
    return NextResponse.json({ error: "Ürünler getirilemedi." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isim, fiyat, indirimliFiyat, havaleIndirimi, stokDurumu, stokAdedi, resim, kategori } = body;

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // ŞEFİM: İşte kurşun geçirmez eşleştirme! 
    // Eğer indirimli fiyat varsa, ana sitenin kafası karışmasın diye 'price' alanına indirimli fiyatı yazıyoruz.
    const anaSiteFiyati = indirimliFiyat ? Number(indirimliFiyat) : Number(fiyat);

    const urunVerisi: any = {
      name: isim,             // Orijinal site için
      isim: isim,             // Admin paneli için
      price: anaSiteFiyati,   // Orijinal site güncel fiyatı
      fiyat: anaSiteFiyati,   // Admin güncel fiyatı
      regular_price: Number(fiyat), // Üstü çizilecek olan normal fiyat
      indirimliFiyat: indirimliFiyat ? Number(indirimliFiyat) : null,
      havaleIndirimi: Number(havaleIndirimi || 0),
      stokDurumu, 
      stokAdedi: Number(stokAdedi || 0), 
      resim, 
      kategori 
    };

    if (id) {
      await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { $set: urunVerisi }
      );
      return NextResponse.json({ success: true, mesaj: "Ürün başarıyla güncellendi!" });
    } else {
      if (!isim || !fiyat) {
        return NextResponse.json({ error: "İsim ve fiyat zorunludur." }, { status: 400 });
      }
      urunVerisi.tarih = new Date();
      await db.collection("products").insertOne(urunVerisi);
      return NextResponse.json({ success: true, mesaj: "Yeni ürün başarıyla eklendi şefim! 🚀" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Sistemsel hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Ürün ID eksik." }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}