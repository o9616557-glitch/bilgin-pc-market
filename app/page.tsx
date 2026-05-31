import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, ChevronRight, Layers } from "lucide-react";
import CompareButton from "./CompareButton"; 

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // VERİTABANI BAĞLANTISI (Sağlam backendin aynen duruyor)
  let urunler: any[] = [];
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) { 
    console.error("HATA:", e); 
  }

  return (
    <main className="min-h-screen bg-[#020202] text-gray-200 font-sans pb-24 overflow-hidden selection:bg-white selection:text-black">
      
      {/* ==================== 1. MATTE PREMIUM HERO (GİRİŞ) ==================== */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-24 pb-20 border-b border-white/[0.03]">
        
        {/* Çok Hafif, Göz Yormayan Arka Plan Işığı */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        {/* İnce Mimari Izgara (Çok Mat) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">
              Yeni Nesil Donanım Mimarisi
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[1.05] mb-6 text-white">
            Oyunun Kurallarını <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-100 to-gray-500 italic font-light">
              Yeniden Yaz.
            </span>
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-light tracking-wide mb-12">
            Piyasayı kasıp kavuran RX 9070, amiral gemisi RTX 5090 ve performansı zirveye taşıyan işlemciler, Bilgin PC Market'in minimalist ve güvenli altyapısıyla stoklarda.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="#vitrin" className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all duration-300">
              Sistemini Yükselt
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/hakkimizda" className="flex items-center gap-3 px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300">
              Kurumsal Kimliğimiz
            </Link>
          </div>

        </div>
      </section>

      {/* ==================== 2. MİMARİ ÜRÜN VİTRİNİ ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Temiz ve Keskin Başlık Alanı */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-2">
              Katalog
            </h2>
            <p className="text-gray-500 text-sm tracking-wide font-light">Özenle seçilmiş premium bileşenler.</p>
          </div>
          <div className="text-xs font-medium tracking-widest text-gray-500 uppercase flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full bg-white/[0.02]">
            <Layers className="w-4 h-4 text-gray-400" />
            Stok: {urunler.length} Ürün
          </div>
        </div>

        {/* MİNİMALİST GRID YAPISI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {urunler.length > 0 ? (
            urunler.map((urun: any) => {
              const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
              const indirimVarMi = normalFiyat > gecerliFiyat;
              const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
              const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
              const tukendiMi = urun.stokDurumu === "Tükendi" || stokSifirMi;

              return (
                <Link 
                  href={"/product/" + (urun.slug || urun._id)} 
                  key={urun._id.toString()} 
                  prefetch={true} 
                  className="group flex flex-col w-full bg-[#050505] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-colors duration-300 relative"
                >
                  
                  {/* İnce Hover Işığı (Sadece kartın en üstünde beliren incecik bir çizgi) */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Rozetler (Daha küçük, mat ve zarif) */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {indirimOrani > 0 && !tukendiMi && (
                      <span className="bg-white text-black px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                        -{indirimOrani}%
                      </span>
                    )}
                    {tukendiMi && (
                      <span className="bg-transparent border border-gray-600 text-gray-500 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                        Tükendi
                      </span>
                    )}
                  </div>

                  {/* Karşılaştırma Butonu */}
                  {!tukendiMi && (
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CompareButton urun={urun} />
                    </div>
                  )}

                  {/* Ürün Görseli Alanı (Hafif gri mat arkaplan) */}
                  <div className="relative w-full aspect-[4/3] bg-white/[0.02] flex items-center justify-center p-6 mb-4">
                    {vitrinResmi ? (
                      <img 
                        src={vitrinResmi} 
                        alt={urun.isim || urun.name} 
                        className={"w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 " + (tukendiMi ? "opacity-30 grayscale" : "drop-shadow-xl")} 
                      />
                    ) : ( 
                      <Cpu className="w-12 h-12 text-gray-700" />
                    )}
                  </div>

                  {/* Alt Kısım - Metin ve Fiyat (Çok temiz, tipografi odaklı) */}
                  <div className="flex flex-col flex-grow px-5 pb-5">
                    
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase mb-2 block">
                      {urun.kategori || "Bileşen"}
                    </span>
                    
                    <h3 className="text-gray-300 font-medium text-sm md:text-base leading-snug line-clamp-2 mb-6 group-hover:text-white transition-colors">
                      {urun.isim || urun.name}
                    </h3>

                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex flex-col">
                        {indirimVarMi && (
                          <span className="text-gray-600 line-through text-[11px] font-medium mb-0.5">
                            {normalFiyat.toLocaleString("tr-TR")} ₺
                          </span>
                        )}
                        <span className="text-lg font-semibold tracking-tight text-white">
                          {gecerliFiyat.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                      
                      {/* Minimalist Ok İkonu */}
                      <div className={"w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 " + (tukendiMi ? "text-gray-700" : "bg-white/5 text-gray-400 group-hover:bg-white group-hover:text-black")}>
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                </Link>
              )
            })
          ) : ( 
            <div className="col-span-full py-24 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/[0.01]">
              <Layers className="w-8 h-8 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 tracking-wide mb-1">Katalog Boş</h3>
              <p className="text-gray-600 text-sm">Ürünler yükleniyor veya henüz eklenmedi.</p>
            </div> 
          )}
        </div>

      </div>
    </main>
  );
}