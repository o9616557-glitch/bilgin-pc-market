import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB Bağlantı Bilgisi (Kendi URI değişkenini buraya sabitleyebilirsin)
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bilginpc"; 
let client: MongoClient;

async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(); // Veritabanı adını otomatik çeker veya içine yazabilirsin (.db("bilginpc"))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori"); // Hangi parça adımındayız? (islemci, anakart vs.)
    
    // Uyum Kriterleri (Hafızadan gelen kilitler)
    const seciliSoket = searchParams.get("soket"); 
    const seciliBellek = searchParams.get("bellek");
    const seciliAnakartYapisi = searchParams.get("anakartYapisi");

    const db = await getDb();
    
    // Veritabanı sorgu filtresi başlangıçta sadece ilgili kategoriyi hedeflesin
    let sorgu: any = { kategoriSlug: kategori };

    // 🚀 AKILLI EŞLEŞTİRME DİŞLİLERİ BURADA DÖNÜYOR 🚀
    
    // Eğer Anakart adımındaysak ve işlemci seçildiyse: Sadece o sokete uygun anakartları getir
    if (kategori === "anakart" && seciliSoket) {
      sorgu["teknik_ozellikler.Soket Tipi"] = seciliSoket;
    }

    // Eğer RAM adımındaysak ve işlemci/anakart seçildiyse: Hafızadaki bellek tipini (DDR5/DDR4) içersin
    if (kategori === "ram" && seciliBellek) {
      // Senin veritabanında "DDR5 5600 MT/s" yazdığı için tam eşleşme değil regex (içerir) yapıyoruz şefim
      sorgu["teknik_ozellikler.Bellek Desteği"] = { $regex: seciliBellek, $options: "i" };
    }

    // Eğer Kasa adımındaysak ve anakart seçildiyse: Kasalar o anakart yapısını (ATX, Micro-ATX) desteklemeli
    if (kategori === "kasa" && seciliAnakartYapisi) {
      sorgu["teknik_ozellikler.Anakart Yapısı"] = { $regex: seciliAnakartYapisi, $options: "i" };
    }

    // Ürünleri fiyata göre artan sırada listele ki temiz dursun
    const urunler = await db.collection("products").find(sorgu).sort({ fiyat: 1 }).toArray();

    return NextResponse.json({ success: true, data: urunler });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}