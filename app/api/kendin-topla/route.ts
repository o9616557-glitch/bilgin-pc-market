import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bilginpc"; 
let client: MongoClient;

async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori"); 
    
    const seciliSoket = searchParams.get("soket"); 
    const seciliBellek = searchParams.get("bellek");
    const seciliYapi = searchParams.get("yapi");

    const db = await getDb();
    
    let regexStr = "";
    if (kategori === "islemci") regexStr = "şlemci|slemci|cpu|islemci|işlemci";
    else if (kategori === "anakart") regexStr = "anakart|board";
    else if (kategori === "ram") regexStr = "ram|bellek";
    else if (kategori === "ekran-karti") regexStr = "ekran|vga|gpu";
    else if (kategori === "ssd") regexStr = "ssd|m.2|disk|hdd";
    else if (kategori === "kasa") regexStr = "kasa|kabin";
    else if (kategori === "psu") regexStr = "güç|guc|psu|power";
    else if (kategori === "sogutma") regexStr = "soğut|sogut|cooler";

    // 🚀 SEPETİN ANA TEMELİ: Kategoriyi koruma altına alıyoruz
    let conditions: any[] = [
      {
        $or: [
          { kategori: { $regex: regexStr, $options: "i" } },
          { kategoriSlug: { $regex: regexStr, $options: "i" } }
        ]
      }
    ];

    // 🚀 SENİN DEDİĞİN "TEK TEK AYAR VERME" MANTIĞI BURADA DÖNÜYOR:
    
    // 1. SOKET AYARI (İşlemci, Anakart ve Soğutucu için alan adları tek tek tanımlandı)
    if (seciliSoket && seciliSoket !== "null" && seciliSoket !== "undefined" && seciliSoket !== "") {
      if (kategori === "anakart" || kategori === "islemci") {
        conditions.push({
          $or: [
            { "teknik_ozellikler.Soket Tipi": { $regex: seciliSoket, $options: "i" } },
            { "teknik_ozellikler.Soket": { $regex: seciliSoket, $options: "i" } }
          ]
        });
      }
      if (kategori === "sogutma") {
        conditions.push({
          $or: [
            { "teknik_ozellikler.Uyumlu Soketler": { $regex: seciliSoket, $options: "i" } },
            { "teknik_ozellikler.Soket Desteği": { $regex: seciliSoket, $options: "i" } },
            { "teknik_ozellikler.Soket Tipi": { $regex: seciliSoket, $options: "i" } }
          ]
        });
      }
    }

    // 2. BELLEK AYARI (Anakart ve RAM'deki tüm olası kelimeler tek tek listelendi patron)
    if (seciliBellek && seciliBellek !== "null" && seciliBellek !== "undefined" && seciliBellek !== "") {
      if (kategori === "ram" || kategori === "anakart" || kategori === "islemci") {
        conditions.push({
          $or: [
            { "teknik_ozellikler.Bellek Türü": { $regex: seciliBellek, $options: "i" } },
            { "teknik_ozellikler.Bellek Tipi": { $regex: seciliBellek, $options: "i" } },
            { "teknik_ozellikler.RAM Tipi": { $regex: seciliBellek, $options: "i" } },
            { "teknik_ozellikler.Bellek Desteği": { $regex: seciliBellek, $options: "i" } },
            { "teknik_ozellikler.Tip": { $regex: seciliBellek, $options: "i" } }
          ]
        });
      }
    }

    // 3. KASA VE ANAKART BOYUT AYARI
    if (seciliYapi && seciliYapi !== "null" && seciliYapi !== "undefined" && seciliYapi !== "") {
      if (kategori === "kasa" || kategori === "anakart") {
        conditions.push({
          $or: [
            { "teknik_ozellikler.Anakart Yapısı": { $regex: seciliYapi, $options: "i" } },
            { "teknik_ozellikler.Anakart Desteği": { $regex: seciliYapi, $options: "i" } }
          ]
        });
      }
    }

    // Bütün şartları güvenli bir $and zinciriyle MongoDB'ye gönderiyoruz şefim
    const sorgu = { $and: conditions };
    const urunler = await db.collection("products").find(sorgu).sort({ fiyat: 1 }).toArray();
    
    return NextResponse.json({ success: true, data: urunler });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}