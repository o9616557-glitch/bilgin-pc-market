"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext"; 
import { Trash2, ShoppingCart, ArrowLeft, Banknote, Home } from "lucide-react"; 

export default function SepetSayfasi() {
  const router = useRouter();
  const { sepet, sepetiTemizle, sepettenSil, adetGuncelle } = useCart();
  const [urunToDelete, setUrunToDelete] = useState<any | null>(null);

  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = (araToplam > 5000 || araToplam === 0) ? 0 : 1; 
  
  const toplamHavaleIndirimi = sepet.reduce((toplam: number, urun: any) => {
    const oran = (urun.havaleIndirimi !== undefined && urun.havaleIndirimi !== null) ? Number(urun.havaleIndirimi) : 0;
    return toplam + ((urun.fiyat * urun.adet) * oran) / 100;
  }, 0);

  const genelToplam = araToplam + kargo;
  const havaleliToplam = genelToplam - toplamHavaleIndirimi;

  if (sepet.length === 0) {
    return (
      <div className="min-h-screen site-page flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center p-8 sm:p-16 bg-transparent relative flex flex-col items-center site-content-in">
          <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center mb-6">
             <ShoppingCart className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="site-h2 mb-3">
            Sepetiniz henüz <span className="site-accent-text">boş</span>
          </h2>
          <p className="site-body max-w-sm mx-auto mb-8">
            Sepetinizde henüz hiçbir donanım bulunmuyor. Sisteminizi güçlendirecek en iyi teknolojileri keşfetmek için mağazamıza göz atabilirsiniz.
          </p>
          <Link href="/" prefetch={true} className="btn-primary uppercase tracking-wide text-xs sm:text-sm">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen site-page pb-12 relative">
      <div className="glass-panel border-b border-white/[0.06] sticky top-0 z-50 shadow-lg mb-6 sm:mb-8 rounded-none">
        <div className="site-container-narrow py-4 flex items-center justify-between">
          <Link href="/" className="group flex items-center transition-all" title="Ana Sayfaya Dön">
            <div className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-site-accent hover:bg-white/5 transition-all duration-200">
              <Home className="w-5 h-5" />
            </div>
            <div className="hidden md:flex items-center gap-2 site-label text-slate-400 group-hover:text-site-accent transition-all normal-case">
              <ArrowLeft className="w-4 h-4" /> Mağazaya geri dön
            </div>
          </Link>
          <Link href="/" prefetch={true} className="text-xl sm:text-2xl font-semibold tracking-tight text-white hover:opacity-80 transition-opacity">
            BİLGİN <span className="site-accent-text">PC</span>
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-400 site-label normal-case bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span>🔒</span> <span className="hidden sm:inline">Güvenli alışveriş</span>
          </div>
        </div>
      </div>

      <div className="site-container-narrow site-content-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 gap-4 mt-2 border-b border-white/[0.06]">
          <h1 className="site-h2 mb-0 border-l-4 border-site-accent-strong pl-4">
            Alışveriş <span className="site-accent-text">sepetim</span>
          </h1>
          {sepetiTemizle && (
            <button onClick={sepetiTemizle} className="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-rose-400 bg-[#121215] border border-white/10 hover:border-rose-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all uppercase tracking-wider shrink-0 w-max self-end sm:self-auto">
              Sepeti Temizle
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {sepet.map((urun: any, index: number) => {
              const urunToplamFiyat = urun.fiyat * urun.adet;

              return (
                <div key={index} className="flex flex-col sm:flex-row items-center sm:items-stretch bg-[#09090b] border border-white/5 rounded-2xl p-4 gap-4 transition-all hover:border-[#3b82f6]/30 shadow-sm">
                  
             {/* 🚀 BİNGO: Adres /product/ klasörüne ve slug (isim) yapısına göre uyarlandı */}
                  <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-[#121215] rounded-xl border border-white/10 flex items-center justify-center p-2 shadow-inner">
                    <Link href={`/product/${urun.slug}`} className="w-full h-full flex items-center justify-center hover:opacity-80 transition-opacity">
                      <img src={urun.resim || "/placeholder.jpg"} alt={urun.isim} className="max-w-full max-h-full object-contain cursor-pointer" />
                    </Link>
                  </div>
                  
                  <div className="flex-1 flex flex-col text-center sm:text-left w-full justify-center">
                    <Link href={`/product/${urun.slug}`} className="hover:text-[#3b82f6] transition-colors cursor-pointer">
                      <h3 className="font-bold text-sm sm:text-base text-white mb-1.5 leading-snug break-words">{urun.isim}</h3>
                    </Link>
                    {urun.varyasyon && !urun.varyasyon.toLowerCase().includes("standart") && (
                      <div className="flex justify-center sm:justify-start mb-2">
                         <span className="text-[#3b82f6] text-[10px] sm:text-xs font-bold bg-[#3b82f6]/10 px-2 py-1 rounded border border-[#3b82f6]/20 tracking-wide">{urun.varyasyon}</span>
                      </div>
                    )}
                    <div className="text-lg sm:text-xl font-black mt-1 text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                      {urunToplamFiyat.toLocaleString("tr-TR")} <span className="text-xs sm:text-sm text-white font-bold">TL</span>
                    </div>
                  </div>
                  
                  {/* 🚀 BİNGO: PC'de çöp kutusu ve miktar butonu yan yana (sm:flex-row yapıldı) */}
                  <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-3 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-none">
                    <div className="flex items-center bg-[#121215] border border-white/10 rounded-xl p-1 shadow-inner h-11">
                      <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} className="w-8 h-full sm:w-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all font-medium text-lg">-</button>
                      <span className="font-black w-8 text-center text-white text-sm sm:text-base">{urun.adet}</span>
                      <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} className="w-8 h-full sm:w-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all font-medium text-lg">+</button>
                    </div>
                    <button onClick={() => setUrunToDelete(urun)} className="w-11 h-11 flex items-center justify-center text-slate-400 bg-[#121215] border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 rounded-xl transition-all shrink-0" title="Sepetten Çıkar">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-1/3 sticky top-28">
            <div className="bg-[#09090b] border border-white/5 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl">
              <h2 className="font-black text-lg sm:text-xl mb-5 pb-3 border-b border-white/10 text-white uppercase tracking-wider">
                Sipariş <span className="text-[#3b82f6]">Özeti</span>
              </h2>
              
              <div className="flex justify-between text-slate-400 mb-3 sm:mb-4 font-medium text-xs sm:text-sm">
                <span>Ara Toplam</span>
                <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
              </div>
              
              <div className="flex justify-between text-slate-400 mb-5 sm:mb-6 font-medium text-xs sm:text-sm">
                <span>Kargo Ücreti</span>
                <span>{kargo === 0 ? <span className="text-emerald-400 font-black uppercase tracking-wider text-[10px] sm:text-xs bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">Ücretsiz</span> : <span className="text-white font-bold">{kargo} TL</span>}</span>
              </div>

              <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-5 sm:pt-6 mb-5">
                <span className="text-xs sm:text-sm uppercase tracking-wider text-slate-400">Genel Toplam</span>
                <span className="text-xl sm:text-2xl lg:text-3xl text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  {genelToplam.toLocaleString("tr-TR")} <span className="text-xs sm:text-sm text-white font-bold">TL</span>
                </span>
              </div>

              {toplamHavaleIndirimi > 0 && (
                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 relative overflow-hidden transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981] blur-[50px] opacity-20 pointer-events-none"></div>
                  <div className="flex flex-col gap-1.5 relative z-10">
                    <div className="flex items-center gap-1.5 text-[#10b981]">
                      <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-black text-xs sm:text-sm uppercase tracking-wider">Havale / EFT İle</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#10b981] text-right drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      {havaleliToplam.toLocaleString("tr-TR")} <span className="text-sm">TL</span>
                    </div>
                  </div>
                </div>
              )}

              <Link href="/odeme" className="block w-full">
                <button className="w-full bg-[#3b82f6] text-white font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm hover:bg-[#2563eb] transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                  Güvenli Ödemeye Geç
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {urunToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center mb-4 bg-[#121215] shadow-inner">
              <Trash2 className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Ürünü Sil</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Bu ürünü sepetinizden çıkarmak istediğinize emin misiniz?</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setUrunToDelete(null)} className="flex-1 bg-[#121215] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">
                İptal
              </button>
              <button onClick={() => { sepettenSil(urunToDelete.id, urunToDelete.varyasyon); setUrunToDelete(null); }} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg">
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}