"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Search, Copy, Check, Package, Truck, ShoppingCart, 
  CheckCircle, Info, CalendarDays, User, ShieldCheck, CreditCard,
  MapPin, Star, Monitor, Headphones, PackageX
} from "lucide-react";
import { useOrders } from "@/app/OrderContext";
import toast from "react-hot-toast/headless";

export default function SiparisTakipPage() {
  const [kodu, setKodu] = useState("");
  const [siparis, setSiparis] = useState<any>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  // 🚀 KARGO POPUP VE SİPARİŞ MOTORU
  const [kargoPopupAcik, setKargoPopupAcik] = useState(false);
  const { orders: localOrders } = useOrders();

  // 🚀 EKRAN DONDURMA
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (kargoPopupAcik) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [kargoPopupAcik]);

  const adimlar = ["Sipariş Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

  const aktifAdimBul = (durum: string) => {
    if (!durum) return 0; 
    const d = durum.toLowerCase();
    if (durum === "Teslim Edildi" || d.includes("teslim") || d.includes("tamam") || d.includes("tamal") || d.includes("bit") || d.includes("son")) return 3;
    if (durum === "Kargoya Verildi" || d.includes("kargo")) return 2;
    if (durum === "Ödendi / Hazırlanıyor" || d.includes("hazır") || d.includes("odendi")) return 1;
    return 0;
  };

  const iptalEdildiMi = (durum: string) => {
    if (!durum) return false;
    return durum === "İptal Edildi" || durum.toLowerCase().includes("iptal");
  };

  const sorgula = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    setSiparis(null);
    if (!kodu) { setHata("Lütfen sipariş kodunuzu girin."); return; }
    setYukleniyor(true);
    try {
      const res = await fetch("/api/siparis-takip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siparisKodu: kodu }),
      });
      const data = await res.json();
      if (data.success || data.siparis) {
        setSiparis(data.siparis || data);
      } else {
        setHata(data.error || "Bu koda ait bir sipariş bulunamadı.");
      }
    } catch (err) {
      setHata("Bağlantı hatası oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  const koduKopyala = (siparisKodu: string) => {
    navigator.clipboard.writeText(siparisKodu);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  const magazaMesaji = siparis?.musteriMesaji || siparis?.mesaj || siparis?.not || siparis?.adminNotu || siparis?.aciklama;

  const siparisTarihi = siparis?.createdAt || siparis?.tarih;
  const formatliTarih = siparisTarihi 
    ? new Date(siparisTarihi).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' }) 
    : "";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.05] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-2 sm:p-4 shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <nav className="flex flex-row lg:flex-col gap-1.5 min-w-max lg:min-w-0">
              <Link href="/hesabim" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Profil
              </Link>
              <Link href="/cuzdan" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ İÇERİK */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full animate-in fade-in duration-300">
          
          {/* 🚀 BİNGO: FASULYE MENÜ EKSİKSİZ VE TAM SIRALI */}
          <div className="flex flex-nowrap items-center gap-3 w-full overflow-x-auto pt-2 pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            
            <Link href="/siparislerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Package className="w-4 h-4 text-cyan-500" /> Siparişler
            </Link>

            <Link href="/favorilerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Star className="w-4 h-4 text-cyan-500" /> Favoriler
            </Link>

            <Link href="/sistemlerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Monitor className="w-4 h-4 text-cyan-500" /> Sistemler
            </Link>

            <Link href="/destek-taleplerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Headphones className="w-4 h-4 text-cyan-500" /> Destek / İade
            </Link>

            <Link href="/siparis-takip" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-cyan-500" /> Sorgula
            </Link>

            <Link href="/adreslerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <MapPin className="w-4 h-4 text-cyan-500" /> Adresler
            </Link>

            <button onClick={() => setKargoPopupAcik(true)} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none relative">
              <Truck className="w-4 h-4 text-cyan-500" /> Kargolar
              {localOrders?.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white shadow-lg">
                  {localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")).length}
                </span>
              )}
            </button>
            
          </div>

          {/* 🚀 BAŞLIK KUTUSU */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 z-40 overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Sipariş Takibi</h1>
                <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                  Güncel kargo ve sipariş durumunuzu öğrenin.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto relative z-50">
              <Link 
                href="/" 
                prefetch={true}
                className="w-full xl:w-auto flex items-center justify-center gap-2 bg-[#020617] hover:bg-slate-800 border border-slate-700 rounded-lg px-4 sm:px-6 py-3 transition-colors text-[10px] sm:text-xs text-white font-black uppercase tracking-widest shadow-lg shrink-0"
              >
                MAĞAZAYA DÖN
              </Link>
            </div>
          </div>

          {/* 🔍 ARAMA FORMU */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3 shadow-xl relative z-10">
            <form onSubmit={sorgula} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={kodu}
                  onChange={(e) => setKodu(e.target.value)}
                  placeholder="Sipariş Kodu (Örn: BPC-118312)"
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-bold tracking-wider text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={yukleniyor}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-xs sm:text-sm px-10 py-4 sm:py-0 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
              >
                {yukleniyor ? "ARANIYOR..." : "SORGULA"}
              </button>
            </form>
          </div>

          {/* ⚠️ HATA BİLDİRİMİ */}
          {hata && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
              <Info className="w-5 h-5" /> {hata}
            </div>
          )}

          {/* 📦 SONUÇ ALANI */}
          {siparis && (
            <div className="flex flex-col gap-5 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {magazaMesaji && (
                <div className="p-5 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <p className="font-black text-amber-500 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                    <Info size={14} /> MAĞAZA MESAJI
                  </p>
                  <p className="font-bold text-sm leading-relaxed">{magazaMesaji}</p>
                </div>
              )}

              {iptalEdildiMi(siparis.durum) ? (
                <div className="p-8 sm:p-12 bg-[#0f172a] border border-slate-800 rounded-2xl text-center shadow-xl">
                  <div className="w-20 h-20 rounded-full bg-[#020617] border border-rose-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(225,29,72,0.1)]">
                    <span className="text-4xl text-rose-500 font-black">×</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3">Sipariş İptal Edildi</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                    Bu sipariş iptal edilmiş görünüyor. Sorularınız için <span className="text-cyan-400 font-bold">0850 305 59 68</span> numaralı hattan bize ulaşabilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
                  <div className="relative flex justify-between items-start">
                    
                    <div className="absolute left-0 top-[21px] sm:top-[29px] w-full h-[4px] sm:h-[6px] bg-[#020617] rounded-full border border-slate-800/50"></div>
                    
                    <div 
                      className="absolute left-0 top-[21px] sm:top-[29px] h-[4px] sm:h-[6px] bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                      style={{ width: `${(aktifAdimBul(siparis.durum) / (adimlar.length - 1)) * 100}%` }}
                    ></div>

                    {adimlar.map((adim, index) => {
                      const aktifAdimNo = aktifAdimBul(siparis.durum);
                      const tamamlandiMi = index <= aktifAdimNo;
                      const suAnkiMi = index === aktifAdimNo;
                      
                      return (
                        <div key={index} className="flex flex-col items-center relative z-10 w-1/4">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            tamamlandiMi ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-[#020617] text-slate-600 border border-slate-800"
                          } ${suAnkiMi && index !== 3 ? "animate-pulse" : ""}`}>
                            {index === 0 && <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />}
                            {index === 1 && <Package className="w-5 h-5 sm:w-6 sm:h-6" />}
                            {index === 2 && <Truck className="w-5 h-5 sm:w-6 sm:h-6" />}
                            {index === 3 && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                          </div>
                          <span className={`mt-3 sm:mt-4 text-[9px] sm:text-xs font-black uppercase tracking-widest text-center px-1 sm:px-2 ${
                            tamamlandiMi ? "text-white" : "text-slate-500"
                          }`}>
                            {adim}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
                
                {/* SOL: SİPARİŞ İÇERİĞİ */}
                <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 border-b border-slate-800/80 pb-6">
                     <div>
                       <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1.5">Takip No</p>
                       <div className="flex items-center gap-3">
                         <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{siparis.siparisKodu}</h2>
                         <button onClick={() => koduKopyala(siparis.siparisKodu)} className="p-2 bg-[#020617] border border-slate-800 hover:bg-slate-800 rounded-xl transition-all" title="Kodu Kopyala">
                           {kopyalandi ? <Check className="text-emerald-400 w-4 h-4" /> : <Copy className="text-slate-400 w-4 h-4" />}
                         </button>
                       </div>

                       {formatliTarih && (
                         <div className="flex items-center gap-2 mt-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                           <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
                           <span>Tarih: <span className="text-white">{formatliTarih}</span></span>
                         </div>
                       )}
                     </div>
                     
                     <div className="sm:text-right bg-[#020617] p-4 rounded-xl border border-slate-800 w-full sm:w-auto">
                       <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1">Güncel Durum</p>
                       <p className={`text-sm sm:text-base font-black uppercase tracking-widest ${iptalEdildiMi(siparis.durum) ? 'text-rose-400' : 'text-cyan-400'}`}>
                         {siparis.durum || "HAZIRLANIYOR"}
                       </p>
                     </div>
                   </div>

                   {siparis.items && siparis.items.length > 0 && (
                    <div className="flex-1">
                      <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-3">PAKET İÇERİĞİ</p>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {siparis.items.map((urun: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 sm:gap-4 bg-[#020617] p-3 rounded-2xl border border-slate-800 group hover:border-cyan-500/30 transition-all shadow-sm">
                            
                            <Link href={"/product/" + (urun.slug || urun.id || urun._id)} prefetch={true} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#0f172a] border border-slate-800 flex-shrink-0 relative block cursor-pointer">
                              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                              {urun.resim || urun.gorsel || urun.image ? (
                                <img 
                                  src={urun.resim || urun.gorsel || urun.image} 
                                  alt={urun.isim || "Ürün"} 
                                  className="w-full h-full object-contain p-1 filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600 group-hover:text-cyan-400 transition-colors"><Package className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                              )}
                            </Link>

                            <div className="flex-1 flex flex-col justify-center min-w-0">
                              <Link href={"/product/" + (urun.slug || urun.id || urun._id)} prefetch={true} className="block w-fit max-w-full">
                                <p className="text-xs sm:text-sm font-black text-slate-200 leading-tight mb-1 hover:text-cyan-400 transition-colors cursor-pointer truncate">
                                  {urun.isim || "Ürün"}
                                </p>
                              </Link>
                              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{urun.adet} ADET</p>
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    </div>
                   )}
                </div>

                {/* SAĞ: WHATSAPP DESTEK */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-[#25D366]"></div>
                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#25D366]/5 blur-[40px] pointer-events-none rounded-full"></div>
                   
                   <div className="w-16 h-16 rounded-full bg-[#020617] flex items-center justify-center mb-5 border border-slate-800 group-hover:scale-110 group-hover:border-[#25D366]/30 transition-all duration-500 shadow-[0_0_20px_rgba(37,211,102,0.1)]">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                     </svg>
                 </div>
                 <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mb-3">WhatsApp Destek</h3>
                 <p className="text-slate-500 text-[10px] sm:text-xs font-medium leading-relaxed mb-6 uppercase tracking-wide">
                   Siparişinizle ilgili her türlü sorunuz için bize ulaşın.
                 </p>
                 <a href="https://wa.me/905327345023" target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-[#25D366] hover:bg-[#20b858] text-black text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] flex justify-center items-center gap-2 relative z-10">
                   DESTEK MERKEZİ
                 </a>
                </div>

              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* 🚀 MİLİMETRİK KARGOLAR POPUP'I */}
      {kargoPopupAcik && (
        <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 relative z-10 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" /> Aktif Kargolarınız
              </h3>
              <button 
                onClick={() => setKargoPopupAcik(false)} 
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white bg-[#020617] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {(() => {
                const kargoSiparisleri = localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo"));
                
                if (kargoSiparisleri.length === 0) {
                  return (
                    <div className="text-center py-10 flex flex-col items-center justify-center relative z-10">
                      <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#020617]">
                        <PackageX className="w-7 h-7 text-slate-600" />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">Şu an yolda olan aktif kargonuz bulunmuyor.</p>
                    </div>
                  );
                }

                return kargoSiparisleri.map((siparis: any, idx: number) => {
                  const siparisKodu = siparis.siparisKodu || siparis.orderNumber || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                  const tarih = siparis.createdAt ? new Date(siparis.createdAt).toLocaleDateString("tr-TR") : siparis.tarih ? new Date(siparis.tarih).toLocaleDateString("tr-TR") : "";
                  const firma = siparis.kargoFirmasi || siparis.shippingCompany || "Belirtilmemiş";
                  const takipNo = siparis.takipNo || siparis.kargoTakipNo || siparis.trackingNumber || "Takip No Girilmemiş";

                  return (
                    <div key={siparis._id || idx} className="bg-[#020617] border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors relative z-10 mb-2">
                      <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                        <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">#{siparisKodu}</span>
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> {tarih}</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Kargo Firması</span>
                          <span className="font-bold text-white px-2 py-1 bg-[#0f172a] rounded-md border border-slate-800">{firma}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Takip Numarası</span>
                          <div className="flex items-center gap-2 px-2 py-1 bg-cyan-950/20 rounded-md border border-cyan-500/20">
                            <span className="font-black text-cyan-400">{takipNo}</span>
                            {takipNo !== "Takip No Girilmemiş" && (
                              <button onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(takipNo);
                                toast.success("Takip numarası kopyalandı!");
                              }} className="text-cyan-600 hover:text-cyan-300 transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
}