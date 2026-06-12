import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB Bağlantı Bilgisi
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
    
    // Uyum Kriterleri 
    const seciliSoket = searchParams.get("soket"); 
    const seciliBellek = searchParams.get("bellek");
    const seciliAnakartYapisi = searchParams.get("anakartYapisi");

    const db = await getDb();
    
    // 🚀 BÜYÜK/KÜÇÜK İ HARFİ SENDROMUNU ÇÖZEN KURŞUNGEÇİRMEZ ARAMA 🚀
    // Kelimenin başındaki sorunlu harfleri attık, "şlemci" veya "slemci" geçiyorsa bile bulacak!
    let regexStr = "";
    if (kategori === "islemci") regexStr = "şlemci|slemci|cpu|islemci|işlemci";
    else if (kategori === "anakart") regexStr = "anakart|board";
    else if (kategori === "ram") regexStr = "ram|bellek";
    else if (kategori === "ekran-karti") regexStr = "ekran|vga|gpu";
    else if (kategori === "ssd") regexStr = "ssd|m.2|disk|hdd";
    else if (kategori === "kasa") regexStr = "kasa|kabin";
    else if (kategori === "psu") regexStr = "güç|guc|psu|power";
    else if (kategori === "sogutma") regexStr = "soğut|sogut|cooler";

    // Kategori isminde VEYA kategoriSlug isminde arama yap (Kesin bulur)
    let sorgu: any = {
      $or: [
        { kategori: { $regex: regexStr, $options: "i" } },
        { kategoriSlug: { $regex: regexStr, $options: "i" } }
      ]
    };

    // 🚀 ZİNCİRLEME UYUM FİLTRELERİ (Soket, Bellek, Kasa uyumu)
    if (kategori === "anakart" && seciliSoket) {
      sorgu["teknik_ozellikler.Soket Tipi"] = { $regex: seciliSoket, $options: "i" };
    }

    if (kategori === "ram" && seciliBellek) {
      sorgu["teknik_ozellikler.Bellek Desteği"] = { $regex: seciliBellek, $options: "i" };
    }

    if (kategori === "kasa" && seciliAnakartYapisi) {
      sorgu["teknik_ozellikler.Anakart Yapısı"] = { $regex: seciliAnakartYapisi, $options: "i" };
    }

    const urunler = await db.collection("products").find(sorgu).sort({ fiyat: 1 }).toArray();

    return NextResponse.json({ success: true, data: urunler });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}