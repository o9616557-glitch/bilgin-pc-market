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
    <main className="min-h-screen bg-black text-white font-sans pb-24 overflow-hidden selection:bg-[#00e5ff] selection:text-black">
      
      {/* ==================== 1. SAF SİYAH HERO (GİRİŞ) ==================== */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-24 pb-20 border-b border-white/[0.05]">
        
        {/* Sadece ortada çok hafif bir neon yansıması (Göz yormaz) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#00e5ff] rounded-full filter blur-[200px] opacity-[0.05] pointer-events-none" />
        
        {/* Şık Izgara Deseni */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol Taraf - Metin */}
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
                <Sparkles className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-300">
                  Yeni Nesil Sistemler
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95]">
                Saf Gücün <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00e5ff] to-blue-500 drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  Merkezi
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-medium tracking-wide">
                Tepe model donanımlar, kusursuz mimari ve e-sporcuların tercihi olan efsanevi parçalar şimdi stoklarda.
              </p>

              <div className="pt-4">
                <a href="#vitrin" className="group relative inline-flex w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-black font-black uppercase tracking-[0.1em] overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 text-center items-center justify-center">
                  <div className="absolute inset-0 w-0 bg-[#00e5ff] transition-all duration-[300ms] ease-out group-hover:w-full"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    Kataloğu İncele <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  </span>
                </a>
              </div>
            </div>

            {/* Sağ Taraf - Vitrin Görseli */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00e5ff] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
              
              <div className="relative bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -top-3 -right-3 bg-[#00e5ff] text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest z-20 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  Amiral Gemisi
                </div>
                
                <div className="w-full h-[350px] bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative p-8 group">
                   <img 
                     src="https://www.pngmart.com/files/22/Graphics-Card-PNG-Transparent.png" 
                     alt="Amiral Gemisi Ekran Kartı" 
                     className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,229,255,0.15)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 z-10 relative" 
                   />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. PARLAYAN CAM ÜRÜN VİTRİNİ ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.5)]"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white pl-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Vitrin</span>
            </h2>
          </div>
          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping"></div>
            Aktif Stok: {urunler.length}
          </div>
        </div>

        {/* ESNEMEYE UYGUN GRID YAPISI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                <Link 
                  href={"/product/" + (urun.slug || urun._id)} 
                  key={urun._id.toString()} 
                  prefetch={true} 
                  // KART ANA YAPISI: Flex-col ile yazı ve resmi ayırıyoruz, taşma bitiyor!
                  className="group relative flex flex-col w-full h-full bg-white/[0.02] backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-[#00e5ff]/40 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.2)]"
                >
                  {/* Kart İçi Cam Parlama Efekti */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* 1. ÜST KISIM (GÖRSEL VE ROZETLER) */}
                  <div className="relative w-full aspect-square sm:aspect-[4/3] p-6 flex items-center justify-center bg-black/20 border-b border-white/5">
                    
                    {/* Rozetler (Mobilde de rahat sığar) */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {indirimOrani > 0 && !tukendiMi && (
                        <span className="bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20 px-2 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black tracking-widest backdrop-blur-md shadow-lg shadow-[#00e5ff]/10">
                          %{indirimOrani} İNDİRİM
                        </span>
                      )}
                      {tukendiMi && (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black tracking-widest backdrop-blur-md">
                          STOKTA YOK
                        </span>
                      )}
                    </div>

                    {/* Karşılaştırma Butonu (Mobilde hep görünür, PC'de hep görünür ama hoverda parlar) */}
                    {!tukendiMi && (
                      <div className="absolute top-4 right-4 z-30 opacity-100 transition-all duration-300 group-hover:scale-110">
                        <CompareButton urun={urun} />
                      </div>
                    )}

                    {/* Resim */}
                    {vitrinResmi ? (
                      <img 
                        src={vitrinResmi} 
                        alt={urun.isim || urun.name} 
                        className={"w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-110 " + (tukendiMi ? "grayscale opacity-20" : "")} 
                      />
                    ) : ( 
                      <Cpu className="w-16 h-16 text-white/10" />
                    )}
                  </div>

                  {/* 2. ALT KISIM (METİNLER VE FİYAT - Asla Taşmaz) */}
                  <div className="flex flex-col flex-grow p-5 sm:p-6 bg-transparent relative z-10">
                    
                    {/* Kategori ve Havale İndirimi */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-500 text-[10px] font-bold tracking-[0.15em] uppercase border border-gray-800 px-2 py-0.5 rounded-md">
                        {urun.kategori || "BİLEŞEN"}
                      </span>
                      {havaleOrani > 0 && !tukendiMi && (
                        <span className="text-[#10b981] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <BanknoteIcon className="w-3.5 h-3.5" /> %{havaleOrani} Havale
                        </span>
                      )}
                    </div>
                    
                    {/* Ürün İsmi (Hata yapmaması için max-2 satır) */}
                    <h3 className="text-gray-200 font-bold text-sm sm:text-base leading-snug line-clamp-2 mb-4 group-hover:text-white transition-colors">
                      {urun.isim || urun.name}
                    </h3>

                    {/* Fiyat ve Buton (En alta yaslanır) */}
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        {indirimVarMi && (
                          <span className="block text-gray-600 line-through text-[11px] font-bold mb-1">
                            {normalFiyat.toLocaleString("tr-TR")} ₺
                          </span>
                        )}
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#00e5ff] transition-colors duration-300">
                          {gecerliFiyat.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                      
                      {/* Şık Yön Butonu */}
                      <div className={"w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 " + (tukendiMi ? "bg-white/5 border-white/5 text-gray-700" : "bg-white/5 border-white/10 text-white group-hover:bg-[#00e5ff] group-hover:border-[#00e5ff] group-hover:text-black shadow-[0_0_15px_rgba(0,229,255,0)] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]")}>
                        <ArrowRight className={"w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 " + (tukendiMi ? "" : "-rotate-45 group-hover:rotate-0")} />
                      </div>
                    </div>

                  </div>

                </Link>
              )
            })
          ) : ( 
            <div className="col-span-full py-24 sm:py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01] backdrop-blur-md">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 rotate-12">
                <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Sistem Çevrimdışı</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base text-center px-4">Veritabanına bağlanılamadı veya stokta ürün yok.</p>
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