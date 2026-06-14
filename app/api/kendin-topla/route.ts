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
    const kategori = searchParams.get("kategori") || ""; 
    
    const seciliSoket = searchParams.get("soket") || ""; 
    const seciliBellek = searchParams.get("bellek") || "";
    const seciliYapi = searchParams.get("yapi") || "";
    const seciliRadyator = searchParams.get("radyator") || "";

    const db = await getDb();
    
    let regexStr = "";
    if (kategori === "islemci") regexStr = "şlemci|slemci|cpu|islemci|işlemci";
    else if (kategori === "anakart") regexStr = "anakart|board";
   else if (kategori === "ram") regexStr = "ram";
    else if (kategori === "ekran-karti") regexStr = "ekran|vga|gpu";
    else if (kategori === "ssd") regexStr = "ssd|m.2|disk|hdd";
    else if (kategori === "kasa") regexStr = "kasa|kabin";
    else if (kategori === "psu") regexStr = "güç|guc|psu|power";
    else if (kategori === "sogutma") regexStr = "soğut|sogut|cooler|fan|sıvı|sivi|water";

    let conditions: any[] = [
      {
        $or: [
          { kategori: { $regex: regexStr, $options: "i" } },
          { kategoriSlug: { $regex: regexStr, $options: "i" } }
        ]
      }
    ];

    // 1. SOKET KONTROLÜ
    if (seciliSoket && seciliSoket !== "undefined" && seciliSoket.trim() !== "") {
      if (["islemci", "anakart", "sogutma"].includes(kategori)) {
        conditions.push({ "sihirbaz_ozellikleri.soket": { $regex: seciliSoket, $options: "i" } });
      }
    }

    // 2. BELLEK KONTROLÜ
    if (seciliBellek && seciliBellek !== "undefined" && seciliBellek.trim() !== "") {
      if (["islemci", "anakart", "ram"].includes(kategori)) {
        conditions.push({ "sihirbaz_ozellikleri.bellek_tipi": { $regex: seciliBellek, $options: "i" } });
      }
    }

    // 3. ANAKART BOYUT KONTROLÜ
    if (seciliYapi && seciliYapi !== "undefined" && seciliYapi.trim() !== "") {
      if (["anakart", "kasa"].includes(kategori)) {
        conditions.push({ "sihirbaz_ozellikleri.anakart_yapisi": { $regex: seciliYapi, $options: "i" } });
      }
    }

    // 4. RADYATÖR VE KASA UYUMU
    if (seciliRadyator && seciliRadyator !== "undefined" && seciliRadyator.trim() !== "") {
      if (["sogutma", "kasa"].includes(kategori)) {
        conditions.push({ "sihirbaz_ozellikleri.radyator_boyutu": { $regex: seciliRadyator, $options: "i" } });
      }
    }

    const sorgu = { $and: conditions };
    const urunler = await db.collection("products").find(sorgu).sort({ fiyat: 1 }).toArray();
    
    return NextResponse.json({ success: true, data: urunler });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}