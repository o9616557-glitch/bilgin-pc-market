import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { Cpu, Crosshair, Sparkles, Star, GitCompare, ShieldCheck, Zap } from "lucide-react";
import CompareButton from "./CompareButton"; 

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let urunler: any[] = [];
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) { 
    console.error("HATA:", e); 
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-[#00d2ff] selection:text-black">
      
      {/* 🚀 ANA SAYFA İNDİRİM ROZETİ CSS KODU (SOL ÜST KÖŞE) 🚀 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .discount-badge-home { position: absolute; top: 10px; left: 10px; width: 75px; height: 100px; z-index: 50; filter: drop-shadow(0px 8px 10px rgba(0,0,0,0.6)); pointer-events: none; }
        .badge-rosette-home { position: relative; width: 75px; height: 75px; background: #e60000; clip-path: polygon(50% 0%, 60% 10%, 75% 5%, 80% 20%, 95% 25%, 90% 40%, 100% 50%, 90% 60%, 95% 75%, 80% 80%, 75% 95%, 60% 90%, 50% 100%, 40% 90%, 25% 95%, 20% 80%, 5% 75%, 10% 60%, 0% 50%, 10% 40%, 5% 25%, 20% 20%, 25% 5%, 40% 10%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 2; }
        .badge-rosette-home span:first-child { font-size: 20px; font-weight: 900; line-height: 1; margin-top: 3px; }
        .badge-rosette-home span:last-child { font-size: 13px; font-weight: 900; line-height: 1; }
        .badge-ribbon-home-left, .badge-ribbon-home-right { position: absolute; top: 50px; width: 26px; height: 50px; background: linear-gradient(to right, #c20000 12%, white 12%, white 18%, #c20000 18%, #c20000 82%, white 82%, white 88%, #c20000 88%); z-index: 1; }
        .badge-ribbon-home-left { left: 8px; transform: rotate(20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
        .badge-ribbon-home-right { right: 8px; transform: rotate(-20deg); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%); }
      `}} />

      {/* ==================== 1. HERO (GİRİŞ BÖLÜMÜ) ==================== */}
      <section className="relative w-full min-h-[55vh] flex items-center justify-center pt-24 pb-6 border-b border-white/10">
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

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95] text-white">
                Doğru Parça <br/>
                <span className="text-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.3)]">Doğru Fiyat</span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-medium tracking-wide">
                Bütçenize uygun hazır sistemler, güncel ekran kartları ve kaliteli bilgisayar bileşenleri Bilgin PC Market güvencesiyle stoklarımızda.
              </p>

              <div className="pt-4">
                <a href="#vitrin" className="group relative inline-flex w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-[0.1em] overflow-hidden rounded-none border border-white/20 hover:border-[#00d2ff] hover:text-[#00d2ff] transition-all duration-300 text-center items-center justify-center">
                  <span className="relative flex items-center justify-center gap-3">
                    Ürünleri İncele <Crosshair className="w-5 h-5 transition-transform duration-500" />
                  </span>
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-none p-6 shadow-2xl">
                <div className="absolute -top-[1px] -right-[1px] bg-white text-black text-[10px] font-black px-4 py-2 rounded-none uppercase tracking-widest z-20">
                  Öne Çıkanlar
                </div>
                <div className="w-full h-[350px] bg-black/60 rounded-none border border-white/5 flex items-center justify-center overflow-hidden relative p-8 group">
                   <img src="/amiral.png" alt="Öne Çıkan Ekran Kartı" className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105 z-10 relative" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. NEDEN BİZ? ==================== */}
      <section className="max-w-[1400px] mx-auto pt-8 pb-4">
        
        <div className="flex items-center justify-between px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Neden <span className="text-gray-500">Biz?</span>
            </h2>
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 px-[7.5vw] sm:px-[10vw] lg:px-8 snap-x snap-mandatory scroll-smooth max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:h-2.5 lg:[&::-webkit-scrollbar-track]:bg-[#050505] lg:[&::-webkit-scrollbar-track]:border lg:[&::-webkit-scrollbar-track]:border-white/10 lg:[&::-webkit-scrollbar-thumb]:bg-white/20 hover:lg:[&::-webkit-scrollbar-thumb]:bg-[#00d2ff] lg:[&::-webkit-scrollbar-thumb]:rounded-none">

            <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" alt="Havale İndirimi" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-[#10b981] font-black text-5xl tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">%15</div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#10b981] transition-colors">Havale İndirimi</h3>
                <div className="w-8 h-1 bg-[#10b981] mb-3 transition-all duration-500 group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Banka transferi ile yapacağınız ödemelerde sistem anında net indirim uygular.</p>
              </div>
            </div>

            <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-white transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop" alt="Hızlı Kargo" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-all duration-700 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-white font-black text-4xl tracking-tighter mb-2">HIZLI<span className="text-gray-600">TESLİMAT</span></div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-gray-300 transition-colors">Özenli Paketleme</h3>
                <div className="w-8 h-1 bg-white mb-3 transition-all duration-500 group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Siparişleriniz kargo sürecinde zarar görmemesi için ekstra korumalı şekilde paketlenir ve hızlıca kargoya verilir.</p>
              </div>
            </div>

            <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#d4af37] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop" alt="Montaj ve Test" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 sepia-[.3]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-[#d4af37] font-black text-4xl tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">ÜCRETSİZ<span className="text-white">MONTAJ</span></div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#d4af37] transition-colors">Test ve Kurulum</h3>
                <div className="w-8 h-1 bg-[#d4af37] mb-3 transition-all duration-500 group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Bizden aldığınız sistemler titizlikle toplanır. Gerekli tüm performans testlerinden geçtikten sonra size teslim edilir.</p>
              </div>
            </div>

            <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#3b82f6] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" alt="Resmi Garanti" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-[#3b82f6] font-black text-4xl tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">RESMİ<span className="text-white text-2xl">GARANTİ</span></div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#3b82f6] transition-colors">Güvenilir Alışveriş</h3>
                <div className="w-8 h-1 bg-[#3b82f6] mb-3 transition-all duration-500 group-hover:w-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Mağazamızdaki tüm ürünler Türkiye resmi distribütör garantilidir. İkinci el veya kutusuz ürün satışımız yoktur.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 3. GÜNCEL ÜRÜNLER (VİTRİN) ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto pt-10 pb-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6 px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#00d2ff]"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white pl-4">
              Güncel <span className="text-gray-400">Ürünler</span>
            </h2>
          </div>
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
            <div className="w-2 h-2 rounded-none bg-[#10b981] animate-ping"></div>
            Aktif Stok: {urunler.length}
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-8 px-[7.5vw] sm:px-[10vw] lg:px-8 snap-x snap-mandatory scroll-smooth max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:h-2.5 lg:[&::-webkit-scrollbar-track]:bg-[#050505] lg:[&::-webkit-scrollbar-track]:border lg:[&::-webkit-scrollbar-track]:border-white/10 lg:[&::-webkit-scrollbar-thumb]:bg-white/20 hover:lg:[&::-webkit-scrollbar-thumb]:bg-[#00d2ff] lg:[&::-webkit-scrollbar-thumb]:rounded-none">
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

                return (
                  <div key={urun._id.toString()} className="group relative flex flex-col w-[85vw] sm:w-[320px] lg:w-[calc(25%-0.75rem)] flex-shrink-0 snap-center lg:snap-start bg-[#1e1e1e] border border-white/10 shadow-[5px_5px_0px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,210,255,0.4)]">
                    <Link href={"/product/" + (urun.slug || urun._id)} className="absolute inset-0 z-10" prefetch={true} />

                    <div className="relative w-full aspect-[4/3] p-6 flex items-center justify-center bg-white/5 border-b border-white/10 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00d2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* 🚀 VİTRİN KARTLARI İÇİN HTML ROZET BURADA 🚀 */}
                      {indirimVarMi && !tukendiMi && (
                        <div className="discount-badge-home">
                            <div className="badge-ribbon-home-left"></div>
                            <div className="badge-ribbon-home-right"></div>
                            <div className="badge-rosette-home">
                                <span>%{indirimOrani}</span>
                                <span>İNDİRİM</span>
                            </div>
                        </div>
                      )}

                      {!tukendiMi && (
                        <div className="absolute top-3 right-3 z-[60] pointer-events-auto">
                          <div className="relative flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#00d2ff] px-3 py-1.5 cursor-pointer">
                            <GitCompare className="w-4 h-4 text-[#00d2ff]" />
                            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block text-[#00d2ff]">Karşılaştır</span>
                            <div className="absolute inset-0 z-[70] w-full h-full opacity-0 cursor-pointer [&>*]:w-full [&>*]:h-full [&>*]:absolute [&>*]:inset-0 [&_button]:w-full [&_button]:h-full">
                              <CompareButton urun={urun} />
                            </div>
                          </div>
                        </div>
                      )}
                      {tukendiMi && (
                        <div className="absolute -top-[1px] -left-[1px] z-20 bg-zinc-800/80 backdrop-blur-md border border-zinc-500 text-white px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                          STOKTA YOK
                        </div>
                      )}
                      {vitrinResmi ? (
                        <img src={vitrinResmi} alt={urun.isim || urun.name} className={"w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out group-hover:scale-110 " + (tukendiMi ? "grayscale opacity-20" : "")} />
                      ) : ( 
                        <Cpu className="w-16 h-16 text-white/10" />
                      )}
                    </div>

                    <div className="flex flex-col flex-grow p-5 sm:p-6 relative z-20 pointer-events-none bg-transparent">
                      <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider leading-snug line-clamp-2 mb-2">{urun.isim || urun.name}</h3>
                      <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />)}
                        <span className="text-gray-400 text-xs ml-2 font-bold">(Yorumlar)</span>
                      </div>

                      <div className="border-t border-white/10 pt-4 mt-auto flex justify-between items-end">
                        <div className="flex flex-col">
                          {indirimVarMi && <div className="text-[#a1a1aa] line-through text-xs sm:text-sm font-bold mb-1">{normalFiyat.toLocaleString("tr-TR")} ₺</div>}
                          <div className="text-2xl sm:text-3xl font-black text-white leading-none">{gecerliFiyat.toLocaleString("tr-TR")} <span className="text-base font-normal text-white">₺</span></div>
                          {havaleOrani > 0 && !tukendiMi && (
                            <div className="text-[#10b981] text-[11px] sm:text-xs font-bold flex items-center gap-1.5 mt-2">
                              <BanknoteIcon className="w-3.5 h-3.5" /> Havale: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 2})} ₺
                            </div>
                          )}
                        </div>
                        {indirimVarMi && !tukendiMi && (
                          <div className="border-4 border-double border-[#d4af37] bg-black/40 backdrop-blur-md px-3 py-2 flex flex-col items-center justify-center ml-2">
                            <span className="text-[#d4af37] text-xl sm:text-2xl font-black leading-none">%{indirimOrani}</span>
                            <span className="text-[#d4af37] border-t border-[#d4af37]/50 text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] pt-1 mt-1 text-center">İndirim</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 z-[60] pointer-events-auto relative">
                        <Link href={"/product/" + (urun.slug || urun._id)} className="block w-full">
                          <div className={"w-full text-center py-3 text-xs sm:text-sm font-bold uppercase border transition-all duration-300 backdrop-blur-md " + (tukendiMi ? "bg-black/40 border-[#27272a] text-[#71717a] cursor-not-allowed" : "bg-[#00d2ff]/10 border-[#00d2ff]/30 text-[#00d2ff] hover:bg-[#00d2ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]")}>
                            {tukendiMi ? "Tükendi" : "İncele"}
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : ( 
              <div className="col-span-full w-full py-24 sm:py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-none bg-black/40 backdrop-blur-xl">
                <Cpu className="w-10 h-10 text-white/50 mb-4" />
                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Katalog Güncelleniyor</h3>
              </div> 
            )}
          </div>
        </div>
      </div>

      {/* ==================== 4. KALİTE & GÜVEN ==================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
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
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop" 
              alt="Montaj Atölyesi" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          </div>

        </div>
      </section>

      {/* ==================== 5. HIZLI ERİŞİM ==================== */}
      <section className="max-w-[1400px] mx-auto pt-8 pb-12">
        
        <div className="flex items-center gap-4 mb-6 px-6 lg:px-8">
          <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Hızlı <span className="text-gray-500">Erişim</span>
          </h2>
        </div>

        <div className="w-full">
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 px-[7.5vw] sm:px-[10vw] lg:px-8 snap-x snap-mandatory scroll-smooth max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:h-2.5 lg:[&::-webkit-scrollbar-track]:bg-[#050505] lg:[&::-webkit-scrollbar-track]:border lg:[&::-webkit-scrollbar-track]:border-white/10 lg:[&::-webkit-scrollbar-thumb]:bg-white/20 hover:lg:[&::-webkit-scrollbar-thumb]:bg-[#00d2ff] lg:[&::-webkit-scrollbar-thumb]:rounded-none">
            
            <Link href="/kategori/hazir-sistemler" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#00d2ff] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop" alt="Hazır Sistemler" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors drop-shadow-md">Hazır Sistemler</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

            <Link href="/kategori/ekran-kartlari" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#00d2ff] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop" alt="Ekran Kartları" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors drop-shadow-md">Ekran Kartları</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

            <Link href="/kategori/islemciler" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#00d2ff] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop" alt="İşlemciler" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors drop-shadow-md">İşlemciler</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

            <Link href="/kategori/anakartlar" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#00d2ff] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" alt="Anakartlar" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors drop-shadow-md">Anakartlar</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

            <Link href="/kategori/sivi-sogutma" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#00d2ff] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop" alt="Sıvı Soğutma" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors drop-shadow-md">Sıvı Soğutma</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

            <Link href="/kategori/profesyonel-monitor" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-center lg:snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#00d2ff] transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" alt="Profesyonel Monitörler" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
              <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#00d2ff] transition-colors drop-shadow-md">Prof. Monitörler</h3>
                <div className="w-12 h-1 bg-[#00d2ff] mt-3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ==================== 6. BİLGİN PC BİLGİLENDİRME ==================== */}
      <section className="relative w-full py-20 sm:py-28 bg-[#0a0a0a] border-t border-white/10 overflow-hidden flex items-center justify-center">
        
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop" alt="Bilgin PC Arka Plan" className="w-full h-full object-cover grayscale" />
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

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
            Güvenilir Donanım, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00d2ff] to-[#00d2ff]">Samimi Hizmet.</span>
          </h2>

          <div className="space-y-4 text-gray-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto">
            <p>
              Bilgin PC Market olarak, sizlere her zaman en pahalı olanı değil; ihtiyacınıza ve bütçenize en uygun olan doğru parçayı sunmayı amaçlıyoruz. Sadece satış yapana kadar değil, satış sonrasında da yanınızda olan dürüst bir hizmet anlayışını benimsiyoruz.
            </p>
            <p>
              RTX 5070 gibi yeni nesil güncel ekran kartlarından, fiyat performans odaklı işlemcilere kadar aradığınız donanımları mağazamızda stoklu bulundurmaya gayret ediyoruz. Sipariş ettiğiniz her sistemi kendi evimize götürecekmiş gibi özenle topluyor, tüm testlerini bizzat tamamlamadan kargoya vermiyoruz.
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