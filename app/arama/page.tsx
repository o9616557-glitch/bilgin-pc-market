import Link from "next/link";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

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
  const arananKelime = searchParams?.q || "";
  let temizUrunler: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db();
   let query = {};
    if (arananKelime.trim()) {
      // 🚀 ŞEFİN PARÇALAYICISI: Müşterinin yazdığı kelimeleri boşluklardan ayırır
      const kelimeler = arananKelime.trim().split(/\s+/);
      
      const aramaSartlari = kelimeler.map((kelime: string) => {
        const gucluKelime = gelismisRegex(kelime);
        return {
          $or: [
            { isim: { $regex: gucluKelime, $options: "i" } },
            { name: { $regex: gucluKelime, $options: "i" } },
            { marka: { $regex: gucluKelime, $options: "i" } },
            { kategori: { $regex: gucluKelime, $options: "i" } }
          ]
        };
      });

      // Bütün kelimelerin aynı üründe geçmesini zorunlu tut
      query = { $and: aramaSartlari };
    }

    let urunler = await db.collection("urunler").find(query).toArray();
    if (urunler.length === 0) urunler = await db.collection("uruns").find(query).toArray();
    if (urunler.length === 0) urunler = await db.collection("products").find(query).toArray();

    temizUrunler = urunler.map((urun: any) => ({
      ...urun,
      _id: urun._id.toString(),
      fiyat: urun.indirimliFiyat || urun.fiyat || urun.price || 0,
      resim: (urun.resimler && urun.resimler[0]) || urun.resim || urun.image || "/placeholder.jpg"
    }));
  } catch (error) {
    console.error("Arama hatası:", error);
  }

  return (
    <div className="bg-[#050814] min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 ÜST BAŞLIK BÖLÜMÜ */}
        <div className="mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {arananKelime ? `"${arananKelime}" İçin Arama Sonuçları` : "Tüm Ürünler"}
          </h1>
          <p className="text-gray-400 mt-2 font-medium">{temizUrunler.length} ürün bulundu</p>
        </div>

        {/* 🔥 FİLTRESİZ, TAM EKRAN ÜRÜN VİTRİNİ */}
        {temizUrunler.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {temizUrunler.map((urun) => (
              <Link key={urun._id} href={"/product/" + urun.slug} className="bg-[#121212] border border-white/5 hover:border-[#00d2ff]/50 rounded-2xl p-4 flex flex-col group transition-all">
                <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center p-3">
                  <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-sm text-gray-300 font-medium line-clamp-2 flex-1 mb-3 group-hover:text-[#00d2ff] transition-colors">{urun.isim}</h3>
                <div className="text-lg font-black text-[#00d2ff]">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xl font-bold text-gray-300 mb-2">Üzgünüz, ürün bulunamadı.</p>
            <p className="text-gray-500">Lütfen farklı bir kelimeyle aramayı deneyin.</p>
          </div>
        )}

      </div>
    </div>
  );
}