"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { Server, ArrowLeft, ShoppingBag, Trash2, Cpu, HardDrive, LayoutGrid, Monitor, Wind, Zap, AlertTriangle } from "lucide-react";

export default function SistemlerimPage() {
  const { sepeteEkle } = useCart();
  // 🚀 ÇIRAK ARTIK SAYFA DAHA ÇİZİLMEDEN RAFA BAKIYOR (SIFIR GECİKME)
  const [sistemler, setSistemler] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const cirakHafizasi = localStorage.getItem("bilgin_kayitli_sistemler");
      if (cirakHafizasi) return JSON.parse(cirakHafizasi);
    }
    return [];
  });

  // 🚀 Veri hafızada varsa, "Yükleniyor" ekranını iptal ediyoruz, saniyesinde açılıyor!
  const [yukleniyor, setYukleniyor] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("bilgin_kayitli_sistemler");
    }
    return true;
  });

  // 🚀 ŞIK SİLME PENCERESİ İÇİN KONTROL (Bunu kaybetmiyoruz)
  const [silinecekSistem, setSilinecekSistem] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    // 🚀 USTA (Bulut Motoru): Çırak ekranı sıfır saniyede doldurdu, usta sadece arkadan sessizce güncel veri var mı diye kontrol ediyor
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

  const handleSepeteEkle = (sistem: any) => {
    const parcalar = Object.values(sistem.selections);
    if (parcalar.length === 0) return;

    parcalar.forEach((urun: any) => {
      sepeteEkle({
        id: urun._id?.toString() || Math.random().toString(), // Garanti ID
        isim: `[${sistem.name}] ${urun.isim}`,
        fiyat: Number(urun.indirimliFiyat || urun.fiyat || 0),
        resim: urun.resim || "https://via.placeholder.com/150",
        varyasyon: "Sistem Parçası",
        havaleIndirimi: urun.havaleIndirimi || 5,
        // 🚀 SAYFAYI ÇÖKERTEN EKSİKLER AŞAĞIDA TAMAMLANDI:
        slug: urun.slug || "sistem-parcasi", // Sepet link arayıp patlamasın diye
        stok: urun.stok || 10 // Sepet stok limiti arayıp hata vermesin diye
      });
    });

    toast.success(`"${sistem.name}" başarıyla sepete eklendi! 🛒`);
  };
  // 🚀 GERÇEK SİLME MOTORU
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
        setSilinecekSistem(null); // Pencereyi kapat
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
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00d2ff] blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/10 pb-6 mb-10">
          <div>
            <Link href="/kendin-topla" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00d2ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> PC ATÖLYESİNE DÖN
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              KAYITLI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3b82f6]">SİSTEMLERİM</span>
            </h1>
          </div>
          <div className="flex items-center bg-[#09090b] text-slate-300 px-5 py-3 rounded-xl border border-white/10 shadow-sm w-max">
            <span className="text-xs font-black uppercase tracking-wider">
              TOPLAM <span className="text-[#00d2ff] text-base mx-1">{sistemler.length}</span> SİSTEM
            </span>
          </div>
        </div>

        {yukleniyor ? (
          <div className="text-center py-20 text-[#00d2ff] font-black uppercase tracking-widest animate-pulse">
            Sistemler Yükleniyor...
          </div>
        ) : sistemler.length === 0 ? (
          <div className="text-center p-12 sm:p-20 bg-[#121215]/50 border border-white/5 rounded-3xl relative">
            <div className="w-24 h-24 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Server className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide mb-3 text-white">Sistemleriniz boş</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
             "Henüz hayalinizdeki bilgisayarı toplayıp kaydetmediniz. PC Atölyesi'ne giderek hemen bir canavar toplayabilirsiniz!"
            </p>
            <Link href="/kendin-topla" className="inline-block bg-[#00d2ff] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:-translate-y-0.5">
              Sistem Toplamaya Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {sistemler.map((sistem) => {
              const parcalar = Object.values(sistem.selections) as any[];
              const toplamFiyat = parcalar.reduce((acc, curr) => acc + Number(curr.indirimliFiyat || curr.fiyat || 0), 0);
              
              return (
                <div key={sistem._id} className="bg-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 shadow-xl transition-all hover:border-[#00d2ff]/30 group">
                  
                  <div className="w-full lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex-1">
                      <div className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-[#00d2ff]" /> Özel Sistem
                      </div>
                      <h2 className="text-2xl font-black text-white leading-tight mb-2 break-words">{sistem.name}</h2>
                      <p className="text-xs text-slate-400 font-medium mb-6">
                        Oluşturulma: {new Date(sistem.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                      
                      <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 mb-0 lg:mb-6">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Toplam Tutar</div>
                        <div className="text-3xl font-black text-[#00d2ff] tracking-tight">
                          {toplamFiyat.toLocaleString("tr-TR")} <span className="text-base text-white">TL</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex flex-col gap-3">
                      <button 
                        onClick={() => handleSepeteEkle(sistem)}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-[#00d2ff] text-black hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] flex justify-center items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
                      </button>
                      <button 
                        onClick={() => setSilinecekSistem({id: sistem._id, name: sistem.name})}
                        className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-zinc-900 border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex justify-center items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Sistemlerimden Sil
                      </button>
                    </div>
                  </div>

          <div className="w-full lg:w-2/3 flex flex-col">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Bileşen Listesi ({parcalar.length} Parça)</h3>
                    
        {/* 🚀 AKILLI OKLU KAYDIRMA SARMALAYICISI (Sensörlü: Konuma Göre Ok Gösterir) */}
                    <div className="relative flex-1 group mt-2">
                      
                      {/* YUKARI OK (Başlangıçta en üstte olduğumuz için gizli) */}
                      {parcalar.length > 4 && (
                        <button 
                          onClick={(e) => {
                            const container = e.currentTarget.parentElement?.querySelector('.bilgin-scroll-alani');
                            container?.scrollBy({ top: -200, behavior: 'smooth' });
                          }}
                          className="up-ok-btn absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center bg-[#09090b]/90 hover:bg-[#00d2ff]/20 border border-white/10 hover:border-[#00d2ff]/50 rounded-full text-slate-400 hover:text-[#00d2ff] backdrop-blur-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none hover:scale-110"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
                        </button>
                      )}

                      {/* LİSTE VE SENSÖR (onScroll ile yukarı/aşağı okları milisaniyede yönetir) */}
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
                          <div key={i} className="flex items-start gap-3 bg-[#121215] p-3 rounded-xl border border-white/5 relative z-10 transition-colors hover:border-white/10">
                            <div className="w-12 h-12 rounded-lg bg-black border border-white/5 p-1 shrink-0 flex items-center justify-center mt-1">
                              {urun.resim ? (
                                <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <Server className="w-5 h-5 text-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[9px] text-[#00d2ff] font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                                {getIconForCategory(urun.kategoriSlug)} {urun.kategoriSlug?.replace("-", " ")}
                              </div>
                              <div className="text-xs font-bold text-white leading-snug mb-1">{urun.isim}</div>
                              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                                {Number(urun.indirimliFiyat || urun.fiyat || 0).toLocaleString("tr-TR")} ₺
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* 💎 LİSTE SONU ELMASI */}
                        {parcalar.length > 0 && (
                          <div className="col-span-1 md:col-span-2 flex items-center justify-center pt-6 pb-2 opacity-50 select-none">
                            <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1"></div>
                            <div className="mx-4 text-[#00d2ff] text-xs drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]">◆</div>
                            <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1"></div>
                          </div>
                        )}
                      </div>

                      {/* AŞAĞI OK (Başlangıçta en üstte olduğumuz için görünür) */}
                      {parcalar.length > 4 && (
                        <button 
                          onClick={(e) => {
                            const container = e.currentTarget.parentElement?.querySelector('.bilgin-scroll-alani');
                            container?.scrollBy({ top: 200, behavior: 'smooth' });
                          }}
                          className="down-ok-btn absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center bg-[#09090b]/90 hover:bg-[#00d2ff]/20 border border-white/10 hover:border-[#00d2ff]/50 rounded-full text-slate-400 hover:text-[#00d2ff] backdrop-blur-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-100 hover:scale-110"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                      )}
                    </div>
                    <div className="flex lg:hidden flex-col gap-3 mt-6 pt-6 border-t border-white/10">
                      <button 
                        onClick={() => handleSepeteEkle(sistem)}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-[#00d2ff] text-black hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] flex justify-center items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
                      </button>
                      <button 
                        onClick={() => setSilinecekSistem({id: sistem._id, name: sistem.name})}
                        className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-zinc-900 border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex justify-center items-center gap-2"
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

      {/* 🚀 ŞIK SİLME ONAY PENCERESİ */}
      {silinecekSistem && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#121214] border border-red-500/20 w-full max-w-sm rounded-3xl p-6 md:p-8 flex flex-col relative shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            
            <div className="w-14 h-14 rounded-full border border-red-500/30 flex items-center justify-center mb-6 bg-red-500/10 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 text-center">SİSTEMİ SİL</h3>
            <p className="text-gray-400 text-xs text-center mb-6 leading-relaxed">
              <strong className="text-white block mb-1">"{silinecekSistem.name}"</strong> 
              Bu sistemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setSilinecekSistem(null)}
                className="flex-1 px-4 py-3.5 rounded-xl text-xs font-black uppercase bg-zinc-800 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                Vazgeç
              </button>
              <button 
                onClick={sistemiKalicOlarakSil}
                className="flex-1 px-4 py-3.5 rounded-xl text-xs font-black uppercase bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 210, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 210, 255, 0.4); }
      `}</style>
    </div>
  );
}