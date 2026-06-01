import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Cpu, Crosshair, Sparkles } from "lucide-react";
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
      
      {/* ==================== 1. HERO (GİRİŞ) - KESKİN HATLAR ==================== */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-24 pb-20 border-b border-[#3f3f46]">
        
        {/* Arka Plan Efektleri */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#d4af37] rounded-full filter blur-[250px] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol Taraf - Metin */}
            <div className="text-left space-y-8">
              {/* Yuvarlak olmayan etiket */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-300">
                  Yeni Nesil Sistemler
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95]">
                Saf Gücün <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d4af37] to-yellow-600 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  Merkezi
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-medium tracking-wide">
                Tepe model donanımlar, kusursuz mimari ve e-sporcuların tercihi olan efsanevi parçalar şimdi Bilgin PC Market stoklarında.
              </p>

              <div className="pt-4">
                {/* Keskin köşeli Hero Butonu */}
                <a href="#vitrin" className="group relative inline-flex w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-[#18181b] font-black uppercase tracking-[0.1em] overflow-hidden rounded-none border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 text-center items-center justify-center">
                  <span className="relative flex items-center justify-center gap-3">
                    Kataloğu İncele <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  </span>
                </a>
              </div>
            </div>

            {/* Sağ Taraf - Vitrin Görseli */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#d4af37] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
              
              {/* Keskin köşeli vitrin çerçevesi */}
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
      <div id="vitrin" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
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

        {/* ESNEMEYE UYGUN GRID YAPISI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {urunler.length > 0 ? (
            urunler.map((urun: any) => {
              const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
              const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
              const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
              const indirimVarMi = normalFiyat > gecerliFiyat;
              const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
              const stokSifirMi = urun.stokAdedi === 0 || urun.stokAdedi === "0";
              const tukendiMi = urun.stokDurumu === "Tükendi" || stokSifirMi;
              
              // Havale İndirimi Hesaplama
              const havaleOrani = urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5;
              const havaleFiyati = gecerliFiyat - (gecerliFiyat * (havaleOrani / 100));

              return (
                <Link 
                  href={"/product/" + (urun.slug || urun._id)} 
                  key={urun._id.toString()} 
                  prefetch={true} 
                  // YENİ TASARIM ANA KART YAPISI: Keskin köşeler, koyu füme arka plan, gölge efekti
                  className="group relative flex flex-col w-full h-full bg-[#18181b] rounded-none border border-[#3f3f46] shadow-[10px_10px_0px_rgba(0,0,0,0.3)] hover:shadow-[15px_15px_0px_rgba(212,175,55,0.15)] hover:-translate-y-1 transition-all duration-300"
                >

                  {/* 1. ÜST KISIM (GÖRSEL VE ROZETLER) */}
                  <div className="relative w-full aspect-square sm:aspect-[4/3] p-6 flex items-center justify-center bg-black/40 border-b border-[#3f3f46]">
                    
                    {/* Keskin İndirim Rozeti (Tasarımındaki gibi tam köşede) */}
                    {indirimOrani > 0 && !tukendiMi && (
                      <div className="absolute -top-[1px] -right-[1px] z-20 bg-[#ef4444] text-white px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        %{indirimOrani} İNDİRİM
                      </div>
                    )}
                    {tukendiMi && (
                      <div className="absolute -top-[1px] -right-[1px] z-20 bg-zinc-600 text-white px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        STOKTA YOK
                      </div>
                    )}

                    {/* Karşılaştırma Butonu */}
                    {!tukendiMi && (
                      <div className="absolute top-4 left-4 z-30 opacity-100 transition-all duration-300 group-hover:scale-110">
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

                  {/* 2. ALT KISIM (METİNLER VE FİYAT) */}
                  <div className="flex flex-col flex-grow p-6 relative z-10 bg-transparent">
                    
                    {/* Ürün İsmi (Altın rengi vurgulu) */}
                    <h3 className="text-[#d4af37] font-semibold text-sm sm:text-lg uppercase tracking-wider leading-snug line-clamp-2 mb-4">
                      {urun.isim || urun.name}
                    </h3>

                    {/* Fiyatlandırma Alanı (Çizgili Ayıraçlarla) */}
                    <div className="border-t border-b border-[#3f3f46] py-4 mb-5 mt-auto">
                      
                      {/* Eski Fiyat */}
                      {indirimVarMi && (
                        <div className="text-[#a1a1aa] line-through text-xs sm:text-sm mb-1">
                          {normalFiyat.toLocaleString("tr-TR")} ₺
                        </div>
                      )}
                      
                      {/* Yeni Fiyat */}
                      <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none mb-2">
                        {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-lg font-normal text-[#a1a1aa]">₺</span>
                      </div>
                      
                      {/* Havale Fiyatı */}
                      {havaleOrani > 0 && !tukendiMi && (
                        <div className="text-[#10b981] text-xs sm:text-sm font-medium flex items-center gap-1.5 mt-1">
                          <BanknoteIcon className="w-4 h-4" /> 
                          Havale/EFT ile: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 2})} ₺
                        </div>
                      )}
                    </div>

                    {/* Satın Al Butonu (Keskin köşeli, hover efektli) */}
                    <div className={"w-full text-center py-3 text-sm font-bold uppercase border-2 transition-all duration-300 " + (tukendiMi ? "bg-[#27272a] border-[#27272a] text-[#71717a] cursor-not-allowed" : "bg-white border-white text-[#18181b] group-hover:bg-transparent group-hover:text-white")}>
                      {tukendiMi ? "Tükendi" : "Hemen İncele"}
                    </div>

                  </div>

                </Link>
              )
            })
          ) : ( 
            <div className="col-span-full py-24 sm:py-32 flex flex-col items-center justify-center border border-dashed border-[#3f3f46] rounded-none bg-white/[0.01]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-none flex items-center justify-center mb-6 rotate-12">
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
      <rect width="20" height="12" x="2" y="6" rx="0"/> {/* İkonu da köşeli yaptım (rx=0) */}
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}