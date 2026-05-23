"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../CartContext"; 

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 

  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  const pId = product?._id?.toString() || product?.id?.toString() || "urun";

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pId]);

  useEffect(() => {
    const calculateShipping = () => {
      const now = new Date();
      if (now.getHours() < 16) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        setTimeLeft(`${pad(15 - now.getHours())}:${pad(59 - now.getMinutes())}:${pad(59 - now.getSeconds())} içinde alırsanız`);
        setShippingMessage("BUGÜN KARGODA!");
      } else {
        setTimeLeft("Saat 16:00'ı geçtiği için");
        setShippingMessage("YARIN KARGODA!");
      }
    };
    calculateShipping();
    const timer = setInterval(calculateShipping, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    setAddingToCart(true);
    try {
      const gecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);
      const urunGorseli = product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400";

      sepeteEkle({
        id: String(pId),
        isim: product.isim || product.name || "İsimsiz Ürün",
        fiyat: gecerliFiyat,
        resim: urunGorseli,
        varyasyon: "Standart Model"
      });

      setAddedSuccess(true);
      setTimeout(() => { 
        setAddingToCart(false); 
        setAddedSuccess(false); 
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setAddingToCart(false);
    }
  };

  if (!product) return <div className="text-center p-10 text-[#00e5ff] font-bold">Yükleniyor...</div>;

  const urunAdi = product.isim || product.name || "İsimsiz Ürün";
  const normalFiyat = Number(product.regular_price || product.fiyat || product.price || 0);
  const indirimliFiyat = product.indirimliFiyat ? Number(product.indirimliFiyat) : null;
  const gecerliFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;
  
  const indirimVarMi = indirimliFiyat !== null && normalFiyat > indirimliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  const adetGosterilecekMi = product.stokAdedi !== null && product.stokAdedi !== undefined && product.stokAdedi !== "" && Number(product.stokAdedi) > 0;
  
  const havaleYuzdesi = product.havaleIndirimi !== undefined ? Number(product.havaleIndirimi) : 5;
  const havaleFiyati = gecerliFiyat - (gecerliFiyat * havaleYuzdesi) / 100;

  const resimler = product.images && product.images.length > 0 
    ? product.images.map((i:any) => i.src) 
    : [product.resim || "https://via.placeholder.com/600"];

  return (
    <div className="min-h-screen bg-[#050814] text-white pb-24 sm:pb-10 font-sans overflow-x-hidden">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 sm:py-10 sm:px-6">
        
        <div className="w-full md:w-1/2 md:rounded-3xl bg-transparent sm:bg-[#09090b] sm:border sm:border-white/5 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {resimler.map((img: string, idx: number) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center flex justify-center items-center h-[350px] sm:h-[500px] relative">
                <img 
                  src={img} 
                  alt={`${urunAdi} - ${idx + 1}`} 
                  className={`max-w-full max-h-full object-contain p-4 sm:p-8 ${tukendiMi ? 'grayscale opacity-50' : ''}`} 
                />
              </div>
            ))}
          </div>
          
          {resimler.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
              {/* ŞEFİM: İşte o kırmızı çizgiyi yok eden düzeltme! any ve number tiplerini açıkça belirttik. */}
              {resimler.map((resim: any, dotIdx: number) => (
                <div key={dotIdx} className="w-2 h-2 rounded-full bg-[#00e5ff] opacity-50 shadow-[0_0_5px_#00e5ff]" />
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 px-4 sm:px-0 mt-6 sm:mt-0 flex flex-col justify-center">
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tukendiMi ? (
               <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black px-3 py-1 rounded-md tracking-wider">TÜKENDİ</span>
            ) : (
               <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] text-xs font-black px-3 py-1 rounded-md tracking-wider">STOKTA VAR {adetGosterilecekMi ? `(${product.stokAdedi})` : ""}</span>
            )}
            {indirimVarMi && !tukendiMi && (
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase">🔥 %{indirimOrani} İNDİRİM</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight mb-6">
            {urunAdi}
          </h1>

          <div className="relative rounded-2xl bg-[#09090b] p-6 mb-6 border border-[#00e5ff]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)] overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00e5ff] blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="mb-4">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest block mb-1">Kredi Kartı Tek Çekim</span>
              {indirimVarMi ? (
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-sm line-through font-bold">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                  <span className="text-3xl font-black text-white">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-white">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
              )}
            </div>

            <div>
              <span className="text-[#10b981] text-[11px] font-bold uppercase tracking-widest block mb-1">Havale / EFT Fiyatı</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                {havaleYuzdesi > 0 && (
                  <span className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] font-bold px-2 py-0.5 rounded uppercase">%{havaleYuzdesi} İndirim</span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
              <span className="text-xl">💳</span>
              <span className="text-amber-400 text-sm font-bold tracking-wide">9 ve 12 Taksit İmkanları</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#09090b] border border-white/5 p-4 rounded-xl mb-6">
            <div className="text-3xl">🚚</div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">HIZLI KARGO AVANTAJI</span>
              <span className="text-sm font-medium mt-0.5">{timeLeft} <strong className="text-[#10b981] font-black">{shippingMessage}</strong></span>
            </div>
          </div>

          <div className="hidden sm:block relative mt-2">
            <button 
              type="button" 
              onClick={handleAddToCart} 
              disabled={addingToCart || tukendiMi} 
              className={`w-full h-16 rounded-xl font-black text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3
              ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:bg-[#00c4db] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]'}`}
            >
              {!tukendiMi && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
              {tukendiMi ? "STOK TÜKENDİ" : "HEMEN SEPETE EKLE"}
            </button>
            {addedSuccess && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-xs font-black px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce whitespace-nowrap">
                ✅ Başarıyla Sepete Eklendi!
              </div>
            )}
          </div>
          
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#050814]/95 backdrop-blur-xl border-t border-white/10 p-4 sm:hidden z-50">
        <div className="relative">
          <button 
            type="button" 
            onClick={handleAddToCart} 
            disabled={addingToCart || tukendiMi} 
            className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2
            ${tukendiMi ? 'bg-zinc-800 text-zinc-600' : 'bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)]'}`}
          >
            {!tukendiMi && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            {tukendiMi ? "STOK TÜKENDİ" : "HEMEN SEPETE EKLE"}
          </button>
          {addedSuccess && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-[10px] font-black px-4 py-2 rounded-lg shadow-xl animate-bounce whitespace-nowrap">
              ✅ Sepete Eklendi!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}