import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // MongoDB köprümüzü bağlıyoruz

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    // Veritabanına bağlan
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); // Veritabanı adın
    
    // "products" koleksiyonunda slug'ı eşleşen ürünü bul
    const urun = await db.collection("products").findOne({ slug: slug });

    if (urun) {
      return NextResponse.json(urun);
    }

    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}