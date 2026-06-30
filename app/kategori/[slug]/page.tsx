import clientPromise from "@/lib/mongodb";
import KategoriClient from "./KategoriClient";
import { urunVitrinResmi } from "@/lib/cloudinary";

export const revalidate = 3600;

export default async function KategoriSayfasi({ params }: any) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const sayfaBasligi = rawSlug.replace(/-/g, " ").toUpperCase();

  let urunler: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // 🚀 İŞTE YENİ NESİL NOKTA ATIŞI! (Hamallık bitti)
    // Veritabanına "Bütün dükkanı değil, sadece kategoriSlug'ı adresle uyuşanları getir" diyoruz.
    const rawUrunler = await db.collection("products").find({ kategoriSlug: rawSlug }).toArray();
    
    const productIds = rawUrunler.map(p => p._id.toString());
    let reviewsData: any[] = [];
    try {
      reviewsData = await db.collection("reviews").find({ 
        productId: { $in: productIds }, 
        type: "review" 
      }).toArray();
    } catch (reviewErr) {}

    // 🚀 Artık Next.js tarafında filtrelemeye gerek kalmadı! Veritabanı zaten süzüp gönderdi.
    urunler = rawUrunler.map(urun => {
      const pid = urun._id.toString();
      const pReviews = reviewsData.filter(r => r.productId === pid);
      return { ...urun, _id: pid, fetchedReviews: pReviews };
    });

  } catch (e) {
    console.error("Kategori ürünleri çekilirken hata:", e);
  }

  return (
    <>
      {urunler.slice(0, 10).map((urun) => {
        const href = urunVitrinResmi(urun, 480);
        if (!href || href === "/placeholder.jpg") return null;
        return <link key={urun._id} rel="preload" as="image" href={href} />;
      })}
    <main className="min-h-screen bg-black text-white pt-12 pb-24 px-4 font-sans select-none touch-manipulation">
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
         <KategoriClient urunler={urunler} sayfaBasligi={sayfaBasligi} />
      </div>
    </main>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // Sadece benzersiz kategori slug'larını çekiyoruz
    const rawUrunler = await db.collection("products").find({}, { projection: { kategoriSlug: 1 } }).toArray();
    
    const benzersizKategoriler = new Set<string>();
    rawUrunler.forEach((urun) => {
      if (urun.kategoriSlug) benzersizKategoriler.add(urun.kategoriSlug);
    });

    return Array.from(benzersizKategoriler).map((slug) => ({ slug }));
  } catch (error) {
    return [];
  }
}