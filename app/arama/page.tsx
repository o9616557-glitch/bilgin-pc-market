import KategoriClient from "@/app/kategori/[slug]/KategoriClient";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// 🔥 ŞEFİN YENİ NESİL TÜRKÇE KARAKTER VE BÜYÜK/KÜÇÜK HARF TERCÜMANI 🔥
// Bu motor "ı" ile "i"yi, "ğ" ile "g"yi aynı şey sanır. Müşteri nasıl yazarsa yazsın ürünü bulur!
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

export default async function AramaSayfasi({ searchParams }: any) {
  // 1. URL'den müşterinin yazdığı kelimeyi yakalıyoruz
  const arananKelime = searchParams?.q || "";

  let temizUrunler: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db(); 

    // Şifreli kelimeyi akıllı Türkçe çeviriciye sokuyoruz
    const gucluKelime = gelismisRegex(arananKelime);

    // 3. Arama Zekası: İsim, marka ve kategoride JİLET gibi arar
    const query = arananKelime ? {
      $or: [
        { isim: { $regex: gucluKelime, $options: "i" } },
        { name: { $regex: gucluKelime, $options: "i" } },
        { marka: { $regex: gucluKelime, $options: "i" } },
        { kategori: { $regex: gucluKelime, $options: "i" } }
      ]
    } : {};

    // 4. 🔥 SADECE "urunler" DEĞİL, TÜM KOLEKSİYONLARA BAKIYORUZ Kİ BOŞ ÇIKMASIN!
    let urunler = await db.collection("urunler").find(query).toArray();
    if (urunler.length === 0) urunler = await db.collection("uruns").find(query).toArray();
    if (urunler.length === 0) urunler = await db.collection("products").find(query).toArray();

    // 5. Ekrana basılacak formata çeviriyoruz
    temizUrunler = urunler.map((urun: any) => ({
      ...urun,
      _id: urun._id.toString(),
      createdAt: urun.createdAt?.toString() || null,
      updatedAt: urun.updatedAt?.toString() || null,
    }));

  } catch (error) {
    console.error("Arama motoru hatası:", error);
  }

  // 6. O şaheser KategoriClient'imizi arama sonuçları için ekrana basıyoruz!
  return (
    <div className="bg-[#050814] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto pt-8">
        <KategoriClient
          urunler={temizUrunler}
          // 🔥 BAŞLIK HATASI DÜZELTİLDİ: Artık ekranda "RTX İçin Arama Sonuçları" yazacak
          sayfaBasligi={arananKelime ? `"${arananKelime}" İçin Arama Sonuçları` : "Tüm Ürünler"}
        />
      </div>
    </div>
  );
}