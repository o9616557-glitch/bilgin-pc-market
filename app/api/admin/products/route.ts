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
    
    // ŞEFİM: İŞTE BURASI! Senin formdan gönderdiğin TÜM VERİLERİ eksiksiz içeri alıyoruz.
    const { id, isim, fiyat, indirimliFiyat, havaleIndirimi, stokDurumu, stokAdedi, resim, kategori } = body;

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Eğer kutu boşsa veritabanına null (yok) olarak kaydediyoruz ki "Stokta Var" yazabilsin
    const islenenStok = (stokAdedi === "" || stokAdedi === null || stokAdedi === undefined) ? null : Number(stokAdedi);
    
    // Vitrin fiyatı (indirim varsa o geçerli, yoksa normal fiyat)
    const anaSiteFiyati = indirimliFiyat ? Number(indirimliFiyat) : Number(fiyat);

    // ŞEFİM: Veritabanına yazılacak KUSURSUZ paket
    const urunVerisi: any = {
      name: isim,
      isim: isim,
      price: anaSiteFiyati,
      fiyat: anaSiteFiyati,
      regular_price: Number(fiyat),
      indirimliFiyat: indirimliFiyat ? Number(indirimliFiyat) : null,
      havaleIndirimi: Number(havaleIndirimi || 0),
      stokDurumu: stokDurumu || "Stokta Var",
      stokAdedi: islenenStok,
      resim: resim || "/placeholder.png",
      kategori: kategori || "Bilgisayar"
    };

    if (id) {
      // Düzenleme işlemi
      await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { $set: urunVerisi }
      );
      return NextResponse.json({ success: true, mesaj: "Ürün başarıyla güncellendi!" });
    } else {
      // Yeni ürün ekleme işlemi
      if (!isim || !fiyat) return NextResponse.json({ error: "İsim/Fiyat zorunlu" }, { status: 400 });
      urunVerisi.tarih = new Date();
      await db.collection("products").insertOne(urunVerisi);
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