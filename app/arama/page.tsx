import KategoriClient from "@/app/kategori/[slug]/KategoriClient";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function AramaSayfasi({ searchParams }: any) {
  // 1. Next.js 15+ için searchParams'ı güvenli (await ile) alıyoruz!
  const sp = await searchParams;
  const arananKelime = sp?.q || "";

  let temizUrunler: any[] = [];
  let hataMesaji = "";

  try {
    const client = await clientPromise;
    const db = client.db();

    const query = {
      $or: [
        { isim: { $regex: arananKelime, $options: "i" } },
        { name: { $regex: arananKelime, $options: "i" } },
        { marka: { $regex: arananKelime, $options: "i" } },
        { kategori: { $regex: arananKelime, $options: "i" } }
      ]
    };

    // 2. ŞEFİN DİKKATİNE: Önce "urunler" tablosuna bakıyoruz...
    let urunler = await db.collection("urunler").find(query).toArray();

    // 3. Eğer boşsa, Mongoose'un otomatik İngilizce yaptığı "uruns" tablosuna bakıyoruz!
    if (urunler.length === 0) {
        urunler = await db.collection("uruns").find(query).toArray();
    }

    // 4. Eğer o da boşsa, bir de "products" tablosuna bakalım
    if (urunler.length === 0) {
        urunler = await db.collection("products").find(query).toArray();
    }

    temizUrunler = urunler.map((urun: any) => ({
      ...urun,
      _id: urun._id.toString(),
      createdAt: urun.createdAt?.toString() || null,
      updatedAt: urun.updatedAt?.toString() || null,
    }));

  } catch (error: any) {
    console.error("Arama motoru hatası:", error);
    hataMesaji = error.message;
  }

  // 🚀 EKRANA HATA, UYARI VEYA VİTRİN BASMA MOTORU
  return (
    <div className="bg-[#050814] min-h-screen pb-20 pt-10 text-white px-4">
      {hataMesaji ? (
         <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500 p-6 rounded-xl">
           <h2 className="text-red-500 font-bold text-xl mb-2">🚨 ŞEFİM BİR HATA YAKALANDI:</h2>
           <p>{hataMesaji}</p>
         </div>
      ) : temizUrunler.length === 0 ? (
         <div className="max-w-2xl mx-auto bg-yellow-500/10 border border-yellow-500 p-6 rounded-xl text-center mt-20">
           <h2 className="text-yellow-500 font-bold text-2xl mb-2">🤔 Arama Çalıştı Ama Ürün Bulunamadı!</h2>
           <p className="text-gray-300"><strong>"{arananKelime}"</strong> kelimesini aradık ama veritabanında eşleşen hiçbir şey yok.</p>
           <p className="text-gray-400 text-sm mt-4">Not: Yukarıdaki adres çubuğunda <strong>/arama?q={arananKelime}</strong> yazıyor mu kontrol et. Eğer yazıyorsa ve bu uyarı çıkıyorsa aradığın kelimede ürün yoktur.</p>
         </div>
      ) : (
        <div className="max-w-[1400px] mx-auto pt-8">
          <KategoriClient
            urunler={temizUrunler}
            sayfaBasligi={"${arananKelime}"}
          />
        </div>
      )}
    </div>
  );
}