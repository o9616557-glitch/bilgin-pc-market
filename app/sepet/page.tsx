"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { Trash2, ShoppingCart, ArrowLeft, Banknote, Home, Minus, Plus } from "lucide-react";

export default function SepetSayfasi() {
  const { sepet, sepetiTemizle, sepettenSil, adetGuncelle } = useCart();
  const [urunToDelete, setUrunToDelete] = useState<any | null>(null);

  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + urun.fiyat * urun.adet, 0);
  const kargo = araToplam > 5000 || araToplam === 0 ? 0 : 1;

  const toplamHavaleIndirimi = sepet.reduce((toplam: number, urun: any) => {
    const oran = urun.havaleIndirimi !== undefined && urun.havaleIndirimi !== null ? Number(urun.havaleIndirimi) : 0;
    return toplam + (urun.fiyat * urun.adet * oran) / 100;
  }, 0);

  const genelToplam = araToplam + kargo;
  const havaleliToplam = genelToplam - toplamHavaleIndirimi;

  if (sepet.length === 0) {
    return (
      <div className="min-h-screen site-page flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center p-8 sm:p-12 glass-card max-w-md w-full site-content-in">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 mx-auto">
            <ShoppingCart className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="site-h2 mb-2">Sepetiniz boş</h2>
          <p className="site-body mb-8">Henüz ürün eklenmedi. Mağazadan ürün seçerek başlayabilirsiniz.</p>
          <Link href="/" prefetch={true} className="btn-primary w-full sm:w-auto">
            Alışverişe başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen site-page pb-12 relative">
      <div className="glass-panel border-b border-white/[0.06] sticky top-0 z-50 mb-6 sm:mb-8 rounded-none">
        <div className="site-container-narrow py-3.5 sm:py-4 flex items-center justify-between">
          <Link href="/" className="group flex items-center transition-all" title="Ana Sayfaya Dön">
            <div className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-site-accent hover:bg-white/5 transition-all">
              <Home className="w-5 h-5" />
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 group-hover:text-site-accent transition-all">
              <ArrowLeft className="w-4 h-4" /> Mağazaya dön
            </div>
          </Link>
          <Link href="/" prefetch={true} className="text-lg sm:text-xl font-semibold tracking-tight text-white hover:opacity-80 transition-opacity">
            BİLGİN <span className="site-accent-text">PC</span>
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span>🔒</span> <span className="hidden sm:inline">Güvenli alışveriş</span>
          </div>
        </div>
      </div>

      <div className="site-container-narrow site-content-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 gap-3">
          <h1 className="site-h2 mb-0">Alışveriş sepetim</h1>
          {sepetiTemizle && (
            <button
              onClick={sepetiTemizle}
              className="text-xs font-medium text-slate-400 hover:text-rose-400 bg-white/[0.03] border border-white/[0.08] hover:border-rose-500/30 px-3 py-2 rounded-lg transition-all shrink-0"
            >
              Sepeti temizle
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="w-full lg:w-2/3 flex flex-col gap-3 sm:gap-4">
            {sepet.map((urun: any, index: number) => {
              const urunToplamFiyat = urun.fiyat * urun.adet;

              return (
                <div
                  key={index}
                  className="glass-card p-3.5 sm:p-4 flex gap-3 sm:gap-4 items-start hover:border-site-accent/20 transition-colors"
                >
                  <Link
                    href={`/product/${urun.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white/[0.03] rounded-xl border border-white/[0.06] flex items-center justify-center p-2"
                  >
                    <img
                      src={urun.resim || "/placeholder.jpg"}
                      alt={urun.isim}
                      className="max-w-full max-h-full object-contain"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/product/${urun.slug}`} className="hover:text-site-accent transition-colors">
                          <h3 className="font-medium text-sm sm:text-base text-white leading-snug line-clamp-2">{urun.isim}</h3>
                        </Link>
                        {urun.varyasyon && !urun.varyasyon.toLowerCase().includes("standart") && (
                          <span className="inline-block mt-1.5 text-[10px] sm:text-xs font-medium text-site-accent bg-site-accent/10 px-2 py-0.5 rounded-md border border-site-accent/20">
                            {urun.varyasyon}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setUrunToDelete(urun)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all shrink-0"
                        title="Sepetten çıkar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-auto">
                      <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-lg p-0.5">
                        <button
                          onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold w-8 text-center text-white text-sm">{urun.adet}</span>
                        <button
                          onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-base sm:text-lg font-semibold text-site-accent tabular-nums">
                        {urunToplamFiyat.toLocaleString("tr-TR")} <span className="text-xs text-slate-400 font-medium">TL</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-1/3 lg:sticky lg:top-28">
            <div className="glass-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white mb-4 pb-3 border-b border-white/[0.06]">
                Sipariş özeti
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Ara toplam</span>
                  <span className="text-white font-medium tabular-nums">{araToplam.toLocaleString("tr-TR")} TL</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Kargo</span>
                  <span>
                    {kargo === 0 ? (
                      <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                        Ücretsiz
                      </span>
                    ) : (
                      <span className="text-white font-medium tabular-nums">{kargo} TL</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/[0.06] pt-4 mt-4 mb-4">
                <span className="text-sm text-slate-400">Genel toplam</span>
                <span className="text-xl sm:text-2xl font-semibold text-site-accent tabular-nums">
                  {genelToplam.toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span>
                </span>
              </div>

              {toplamHavaleIndirimi > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <Banknote className="w-4 h-4 shrink-0" />
                      <span>Havale / EFT ile</span>
                    </div>
                    <span className="text-lg font-semibold text-emerald-400 tabular-nums">
                      {havaleliToplam.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                </div>
              )}

              <Link href="/odeme" prefetch className="block w-full">
                <button className="btn-primary w-full py-3.5 text-sm">Güvenli ödemeye geç</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {urunToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card p-6 sm:p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ürünü kaldır</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Bu ürünü sepetten çıkarmak istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setUrunToDelete(null)}
                className="flex-1 btn-ghost py-3 text-sm"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  sepettenSil(urunToDelete.id, urunToDelete.varyasyon);
                  setUrunToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-sm font-medium transition-colors"
              >
                Kaldır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
