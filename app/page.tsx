import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { Cpu, Crosshair, Sparkles, Star, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import OkluSlider from "@/components/OkluSlider";
import VitrinButon from "@/components/VitrinButon";

export const revalidate = 60; 

export default async function HomePage() {
  let urunler: any[] = [];
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    const rawUrunler = await db.collection("products").find({}).limit(12).toArray();
    const productIds = rawUrunler.map(p => p._id.toString());
    let reviewsData: any[] = [];
    
    try {
        reviewsData = await db.collection("reviews").find({ 
            productId: { $in: productIds }, 
            type: "review" 
        }).toArray();
    } catch (reviewErr) {
        console.log("Yorumlar çekilemedi, varsayılan değerler kullanılacak.");
    }

    urunler = rawUrunler.map(urun => {
        const pid = urun._id.toString();
        const pReviews = reviewsData.filter(r => r.productId === pid);
        return { ...urun, fetchedReviews: pReviews };
    });

  } catch (e) { 
    console.error("HATA:", e); 
  }

  return (

    
    
    <main className="min-h-screen bg-black text-white font-sans overflow-hidden select-none touch-manipulation">
      
      <style dangerouslySetInnerHTML={{ __html: `
        body { -webkit-tap-highlight-color: transparent; }
        button, img, a, div, span, p, h1, h2, h3 { -webkit-touch-callout: none !important; user-select: none !important; }
      .discount-badge-home { position: absolute; top: 10px; right: 10px; width: 65px; height: 90px; z-index: 2; filter: ... }
        .badge-rosette-home { position: relative; width: 65px; height: 65px; background: #e60000; clip-path: polygon(50% 0%, 60% 10%, 75% 5%, 80% 20%, 95% 25%, 90% 40%, 100% 50%, 90% 60%, 95% 75%, 80% 80%, 75% 95%, 60% 90%, 50% 100%, 40% 90%, 25% 95%, 20% 80%, 5% 75%, 10% 60%, 0% 50%, 10% 40%, 5% 25%, 20% 20%, 25% 5%, 40% 10%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 2; }
        .badge-rosette-home span:first-child { font-size: 17px; font-weight: 900; line-height: 1; margin-top: 3px; }
        .badge-rosette-home span:last-child { font-size: 11px; font-weight: 900; line-height: 1; }
        .badge-ribbon-home-left, .badge-ribbon-home-right { position: absolute; top: 45px; width: 20px; height: 45px; background: linear-gradient(to right, #c20000 12%, white 12%, white 18%, #c20000 18%, #c20000 82%, white 82%, white 88%, #c20000 88%); z-index: 1; }
        .badge-ribbon-home-left { left: 8px; transform: rotate(20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
        .badge-ribbon-home-right { right: 8px; transform: rotate(-20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
      `}} />

      {/* ==================== 1. HERO ==================== */}
      <section className="relative w-full min-h-[55vh] flex items-center justify-center pt-24 pb-6 border-b border-white/10 select-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-300">
                  Profesyonel Donanım
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95] text-white select-none">
                Doğru Parça <br/>
                <span className="text-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.3)]">Doğru Fiyat</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-medium tracking-wide select-none">
                Bütçenize uygun hazır sistemler, güncel ekran kartları ve kaliteli bilgisayar bileşenleri Bilgin PC Market güvencesiyle stoklarımızda.
              </p>
              <div className="pt-4">
                <a href="#vitrin" className="group relative inline-flex w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-[0.1em] overflow-hidden rounded-none border border-white/20 hover:border-[#00d2ff] hover:text-[#00d2ff] transition-all duration-700 text-center items-center justify-center">
                  <span className="relative flex items-center justify-center gap-3">
                    Ürünleri İncele <Crosshair className="w-5 h-5 transition-transform duration-700" />
                  </span>
                </a>
              </div>
            </div>
           <div className="relative hidden lg:block select-none">
              <Link href="/kategori/ekran-karti" prefetch={true} className="block relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-none p-6 shadow-2xl hover:border-[#00d2ff]/50 transition-colors duration-500 group cursor-pointer">
                
                {/* 🎯 Etiket (Hoverda Maviye Döner) */}
                <div className="absolute -top-[1px] -right-[1px] bg-white text-black text-[10px] font-black px-4 py-2 rounded-none uppercase tracking-widest z-20 group-hover:bg-[#00d2ff] transition-colors duration-500 shadow-lg">
                  Ekran Kartları
                </div>
                
           <div className="w-full h-[350px] bg-black/60 rounded-none border border-white/5 flex items-center justify-center overflow-hidden relative p-8">
                   {/* 🚀 BİNGO: loading="lazy" eklendi! Menü açılana kadar bu resim interneti meşgul etmeyecek! */}
                   <img 
                     src="https://res.cloudinary.com/dtnbkoa9s/image/upload/v1781456011/kv_mxdcuq.jpg" 
                     alt="Amiral Gemisi Ekran Kartı" 
                     loading="lazy"
                     className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-out group-hover:scale-110 z-10 relative" 
                   />
                   
                   {/* 🚀 Hover'da Çıkan Zıplayan Ok Butonu 🚀 */}
                   <div className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-[#00d2ff] rounded-none flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-[0_0_20px_rgba(0,210,255,0.6)] border border-[#00d2ff]">
                     <ArrowRight className="w-6 h-6" />
                   </div>
                </div>
              </Link> {/* ⚠️ ŞEFİM NOT: Bu Link etiketinin açılışında prefetch={false} yazdığından emin ol! */}
            </div>
          </div>
        </div>
      </section>

    {/* ======={/* ==================== 1.5. GÜNÜN YILDIZLARI (VIP KARTLAR) ==================== */}
      <section className="max-w-[1400px] mx-auto pt-12 pb-4 select-none touch-manipulation">
        <div className="flex items-center justify-between px-6 lg:px-8 mb-6 lg:mb-8 pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.5)]"></div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg">
              Günün <span className="text-[#00d2ff]">Yıldızları</span>
            </h2>
          </div>
        </div>

        <div className="w-full">
          {/* 🔥 MOBİLDE YANA KAYAR, BİLGİSAYARDA YAN YANA 3'LÜ DURUR 🔥 */}
          <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-4 lg:gap-6 pb-8 px-[7.5vw] lg:px-8 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            
            {[...urunler]
              .sort((a, b) => {
                 const aFiyat = Number(a.fiyat || a.price || a.regular_price || 0);
                 const bFiyat = Number(b.fiyat || b.price || b.regular_price || 0);
                 return bFiyat - aFiyat; // Fiyatı en yüksek olanları en başa alır
              })
              .slice(0, 3) // Sadece en tepe 3 amiral gemisini çeker
              .map((urun: any) => {
                const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
                const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || urun.regular_price || 0);

                return (
                  <Link 
                    href={"/product/" + (urun.slug || urun._id)} 
                    key={urun._id.toString()} 
                    prefetch={true} 
                    className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-auto snap-center snap-always h-[400px] sm:h-[450px] bg-[#121212] rounded-3xl overflow-hidden border border-white/20 hover:border-[#00d2ff] transition-all duration-700 flex flex-col justify-end p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                  >
                    {/* Arka plan gradyanı - Şefin talimatıyla yarıya indirildi */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent z-10 pointer-events-none"></div>
                    
                    {/* 🎯 VIP Rozeti */}
                    <div className="absolute top-6 left-6 z-20 bg-[#00a3c7] text-black text-[10px] sm:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest pointer-events-none border border-zinc-700 shadow-md">
                      Premium Seçim
                    </div>
{/* Dev Ürün Resmi */}
                    <div className="absolute inset-0 flex items-center justify-center p-12 z-0 pointer-events-none bg-white/5">
                      {vitrinResmi ? (
                        <img 
                          src={vitrinResmi} 
                          alt={urun.isim || "Ürün"} 
                          loading="lazy" 
                          className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-1000 ease-out brightness-110" 
                        />
                      ) : (
                        <Cpu className="w-20 h-20 text-white/10" />
                      )}
                    </div>

                    {/* Alt Bilgiler ve Neon Fiyat */}
                    <div className="relative z-20 transform group-hover:-translate-y-2 transition-transform duration-700 pointer-events-none">
                      <div className="text-gray-300 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-2 drop-shadow-md">{urun.marka || "BİLGİN PC"}</div>
                      <h3 className="text-white text-lg sm:text-xl font-bold leading-snug line-clamp-2 mb-4 group-hover:text-[#00d2ff] transition-colors duration-700 drop-shadow-lg">{urun.isim || urun.name}</h3>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-white/20 pt-4">
                        <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">{gecerliFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">₺</span></span>
                        
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-[#00d2ff] text-black transition-colors duration-700 shadow-[0_0_15px_rgba(255,255,255,0.5)] pointer-events-auto">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
            })}
          </div>
        </div>
      </section>
      {/* ==================== 2. NEDEN BİZ? ==================== */}
      <section className="max-w-[1400px] mx-auto pt-8 pb-4 select-none touch-manipulation">
        <div className="flex items-center justify-between px-6 lg:px-8 mb-6 pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Neden <span className="text-gray-500">Biz?</span>
            </h2>
          </div>
        </div>
        <div className="w-full">
          <OkluSlider>
         <div className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#10b981] transition-colors duration-700 ease-out">
              {/* 🚀 BİNGO: loading="lazy" BURAYA DA EKLENDİ! */}
              <img 
                src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456009/depositphotos_76643017-stock-photo-illustration-of-great-sales-and_qvv12v.webp" 
                alt="Havale İndirimi" 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000 ease-out pointer-events-none" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
            <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
 <div className="text-[#10b981] font-black text-4xl tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">SEPETTE<span className="text-white">İNDİRİM</span></div>
    <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#10b981] transition-colors duration-700">ÜST DÜZEY DONANIM FIRSATLARI</h3>
    <div className="w-8 h-1 bg-[#10b981] mb-3 transition-all duration-700 ease-out group-hover:w-full"></div>
    <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-700">Rekabetçi oyunlar için tasarlanan yüksek performanslı işlemciler ve en güncel ekran kartlarında geçerli özel fiyat avantajlarını kaçırmayın. Kampanyalı ürünleri hemen sepetinize ekleyin.</p>
</div>
            </div>

            <div className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-white transition-colors duration-700 ease-out">
           <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456013/image-8-1024x682_s06r1u.png" alt="Hızlı Teslimat" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-all duration-1000 ease-out grayscale pointer-events-none" />
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <div className="text-white font-black text-4xl tracking-tighter mb-2">HIZLI<span className="text-gray-600">TESLİMAT</span></div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-gray-300 transition-colors duration-700">Özenli Paketleme</h3>
                <div className="w-8 h-1 bg-white mb-3 transition-all duration-700 ease-out group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-700">Siparişleriniz kargo sürecinde zarar görmemesi için ekstra korumalı şekilde paketlenir ve hızlıca kargoya verilir.</p>
              </div>
            </div>

    <div className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#d4af37] transition-colors duration-700 ease-out">
              {/* 🚀 BİNGO: loading="lazy" EKLENDİ! */}
              <img 
                src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456012/computer-assembling-service-serviceman-installing-260nw-1698824008_f1pdcz.webp" 
                alt="Montaj Atölyesi" 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-1000 ease-out sepia-[.3] pointer-events-none" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <div className="text-[#d4af37] font-black text-4xl tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">ÜCRETSİZ<span className="text-white">MONTAJ</span></div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#d4af37] transition-colors duration-700">Test ve Kurulum</h3>
                <div className="w-8 h-1 bg-[#d4af37] mb-3 transition-all duration-700 ease-out group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-700">Bizden aldığınız sistemler titizlikle toplanır. Gerekli tüm performans testlerinden geçtikten sonra size teslim edilir.</p>
              </div>
            </div>

            <div className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-end p-6 sm:p-8 hover:border-[#10b981]/50 transition-colors duration-700">
                <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781542680/images_o28u1h.png" alt="12 Taksit Seçeneği" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                  <div className="text-[#10b981] font-black text-4xl tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">12<span className="text-white">TAKSİT</span></div>
                    <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#10b981] transition-colors duration-700">KREDİ KARTINA ÖDEME KOLAYLIĞI</h3>
                    <div className="w-8 h-1 bg-[#10b981] mb-3 transition-all duration-700 ease-out group-hover:w-full"></div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-700">Hayalinizdeki sisteme bütçenizi zorlamadan sahip olun. Tüm anlaşmalı kredi kartlarında 12 aya varan taksit imkanıyla ödemelerinizi rahatça planlayın.</p>
                </div>
            </div>

            <div className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#3b82f6] transition-colors duration-700 ease-out">
              <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456009/pngtree-one-hundred-percent-original-render-check-mark-approved-photo-png-image_16957598_uvrexo.png" alt="Orijinal Distribütör Garantisi" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-all duration-1000 ease-out pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <div className="text-[#3b82f6] font-black text-4xl tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">RESMİ<span className="text-white text-2xl">GARANTİ</span></div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#3b82f6] transition-colors duration-700">Güvenilir Alışveriş</h3>
                <div className="w-8 h-1 bg-[#3b82f6] mb-3 transition-all duration-700 ease-out group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-700">Mağazamızdaki tüm ürünler Türkiye resmi distribütör garantilidir. İkinci el veya kutusuz ürün satışımız yoktur.</p>
              </div>
            </div>
          </OkluSlider>
        </div>
      </section>

      {/* ==================== 3. GÜNCEL ÜRÜNLER (VİTRİN) ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto pt-10 pb-8 select-none touch-manipulation">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6 px-6 lg:px-8 pointer-events-none">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#00d2ff]"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white pl-4">
              Güncel <span className="text-gray-400">Ürünler</span>
            </h2>
          </div>
        </div>

        <div className="w-full">
          <OkluSlider>
           {urunler.length > 0 ? (
              urunler.map((urun: any) => {
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
                  <div key={urun._id.toString()} className="group relative flex-none snap-center snap-always lg:snap-start flex flex-col w-[85vw] sm:w-[320px] lg:w-[calc(25%-0.75rem)] flex-shrink-0 bg-[#09090b] rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 ease-out hover:border-[#00d2ff]/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]">
                    
                    {/* ÜST KISIM: RESİM VE ROZETLER */}
                    <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6 overflow-hidden">
                      
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
{/* 🚀 HEDEF 3: SADECE RESME TIKLAYINCA ÜRÜNE GİTME (ÇİFTE KORUMA EKLENDİ) */}
                      <Link href={"/product/" + (urun.slug || urun._id)} prefetch={false} className="w-full h-full flex items-center justify-center relative z-10 pointer-events-auto cursor-pointer">
                        {vitrinResmi ? (
                          <img 
                            src={vitrinResmi} 
                            alt={urun.isim || urun.name} 
                            loading="lazy" 
                            className={`w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-out group-hover:scale-110 ${tukendiMi ? "grayscale opacity-30" : ""}`}
                          />
                        ) : (
                          <Cpu className="w-16 h-16 text-white/10" />
                        )}
                      </Link>
                    </div>

                    {/* ALT KISIM: BİLGİLER VE BUTONLAR */}
                    <div className="p-5 flex flex-col flex-grow relative z-20 bg-transparent">
                      <div className="flex justify-between items-center mb-2 pointer-events-none">
                        <span className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">{urun.marka || "DONANIM"}</span>
                        
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                          <Star className={`w-3 h-3 ${yorumSayisi > 0 ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}`} />
                          <span>{yorumSayisi > 0 ? `${yildizSayisi.toFixed(1)} (${yorumSayisi})` : 'Henüz Değerlendirilmedi'}</span>
                        </div>
                      </div>

                      {/* 🚀 HEDEF 3 (Devamı): İSME TIKLAYINCA ÜRÜNE GİTME */}
                      <div className="block mt-1 pointer-events-auto">
                        <Link href={"/product/" + (urun.slug || urun._id)} prefetch={true}>
                          <h3 className="text-white text-sm font-bold leading-relaxed line-clamp-2 mb-4 hover:text-[#00d2ff] transition-colors duration-700 cursor-pointer">
                            {urun.isim || urun.name}
                          </h3>
                        </Link>
                      </div>

                      {/* FİYAT VE BUTON HİZASI */}
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5 pointer-events-auto relative z-50">
                        
                        {/* Fiyatlar */}
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

                        {/* 🚀 HEDEF 1 VE 2: BAĞIMSIZ BUTONLAR */}
                        <div className="relative z-50 flex gap-2 pointer-events-auto">
                          {tukendiMi ? (
                              <div className="h-10 px-4 sm:h-11 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center cursor-not-allowed" title="Tükendi">
                                <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Tükendi</span>
                              </div>
                          ) : (
                              <VitrinButon urun={urun} />
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                )
              })
            ) : ( 
              <div className="w-full flex-none py-24 sm:py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-none bg-black/40 backdrop-blur-xl">
                <Cpu className="w-10 h-10 text-white/50 mb-4" />
                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Katalog Güncelleniyor</h3>
              </div> 
            )}
          </OkluSlider>
        </div>
      </div>
      {/* ==================== 4. KALİTE & GÜVEN ==================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 select-none pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#121212] border border-white/10 p-8 lg:p-12 relative overflow-hidden shadow-[5px_5px_0px_rgba(0,0,0,0.8)]">
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="space-y-6 max-w-xl">
            <div className="text-[#00d2ff] text-[10px] font-black tracking-[0.3em] uppercase">
              Kalite & Güven
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Özenli Montaj, <br/>
              <span className="text-gray-500">Doğru Parça Seçimi.</span>
            </h2>
            <div className="h-1 w-20 bg-[#00d2ff]"></div>
            <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed pt-2">
              Bilgin PC Market olarak, bütçenize ve ihtiyaçlarınıza en uygun sistemleri büyük bir özenle hazırlıyoruz. Her bir parçanın birbiriyle olan uyumunu gözeterek uzun ömürlü bilgisayarlar topluyoruz.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
              Kablolama düzeninden yazılım testlerine ve termal analizlere kadar tüm aşamalarda titiz davranıyoruz. Amacımız, size sorunsuz çalışacak, güvenilir ve verdiğiniz paranın tam karşılığını sunan sistemler ulaştırmak.
            </p>
          </div>
         <div className="relative w-full h-[250px] sm:h-[350px] overflow-hidden border border-white/10 shadow-2xl">
            {/* 🚀 BİNGO: SON KAÇAK DA ETKİSİZ HALE GETİRİLDİ! */}
            <img 
              src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456012/photo-1542751371-adc38448a05e_vdzftv.jpg" 
              alt="Donanım Montaj Masası" 
              loading="lazy" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-1000 ease-out grayscale hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      <Link href="/favorilerim" className="bg-red-600 text-white p-4 font-bold text-xl relative z-[9999]">TEST BUTONU</Link>

      {/* ==================== 5. HIZLI ERİŞİM ==================== */}
      <section className="max-w-[1400px] mx-auto pt-8 pb-12 select-none touch-manipulation">
        <div className="flex items-center gap-4 mb-6 px-6 lg:px-8 pointer-events-none">
          <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Hızlı <span className="text-gray-500">Erişim</span>
          </h2>
        </div>
        <div className="w-full">
        <OkluSlider>
            <Link href="/kategori/ekran-karti" prefetch={false} className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#00d2ff] transition-colors duration-700 ease-out">
              <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456502/5789-amdnin-cine-ozel-ekran-karti-dunyaya-aciliyor_hdqtwp.webp" alt="Yüksek Performanslı Ekran Kartı" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors duration-700 drop-shadow-md">Ekran Kartları</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </Link>
            <Link href="/kategori/islemci" prefetch={false} className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#00d2ff] transition-colors duration-700 ease-out">
              <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781456013/photo-1591799264318-7e6ef8ddb7ea_uxzawq.jpg" alt="Güncel Donanım İşlemcisi" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors duration-700 drop-shadow-md">İşlemciler</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </Link>
            <Link href="/kategori/anakart" prefetch={false} className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#00d2ff] transition-colors duration-700 ease-out">
              <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781454483/photo-1518770660439-4636190af475_cicwu0.jpg" alt="Donanım Temeli Anakart" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors duration-700 drop-shadow-md">Anakartlar</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </Link>
            <Link href="/kategori/sogutma" prefetch={false} className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#00d2ff] transition-colors duration-700 ease-out">
              <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781454481/photo-1587202372634-32705e3bf49c_mrqkiv.jpg" alt="RGB Fanlı Sıvı Soğutma" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors duration-700 drop-shadow-md">Sıvı Soğutma</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </Link>
            <Link href="/kategori/monitor" prefetch={false} className="group relative flex-none snap-center snap-always lg:snap-start w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 overflow-hidden flex flex-col justify-end p-6 hover:border-[#00d2ff] transition-colors duration-700 ease-out">
              <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781457384/2025941420-00UIEZ-1_ujpjre.webp" alt="Kavisli Oyuncu Monitörü" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-700 ease-out pointer-events-none">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors duration-700 drop-shadow-md">Prof. Monitörler</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </Link>
          </OkluSlider>
        </div>
      </section>

      {/* ==================== 6. BİLGİN PC BİLGİLENDİRME ==================== */}
      <section className="relative w-full py-20 sm:py-28 bg-[#0a0a0a] border-t border-white/10 overflow-hidden flex items-center justify-center select-none pointer-events-none">
        <div className="absolute inset-0 z-0 opacity-40">
        <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/v1781456011/kv_mxdcuq.jpg" alt="Bilgin PC Arka Plan" loading="lazy" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-[#0a0a0a]/70"></div>
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00d2ff]/5 rounded-full blur-[150px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00d2ff]"></div>
            <Zap className="w-6 h-6 text-[#00d2ff]" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00d2ff]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
            Güvenilir Donanım, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00d2ff] to-[#00d2ff]">Samimi Hizmet.</span>
          </h2>
          <div className="space-y-4 text-gray-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto">
            <p>
              Bilgin PC Market olarak, sizlere her zaman en pahalı olanı değil; ihtiyacınıza ve bütçenize en uygun olan doğru parçayı sunmayı amaçlıyoruz. Sadece satış yapana kadar değil, satış sonrasında da yanınızda olan dürüst bir hizmet anlayışını benimsiyoruz.
            </p>
            <p>
              RTX 5080 gibi yeni nesil güncel ekran kartlarından, fiyat performans odaklı işlemcilere kadar aradığınız donanımları mağazamızda stoklu bulundurmaya gayret ediyoruz. Sipariş ettiğiniz her sistemi kendi evimize götürecekmiş gibi özenle topluyor, tüm testlerini bizzat tamamlamadan kargoya vermiyoruz.
            </p>
            <p className="text-white font-bold tracking-wide pt-4">
              Bize duyduğunuz güven ve samimiyet, bizim için her şeyden önemlidir.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#00d2ff]" /> Resmi Garanti</span>
            <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-[#00d2ff]" /> Güncel Donanım</span>
            <span className="hidden sm:flex items-center gap-2"><Star className="w-4 h-4 text-[#00d2ff]" /> Müşteri Memnuniyeti</span>
          </div>
        </div>
      </section>

    </main>
  );
}

function BanknoteIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="0"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}