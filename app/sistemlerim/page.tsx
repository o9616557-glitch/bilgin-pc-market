"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { Server, ArrowLeft, ShoppingBag, Trash2, Cpu, HardDrive, LayoutGrid, Monitor, Wind, Zap } from "lucide-react";

export default function SistemlerimPage() {
  const { sepeteEkle } = useCart();
  const [sistemler, setSistemler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const sistemleriGetir = async () => {
    try {
      const res = await fetch("/api/sistemlerim");
      const data = await res.json();
      if (res.ok && data.success) {
        setSistemler(data.systems);
      }
    } catch (error) {
      toast.error("Sistemler yüklenirken hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    sistemleriGetir();
  }, []);

  const handleSepeteEkle = (sistem: any) => {
    const parcalar = Object.values(sistem.selections);
    if (parcalar.length === 0) return;

    parcalar.forEach((urun: any) => {
      sepeteEkle({
        id: urun._id?.toString(),
        isim: `[${sistem.name}] ${urun.isim}`,
        fiyat: Number(urun.indirimliFiyat || urun.fiyat || 0),
        resim: urun.resim || "https://via.placeholder.com/150",
        varyasyon: "Sihirbaz Parçası",
        havaleIndirimi: urun.havaleIndirimi || 5
      });
    });

    toast.success(`"${sistem.name}" başarıyla sepete eklendi! 🛒`);
  };

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
        
        {/* ÜST BAŞLIK */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/10 pb-6 mb-10">
          <div>
            <Link href="/kendin-topla" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00d2ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> PC SİHİRBAZINA DÖN
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              KAYITLI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3b82f6]">SİSTEMLERİM</span>
            </h1>
          </div>
          <div className="flex items-center bg-[#09090b] text-slate-300 px-5 py-3 rounded-xl border border-white/10 shadow-sm w-max">
            <span className="text-xs font-black uppercase tracking-wider">
              TOPLAM <span className="text-[#00d2ff] text-base mx-1">{sistemler.length}</span> GARAJ
            </span>
          </div>
        </div>

        {/* İÇERİK KISMI */}
        {yukleniyor ? (
          <div className="text-center py-20 text-[#00d2ff] font-black uppercase tracking-widest animate-pulse">
            Sistemler Yükleniyor...
          </div>
        ) : sistemler.length === 0 ? (
          <div className="text-center p-12 sm:p-20 bg-[#121215]/50 border border-white/5 rounded-3xl relative">
            <div className="w-24 h-24 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Server className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide mb-3 text-white">Garajınız Bomboş</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
              Henüz hayalinizdeki bilgisayarı toplayıp kaydetmediniz. PC Sihirbazı'na giderek hemen bir canavar yaratabilirsiniz!
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
                <div key={sistem._id} className="bg-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8 shadow-xl transition-all hover:border-[#00d2ff]/30 group">
                  
                  {/* SOL: SİSTEM BİLGİLERİ VE BUTONLAR */}
                  <div className="w-full lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex-1">
                      <div className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-[#00d2ff]" /> Özel Sistem
                      </div>
                      <h2 className="text-2xl font-black text-white leading-tight mb-2 break-words">{sistem.name}</h2>
                      <p className="text-xs text-slate-400 font-medium mb-6">
                        Oluşturulma: {new Date(sistem.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                      
                      <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 mb-6">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Toplam Tutar</div>
                        <div className="text-3xl font-black text-[#00d2ff] tracking-tight">
                          {toplamFiyat.toLocaleString("tr-TR")} <span className="text-base text-white">TL</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => handleSepeteEkle(sistem)}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-[#00d2ff] text-black hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] flex justify-center items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
                      </button>
                      <button 
                        className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-zinc-900 border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex justify-center items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Garajdan Sil
                      </button>
                    </div>
                  </div>

                  {/* SAĞ: PARÇA LİSTESİ */}
                  <div className="w-full lg:w-2/3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Bileşen Listesi ({parcalar.length} Parça)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {parcalar.map((urun: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-[#121215] p-3 rounded-xl border border-white/5">
                          <div className="w-12 h-12 rounded-lg bg-black border border-white/5 p-1 shrink-0 flex items-center justify-center">
                            {urun.resim ? (
                              <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <Server className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] text-[#00d2ff] font-black uppercase tracking-wider mb-0.5 flex items-center gap-1">
                              {getIconForCategory(urun.kategoriSlug)} {urun.kategoriSlug?.replace("-", " ")}
                            </div>
                            <div className="text-xs font-bold text-white truncate">{urun.isim}</div>
                            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                              {Number(urun.indirimliFiyat || urun.fiyat || 0).toLocaleString("tr-TR")} ₺
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 210, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 210, 255, 0.4); }
      `}</style>
    </div>
  );
}