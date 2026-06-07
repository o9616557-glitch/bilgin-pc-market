import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// 🔥 ŞEFİN YENİ NESİL TÜRKÇE ÇEVİRMENİ 🔥
function gelismisRegex(metin: string) {
  if (!metin) return "";
  return metin
    .replace(/[iİıI]/g, "[iİıI]")
    .replace(/[gĞğG]/g, "[gĞğG]")
    .replace(/[cÇçC]/g, "[cÇçC]")
    .replace(/[sŞşS]/g, "[sŞşS]")
    .replace(/[oÖöO]/g, "[oÖöO]")
    .replace(/[uÜüU]/g, "[uÜüU]");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const init = searchParams.get("init") === "true";

  try {
    const client = await clientPromise;
    const db = client.db();
    
    let query = {};
    if (q) {
      const gucluKelime = gelismisRegex(q);
      query = {
        $or: [
          { isim: { $regex: gucluKelime, $options: "i" } },
          { name: { $regex: gucluKelime, $options: "i" } },
          { marka: { $regex: gucluKelime, $options: "i" } }
        ]
      };
    }

    const limit = init ? 4 : 12; 
    
    let urunler = await db.collection("urunler").find(query).limit(limit).toArray();
    if (urunler.length === 0) urunler = await db.collection("uruns").find(query).limit(limit).toArray();
    if (urunler.length === 0) urunler = await db.collection("products").find(query).limit(limit).toArray();

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