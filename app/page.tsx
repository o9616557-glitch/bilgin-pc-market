import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";

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
    <main className="min-h-screen bg-[#050814] text-[#ededed] font-sans pb-20">
      
      {/* 🚀 1. BÖLÜM: KAHRAMAN (HERO) ALANI - Sitenin Vitrini */}
      <section className="relative overflow-hidden bg-[#09090b] border-b border-slate-800/80 pt-24 pb-32 mb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#10b981] blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] text-sm font-bold uppercase tracking-wider mb-8">
            <Zap className="w-4 h-4 fill-current" /> Yeni Nesil Donanım Merkezi
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6 leading-tight">
            Performansın <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Zirvesine Ulaşın
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Oyun bilgisayarları, üst düzey bileşenler ve profesyonel donanım çözümlerinde en iyi fiyat garantisiyle Bilgin PC Market yanınızda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#vitrin" className="w-full sm:w-auto bg-[#00e5ff] text-black font-black uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2">
              Ürünleri Keşfet <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/hakkimizda" className="w-full sm:w-auto bg-[#121215] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-[#1a1a1f] transition-all flex items-center justify-center gap-2">
              Biz Kimiz?
            </Link>
          </div>
        </div>
        
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 hidden md:block">
          <div className="grid grid-cols-3 gap-4 bg-[#09090b] border border-slate-800 p-4 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <ShieldCheck className="w-6 h-6 text-[#10b981]" /> <span className="font-bold text-sm uppercase tracking-wide">Distribütör Garantili</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-300 border-x border-slate-800">
              <Zap className="w-6 h-6 text-orange-400" /> <span className="font-bold text-sm uppercase tracking-wide">Aynı Gün Kargo</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <Cpu className="w-6 h-6 text-[#00e5ff]" /> <span className="font-bold text-sm uppercase tracking-wide">%100 Orijinal Ürün</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 2. BÖLÜM: ÜRÜN VİTRİNİ */}
      <div id="vitrin" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        
        <div className="flex items-end justify-between mb-10 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wide text-white">
              Popüler <span className="text-[#00e5ff]">Ürünler</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Stoktaki en yeni ve en çok satan donanımlar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {urunler.length > 0 ? (
            urunler.map((urun: any) => {
              const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
              const indirimVarMi = normalFiyat > gecerliFiyat;
              const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
              const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
              const tukendiMi = urun.stokDurumu === "Tükendi" || stokSifirMi;
              const havaleOrani = urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5;

              return (
                <Link href={/product/${urun.slug || urun._id}} key={urun._id.toString()} className="group outline-none">
                  <div className="bg-[#09090b] rounded-2xl border border-slate-800 p-4 flex flex-col h-full relative overflow-hidden transition-all duration-300 group-hover:border-[#00e5ff]/40 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] group-hover:-translate-y-1">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

                    {indirimOrani > 0 && !tukendiMi && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase z-10 shadow-lg border border-red-400/30">
                        %{indirimOrani} İNDİRİM
                      </div>
                    )}

                    {tukendiMi && (
                      <div className="absolute top-3 right-3 bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase z-10 backdrop-blur-md">
                        TÜKENDİ
                      </div>
                    )}

                    <div className="w-full aspect-square bg-[#121215] rounded-xl border border-slate-800/80 overflow-hidden mb-4 relative flex items-center justify-center p-4">
                      {vitrinResmi ? (
                        <img 
                          src={vitrinResmi} 
                          alt={urun.isim || urun.name} 
                          className={w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${tukendiMi ? "grayscale opacity-40" : ""}} 
                        />
                      ) : ( 
                        <div className="text-slate-600 text-xs font-bold tracking-widest uppercase">Görsel Yok</div> 
                      )}
                    </div>

                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-slate-800/50 px-2 py-0.5 rounded-md">
                          {urun.kategori || "Donanım"}
                        </span>
                        {havaleOrani > 0 && !tukendiMi && (
                          <span className="text-[#10b981] text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <BanknoteIcon className="w-3 h-3" /> %{havaleOrani} İndirim
                          </span>
                        )}
                      </div>

                      <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 mb-4 group-hover:text-[#00e5ff] transition-colors">
                        {urun.isim || urun.name}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-800/80">
                        {indirimVarMi ? (
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-xs font-bold line-through mb-0.5">
                              {normalFiyat.toLocaleString("tr-TR")} TL
                            </span>
                            <span className="text-xl font-black text-[#00e5ff]">
                              {gecerliFiyat.toLocaleString("tr-TR")} TL
                            </span>
                          </div>
                        ) : (
                          <div className="text-xl font-black text-white">
                            {gecerliFiyat.toLocaleString("tr-TR")} TL
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`mt-4 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      tukendiMi 
                        ? "bg-slate-800/50 text-slate-500 border border-slate-700/50" 
                        : "bg-[#121215] text-slate-300 border border-slate-700 group-hover:bg-[#00e5ff] group-hover:text-black group-hover:border-[#00e5ff] shadow-[0_0_15px_rgba(0,0,0,0)] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                    }`}>
                      {tukendiMi ? (
                        <span>Stokta Yok</span>
                      ) : (
                        <span className="flex items-center gap-2">İncele <ArrowRight className="w-4 h-4" /></span>
                      )}
                    </div>

                  </div>
                </Link>
              )
            })
          ) : ( 
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-[#09090b] border border-slate-800 rounded-3xl">
              <Cpu className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Vitrin Şu An Boş</h3>
              <p className="text-slate-400">Yakında yeni nesil donanımlarla karşınızda olacağız.</p>
            </div> 
          )}
        </div>

      </div>
    </main>
  );
}

function BanknoteIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}