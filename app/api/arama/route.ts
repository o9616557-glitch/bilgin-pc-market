import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const init = searchParams.get("init") === "true"; // Modal ilk açıldığında çalışacak özel mod

  try {
    const client = await clientPromise;
    const db = client.db();
    
    let query = {};
    if (q) {
      query = {
        $or: [
          { isim: { $regex: q, $options: "i" } },
          { name: { $regex: q, $options: "i" } },
          { marka: { $regex: q, $options: "i" } }
        ]
      };
    }

    // 🔥 init=true ise "En Çok Satanlar" (Vitrin) için son eklenen/popüler 4 ürünü çeker!
    const limit = init ? 4 : 10; 
    
    let urunler = await db.collection("urunler").find(query).limit(limit).toArray();
    if (urunler.length === 0) urunler = await db.collection("uruns").find(query).limit(limit).toArray();
    if (urunler.length === 0) urunler = await db.collection("products").find(query).limit(limit).toArray();

    // Sadece ekranda gösterilecek "Hafif" verileri seçiyoruz ki şimşek gibi açılsın
    const temizUrunler = urunler.map((u: any) => ({
      _id: u._id.toString(),
      isim: u.isim || u.name || "",
      slug: u.slug || u._id.toString(),
      fiyat: u.indirimliFiyat || u.price || u.fiyat || 0,
      resim: (u.resimler && u.resimler[0]) || u.resim || u.image || "/placeholder.jpg"
    }));

    return NextResponse.json(temizUrunler);
  } catch (error) {
    return NextResponse.json([]);
  }
}