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
    <main className="min-h-screen bg-black text-white font-sans pb-24 overflow-hidden selection:bg-[#10b981] selection:text-black">
      
      {/* ==================== 1. HERO (GİRİŞ BÖLÜMÜ) ==================== */}
      <section className="relative w-full min-h-[55vh] flex items-center justify-center pt-24 pb-6 border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-300">
                  Yeni Nesil Sistemler
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95] text-white">
                Saf Gücün <br/>
                <span className="text-white">Merkezi</span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-medium tracking-wide">
                Tepe model donanımlar, kusursuz mimari ve e-sporcuların tercihi olan efsanevi parçalar şimdi stoklarda.
              </p>

              <div className="pt-4">
                <a href="#vitrin" className="group relative inline-flex w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-[0.1em] overflow-hidden rounded-none border border-white/20 hover:border-[#10b981] hover:text-[#10b981] transition-all duration-300 text-center items-center justify-center">
                  <span className="relative flex items-center justify-center gap-3">
                    Kataloğu İncele <Crosshair className="w-5 h-5 transition-transform duration-500" />
                  </span>
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-none p-6 shadow-2xl">
                <div className="absolute -top-[1px] -right-[1px] bg-white text-black text-[10px] font-black px-4 py-2 rounded-none uppercase tracking-widest z-20">
                  Amiral Gemisi
                </div>
                <div className="w-full h-[350px] bg-black/60 rounded-none border border-white/5 flex items-center justify-center overflow-hidden relative p-8 group">
                   <img src="/amiral.png" alt="Amiral Gemisi" className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105 z-10 relative" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 2. ÖZEL AYRICALIKLAR (Renk Tonu Hafifçe Açıldı) ==================== */}
      <section className="max-w-[1400px] mx-auto px-0 sm:px-6 lg:px-8 pt-8 pb-4">
        
        <div className="flex items-center justify-between px-4 sm:px-0 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Özel <span className="text-gray-500">Ayrıcalıklar</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-4 px-4 sm:px-0 snap-x snap-mandatory scroll-smooth max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:h-2.5 lg:[&::-webkit-scrollbar-track]:bg-[#050505] lg:[&::-webkit-scrollbar-track]:border lg:[&::-webkit-scrollbar-track]:border-white/10 lg:[&::-webkit-scrollbar-thumb]:bg-white/20 hover:lg:[&::-webkit-scrollbar-thumb]:bg-[#10b981] lg:[&::-webkit-scrollbar-thumb]:rounded-none">

          {/* KART 1 */}
          <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=800&auto=format&fit=crop" alt="Havale İndirimi" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="text-[#10b981] font-black text-5xl tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">%15</div>
              <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#10b981] transition-colors">Havale İndirimi</h3>
              <div className="w-8 h-1 bg-[#10b981] mb-3 transition-all duration-500 group-hover:w-full"></div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Sepet tutarı fark etmeksizin, banka transferi ile yapacağınız tüm ödemelerde sistem anında net indirim uygular.</p>
            </div>
          </div>

          {/* KART 2 */}
          <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-white transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop" alt="Hızlı Kargo" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="text-white font-black text-4xl tracking-tighter mb-2">JET<span className="text-gray-600">HIZI</span></div>
              <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-gray-300 transition-colors">Hızlı Teslimat</h3>
              <div className="w-8 h-1 bg-white mb-3 transition-all duration-500 group-hover:w-full"></div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Saat 16:00'a kadar onaylanan donanım siparişleriniz, darbelere karşı özel korumalı paketlemeyle aynı gün kargoya teslim edilir.</p>
            </div>
          </div>

          {/* KART 3 */}
          <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#d4af37] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop" alt="Montaj ve Test" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 sepia-[.3]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="text-[#d4af37] font-black text-4xl tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">PRO<span className="text-white">TEST</span></div>
              <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#d4af37] transition-colors">Ücretsiz Montaj</h3>
              <div className="w-8 h-1 bg-[#d4af37] mb-3 transition-all duration-500 group-hover:w-full"></div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Sipariş ettiğiniz sistemler titizlikle toplanır. 24 saatlik stres testlerinden sorunsuz geçtikten sonra tarafınıza ulaştırılır.</p>
            </div>
          </div>

          {/* KART 4 */}
          <div className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#121212] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#3b82f6] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" alt="Resmi Garanti" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="text-[#3b82f6] font-black text-4xl tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">%100<span className="text-white text-2xl">TR</span></div>
              <h3 className="text-white font-black text-base uppercase tracking-widest mb-3 group-hover:text-[#3b82f6] transition-colors">Resmi Garanti</h3>
              <div className="w-8 h-1 bg-[#3b82f6] mb-3 transition-all duration-500 group-hover:w-full"></div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100">Mağazamızdaki tüm ürünler Türkiye resmi distribütör garantilidir. İthalatçı garantili veya kutusuz sıfır ürün satışımız yoktur.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 2.5 YENİ BÖLÜM: VİZYON & GÖRSEL ŞÖLENİ (Yazı Görsel Karışımı) ==================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#121212] border border-white/10 p-8 lg:p-12 relative overflow-hidden shadow-[5px_5px_0px_rgba(0,0,0,0.8)]">
          
          {/* Arka plan sızıntı neon ışık efekti */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Sol Taraf: Alt Alta Modern Dökülen Metinler */}
          <div className="space-y-6 max-w-xl">
            <div className="text-[#10b981] text-[10px] font-black tracking-[0.3em] uppercase">
              Mühendislik & İnovasyon
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Sadece Toplamıyoruz, <br/>
              <span className="text-gray-500">Kusursuz İşliyoruz.</span>
            </h2>
            <div className="h-1 w-20 bg-white"></div>
            
            <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed pt-2">
              Bilgin PC Market çatısı altında hayat bulan her amiral gemisi sistem, sıradan bir montaj sürecinden çok daha fazlasını temsil eder. Anakartın en kritik VRM fazlarından sıvı soğutmanın milimetrik hava akış hatlarına kadar her detay jilet gibi optimize edilir.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
              Kablolama sanatından statik yük testlerine, yüksek kararlılık ayarlarından termal analizlere kadar tüm aşamalar, rekabetçi arenalarda sıfır drop ve maksimum FPS ile oynamanız için tasarlanmıştır. Güç sadece parçalarda değil, onların kusursuz uyumundadır.
            </p>
          </div>

          {/* Sağ Taraf: PC'de Kenarda Duracak Harika Görsel */}
          <div className="relative w-full h-[250px] sm:h-[350px] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Donanım Laboratuvarı" 
              className="w-full h-full object-cover opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-700 grayscale hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          </div>

        </div>
      </section>

      {/* ==================== 3. HIZLI ERİŞİM (Kategori Kartları - Renkleri Bir Tık Açıldı & Aynı Boyut) ==================== */}
      <section className="max-w-[1400px] mx-auto px-0 sm:px-6 lg:px-8 pt-8 pb-4">
        
        <div className="flex items-center gap-4 mb-6 px-4 sm:px-0">
          <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Hızlı <span className="text-gray-500">Erişim</span>
          </h2>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-4 px-4 sm:px-0 snap-x snap-mandatory scroll-smooth max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:h-2.5 lg:[&::-webkit-scrollbar-track]:bg-[#050505] lg:[&::-webkit-scrollbar-track]:border lg:[&::-webkit-scrollbar-track]:border-white/10 lg:[&::-webkit-scrollbar-thumb]:bg-white/20 hover:lg:[&::-webkit-scrollbar-thumb]:bg-[#10b981] lg:[&::-webkit-scrollbar-thumb]:rounded-none">
          
          {/* KATEGORİ 1: HAZIR SİSTEMLER */}
          <Link href="/kategori/hazir-sistemler" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop" alt="Hazır Sistemler" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#10b981] transition-colors">Hazır Sistemler</h3>
              <div className="w-12 h-1 bg-[#10b981] mt-3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* KATEGORİ 2: EKRAN KARTLARI */}
          <Link href="/kategori/ekran-kartlari" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop" alt="Ekran Kartları" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#10b981] transition-colors">Ekran Kartları</h3>
              <div className="w-12 h-1 bg-[#10b981] mt-3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* KATEGORİ 3: İŞLEMCİLER */}
          <Link href="/kategori/islemciler" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop" alt="İşlemciler" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#10b981] transition-colors">İşlemciler</h3>
              <div className="w-12 h-1 bg-[#10b981] mt-3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* KATEGORİ 4: ANAKARTLAR */}
          <Link href="/kategori/anakartlar" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" alt="Anakartlar" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#10b981] transition-colors">Anakartlar</h3>
              <div className="w-12 h-1 bg-[#10b981] mt-3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* KATEGORİ 5: SIVI SOĞUTMA */}
          <Link href="/kategori/sivi-sogutma" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop" alt="Sıvı Soğutma" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#10b981] transition-colors">Sıvı Soğutma</h3>
              <div className="w-12 h-1 bg-[#10b981] mt-3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* KATEGORİ 6: PROFESYONEL MONİTÖRLER */}
          <Link href="/kategori/profesyonel-monitor" className="group relative flex-none w-[85vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] h-[380px] bg-[#161616] border border-white/10 snap-start overflow-hidden flex flex-col justify-end p-6 cursor-pointer hover:border-[#10b981] transition-colors duration-500">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" alt="Profesyonel Monitörler" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-white font-black text-2xl uppercase tracking-widest group-hover:text-[#10b981] transition-colors">Prof. Monitörler</h3>
              <div className="w-12 h-1 bg-[#10b981] mt-3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

        </div>
      </section>

      {/* ==================== 4. PREMIUM ÜRÜN VİTRİNİ (Renk Tonu Hafifçe Açıldı) ==================== */}
      <div id="vitrin" className="max-w-[1400px] mx-auto px-0 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6 px-4 sm:px-0">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-white"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white pl-4">
              Premium <span className="text-gray-400">Vitrin</span>
            </h2>
          </div>
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
            <div className="w-2 h-2 rounded-none bg-[#10b981] animate-ping"></div>
            Aktif Stok: {urunler.length}
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-8 px-4 sm:px-0 snap-x snap-mandatory scroll-smooth max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:h-2.5 lg:[&::-webkit-scrollbar-track]:bg-[#050505] lg:[&::-webkit-scrollbar-track]:border lg:[&::-webkit-scrollbar-track]:border-white/10 lg:[&::-webkit-scrollbar-thumb]:bg-white/20 hover:lg:[&::-webkit-scrollbar-thumb]:bg-[#10b981] lg:[&::-webkit-scrollbar-thumb]:rounded-none">
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
                <div key={urun._id.toString()} className="group relative flex flex-col w-[85vw] sm:w-[320px] lg:w-[calc(25%-1.125rem)] flex-shrink-0 snap-start bg-[#121212] border border-white/10 shadow-[5px_5px_0px_rgba(0,0,0,0.8)] transition-all duration-300">
                  <Link href={"/product/" + (urun.slug || urun._id)} className="absolute inset-0 z-10" prefetch={true} />

                  <div className="relative w-full aspect-[4/3] p-6 flex items-center justify-center bg-white/5 border-b border-white/10 pointer-events-none">
                    {!tukendiMi && (
                      <div className="absolute top-3 right-3 z-[60] pointer-events-auto">
                        <div className="relative flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#10b981] px-3 py-1.5 cursor-pointer">
                          <GitCompare className="w-4 h-4 text-[#10b981]" />
                          <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block text-[#10b981]">Karşılaştır</span>
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
                      <img src={vitrinResmi} alt={urun.isim || urun.name} className={"w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out group-hover:scale-105 " + (tukendiMi ? "grayscale opacity-20" : "")} />
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
                            <BanknoteIcon className="w-3.5 h-3.5" /> Havale/EFT: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 2})} ₺
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
                        <div className={"w-full text-center py-3 text-xs sm:text-sm font-bold uppercase border transition-all duration-300 backdrop-blur-md " + (tukendiMi ? "bg-black/40 border-[#27272a] text-[#71717a] cursor-not-allowed" : "bg-white/5 border-white/20 text-white hover:border-[#10b981] hover:text-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]")}>
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