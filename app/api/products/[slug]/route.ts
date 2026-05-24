import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Senin resimdeki bağlantı köprün

export async function GET() {
  try {
    // Veritabanına bağlan
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); // Senin veritabanı adın

    // "products" koleksiyonundaki BÜTÜN ürünleri dizi (array) olarak çek
    const products = await db.collection("products").find({}).toArray();

    // Ürünleri Favoriler sayfasına gönder
    return NextResponse.json({ products });
    
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}