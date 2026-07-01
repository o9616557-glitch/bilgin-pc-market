import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { urunAramaQueryOlustur } from "@/lib/product-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const init = searchParams.get("init") === "true";

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const query = q.trim() ? urunAramaQueryOlustur(q) : {};

    const limit = init ? 4 : 10; 

    // 🚀 Asıl veriler "products" koleksiyonunda. Önce ona gidiyoruz ki
    // her aramada boş koleksiyonlarda gereksiz $regex taraması yapılmasın.
    const projection = {
      isim: 1, name: 1, slug: 1,
      indirimliFiyat: 1, price: 1, fiyat: 1,
      resimler: 1, resim: 1, image: 1, images: 1,
    };

    let urunler = await db.collection("products").find(query).project(projection).limit(limit).maxTimeMS(1200).toArray();
    if (urunler.length === 0) urunler = await db.collection("urunler").find(query).project(projection).limit(limit).maxTimeMS(1200).toArray();
    if (urunler.length === 0) urunler = await db.collection("uruns").find(query).project(projection).limit(limit).maxTimeMS(1200).toArray();

    const resimBul = (u: any) => {
      if (Array.isArray(u.resimler) && u.resimler[0]) return u.resimler[0];
      if (u.resim) return u.resim;
      if (u.image) return u.image;
      if (Array.isArray(u.images) && u.images[0]) {
        return typeof u.images[0] === "string" ? u.images[0] : (u.images[0]?.src || "/placeholder.jpg");
      }
      return "/placeholder.jpg";
    };

    const temizUrunler = urunler.map((u: any) => ({
      _id: u._id.toString(),
      isim: u.isim || u.name || "",
      slug: u.slug || u._id.toString(),
      fiyat: u.indirimliFiyat || u.price || u.fiyat || 0,
      resim: resimBul(u),
    }));

    const response = NextResponse.json(temizUrunler);
    if (init) {
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    }
    return response;
  } catch (error) {
    console.error("API Arama Hatası:", error);
    return NextResponse.json([]);
  }
}