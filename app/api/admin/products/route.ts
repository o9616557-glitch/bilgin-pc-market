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
      headers: { "Cache-Control": "no-store", "Pragma": "no-cache", "Expires": "0" },
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
    const { id, isim, fiyat, stokDurumu, stokAdedi, resim, kategori } = body;

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // ŞEFİM: İŞTE SİHİR BURADA! Eğer kutu boşsa veritabanına null (yok) olarak kaydediyoruz.
    const islenenStok = (stokAdedi === "" || stokAdedi === null || stokAdedi === undefined) ? null : Number(stokAdedi);

    if (id) {
      await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isim, 
            fiyat: Number(fiyat), 
            stokDurumu, 
            stokAdedi: islenenStok, // Boşsa boş kalır, sayıysa sayı olur
            resim, 
            kategori 
          } 
        }
      );
      return NextResponse.json({ success: true, mesaj: "Ürün güncellendi!" });
    } else {
      if (!isim || !fiyat) return NextResponse.json({ error: "İsim/Fiyat zorunlu" }, { status: 400 });
      
      const yeniUrun = {
        isim,
        fiyat: Number(fiyat),
        stokDurumu: stokDurumu || "Stokta Var",
        stokAdedi: islenenStok, // Boşsa boş kalır
        resim: resim || "/placeholder.png",
        kategori: kategori || "Bilgisayar",
        tarih: new Date()
      };

      await db.collection("products").insertOne(yeniUrun);
      return NextResponse.json({ success: true, mesaj: "Yeni ürün eklendi!" });
    }

  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: "Hata." }, { status: 500 }); }
}