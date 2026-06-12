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
    // 🚀 ŞEFİM, SOĞUTMA FİLTRESİ GENİŞLETİLDİ (Sıvı soğutma, işlemci soğutucu ne varsa bulur)
    else if (kategori === "sogutma") regexStr = "soğut|sogut|cooler|fan|sıvı|sivi";

    let conditions: any[] = [
      {
        $or: [
          { kategori: { $regex: regexStr, $options: "i" } },
          { kategoriSlug: { $regex: regexStr, $options: "i" } }
        ]
      }
    ];

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

    const sorgu = { $and: conditions };
    const urunler = await db.collection("products").find(sorgu).sort({ fiyat: 1 }).toArray();
    
    return NextResponse.json({ success: true, data: urunler });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}