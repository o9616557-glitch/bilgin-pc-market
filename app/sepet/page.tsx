"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext"; 
import { Trash2, ShoppingCart, ArrowLeft, Banknote } from "lucide-react"; 

export default function SepetSayfasi() {
  const router = useRouter();
  const { sepet, sepetiTemizle, sepettenSil, adetGuncelle } = useCart();
  const [urunToDelete, setUrunToDelete] = useState<any | null>(null);

  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = (araToplam > 5000 || araToplam === 0) ? 0 : 150;
  
  const toplamHavaleIndirimi = sepet.reduce((toplam: number, urun: any) => {
    const oran = (urun.havaleIndirimi !== undefined && urun.havaleIndirimi !== null) ? Number(urun.havaleIndirimi) : 0;
    return toplam + ((urun.fiyat * urun.adet) * oran) / 100;
  }, 0);

  const genelToplam = araToplam + kargo;
  const havaleliToplam = genelToplam - toplamHavaleIndirimi;

  if (sepet.length === 0) {
  return (
    <div className="min-h-[80vh] bg-[#050814] flex flex-col items-center justify-center px-4 relative z-10">
      <div className="text-center p-10 sm:p-16 bg-transparent relative flex flex-col items-center">
        
        {/* JİLET İKON KUTUSU */}
        <div className="w-20 h-20 rounded-full bg-[#121215]/80 border border-slate-800/50 flex items-center justify-center mb-6 shadow-inner">
           <ShoppingCart className="w-10 h-10 text-slate-500" />
        </div>
        
        {/* YENİ BAŞLIK VE METİN */}
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-3 text-white">
          SEPETİNİZ HENÜZ <span className="text-[#00e5ff]">BOŞ</span>
        </h2>
        
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
          Sepetinizde henüz hiçbir donanım bulunmuyor. Sisteminizi güçlendirecek en iyi teknolojileri keşfetmek için mağazamıza göz atabilirsiniz.
        </p>
        
        {/* SİBER BUTON */}
        <Link
          href="/"
          prefetch={true}
          className="bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#00c4db] transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
        >
          ALIŞVERİŞE BAŞLA
        </Link>
        
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#050814] text-white pb-12 relative">
      
      {/* 🚀 MİNİMAL GÜVENLİ SEPET BARI (Artık Alt İçerikle Aynı Hizada) */}
      <div className="border-b border-slate-800 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50 shadow-lg mb-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Sol: Mağazaya Güvenli Dönüş Kapısı */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-[#00e5ff] transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer p-0"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Geri Dön</span>
          </button>
          
          {/* Orta: Tıklanabilir Logo */}
          <Link href="/" className="font-black text-xl sm:text-2xl tracking-tight text-white hover:opacity-80 transition-opacity">
            BİLGİN <span className="text-[#00e5ff]">PC</span>
          </Link>

          {/* Sağ: Güvenlik Rozeti */}
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span>🔒</span> <span className="hidden sm:inline">Güvenli Alışveriş</span>
          </div>
        </div>
      </div>

      {/* 🚀 ANA İÇERİK (YAN YANA DİZİLİM MOTORU EKLENDİ) */}
      <div className="ana-konteynir" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* ALIŞVERİŞ SEPETİM BAŞLIĞI */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-4 gap-4 mt-2 border-b border-slate-800">
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white drop-shadow-md border-l-4 border-[#00e5ff] pl-4 m-0">
            ALIŞVERİŞ <span className="text-[#00e5ff] font-black">SEPETİM</span>
          </h1>
          {sepetiTemizle && (
            <button onClick={sepetiTemizle} className="text-sm font-semibold text-slate-400 hover:text-red-400 bg-slate-800/50 border border-slate-700/50 py-2 px-4 rounded-xl transition-all">
              Sepeti Temizle
            </button>
          )}
        </div>

        {/* 🚀 İŞTE IZGARA YAPISI (Masaüstü Yan Yana, Mobil Alt Alta) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SOL TARAF: ÜRÜN LİSTESİ */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {sepet.map((urun: any, index: number) => {
              const urunToplamFiyat = urun.fiyat * urun.adet;

              return (
                <div key={index} className="flex flex-col sm:flex-row items-center bg-[#09090b] border border-slate-800/50 rounded-2xl p-4 gap-4 transition-all hover:border-[#00e5ff]/30">
                  <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-[#121215] rounded-xl border border-slate-800 flex items-center justify-center p-2">
                    <img src={urun.resim || "/placeholder.jpg"} alt={urun.isim} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col text-center sm:text-left w-full">
                    <h3 className="font-bold text-lg text-white mb-1 leading-tight">{urun.isim}</h3>
                    {urun.varyasyon && !urun.varyasyon.toLowerCase().includes("standart") && (
                      <p className="text-[#00e5ff] text-xs font-semibold mb-2 bg-[#00e5ff]/10 inline-block self-center sm:self-start px-2 py-0.5 rounded border border-[#00e5ff]/20">{urun.varyasyon}</p>
                    )}
                    
                    <div className="text-xl font-black mt-2 sm:mt-auto tracking-tight text-white">
                      {urunToplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-800/50 sm:border-none">
                    <div className="flex items-center bg-[#121215] border border-slate-800 rounded-xl p-1">
                      <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] hover:bg-slate-800 rounded-lg transition-all text-xl font-medium">-</button>
                      <span className="font-black w-8 text-center text-white text-base">{urun.adet}</span>
                      <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] hover:bg-slate-800 rounded-lg transition-all text-xl font-medium">+</button>
                    </div>
                    <button onClick={() => setUrunToDelete(urun)} className="w-11 h-11 flex items-center justify-center text-slate-400 bg-slate-800/50 border border-slate-700/50 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl transition-all shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SAĞ TARAF: SİPARİŞ ÖZETİ (Sabit Durur) */}
          <div className="w-full lg:w-1/3 sticky top-28">
            <div className="bg-[#09090b] border border-slate-800/50 rounded-3xl p-6 lg:p-8">
              <h2 className="font-black text-xl mb-6 pb-4 border-b border-slate-800 text-white uppercase tracking-wide">
                Sipariş <span className="text-[#00e5ff]">Özeti</span>
              </h2>
              
              <div className="flex justify-between text-slate-400 mb-4 font-medium text-sm">
                <span>Ara Toplam</span>
                <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
              </div>
              
              <div className="flex justify-between text-slate-400 mb-6 font-medium text-sm">
                <span>Kargo Ücreti</span>
                <span>{kargo === 0 ? <span className="text-[#00e5ff] font-bold">Ücretsiz</span> : <span className="text-white font-bold">{kargo} TL</span>}</span>
              </div>

              <div className="flex justify-between items-center text-white font-black border-t border-slate-800 pt-6 mb-5">
                <span className="text-lg">Toplam</span>
                <span className="text-2xl lg:text-3xl text-white">{genelToplam.toLocaleString("tr-TR")} <span className="text-base text-slate-400 font-bold">TL</span></span>
              </div>

              {toplamHavaleIndirimi > 0 && (
                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl p-5 mb-6 relative overflow-hidden transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981] blur-[50px] opacity-20 pointer-events-none"></div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex items-center gap-2 text-[#10b981]">
                      <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-black text-sm sm:text-base">Havale / EFT İle</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#10b981] text-right drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      {havaleliToplam.toLocaleString("tr-TR")} TL
                    </div>
                  </div>
                </div>
              )}

              <Link href="/odeme" className="block w-full">
                <button className="w-full bg-[#00e5ff] text-black font-black uppercase tracking-wider py-4 rounded-xl text-lg hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  Güvenli Ödemeye Geç
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* SİLME ONAY KUTUSU */}
      {urunToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center mb-4 bg-slate-800/50">
              <Trash2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Ürünü Sil</h3>
            <p className="text-slate-400 text-sm mb-8">Bu ürünü sepetinizden çıkarmak istediğinize emin misiniz?</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setUrunToDelete(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all">
                İptal
              </button>
              <button onClick={() => { sepettenSil(urunToDelete.id, urunToDelete.varyasyon); setUrunToDelete(null); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all">
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}