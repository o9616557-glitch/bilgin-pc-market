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
  return client.db();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori"); // islemci, anakart vs.
    
    // Uyum Kriterleri
    const seciliSoket = searchParams.get("soket"); 
    const seciliBellek = searchParams.get("bellek");
    const seciliAnakartYapisi = searchParams.get("anakartYapisi");

    const db = await getDb();
    
    // 🚀 AKILLI KATEGORİ EŞLEŞTİRME (Büyük/küçük harf ve Türkçe karakter sorunu çözüldü)
    let kategoriRegex = "";
    if (kategori === "islemci") kategoriRegex = "işlemci|islemci|cpu";
    else if (kategori === "anakart") kategoriRegex = "anakart";
    else if (kategori === "ram") kategoriRegex = "ram|bellek";
    else if (kategori === "ekran-karti") kategoriRegex = "ekran kartı|ekran karti|vga";
    else if (kategori === "ssd") kategoriRegex = "ssd|m.2|disk|hdd";
    else if (kategori === "kasa") kategoriRegex = "kasa";
    else if (kategori === "psu") kategoriRegex = "güç kaynağı|guc kaynagi|psu";
    else if (kategori === "sogutma") kategoriRegex = "soğutma|sogutma|soğutucu";

    // $options: "i" demek, büyük/küçük harf duyarsız yap demek (Case Insensitive)
    let sorgu: any = { kategori: { $regex: kategoriRegex, $options: "i" } };

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