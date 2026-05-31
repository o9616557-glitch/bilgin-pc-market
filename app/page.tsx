import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, Crosshair, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-[#03050a] text-white font-sans pb-24 overflow-hidden selection:bg-[#00e5ff] selection:text-black">
      
      {/* ==================== 1. ULTRA MODERN HERO (GİRİŞ) ==================== */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 pb-24 border-b border-white/5">
        
        {/* Fütüristik Arka Plan Efektleri */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#00e5ff] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-[#7000ff] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none" />
        
        {/* Holografik Izgara Deseni */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol Taraf - Metin ve Butonlar */}
            <div className="text-left space-y-8">
              
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[#00e5ff]/50 transition-colors cursor-default">
                <Sparkles className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-xs font-black tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                  Yeni Nesil Donanım Mimarisi
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                Performansın <br/>
                <span className="relative inline-block mt-2">
                  <span className="absolute -inset-2 bg-[#00e5ff]/20 blur-2xl rounded-full"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-white via-[#00e5ff] to-blue-600">
                    Zirvesi
                  </span>
                </span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl max-w-xl font-medium tracking-wide">
                RX 9070, RTX 5090 ve 9950X3D gibi oyunun kurallarını değiştiren amiral gemisi donanımlar Bilgin PC Market güvencesiyle stoklarda.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <a href="#vitrin" className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-[0.1em] overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 text-center">
                  <div className="absolute inset-0 w-0 bg-[#00e5ff] transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    Donanımları Keşfet <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  </span>
                </a>
              </div>

            </div>

            {/* Sağ Taraf - Vitrin Görseli (PC'de Görünür) */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600/30 to-[#00e5ff]/30 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="relative bg-[#070b14]/80 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -top-4 -right-4 bg-[#00e5ff] text-black text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.5)] z-20">
                  Amiral Gemisi
                </div>
                
                {/* BURASI GÖRSEL ALANI */}
                <div className="w-full h-80 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative p-4 group">
                   
                   {/* DİKKAT: Kendi ürün resmini public klasörüne atıp buradaki src yolunu değiştirebilirsin */}
                   <img 
                     src="https://www.pngmart.com/files/22/Graphics-Card-PNG-Transparent.png" 
                     alt="Amiral Gemisi Ekran Kartı" 
                     className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,229,255,0.2)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 z-10 relative" 
                   />
                   
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
                  <p className="text-sm text-gray-400 font-medium">En güncel mimari, maksimum FPS, sıfır darboğaz.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. PREMIUM ÜRÜN VİTRİNİ ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.5)]"></div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white pl-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Katalog</span>
            </h2>
          </div>
          <div className="text-sm font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping"></div>
            Canlı Stok: {urunler.length} Ürün
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

              return (
                <Link 
                  href={"/product/" + (urun.slug || urun._id)} 
                  key={urun._id.toString()} 
                  prefetch={true} 
                  className="group relative block w-full h-[480px] bg-[#070b14] rounded-3xl overflow-hidden border border-white/5 hover:border-[#00e5ff]/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00e5ff]/0 to-[#00e5ff]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                    {indirimOrani > 0 && !tukendiMi && (
                      <span className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest backdrop-blur-md">
                        %{indirimOrani} OFF
                      </span>
                    )}
                    {tukendiMi && (
                      <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest backdrop-blur-md">
                        STOKTA YOK
                      </span>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* MOBİL VE PC İÇİN DÜZELTİLMİŞ KARŞILAŞTIRMA BUTONU ALANI  */}
                  {/* Mobilde her zaman görünür (opacity-100), PC'de hoverda parlar */}
                  {/* ======================================================== */}
                  {!tukendiMi && (
                    <div className="absolute top-5 right-5 z-30 opacity-100 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity duration-300">
                      <CompareButton urun={urun} />
                    </div>
                  )}

                  <div className="relative w-full h-[60%] pt-12 p-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {vitrinResmi ? (
                      <img 
                        src={vitrinResmi} 
                        alt={urun.isim || urun.name} 
                        className={"w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2 " + (tukendiMi ? "grayscale opacity-20" : "")} 
                      />
                    ) : ( 
                      <Cpu className="w-16 h-16 text-white/10" />
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[40%] p-6 flex flex-col justify-end bg-gradient-to-t from-[#03050a] via-[#03050a]/90 to-transparent z-10">
                    
                    <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {urun.kategori || "BİLEŞEN"}
                    </span>
                    
                    <h3 className="text-gray-200 font-bold text-lg leading-tight mb-4 group-hover:text-white transition-colors line-clamp-2">
                      {urun.isim || urun.name}
                    </h3>

                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        {indirimVarMi && (
                          <span className="block text-gray-600 line-through text-xs font-bold mb-0.5">
                            {normalFiyat.toLocaleString("tr-TR")} ₺
                          </span>
                        )}
                        <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-[#00e5ff] group-hover:to-white transition-all duration-500">
                          {gecerliFiyat.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                      
                      <div className={"w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 " + (tukendiMi ? "bg-white/5 border-white/5 text-gray-700" : "bg-white/5 border-white/10 text-white group-hover:bg-[#00e5ff] group-hover:border-[#00e5ff] group-hover:text-black shadow-[0_0_15px_rgba(0,229,255,0)] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]")}>
                        <ArrowRight className={"w-5 h-5 transition-transform duration-300 " + (tukendiMi ? "" : "-rotate-45 group-hover:rotate-0")} />
                      </div>
                    </div>
                  </div>

                </Link>
              )
            })
          ) : ( 
            <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 rotate-12">
                <Cpu className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest mb-2">Sistem Çevrimdışı</h3>
              <p className="text-gray-600 font-medium">Veri akışı bekleniyor veya stok verisi yok.</p>
            </div> 
          )}
        </div>

      </div>
    </main>
  );
}