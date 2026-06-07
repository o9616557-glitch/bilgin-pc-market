import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function guvenliRegex(metin: string) {
  if (!metin) return "";
  
  // 1. Önce tehlikeli karakterleri temizle
  let temiz = metin.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '');
  
  // 2. Türkçe karakterleri esnet
  let regexStr = temiz
    .replace(/[iİıI]/g, "[iİıI]")
    .replace(/[gĞğG]/g, "[gĞğG]")
    .replace(/[cÇçC]/g, "[cÇçC]")
    .replace(/[sŞşS]/g, "[sŞşS]")
    .replace(/[oÖöO]/g, "[oÖöO]")
    .replace(/[uÜüU]/g, "[uÜüU]");

  // 🚀 ŞEFİN SİHRİ: Her harfin arasına "isteğe bağlı boşluk" izni veriyoruz
  return regexStr.split("").join("[\\s-]*");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const init = searchParams.get("init") === "true";

  try {
    const client = await clientPromise;
    const db = client.db();
    
    let query = {};
    if (q.trim()) {
      // 🚀 ŞEFİN PARÇALAYICISI: Müşterinin yazdığı kelimeleri boşluklardan ayır
      const kelimeler = q.trim().split(/\s+/);
      
      const aramaSartlari = kelimeler.map((kelime) => {
        const gucluKelime = guvenliRegex(kelime);
        return {
          $or: [
            { isim: { $regex: gucluKelime, $options: "i" } },
            { name: { $regex: gucluKelime, $options: "i" } },
            { marka: { $regex: gucluKelime, $options: "i" } },
            { kategori: { $regex: gucluKelime, $options: "i" } }
          ]
        };
      });

      // Bütün kelimelerin (hem asus hem 5070) aynı üründe geçmesini zorunlu tut
      query = { $and: aramaSartlari };
    }

    const limit = init ? 4 : 10; 
    
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
    console.error("API Arama Hatası:", error);
    return NextResponse.json([]);
  }
}