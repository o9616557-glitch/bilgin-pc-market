"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext"; 
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"; 

export default function SepetSayfasi() {
  // ==========================================
  // 🚀 ŞEFİN MOTORU: BURAYA KESİNLİKLE DOKUNULMADI!
  // ==========================================
  const { sepet, sepetiTemizle, sepettenSil, adetGuncelle } = useCart();

  // Fiyat Hesaplama Motoru (Resimdeki ile Birebir Aynı)
  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150;
  const genelToplam = araToplam + kargo;


  // ==========================================
  // 🛒 1. BÖLÜM: EĞER SEPET BOŞ İSE 
  // ==========================================
  if (sepet.length === 0) {
    return (
      // 🌌 ANA ARKA PLAN: Mat siyah yerine Derin Uzay Siyahı (#03050a)
      <div className="min-h-[80vh] bg-[#03050a] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
        
        {/* 🔮 ARKADAKİ NEON IŞIKLAR: Sayfanın arkasından hafif mavi bir sis vurur */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] blur-[160px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
        
        {/* 🧊 CAM TASARIMLI BOŞ SEPET KUTUSU (Glassmorphism) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl flex flex-col items-center relative z-10 max-w-lg w-full text-center">
          <div className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🛒</div>
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-wider text-white">
            Sepetin <span className="text-[#00e5ff]">Boş</span>
          </h2>
          <p className="text-slate-400 mb-8 font-medium text-sm md:text-base leading-relaxed">
            İhtiyacınıza en uygun bilgisayar donanımlarını keşfetmek için mağazaya göz atın.
          </p>
          <Link href="/" className="bg-[#00e5ff] text-black font-black py-4 px-10 rounded-xl hover:bg-[#00c4db] transition-all duration-300 shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] uppercase tracking-wide w-full sm:w-auto">
            Mağazaya Geri Dön
          </Link>
        </div>
      </div>
    );
  }


  // ==========================================
  // 📦 2. BÖLÜM: EĞER SEPET DOLU İSE
  // ==========================================
  return (
    // 🌌 ANA ARKA PLAN: Yukarıdan hafif boşluk (pt-24) ve uzay siyahı
    <div className="min-h-screen bg-[#03050a] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      
      {/* 🔮 ARKADAKİ NEON MAVİ PARLAMA EFEKTLERİ */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#00e5ff] blur-[160px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#00e5ff] blur-[160px] opacity-10 pointer-events-none"></div>

      {/* 🏗️ ANA İSKELET: Sol ve Sağ Kutuları Tutan Geniş Çerçeve */}
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* ⬅️ SOL TARAF: ÜRÜNLER LİSTESİ */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* ÜST BAŞLIK: Alışveriş Sepetim yazısı ve Sepeti Temizle Butonu */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
              ALIŞVERİŞ <span className="text-[#00e5ff]">SEPETİM</span>
            </h1>
            {sepetiTemizle && (
              <button onClick={sepetiTemizle} className="text-sm font-semibold text-slate-400 hover:text-red-400 transition-all">
                Sepeti Temizle
              </button>
            )}
          </div>

          {/* DÖNGÜ: Sepetteki ürünleri tek tek yazar */}
          {sepet.map((urun: any, index: number) => (
            // 🧊 CAM ÜRÜN KARTLARI: Şeffaf arka plan, beyaz ince kenarlık, üzerine gelince mavi parlar
            <div key={index} className="flex flex-col sm:flex-row items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 gap-4 transition-all hover:border-[#00e5ff]/40 shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] relative">
              
              {/* Ürün Resmi (İçi biraz daha siyah cam kutu) */}
              <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-2">
                <img src={urun.resim || "/placeholder.jpg"} alt={urun.isim} className="w-full h-full object-contain drop-shadow-md" />
              </div>

              {/* Ürün Yazıları ve Detayları */}
              <div className="flex-1 flex flex-col text-center sm:text-left w-full">
                <h3 className="font-bold text-lg text-white mb-1 leading-tight">{urun.isim}</h3>
                
                {/* AKILLI VARYASYON FİLTRESİ (Standart yazıyorsa gizler) */}
                {urun.varyasyon && !urun.varyasyon.toLowerCase().includes("standart") && (
                  <p className="text-[#00e5ff] text-sm font-semibold mb-2">{urun.varyasyon}</p>
                )}

                {/* Fiyat Yazısı */}
                <div className="text-xl font-black mt-2 sm:mt-auto tracking-tight">
                  {(urun.fiyat * urun.adet).toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span>
                </div>
              </div>

              {/* Butonlar: Artı/Eksi ve Sil Butonları Yan Yana */}
              <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                
                {/* 🔢 + / - ADET KONTROLÜ (İçi gölgeli cam kutu) */}
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shadow-inner">
                  <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, -1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] hover:bg-white/5 rounded-lg transition-all text-xl font-medium">
                    -
                  </button>
                  <span className="font-black w-8 text-center text-white text-lg">{urun.adet}</span>
                  <button onClick={() => adetGuncelle(urun.id, urun.varyasyon, 1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] hover:bg-white/5 rounded-lg transition-all text-xl font-medium">
                    +
                  </button>
                </div>

                {/* 🗑️ SİL BUTONU: Kırmızı yerine asil metalik gri/beyaz geçişli tasarım! */}
                <button 
                  onClick={() => sepettenSil(urun.id, urun.varyasyon)} 
                  className="p-2.5 text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-xl transition-all w-full sm:w-auto flex justify-center"
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
          
          {/* 🧊 CAM SİPARİŞ ÖZETİ EKRANI */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24 shadow-2xl">
            
            <h2 className="font-black text-xl mb-6 pb-4 border-b border-white/10 text-white uppercase tracking-wide">
              Sipariş <span className="text-[#00e5ff]">Özeti</span>
            </h2>

            {/* Ara Toplam Yazısı */}
            <div className="flex justify-between text-slate-300 mb-4 font-medium text-sm lg:text-base">
              <span>Ara Toplam</span>
              <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
            </div>

            {/* Kargo Ücreti Yazısı (5000'i Geçerse Yeşil Ücretsiz yazar) */}
            <div className="flex justify-between text-slate-300 mb-6 font-medium text-sm lg:text-base">
              <span>Kargo Ücreti</span>
              <span>
                {kargo === 0 ? (
                  <span className="text-[#00e5ff] font-bold">Ücretsiz</span>
                ) : (
                  <span className="text-white font-bold">{kargo} TL</span>
                )}
              </span>
            </div>

            {/* Genel Toplam Yazısı (Neon Parlamalı) */}
            <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-6 mb-8">
              <span className="text-lg">Genel Toplam</span>
              <span className="text-2xl lg:text-3xl text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                {genelToplam.toLocaleString("tr-TR")} <span className="text-base text-slate-400 font-bold">TL</span>
              </span>
            </div>

            {/* ALIŞVERİŞİ TAMAMLA BUTONU (Kocaman Neon Mavi) */}
            <Link href="/odeme" className="block w-full">
              <button className="w-full bg-[#00e5ff] text-black font-black uppercase tracking-wider py-4 rounded-xl text-lg hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_35px_rgba(0,229,255,0.4)]">
                Alışverişi Tamamla
              </button>
            </Link>

            {/* Mağazaya Dön Linki */}
            <div className="text-center mt-6">
              <Link href="/" className="text-slate-400 hover:text-white text-sm transition-all font-medium inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Mağazaya Dönüp Alışverişe Devam Et
              </Link>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}