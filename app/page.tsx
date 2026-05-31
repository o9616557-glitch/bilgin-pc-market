import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";
import CompareButton from "./CompareButton"; 

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // 1. VERİTABANINDAN ÜRÜNLERİ ÇEKME İŞLEMİ
  let urunler: any[] = [];
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) { 
    console.error("HATA:", e); 
  }

  return (
    <main className="min-h-screen bg-[#050814] text-[#ededed] font-sans pb-20 overflow-hidden">
      
      {/* ==================== 1. EFSANEVİ HERO (GİRİŞ) VİTRİNİ ==================== */}
      <section className="relative w-full bg-[#0b0f19] border-b border-slate-800/80 min-h-[85vh] flex items-center pt-20 pb-24">
        
        {/* Arka Plan Atmosfer Işıkları */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00e5ff]/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* İnce Izgara (Grid) Deseni */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol Taraf - Metin ve Butonlar */}
            <div className="text-left space-y-8">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff]"></span>
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-300 tracking-wide uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00e5ff]" /> Yeni Nesil Stoklarda
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight uppercase">
                Performansın <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-[#00e5ff] to-blue-500 animate-gradient-x drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  Zirvesine Ulaşın
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
                E-spor arenasında sınırları zorlamak isteyenler için en güçlü bileşenler Bilgin PC Market'te. Sektörü kasıp kavuran <strong className="text-[#00e5ff]">RX 9070</strong>, amiral gemisi <strong className="text-blue-500">RTX 5090</strong> ve performansı zirveye taşıyan <strong className="text-purple-400">Ryzen 9 9950X3D</strong> gibi efsanelerle sisteminizi hemen şimdi yükseltin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#vitrin" className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-slate-900 transition-all duration-200 bg-[#00e5ff] rounded-xl hover:bg-[#00c4db] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:-translate-y-1 uppercase tracking-wider overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">Ürünleri Keşfet <ArrowRight className="w-5 h-5" /></span>
                </a>
                
                <Link href="/hakkimizda" className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900/80 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-slate-500 backdrop-blur-md uppercase tracking-wider">
                  Biz Kimiz?
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Distribütör Garantili</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Aynı Gün Kargo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00e5ff]" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">%100 Orijinal Ürün</span>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Vitrin Görseli (Cam Efektli Kutu İçinde) */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600/30 to-[#00e5ff]/30 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="relative bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/50">
                  Yeni Nesil
                </div>
                
                <div className="w-full h-80 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden relative">
                   <Cpu className="w-32 h-32 text-slate-700/50" />
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-wide">Extreme Performans Serisi</h3>
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.8)]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">En güncel mimari, maksimum FPS, sıfır darboğaz.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. VERİTABANINDAN GELEN ÜRÜNLER (VİTRİN) ==================== */}
      <div id="vitrin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        <div className="flex items-end justify-between mb-12 border-b border-slate-800/80 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-1 bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.5)]"></div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white">
              Popüler <span className="text-[#00e5ff]">Ürünler</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-2 font-medium">300'den fazla tepe model donanım parçası stoklarımızda seni bekliyor.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {urunler.length > 0 ? (
            urunler.map((urun: any) => {
              // Senin yazdığın veri eşleştirme mantığı
              const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
              const indirimVarMi = normalFiyat > gecerliFiyat;
              const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
              const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
              const tukendiMi = urun.stokDurumu === "Tükendi" || stokSifirMi;
              const havaleOrani = urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5;

              return (
                <Link 
                  href={"/product/" + (urun.slug || urun._id)} 
                  key={urun._id.toString()} 
                  prefetch={true} 
                  className="group outline-none block h-full"
                >
                  <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 p-5 flex flex-col h-full relative overflow-hidden transition-all duration-300 group-hover:border-[#00e5ff]/50 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] group-hover:-translate-y-2">
                    
                    {/* Kart İçi Glow Efekti */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>

                    {/* İndirim ve Tükendi Rozetleri */}
                    {indirimOrani > 0 && !tukendiMi && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase z-10 shadow-lg shadow-red-500/20 border border-red-400/30">
                        %{indirimOrani} İNDİRİM
                      </div>
                    )}

                    {tukendiMi && (
                      <div className="absolute top-4 right-4 bg-red-900/80 text-white border border-red-500 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase z-10 backdrop-blur-md shadow-lg shadow-red-900/50">
                        TÜKENDİ
                      </div>
                    )}

                    {/* Ürün Görseli */}
                    <div className="w-full aspect-square bg-[#050814] rounded-xl border border-slate-800 overflow-hidden mb-5 relative flex items-center justify-center p-4">
                      {vitrinResmi ? (
                        <img 
                          src={vitrinResmi} 
                          alt={urun.isim || urun.name} 
                          className={"w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 " + (tukendiMi ? "grayscale opacity-40" : "")} 
                        />
                      ) : ( 
                        <div className="flex flex-col items-center justify-center text-slate-700">
                          <Cpu className="w-10 h-10 mb-2 opacity-50" />
                          <div className="text-[10px] font-black tracking-widest uppercase">Görsel Yok</div>
                        </div> 
                      )}
                      
                      {!tukendiMi && <CompareButton urun={urun} />}
                    </div>

                    {/* Ürün Bilgileri */}
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                          {urun.kategori || "Donanım"}
                        </span>
                        {havaleOrani > 0 && !tukendiMi && (
                          <span className="text-[#10b981] text-[10px] font-black uppercase tracking-wider bg-[#10b981]/10 border border-[#10b981]/30 px-2 py-1 rounded-md flex items-center gap-1.5">
                            <BanknoteIcon className="w-3.5 h-3.5" /> %{havaleOrani} İndirim
                          </span>
                        )}
                      </div>

                      <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-4 group-hover:text-[#00e5ff] transition-colors">
                        {urun.isim || urun.name}
                      </h3>
                      
                      {/* Fiyat Alanı */}
                      <div className="mt-auto pt-4 border-t border-slate-800/80">
                        {indirimVarMi ? (
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-xs font-bold line-through mb-1">
                              {normalFiyat.toLocaleString("tr-TR")} TL
                            </span>
                            <span className="text-2xl font-black text-[#00e5ff] tracking-tight">
                              {gecerliFiyat.toLocaleString("tr-TR")} TL
                            </span>
                          </div>
                        ) : (
                          <div className="text-2xl font-black text-white tracking-tight">
                            {gecerliFiyat.toLocaleString("tr-TR")} TL
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buton */}
                    <div className={"mt-5 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 " + (tukendiMi ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed" : "bg-[#050814] text-slate-300 border border-slate-700 group-hover:bg-[#00e5ff] group-hover:text-slate-900 group-hover:border-[#00e5ff] shadow-lg group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]")}>
                      {tukendiMi ? (
                        <span>Stokta Yok</span>
                      ) : (
                        <span className="flex items-center gap-2">Hemen İncele <ArrowRight className="w-4 h-4" /></span>
                      )}
                    </div>

                  </div>
                </Link>
              )
            })
          ) : ( 
            <div className="col-span-full py-24 flex flex-col items-center justify-center bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl">
              <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                <Cpu className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Vitrin Şu An Boş</h3>
              <p className="text-slate-400 font-medium">Veritabanından ürünler yükleniyor veya henüz eklenmedi.</p>
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
      <rect width="20" height="12" x="2" y="6" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}