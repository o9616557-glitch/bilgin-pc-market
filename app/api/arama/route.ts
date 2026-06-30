import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// 🔥 ŞEFİN TÜRKÇE VE BOŞLUK ÇEVİRMENİ (HATASIZ SÜRÜM) 🔥
function guvenliRegex(metin: string) {
  if (!metin) return "";
  
  let aralikli = metin.split('').join('%%%');
  let temiz = aralikli.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
  
  // 🔥 İŞTE BÜYÜ BURADA: \s yerine köşeli parantez içinde boşluk [ ]* kullanıyoruz. 
  // Böylece içindeki s harfi Türkçe çevirmene takılıp sistemi patlatmıyor!
  temiz = temiz.split('%%%').join('[ ]*');
  
  return temiz
    .replace(/[iİıI]/g, "[iİıI]")
    .replace(/[gĞğG]/g, "[gĞğG]")
    .replace(/[cÇçC]/g, "[cÇçC]")
    .replace(/[sŞşS]/g, "[sŞşS]")
    .replace(/[oÖöO]/g, "[oÖöO]")
    .replace(/[uÜüU]/g, "[uÜüU]");
}
// 🚀 ŞEFİN HARF VE RAKAM NEŞTERİ (asus5070 -> asus 5070 yapar)
function harfRakamAyir(metin: string) {
  if (!metin) return "";
  return metin
    .replace(/([a-zA-ZğüşıöçĞÜŞİÖÇ])(\d)/g, '$1 $2') // Harften sonra rakam gelirse arayı aç
    .replace(/(\d)([a-zA-ZğüşıöçĞÜŞİÖÇ])/g, '$1 $2'); // Rakamdan sonra harf gelirse arayı aç (örn: 5070rtx -> 5070 rtx)
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
      // 1. Önce müşterinin yapışık yazdığı "asus5070"i ayırıyoruz
      const akilliMetin = harfRakamAyir(q.trim());
      
      // 2. Ayırdığımız metni kelimelere bölüyoruz
      const kelimeler = akilliMetin.split(/\s+/);
      
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

      // 3. Yazılan her parçanın o üründe geçmesini zorunlu tutuyoruz
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