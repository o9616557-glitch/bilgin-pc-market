import KategoriClient from "@/app/kategori/[slug]/KategoriClient";
import clientPromise from "@/lib/mongodb"; // 🎯 FOTOĞRAFTAN ALINAN DOĞRU BAĞLANTI

export const dynamic = "force-dynamic";

export default async function AramaSayfasi({ searchParams }: any) {
  // 1. URL'den müşterinin yazdığı kelimeyi yakalıyoruz (Örn: ?q=RTX)
  const arananKelime = searchParams?.q || "";

  let temizUrunler: any[] = [];

  try {
    // 2. Senin yöntemine (clientPromise) göre veritabanına bağlanıyoruz
    const client = await clientPromise;
    const db = client.db(); 

    // 3. Arama Zekası: İsimde, markada veya kategoride aranan kelimeyi bulur (Büyük/küçük harf duyarsız)
    const query = {
      $or: [
        { isim: { $regex: arananKelime, $options: "i" } },
        { name: { $regex: arananKelime, $options: "i" } },
        { marka: { $regex: arananKelime, $options: "i" } },
        { kategori: { $regex: arananKelime, $options: "i" } }
      ]
    };

    // 4. "urunler" koleksiyonundan verileri çekiyoruz
    const urunler = await db.collection("urunler").find(query).toArray();

    // 5. Ekrana basılacak formata (String'e) çeviriyoruz
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
          sayfaBasligi={"${arananKelime}"}
        />
      </div>
    </div>
  );
}