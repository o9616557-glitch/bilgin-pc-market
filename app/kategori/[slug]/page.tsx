import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowLeft, Cpu, PackageX, Star, ArrowRight } from "lucide-react";

// Ana sayfadaki o efsanevi Havale ikonunu aynen kullanıyoruz
function BanknoteIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="0"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}

// Dinamik Sayfa Ayarı
export const revalidate = 60;

// 🚀 BİNGO: Parametreleri "any" yaparak ve "await" ile bekleyerek hatayı kökten çözüyoruz!
export default async function KategoriSayfasi({ params }: any) {
  
  // 🚀 MOTOR TAMİRİ: Yeni Next.js kurallarına göre URL parametresini bekleyerek (await) alıyoruz.
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";

  // Başlığı düzeltme (Örn: ekran-kartlari -> EKRAN KARTLARI)
  const sayfaBasligi = rawSlug.replace(/-/g, " ").toUpperCase();

  // Türkçe karakter dönüştürücü (Filtreleme Motoru)
  const slugify = (text: string) => {
    return (text || "").toString().toLowerCase()
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c")
      .replace(/ö/g, "o").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  };

  let urunler: any[] = [];

  try {
    // 1. Ana Vanaya (MongoDB'ye) Doğrudan Bağlan
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // 2. Tüm Ürünleri Çek
    const rawUrunler = await db.collection("products").find({}).toArray();
    
    // 3. Yorumları Çek (Yıldızlar için)
    const productIds = rawUrunler.map(p => p._id.toString());
    let reviewsData: any[] = [];
    try {
      reviewsData = await db.collection("reviews").find({ 
        productId: { $in: productIds }, 
        type: "review" 
      }).toArray();
    } catch (reviewErr) {}

    // 4. SADECE BU KATEGORİYE AİT OLANLARI FİLTRELE
    const filtrelenmisUrunler = rawUrunler.filter((urun: any) => {
      const urunKategorisi = slugify(urun.kategori || urun.category || "");
      return urunKategorisi === rawSlug;
    });

    // 5. Yorumlarla Eşleştir
    urunler = filtrelenmisUrunler.map(urun => {
      const pid = urun._id.toString();
      const pReviews = reviewsData.filter(r => r.productId === pid);
      return { ...urun, fetchedReviews: pReviews };
    });

  } catch (e) {
    console.error("Kategori ürünleri çekilirken hata:", e);
  }

  return (
    <main className="min-h-screen bg-black text-white pt-12 pb-24 px-4 font-sans select-none touch-manipulation">
      
      {/* 🚀 ANA SAYFADAKİ İNDİRİM ROZETİ CSS'İ 🚀 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .discount-badge-home { position: absolute; top: 10px; right: 10px; width: 65px; height: 90px; z-index: 50; filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.6)); pointer-events: none; }
        .badge-rosette-home { position: relative; width: 65px; height: 65px; background: #e60000; clip-path: polygon(50% 0%, 60% 10%, 75% 5%, 80% 20%, 95% 25%, 90% 40%, 100% 50%, 90% 60%, 95% 75%, 80% 80%, 75% 95%, 60% 90%, 50% 100%, 40% 90%, 25% 95%, 20% 80%, 5% 75%, 10% 60%, 0% 50%, 10% 40%, 5% 25%, 20% 20%, 25% 5%, 40% 10%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 2; }
        .badge-rosette-home span:first-child { font-size: 17px; font-weight: 900; line-height: 1; margin-top: 3px; }
        .badge-rosette-home span:last-child { font-size: 11px; font-weight: 900; line-height: 1; }
        .badge-ribbon-home-left, .badge-ribbon-home-right { position: absolute; top: 45px; width: 20px; height: 45px; background: linear-gradient(to right, #c20000 12%, white 12%, white 18%, #c20000 18%, #c20000 82%, white 82%, white 88%, #c20000 88%); z-index: 1; }
        .badge-ribbon-home-left { left: 8px; transform: rotate(20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
        .badge-ribbon-home-right { right: 8px; transform: rotate(-20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
      `}} />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ÜST BAŞLIK ALANI */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/10 pb-6 mb-10 px-4 sm:px-0">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#00d2ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                {sayfaBasligi}
              </span> MODELLERİ
            </h1>
          </div>
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-3 rounded-none">
            <div className="w-2 h-2 rounded-none bg-[#10b981] animate-ping"></div>
            Bulunan Sonuç: {urunler.length} Adet
          </div>
        </div>

        {urunler.length === 0 ? (
          <div className="w-full py-24 sm:py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-none bg-black/40 backdrop-blur-xl">
            <PackageX className="w-12 h-12 text-white/50 mb-4" />
            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Bu Kategoride Ürün Bulunamadı</h3>
            <p className="text-gray-400 font-medium max-w-md text-center">Şu anda <strong>{sayfaBasligi}</strong> kategorisinde aktif stok bulunmamaktadır. Yeni donanımlar çok yakında eklenecektir.</p>
          </div>
        ) : (
          /* 🚀 ANA SAYFA İLE BİREBİR AYNI KART TASARIMI 🚀 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
            {urunler.map((urun: any) => {
                const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
                const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
                const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
                const indirimVarMi = normalFiyat > gecerliFiyat;
                const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
                const tukendiMi = urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0";
                const havaleOrani = urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5;
                const havaleFiyati = gecerliFiyat - (gecerliFiyat * (havaleOrani / 100));

                let yildizSayisi = urun.rating ? Number(urun.rating) : 0;
                let yorumSayisi = urun.yorumSayisi ? Number(urun.yorumSayisi) : 0;

                if (urun.fetchedReviews && urun.fetchedReviews.length > 0) {
                    yorumSayisi = urun.fetchedReviews.length;
                    const totalRating = urun.fetchedReviews.reduce((acc: any, curr: any) => acc + Number(curr.rating || 0), 0);
                    yildizSayisi = totalRating / yorumSayisi;
                }

                return (
                  <div key={urun._id.toString()} className="group relative flex flex-col w-full flex-shrink-0 bg-[#09090b] rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 ease-out hover:border-[#00d2ff]/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]">
                    
                    <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6 overflow-hidden pointer-events-none">
                      
                      {indirimVarMi && !tukendiMi && (
                        <div className="discount-badge-home pointer-events-none">
                            <div className="badge-ribbon-home-left"></div>
                            <div className="badge-ribbon-home-right"></div>
                            <div className="badge-rosette-home">
                                <span>%{indirimOrani}</span>
                                <span>İNDİRİM</span>
                            </div>
                        </div>
                      )}

                      {tukendiMi ? (
                         <div className="absolute top-4 left-4 z-20 pointer-events-none">
                           <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 shadow-[0_0_10px_rgba(82,82,91,0.8)]" title="Tükendi"></div>
                         </div>
                      ) : (
                         <div className="absolute top-4 left-4 z-20 pointer-events-none">
                           <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="Stokta Var"></div>
                         </div>
                      )}

                      <div className="w-full h-full flex items-center justify-center relative z-10">
                        {vitrinResmi ? (
                          <img 
                            src={vitrinResmi} 
                            alt={urun.isim || urun.name} 
                            className={`w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-out group-hover:scale-110 ${tukendiMi ? "grayscale opacity-30" : ""}`}
                          />
                        ) : (
                          <Cpu className="w-16 h-16 text-white/10" />
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow relative z-20 bg-transparent pointer-events-none">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">{urun.marka || "DONANIM"}</span>
                        
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                          <Star className={`w-3 h-3 ${yorumSayisi > 0 ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}`} />
                          <span>{yorumSayisi > 0 ? `${yildizSayisi.toFixed(1)} (${yorumSayisi})` : 'Değerlendirme Yok'}</span>
                        </div>
                      </div>

                      <div className="block mt-1">
                        <h3 className="text-white text-sm font-bold leading-relaxed line-clamp-2 mb-4 group-hover:text-[#00d2ff] transition-colors duration-700">
                          {urun.isim || urun.name}
                        </h3>
                      </div>

                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5 pointer-events-auto">
                        <div className="flex flex-col relative z-20 pointer-events-none">
                          {indirimVarMi && !tukendiMi && (
                            <span className="text-gray-600 text-[11px] line-through font-medium mb-0.5">{normalFiyat.toLocaleString("tr-TR")} ₺</span>
                          )}
                          <span className="text-xl sm:text-2xl font-black text-white leading-none">
                            {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">₺</span>
                          </span>
                          {havaleOrani > 0 && !tukendiMi && (
                            <span className="text-[#10b981] text-[10px] font-bold mt-1.5 flex items-center gap-1">
                              <BanknoteIcon className="w-3 h-3" /> Havale: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 0})} ₺
                            </span>
                          )}
                        </div>

                        <div className="relative z-20">
                          {tukendiMi ? (
                             <div className="h-10 px-4 sm:h-11 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center cursor-not-allowed" title="Tükendi">
                               <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Tükendi</span>
                             </div>
                          ) : (
                             <Link href={"/product/" + (urun.slug || urun._id)} prefetch={true} className="relative overflow-hidden h-10 px-4 sm:h-11 sm:px-5 bg-white/5 border border-white/10 hover:bg-[#00d2ff] hover:border-[#00d2ff] rounded-xl flex items-center justify-center group/btn transition-all duration-700 shadow-md hover:shadow-[0_0_15px_rgba(0,210,255,0.4)] pointer-events-auto">
                               <span className="text-xs sm:text-sm font-black text-gray-300 group-hover/btn:text-black transition-colors uppercase tracking-widest flex items-center gap-2 duration-700">
                                 İncele <ArrowRight className="w-4 h-4 hidden sm:block transition-transform duration-700 group-hover/btn:translate-x-1" />
                               </span>
                             </Link>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                );
            })}
          </div>
        )}
      </div>
    </main>
  );
}