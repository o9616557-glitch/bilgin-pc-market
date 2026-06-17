import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // Bütün ürünleri çekiyoruz
    const products = await db.collection("products").find({}).toArray();
    let guncellenenSayisi = 0;

    // Türkçe karakterleri temizleyen çeviri motorumuz
    const slugify = (text: string) => {
      return (text || "").toString().toLowerCase()
        .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c")
        .replace(/ö/g, "o").replace(/ğ/g, "g").replace(/ü/g, "u")
        .replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    };

    // 300 ürünü tek tek dönüp, kategoriSlug satırını içlerine ekliyoruz
    for (const urun of products) {
      const catName = urun.kategori || urun.category || "";
      if (catName) {
        const kSlug = slugify(catName);
        await db.collection("products").updateOne(
          { _id: urun._id },
          { $set: { kategoriSlug: kSlug } }
        );
        guncellenenSayisi++;
      }
    }

    return NextResponse.json({ 
      mesaj: `OPERASYON TAMAM ŞEF! Toplam ${guncellenenSayisi} ürünün veritabanı kaydına kategoriSlug başarıyla eklendi.` 
    });
    
  } catch (error) {
    return NextResponse.json({ hata: "Bir şeyler ters gitti." }, { status: 500 });
  }
}