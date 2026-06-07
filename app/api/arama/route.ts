import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]); // En az 2 harf yazılmadan arama yapmasın
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Hem isimde, hem marka da kelimeyi arar
    const query = {
      $or: [
        { isim: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { marka: { $regex: q, $options: "i" } }
      ]
    };

    // Sistemi yormamak için en fazla 5 sonuç getirir
    let urunler = await db.collection("urunler").find(query).limit(5).toArray();
    if (urunler.length === 0) urunler = await db.collection("uruns").find(query).limit(5).toArray();
    if (urunler.length === 0) urunler = await db.collection("products").find(query).limit(5).toArray();

    // Sadece gerekli verileri ekrana yolluyoruz ki fişek gibi açılsın
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