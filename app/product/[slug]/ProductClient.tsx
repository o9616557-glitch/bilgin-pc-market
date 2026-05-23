"use client";

import React, { useState, useEffect } from "react";

// ŞEFİM: İŞTE BURAYA allProducts KISMINI GERİ EKLEDİM, KIRMIZI ÇİZGİ GİDECEK!
export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const [quantity, setQuantity] = useState(1);
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

  // Kargo Sayacı
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

  // ŞEFİM: SAĞ ÜSTTEKİ SEPETİ ANINDA UYANDIRAN MOTOR
  const handleAddToCart = () => {
    setAddingToCart(true);
    try {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = currentCart.findIndex((item: any) => String(item.id) === String(pId));
      
      const gecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);
      const urunGorseli = product.resim || "https://via.placeholder.com/400";

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += quantity;
      } else {
        currentCart.push({ 
          id: String(pId), 
          name: product.isim || product.name, 
          price: gecerliFiyat, 
          image: urunGorseli, 
          slug: product.slug || pId, 
          quantity: quantity 
        });
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));

      // 🚨 SAĞ ÜSTTEKİ MENÜYÜ AYNI ANDA TETİKLEYEN SİHİRLİ EL TELSİZLERİ
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("cartChange"));
      
      // Aynı sekmede normalde tetiklenmeyen 'storage' olayını zorla ateşliyoruz ki sağ üst uyansın!
      try {
        const fakeStorageEvent = new StorageEvent("storage", {
          key: "cart",
          newValue: JSON.stringify(currentCart)
        });
        window.dispatchEvent(fakeStorageEvent);
      } catch (e) {}
      
      setAddedSuccess(true);
      setTimeout(() => { 
        setAddingToCart(false); 
        setAddedSuccess(false); 
      }, 2000);
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-[#050814] text-white py-4 sm:py-8 px-2 sm:px-6 lg:px-8 pb-32 sm:pb-10 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0b1329]/80 border border-white/5 p-4 sm:p-6 rounded-xl shadow-2xl">
        
        {/* RESİM ALANI */}
        <div className="w-full h-[280px] sm:h-[420px] bg-[#09090b] rounded-lg border border-white/5 flex items-center justify-center p-4">
          <img src={product.resim || "https://via.placeholder.com/400"} alt={urunAdi} className={`max-w-full max-h-full object-contain ${tukendiMi ? 'grayscale opacity-50' : ''}`} />
        </div>
        
        {/* BİLGİLER ALANI */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">KOD: {pId.slice(-5).toUpperCase()}</span>
              {tukendiMi ? (
                 <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-md">TÜKENDİ</span>
              ) : (
                 <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] text-[10px] font-bold px-2 py-0.5 rounded-md">STOKTA VAR {adetGosterilecekMi ? `(${product.stokAdedi})` : ""}</span>
              )}
              {/* ŞEFİM: İndirim kutusunun genişliğini yazının boyuna eşitledik (w-fit) */}
              {indirimVarMi && !tukendiMi && (
                <span className="w-fit bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">🔥 %{indirimOrani} İNDİRİM</span>
              )}
            </div>

            {/* BAŞLIK: Mobilde kibar, taş gibi okunaklı */}
            <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-white leading-tight mb-3">{urunAdi}</h1>

            {/* KARGO */}
            <div className="bg-[#050814]/60 p-3 rounded-lg border border-white/5 text-xs mb-4">
              <span className="text-slate-400 block font-bold text-[10px]">HIZLI KARGO AVANTAJI</span>
              <span className="text-slate-200 block mt-0.5">{timeLeft} <strong className="text-[#10b981] font-black">{shippingMessage}</strong></span>
            </div>

            {/* FİYATLAR: Devasa büyüklük küçültüldü, iç içe girmesi engellendi */}
            <div className="bg-[#121214] border border-white/5 p-4 rounded-xl mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                 {indirimVarMi ? (
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-xs line-through font-bold">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                      <span className="text-xl sm:text-2xl font-black text-[#00e5ff]">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                    </div>
                 ) : (
                    <span className="text-xl sm:text-2xl font-black text-white">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                 )}
              </div>
              <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <span className="text-[10px] text-slate-400 block font-bold">Havale / EFT ile</span>
                <span className="text-lg sm:text-xl font-black text-[#10b981]">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
              </div>
            </div>
          </div>

          {/* MASAÜSTÜ SATIN ALMA BUTONLARI (Mobilde gizlenir) */}
          <div className="hidden sm:flex items-center gap-3 mt-2">
            <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-lg p-1 h-12 min-w-[100px]">
              <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-8 h-full font-bold text-white">-</button>
              <span className="text-white font-black text-sm">{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-8 h-full font-bold text-white">+</button>
            </div>
            <div className="flex-1 relative">
              <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-12 font-black rounded-lg uppercase text-xs tracking-wider transition-all ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#00e5ff] text-black hover:bg-[#00c4db]'}`}>
                {tukendiMi ? "TÜKENDİ" : "Sepete Ekle"}
              </button>
              {addedSuccess && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-[10px] font-black px-3 py-1 rounded-md shadow-lg animate-bounce">
                  ✅ Sepete Atıldı!
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* MOBİL İÇİN SABİT YAPIŞKAN ALT BAR (Sadece telefonda görünür) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-md border-t border-white/10 p-3 flex justify-between items-center sm:hidden z-50 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase">Havale Fiyatı</span>
          <span className="text-base font-black text-[#10b981]">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobil Adet Seçici */}
          <div className="flex items-center gap-2 bg-[#050814] border border-white/10 rounded-md p-1 h-9">
            <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-2 font-bold text-white">-</button>
            <span className="text-white font-black text-xs">{quantity}</span>
            <button type="button" onClick={() => setQuantity(q => q + 1)} className="px-2 font-bold text-white">+</button>
          </div>
          {/* Mobil Sepet Butonu */}
          <div className="relative">
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`h-9 px-4 rounded-md font-black text-[11px] uppercase tracking-wider ${tukendiMi ? 'bg-zinc-800 text-zinc-600' : 'bg-[#00e5ff] text-black'}`}>
              {tukendiMi ? "TÜKENDİ" : "SEPETE AT"}
            </button>
            {addedSuccess && (
              <div className="absolute -top-10 right-0 bg-[#10b981] text-black text-[9px] font-black px-2 py-1 rounded shadow-md animate-bounce whitespace-nowrap">
                ✅ Eklendi!
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}