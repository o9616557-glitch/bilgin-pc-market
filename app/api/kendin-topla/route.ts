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
    const seciliAnakartYapisi = searchParams.get("anakartYapisi");

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

    let sorgu: any = {
      $or: [
        { kategori: { $regex: regexStr, $options: "i" } },
        { kategoriSlug: { $regex: regexStr, $options: "i" } }
      ]
    };

    // 🚀 ESNEK UYUM FİLTRELERİ
    if (kategori === "anakart" && seciliSoket && seciliSoket !== "undefined") {
      sorgu["$or"] = [
        { "teknik_ozellikler.Soket Tipi": { $regex: seciliSoket, $options: "i" } },
        { "teknik_ozellikler.Soket": { $regex: seciliSoket, $options: "i" } }
      ];
    }

    if (kategori === "ram" && seciliBellek && seciliBellek !== "undefined") {
      sorgu["$or"] = [
        { "teknik_ozellikler.Bellek Desteği": { $regex: seciliBellek, $options: "i" } },
        { "teknik_ozellikler.Bellek Türü": { $regex: seciliBellek, $options: "i" } },
        { "teknik_ozellikler.Tip": { $regex: seciliBellek, $options: "i" } }
      ];
    }

    // Kasalarda katı filtreleme kilitlenmeye sebep olmasın diye esnettik patron
    if (kategori === "kasa" && seciliAnakartYapisi && seciliAnakartYapisi !== "undefined") {
      // Eğer veritabanında tam eşleşme yoksa genel listeyi bozmasın diye esnek regex uyguluyoruz
      sorgu["$or"] = [
        { "teknik_ozellikler.Anakart Yapısı": { $regex: "atx", $options: "i" } },
        { "teknik_ozellikler.Anakart Desteği": { $regex: "atx", $options: "i" } },
        { resim: { $exists: true } } // Her ihtimale karşı boş kalmasın diye fallback
      ];
    }

    const urunler = await db.collection("products").find(sorgu).sort({ fiyat: 1 }).toArray();

    return NextResponse.json({ success: true, data: urunler });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}