"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext"; 
import { Trash2, ArrowLeft } from "lucide-react"; 

export default function SepetSayfasi() {
  // ==========================================
  // 🚀 ŞEFİN MOTORU: MİLİMETRİK KORUNDU
  // ==========================================
  const { sepet, sepetiTemizle, sepettenSil, adetGuncelle } = useCart();

  // SİLME İŞLEMİ İÇİN HAFIZA VE ŞALTER (Yeni Eklendi!)
  const [urunToDelete, setUrunToDelete] = useState<any | null>(null);

  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150;
  const genelToplam = araToplam + kargo;


  // ==========================================
  // 🛒 1. BÖLÜM: EĞER SEPET BOŞ İSE (ŞEFFAF CAM)
  // ==========================================
  if (sepet.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#03050a] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] blur-[160px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative z-10 max-w-lg w-full text-center">
          <div className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🛒</div>
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-wider text-white">
            Sepetin <span className="text-[#00e5ff]">Boş</span>
          </h2>
          <p className="text-slate-400 mb-8 font-medium text-sm md:text-base leading-relaxed">
            İhtiyacınıza en uygun bilgisayar donanımlarını keşfetmek için mağazaya göz atın.
          </p>
          <Link href="/" className="bg-[#00e5ff] text-black font-black py-4 px-10 rounded-xl hover:bg-[#00c4db] transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_35px_rgba(0,229,255,0.4)] uppercase tracking-wide w-full sm:w-auto">
            Mağazaya Geri Dön
          </Link>
        </div>
      </div>
    );
  }


  // ==========================================
  // 📦 2. BÖLÜM: EĞER SEPET DOLU İSE (ŞEFFAF CAM)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#03050a] text-white pt-8 md:pt-12 pb-12 px-4 relative overflow-hidden">
      
      {/* ARKADAKİ NEON MAVİ PARLAMA EFEKTLERİ */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#00e5ff] blur-[160px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#00e5ff] blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* ⬅️ SOL TARAF: ÜRÜNLER LİSTESİ */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 mb-4 gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white drop-shadow-md">
                ALIŞVERİŞ <span className="text-[#00e5ff]">SEPETİM</span>
              </h1>
            </div>
            {sepetiTemizle && (
              <button onClick={sepetiTemizle} className="text-sm font-semibold text-slate-500 hover:text-red-400 bg-white/5 border border-white/10 hover:border-red-500/30 py-2 px-4 rounded-xl transition-all">
                Sepeti Temizle
              </button>
            )}
          </div>

          {sepet.map((urun: any, index: number) => (
            // 🧊 KART TASARIMI: O beğendiğin tam kıvamında Şeffaf Cam
            <div key={index} className="flex flex-col sm:flex-row items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 gap-4 transition-all hover:border-[#00e5ff]/40 shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] relative">
              
              <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-2">
                <img src={urun.resim || "/placeholder.jpg"} alt={urun.isim} className="w-full h-full object-contain drop-shadow-md" />
              </div>

              <div className="flex-1 flex flex-col text-center sm:text-left w-full">
                <h3 className="font-bold text-lg text-white mb-1 leading-tight">{urun.isim}</h3>
                
                {urun.varyasyon && !urun.varyasyon.toLowerCase().includes("standart") && (
                  <p className="text-[#00e5ff] text-xs font-semibold mb-2 bg-[#00e5ff]/10 inline-block self-center sm:self-start px-2 py-0.5 rounded border border-[#00e5ff]/20">{urun.varyasyon}</p>
                )}

                <div className="text-xl font-black mt-2 sm:mt-auto tracking-tight text-white drop-shadow-sm">
                  {(urun.fiyat * urun.adet).toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-none">
                
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shadow-inner">
                  <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] hover:bg-white/5 rounded-lg transition-all text-xl font-medium">
                    -
                  </button>
                  <span className="font-black w-8 text-center text-white text-base">{urun.adet}</span>
                  <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] hover:bg-white/5 rounded-lg transition-all text-xl font-medium">
                    +
                  </button>
                </div>

                {/* 🗑️ SİL BUTONU: Artık direkt silmiyor, "urunToDelete" hafızasına yazıyor! */}
                <button 
                  onClick={() => setUrunToDelete(urun)} 
                  className="w-11 h-11 flex items-center justify-center text-slate-400 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl transition-all shrink-0"
                  title="Sepetten Çıkar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ➡️ SAĞ TARAF: SİPARİŞ ÖZETİ KUTUSU */}
        <div className="w-full lg:w-[380px] shrink-0">
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24 shadow-2xl">
            
            <h2 className="font-black text-xl mb-6 pb-4 border-b border-white/10 text-white uppercase tracking-wide">
              Sipariş <span className="text-[#00e5ff]">Özeti</span>
            </h2>

            <div className="flex justify-between text-slate-300 mb-4 font-medium text-sm lg:text-base">
              <span>Ara Toplam</span>
              <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
            </div>

            <div className="flex justify-between text-slate-300 mb-6 font-medium text-sm lg:text-base">
              <span>Kargo Ücreti</span>
              <span>
                {kargo === 0 ? (
                  <span className="text-[#00e5ff] font-bold drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">Ücretsiz</span>
                ) : (
                  <span className="text-white font-bold">{kargo} TL</span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-6 mb-8">
              <span className="text-lg">Genel Toplam</span>
              <span className="text-2xl lg:text-3xl text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                {genelToplam.toLocaleString("tr-TR")} <span className="text-base text-slate-400 font-bold">TL</span>
              </span>
            </div>

            <Link href="/odeme" className="block w-full">
              <button className="w-full bg-[#00e5ff] text-black font-black uppercase tracking-wider py-4 rounded-xl text-lg hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_35px_rgba(0,229,255,0.4)]">
                Alışverişi Tamamla
              </button>
            </Link>

            <div className="text-center mt-6">
              <Link href="/" className="text-slate-400 hover:text-white text-sm transition-all font-medium inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Alışverişe Devam Et
              </Link>
            </div>
            
          </div>
        </div>

      </div>

      {/* 🚨 SİLME ONAY KUTUSU (POPUP) - YENİ EKLENDİ! */}
      {urunToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            
            <div className="w-16 h-16 rounded-full border border-slate-600 flex items-center justify-center mb-4 bg-slate-800/50">
              <Trash2 className="w-8 h-8 text-slate-300" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-2">Ürünü Sil</h3>
            <p className="text-slate-300 text-sm mb-8">Bu ürünü sepetinizden çıkarmak istediğinize emin misiniz?</p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setUrunToDelete(null)} 
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl transition-all border border-white/10"
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  sepettenSil(urunToDelete.id, urunToDelete.varyasyon);
                  setUrunToDelete(null); // Sildikten sonra kutuyu kapat
                }} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg"
              >
                Evet, Sil
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}