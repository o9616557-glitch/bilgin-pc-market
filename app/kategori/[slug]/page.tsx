import clientPromise from "@/lib/mongodb";
import KategoriClient from "./KategoriClient"; // Az önce oluşturduğumuz dosyayı çağırıyoruz

export const revalidate = 60;

export default async function KategoriSayfasi({ params }: any) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";

  const sayfaBasligi = rawSlug.replace(/-/g, " ").toUpperCase();

  const slugify = (text: string) => {
    return (text || "").toString().toLowerCase()
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c")
      .replace(/ö/g, "o").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  };

  let urunler: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    const rawUrunler = await db.collection("products").find({}).toArray();
    
    const productIds = rawUrunler.map(p => p._id.toString());
    let reviewsData: any[] = [];
    try {
      reviewsData = await db.collection("reviews").find({ 
        productId: { $in: productIds }, 
        type: "review" 
      }).toArray();
    } catch (reviewErr) {}

    const filtrelenmisUrunler = rawUrunler.filter((urun: any) => {
      const urunKategorisi = slugify(urun.kategori || urun.category || "");
      return urunKategorisi === rawSlug;
    });

    urunler = filtrelenmisUrunler.map(urun => {
      const pid = urun._id.toString();
      const pReviews = reviewsData.filter(r => r.productId === pid);
      // Mongo ID'lerini client tarafında sorun çıkarmaması için string'e zorluyoruz
      return { ...urun, _id: pid, fetchedReviews: pReviews };
    });

  } catch (e) {
    console.error("Kategori ürünleri çekilirken hata:", e);
  }

  return (
    <main className="min-h-screen bg-black text-white pt-12 pb-24 px-4 font-sans select-none touch-manipulation">
      {/* İndirim Rozeti CSS'i */}
      <style dangerouslySetInnerHTML={{ __html: `
        .discount-badge-home { position: absolute; top: 10px; right: 10px; width: 65px; height: 90px; z-index: 50; filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.6)); pointer-events: none; }
        .badge-rosette-home { position: relative; width: 65px; height: 65px; background: #e60000; clip-path: polygon(50% 0%, 60% 10%, 75% 5%, 80% 20%, 95% 25%, 90% 40%, 100% 50%, 90% 60%, 95% 75%, 80% 80%, 75% 95%, 60% 90%, 50% 100%, 40% 90%, 25% 95%, 20% 80%, 5% 75%, 10% 60%, 0% 50%, 10% 40%, 5% 25%, 20% 20%, 25% 5%, 40% 10%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 2; }
        .badge-rosette-home span:first-child { font-size: 17px; font-weight: 900; line-height: 1; margin-top: 3px; }
        .badge-rosette-home span:last-child { font-size: 11px; font-weight: 900; line-height: 1; }
        .badge-ribbon-home-left, .badge-ribbon-home-right { position: absolute; top: 45px; width: 20px; height: 45px; background: linear-gradient(to right, #c20000 12%, white 12%, white 18%, #c20000 18%, #c20000 82%, white 82%, white 88%, #c20000 88%); z-index: 1; }
        .badge-ribbon-home-left { left: 8px; transform: rotate(20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
        .badge-ribbon-home-right { right: 8px; transform: rotate(-20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
      `}} />
      <div className="max-w-[1400px] mx-auto">
         {/* ÇAĞIRILAN İSTEMCİ MOTORU */}
         <KategoriClient urunler={urunler} sayfaBasligi={sayfaBasligi} />
      </div>
    </main>
  );
}