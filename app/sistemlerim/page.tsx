"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { 
  Server, ArrowLeft, ShoppingBag, Trash2, Cpu, HardDrive, 
  LayoutGrid, Monitor, Wind, Zap, AlertTriangle, User, ShieldCheck, CreditCard,
  MapPin, Package, Star, Headphones, Search, Truck, PackageX, Calendar, Copy, Check
} from "lucide-react";
import { useOrders } from "@/app/OrderContext";
import KisayolNav from "@/components/layout/KisayolNav";

export default function SistemlerimPage() {
  const { sepeteEkle } = useCart();
  
  const [sistemler, setSistemler] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const cirakHafizasi = localStorage.getItem("bilgin_kayitli_sistemler");
      if (cirakHafizasi) return JSON.parse(cirakHafizasi);
    }
    return [];
  });

  const [yukleniyor, setYukleniyor] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("bilgin_kayitli_sistemler");
    }
    return true;
  });

  const [silinecekSistem, setSilinecekSistem] = useState<{id: string, name: string} | null>(null);

  // 🚀 KARGO POPUP VE SİPARİŞ MOTORU
  const [kargoPopupAcik, setKargoPopupAcik] = useState(false);
  const { orders: localOrders } = useOrders();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 🚀 EKRAN DONDURMA (Modal / Kargo Popup Açılınca Arka Planı Kilitler)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (silinecekSistem || kargoPopupAcik) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [silinecekSistem, kargoPopupAcik]);

  useEffect(() => {
    const sessizGuncelleme = async () => {
      try {
        const res = await fetch("/api/sistemlerim?t=" + new Date().getTime());
        const data = await res.json();
        if (res.ok && data.success) {
          const yeniDurum = JSON.stringify(data.systems);
          const eskiDurum = localStorage.getItem("bilgin_kayitli_sistemler");
          
          if (eskiDurum !== yeniDurum) {
            setSistemler(data.systems);
            localStorage.setItem("bilgin_kayitli_sistemler", yeniDurum);
          }
        }
      } catch (error) {
      } finally {
        setYukleniyor(false);
      }
    };

    sessizGuncelleme();
  }, []);

  const handleCopy = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSepeteEkle = async (sistem: any) => {
    const parcalar = Object.values(sistem.selections);
    if (parcalar.length === 0) return;

    const toastId = toast.loading(`📦 "${sistem.name}" parçaları sepete zırhlanarak yükleniyor... Lütfen sayfadan ayrılmayın!`);

    for (const urun of parcalar as any[]) {
      sepeteEkle({
        id: urun._id?.toString() || Math.random().toString(),
        isim: `[${sistem.name}] ${urun.isim}`,
        fiyat: Number(urun.indirimliFiyat || urun.fiyat || 0),
        resim: urun.resim || "https://via.placeholder.com/150",
        varyasyon: "Sistem Parçası",
        havaleIndirimi: urun.havaleIndirimi || 5,
        slug: urun.slug || urun._id?.toString() || Math.random().toString(),
        stok: urun.stok || 10
      }, true); 

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
      const sonSepet = JSON.parse(localStorage.getItem("bilgin-sepet") || "[]");
      await fetch("/api/sepet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: sonSepet })
      });
    } catch (error) {
    }

    toast.success(`"${sistem.name}" canavarı sepete eksiksiz yüklendi! Artık sepetinize gidebilirsiniz. 🛒`, { id: toastId });
  };

  const sistemiKalicOlarakSil = async () => {
    if (!silinecekSistem) return;
    
    const toastId = toast.loading("Sistem arşivden siliniyor...");
    try {
      const res = await fetch("/api/sistemlerim", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: silinecekSistem.id })
      });
      if(res.ok) {
        toast.success("Sistem başarıyla silindi!", { id: toastId });
        setSistemler(prev => prev.filter(s => s._id !== silinecekSistem.id));
        setSilinecekSistem(null);
      } else {
        toast.error("Silinemedi, tekrar deneyin.", { id: toastId });
      }
    } catch(e) {
      toast.error("Bağlantı hatası oluştu.", { id: toastId });
    }
  }

  const getIconForCategory = (kategori: string) => {
    switch (kategori) {
      case "islemci": return <Cpu className="w-3 h-3" />;
      case "ekran-karti": return <Monitor className="w-3 h-3" />;
      case "ram": case "anakart": case "kasa": return <LayoutGrid className="w-3 h-3" />;
      case "ssd": return <HardDrive className="w-3 h-3" />;
      case "sogutma": return <Wind className="w-3 h-3" />;
      case "psu": return <Zap className="w-3 h-3" />;
      default: return <Server className="w-3 h-3" />;
    }
  };

  return (
    <div className="site-page p-4 sm:p-6 lg:p-8 relative overflow-clip">
      <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[280px]" />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start site-content-in">
        
        {/* ⬅️ SOL MENÜ */}
        <KisayolNav active="sistemler" />

        {/* ➡️ SAĞ İÇERİK */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full animate-in fade-in duration-300">
        
          {/* 🚀 BAŞLIK KUTUSU (Diğer sayfalar ile aynı: rounded-xl, p-5 sm:p-6, flex-row) */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 z-40 overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <Server className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Kayıtlı Sistemlerim</h1>
                <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                  Toplam: <span className="font-black text-cyan-400">{sistemler.length}</span> Sistem
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto relative z-50">
              <Link 
                href="/kendin-topla" 
                className="w-full xl:w-auto flex items-center justify-center gap-2 bg-[#020617] hover:bg-slate-800 border border-slate-700 rounded-lg px-4 sm:px-6 py-3 transition-colors text-[10px] sm:text-xs text-white font-black uppercase tracking-widest shadow-lg shrink-0"
              >
                PC ATÖLYESİNE DÖN
              </Link>
            </div>
          </div>

          {yukleniyor ? (
            <div className="text-center py-20 text-cyan-400 font-black uppercase tracking-widest animate-pulse bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl">
              Sistemler Yükleniyor...
            </div>
          ) : sistemler.length === 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <Server className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Sistemleriniz Boş</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
                Henüz hayalinizdeki bilgisayarı toplayıp kaydetmediniz. PC Atölyesi'ne giderek hemen bir canavar toplayabilirsiniz!
              </p>
              <Link 
                href="/kendin-topla" 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Sistem Toplamaya Başla
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {sistemler.map((sistem) => {
                const parcalar = Object.values(sistem.selections) as any[];
                const toplamFiyat = parcalar.reduce((acc, curr) => acc + Number(curr.indirimliFiyat || curr.fiyat || 0), 0);
                
                return (
                  <div key={sistem._id} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 shadow-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] group">
                    
                    <div className="w-full lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-8">
                      <div className="flex-1">
                        <div className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                          <Server className="w-3.5 h-3.5 text-cyan-400" /> Özel Sistem
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 break-words group-hover:text-cyan-400 transition-colors">{sistem.name}</h2>
                        <p className="text-xs text-slate-400 font-medium mb-6">
                          Oluşturulma: {new Date(sistem.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                        
                        <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5 mb-0 lg:mb-6 shadow-inner">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Toplam Tutar</div>
                          <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                            {toplamFiyat.toLocaleString("tr-TR")} <span className="text-base text-slate-400">TL</span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden lg:flex flex-col gap-3">
                        <button 
                          onClick={() => handleSepeteEkle(sistem)}
                          className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex justify-center items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
                        </button>
                        <button 
                          onClick={() => setSilinecekSistem({id: sistem._id, name: sistem.name})}
                          className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-[#020617] border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex justify-center items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Sistemlerimden Sil
                        </button>
                      </div>
                    </div>

                    <div className="w-full lg:w-2/3 flex flex-col">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-2 flex items-center gap-2">
                        Bileşen Listesi 
                        <span className="bg-slate-800 text-white px-2 py-0.5 rounded-md text-[10px]">{parcalar.length} Parça</span>
                      </h3>
                      
                      <div className="relative flex-1 group mt-2">
                        
                        {parcalar.length > 4 && (
                          <button 
                            onClick={(e) => {
                              const container = e.currentTarget.parentElement?.querySelector('.bilgin-scroll-alani');
                              container?.scrollBy({ top: -200, behavior: 'smooth' });
                            }}
                            className="up-ok-btn absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center bg-[#020617]/90 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 rounded-full text-slate-400 hover:text-cyan-400 backdrop-blur-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none hover:scale-110"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
                          </button>
                        )}

                        <div 
                          className="bilgin-scroll-alani grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pb-12 pt-1 px-1 items-start content-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                          onScroll={(e) => {
                            const el = e.currentTarget;
                            const isTop = el.scrollTop <= 5;
                            const isBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 5; 
                            
                            const container = el.parentElement;
                            const upBtn = container?.querySelector('.up-ok-btn') as HTMLElement | null;
                            const downBtn = container?.querySelector('.down-ok-btn') as HTMLElement | null;

                            if (upBtn) {
                              upBtn.style.opacity = isTop ? '0' : '1';
                              upBtn.style.pointerEvents = isTop ? 'none' : 'auto';
                            }
                            if (downBtn) {
                              downBtn.style.opacity = isBottom ? '0' : '1';
                              downBtn.style.pointerEvents = isBottom ? 'none' : 'auto';
                            }
                          }}
                        >
                          {parcalar.map((urun: any, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-[#020617] p-3 rounded-xl border border-slate-800 relative z-10 transition-colors hover:border-cyan-500/30">
                              <div className="w-12 h-12 rounded-lg bg-[#0f172a] border border-slate-800 p-1 shrink-0 flex items-center justify-center mt-1">
                                {urun.resim ? (
                                  <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                                ) : (
                                  <Server className="w-5 h-5 text-slate-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[9px] text-cyan-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                                  {getIconForCategory(urun.kategoriSlug)} {urun.kategoriSlug?.replace("-", " ")}
                                </div>
                                <div className="text-xs font-bold text-slate-200 leading-snug mb-1 truncate" title={urun.isim}>{urun.isim}</div>
                                <div className="text-[10px] text-cyan-400/80 font-bold mt-0.5">
                                  {Number(urun.indirimliFiyat || urun.fiyat || 0).toLocaleString("tr-TR")} ₺
                                </div>
                              </div>
                            </div>
                          ))}

                          {parcalar.length > 0 && (
                            <div className="col-span-1 md:col-span-2 flex items-center justify-center pt-6 pb-2 opacity-50 select-none">
                              <div className="h-px bg-gradient-to-r from-transparent to-slate-700 flex-1"></div>
                              <div className="mx-4 text-cyan-500/50 text-xs drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">◆</div>
                              <div className="h-px bg-gradient-to-l from-transparent to-slate-700 flex-1"></div>
                            </div>
                          )}
                        </div>

                        {parcalar.length > 4 && (
                          <button 
                            onClick={(e) => {
                              const container = e.currentTarget.parentElement?.querySelector('.bilgin-scroll-alani');
                              container?.scrollBy({ top: 200, behavior: 'smooth' });
                            }}
                            className="down-ok-btn absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center bg-[#020617]/90 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 rounded-full text-slate-400 hover:text-cyan-400 backdrop-blur-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-100 hover:scale-110"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                        )}
                      </div>

                      <div className="flex lg:hidden flex-col gap-3 mt-6 pt-6 border-t border-slate-800/80">
                        <button 
                          onClick={() => handleSepeteEkle(sistem)}
                          className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex justify-center items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
                        </button>
                        <button 
                          onClick={() => setSilinecekSistem({id: sistem._id, name: sistem.name})}
                          className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-[#020617] border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex justify-center items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Sistemlerimden Sil
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🚀 SİSTEM SİLME ONAY MODALI */}
      {silinecekSistem && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            
            <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-5 relative z-10">
              <AlertTriangle className="w-7 h-7 text-red-400 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10">SİSTEMİ SİL</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed relative z-10">
              <strong className="text-white block mb-1">"{silinecekSistem.name}"</strong> 
              Bu sistemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex w-full gap-3 relative z-10">
              <button 
                onClick={() => setSilinecekSistem(null)}
                className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                İptal
              </button>
              <button 
                onClick={sistemiKalicOlarakSil}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

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
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {tarih}</span>
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
                              <button onClick={(e) => handleCopy(takipNo, e)} className="text-cyan-600 hover:text-cyan-300 transition-colors">
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

    </div>
  );
}