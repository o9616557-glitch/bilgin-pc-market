import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Cpu, Crosshair, Sparkles, Star, GitCompare } from "lucide-react";
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
    <main className="min-h-screen bg-[#0f0f11] text-white font-sans pb-24 overflow-hidden selection:bg-[#d4af37] selection:text-black">
      
      {/* ==================== 1. HERO (GİRİŞ) ==================== */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-24 pb-20 border-b border-[#3f3f46]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#d4af37] rounded-full filter blur-[250px] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-300">
                  Yeni Nesil Sistemler
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95]">
                Saf Gücün <br/>
                {/* BEYAZDAN ALTIN RENGİNE GEÇİŞ YAPAN BAŞLIK */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  Merkezi
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-medium tracking-wide">
                Tepe model donanımlar, kusursuz mimari ve e-sporcuların tercihi olan efsanevi parçalar şimdi Bilgin PC Market stoklarında.
              </p>

              <div className="pt-4">
                <a href="#vitrin" className="group relative inline-flex w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-[#18181b] font-black uppercase tracking-[0.1em] overflow-hidden rounded-none border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 text-center items-center justify-center">
                  <span className="relative flex items-center justify-center gap-3">
                    Kataloğu İncele <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  </span>
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#d4af37] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
              
              <div className="relative bg-[#18181b] border border-[#3f3f46] rounded-none p-6 shadow-[15px_15px_0px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute -top-[1px] -right-[1px] bg-[#d4af37] text-black text-[10px] font-black px-4 py-2 rounded-none uppercase tracking-widest z-20 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Amiral Gemisi
                </div>
                
                <div className="w-full h-[350px] bg-black/40 rounded-none border border-white/5 flex items-center justify-center overflow-hidden relative p-8 group">
                   <img 
                     src="https://www.pngmart.com/files/22/Graphics-Card-PNG-Transparent.png" 
                     alt="Amiral Gemisi Ekran Kartı" 
                     className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 z-10 relative" 
                   />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. PREMIUM ÜRÜN VİTRİNİ ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto px-0 sm:px-6 lg:px-8 pt-24">
        
        {/* Başlık Alanı */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4 sm:px-0">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white pl-4">
              Premium <span className="text-[#d4af37]">Vitrin</span>
            </h2>
          </div>
          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <div className="w-2 h-2 rounded-none bg-[#d4af37] animate-ping"></div>
            Aktif Stok: {urunler.length}
          </div>
        </div>

        {/* MOBİL İÇİN YAN YANA KAYDIRMALI, PC İÇİN GRID YAPI */}
        <div className="flex overflow-x-auto gap-4 pb-12 px-4 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-8 lg:overflow-visible lg:snap-none">
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
                <div 
                  key={urun._id.toString()} 
                  className="group relative flex flex-col w-[85vw] sm:w-[45vw] lg:w-full flex-shrink-0 snap-start bg-[#18181b] rounded-none border border-[#3f3f46] shadow-[10px_10px_0px_rgba(0,0,0,0.3)] hover:shadow-[15px_15px_0px_rgba(212,175,55,0.15)] lg:hover:-translate-y-1 transition-all duration-300"
                >

                  {/* 1. ÜST KISIM (GÖRSEL VE BUTONLAR) */}
                  <div className="relative w-full aspect-[4/3] p-6 flex items-center justify-center bg-black/40 border-b border-[#3f3f46]">
                    
                    {/* BELİRGİN KARŞILAŞTIRMA BUTONU */}
                    {!tukendiMi && (
                      <div className="absolute top-3 left-3 z-30">
                        <div className="flex items-center gap-2 bg-[#18181b]/80 backdrop-blur-sm border border-[#3f3f46] px-3 py-1.5 cursor-pointer hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 text-gray-400 group/compare">
                          <GitCompare className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block group-hover/compare:text-[#d4af37]">Karşılaştır</span>
                          <div className="absolute inset-0 opacity-0 w-full h-full">
                            <CompareButton urun={urun} />
                          </div>
                        </div>
                      </div>
                    )}

                    {tukendiMi && (
                      <div className="absolute -top-[1px] -left-[1px] z-20 bg-zinc-600 text-white px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                        STOKTA YOK
                      </div>
                    )}

                    {/* Resim */}
                    <Link href={"/product/" + (urun.slug || urun._id)} prefetch={true} className="w-full h-full flex items-center justify-center">
                      {vitrinResmi ? (
                        <img 
                          src={vitrinResmi} 
                          alt={urun.isim || urun.name} 
                          className={"w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-110 " + (tukendiMi ? "grayscale opacity-20" : "")} 
                        />
                      ) : ( 
                        <Cpu className="w-16 h-16 text-white/10" />
                      )}
                    </Link>
                  </div>

                  {/* 2. ALT KISIM (METİNLER VE FİYAT) */}
                  <div className="flex flex-col flex-grow p-5 sm:p-6 relative z-10 bg-transparent">
                    
                    {/* Ürün İsmi */}
                    <Link href={"/product/" + (urun.slug || urun._id)}>
                      <h3 className="text-[#d4af37] font-bold text-sm sm:text-base uppercase tracking-wider leading-snug line-clamp-2 mb-2 hover:text-white transition-colors">
                        {urun.isim || urun.name}
                      </h3>
                    </Link>

                    {/* Yıldızlar ve Yorum Sayısı */}
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                      ))}
                      <span className="text-gray-500 text-xs ml-2 font-medium">(Yorumlar)</span>
                    </div>

                    {/* FİYAT VE KARİZMATİK YEŞİL ROZET ALANI (Yan Yana) */}
                    <div className="border-t border-[#3f3f46] pt-4 mt-auto flex justify-between items-end">
                      
                      {/* Sol Taraf: Fiyatlar */}
                      <div className="flex flex-col">
                        {indirimVarMi && (
                          <div className="text-[#a1a1aa] line-through text-xs sm:text-sm font-medium mb-1">
                            {normalFiyat.toLocaleString("tr-TR")} ₺
                          </div>
                        )}
                        <div className="text-2xl sm:text-3xl font-black text-white leading-none">
                          {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-base font-normal text-[#a1a1aa]">₺</span>
                        </div>
                        {havaleOrani > 0 && !tukendiMi && (
                          <div className="text-[#a1a1aa] text-[11px] sm:text-xs font-bold flex items-center gap-1.5 mt-2">
                            <BanknoteIcon className="w-3.5 h-3.5" /> 
                            Havale/EFT: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 2})} ₺
                          </div>
                        )}
                      </div>

                      {/* Sağ Taraf: Siber/Modern Yeşil Rozet */}
                      {indirimVarMi && !tukendiMi && (
                        <div className="relative bg-[#064e3b]/40 border border-[#10b981]/30 p-2 sm:p-2.5 flex flex-col items-end justify-center z-10 min-w-[70px] shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden group-hover:border-[#10b981]/60 transition-colors duration-300">
                           {/* Sol Taraftaki Keskin Neon Çizgi */}
                           <div className="absolute top-0 left-0 w-1 h-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></div>
                           
                           {/* İndirim Oranı */}
                           <div className="text-[#10b981] text-xl sm:text-2xl font-black leading-none tracking-tighter flex items-start gap-1">
                             <span className="text-xs sm:text-sm mt-0.5 opacity-80">%</span>{indirimOrani}
                           </div>
                           
                           {/* Alt Yazı */}
                           <div className="text-[#10b981] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest mt-1 text-right opacity-90">
                             Son Sistem <br/> İndirimi
                           </div>
                        </div>
                      )}
                    </div>

                    {/* İncele Butonu */}
                    <Link href={"/product/" + (urun.slug || urun._id)} className="block w-full">
                      <div className={"w-full text-center py-3 mt-6 text-xs sm:text-sm font-bold uppercase border transition-all duration-300 " + (tukendiMi ? "bg-[#18181b] border-[#27272a] text-[#71717a] cursor-not-allowed" : "bg-[#18181b] border-[#3f3f46] text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37]")}>
                        {tukendiMi ? "Tükendi" : "İncele"}
                      </div>
                    </Link>

                  </div>

                </div>
              )
            })
          ) : ( 
            <div className="col-span-full py-24 sm:py-32 flex flex-col items-center justify-center border border-dashed border-[#3f3f46] rounded-none bg-white/[0.01]">
              <Cpu className="w-10 h-10 text-gray-500 mb-4" />
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Sistem Çevrimdışı</h3>
            </div> 
          )}
        </div>

      </div>
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