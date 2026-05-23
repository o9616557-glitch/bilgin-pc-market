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
    // ŞEFİM: stokAdedi eklendi!
    const { id, isim, fiyat, stokDurumu, stokAdedi, resim, kategori } = body;

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    if (id) {
      await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isim, 
            fiyat: Number(fiyat), 
            stokDurumu, 
            stokAdedi: Number(stokAdedi || 0), // Sayı olarak kaydediyoruz
            resim, 
            kategori 
          } 
        }
      );
      return NextResponse.json({ success: true, mesaj: "Ürün başarıyla güncellendi!" });
    } else {
      if (!isim || !fiyat) {
        return NextResponse.json({ error: "İsim ve fiyat alanları zorunludur." }, { status: 400 });
      }
      
      const yeniUrun = {
        isim,
        fiyat: Number(fiyat),
        stokDurumu: stokDurumu || "Stokta Var",
        stokAdedi: Number(stokAdedi || 10), // Varsayılan 10 adet
        resim: resim || "/placeholder.png",
        kategori: kategori || "Bilgisayar",
        tarih: new Date()
      };

      await db.collection("products").insertOne(yeniUrun);
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