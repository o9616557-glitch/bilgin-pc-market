"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  const [isFav, setIsFav] = useState(false);
  const [favMessage, setFavMessage] = useState("");

  const pId = product?._id?.toString() || product?.id?.toString() || Date.now().toString();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      try {
        const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
        const isProductFav = currentFavs.some((item: any) => String(item.id) === String(pId));
        setIsFav(isProductFav);
      } catch (e) { console.error(e); }
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

  // ŞEFİM: SEPETE EKLEME GARANTİLİ KOD (Hata vermez, direkt ekler)
  const handleAddToCart = () => {
    setAddingToCart(true);
    try {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = currentCart.findIndex((item: any) => String(item.id) === String(pId));
      
      const gecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);
      const urunGorseli = product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400";

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
      // Sitenin her yerindeki sepetlerin güncellenmesi için tetikliyoruz
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));
      
      setAddedSuccess(true);
      setTimeout(() => { 
        setAddingToCart(false); 
        setAddedSuccess(false); 
      }, 2000);
    } catch (error) {
      console.error("Sepete ekleme hatası:", error);
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    if (typeof window === "undefined") return;
    try {
      const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      const existingIndex = currentFavs.findIndex((item: any) => String(item.id) === String(pId));

      let updatedFavs = [...currentFavs];
      if (existingIndex > -1) {
        updatedFavs.splice(existingIndex, 1);
        setIsFav(false);
        setFavMessage("💔 Çıkarıldı");
      } else {
        updatedFavs.push({
          id: String(pId),
          name: product.isim || product.name,
          price: Number(product.indirimliFiyat || product.price || product.fiyat || 0),
          image: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400",
          slug: product.slug || pId
        });
        setIsFav(true);
        setFavMessage("❤️ Eklendi");
      }

      localStorage.setItem("user_favorites", JSON.stringify(updatedFavs));
      window.dispatchEvent(new Event("favoritesUpdated"));
      setTimeout(() => setFavMessage(""), 2000);
    } catch (e) { console.error(e); }
  };

  if (!product) {
    return <div className="text-center p-20 text-[#00e5ff] font-black text-xl animate-pulse">Ürün Bilgileri Çekiliyor...</div>;
  }

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
  const havaleIndirimiTutari = (gecerliFiyat * havaleYuzdesi) / 100;
  const havaleFiyati = gecerliFiyat - havaleIndirimiTutari;

  const anaGorsel = product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/600";

  return (
    // ŞEFİM: Mobilde pb-32 ekledik ki yapışkan bar en alttaki yazıları kapatmasın. px-2 ile kenar boşluklarını sildik.
    <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white py-4 sm:py-10 px-2 sm:px-6 lg:px-8 font-medium font-sans pb-32 sm:pb-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-10 bg-[#0b1329]/60 backdrop-blur-2xl border border-[#00e5ff]/10 p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.03)]">
        
        {/* SOL TARAF: GÖRSEL */}
        <div className="relative w-full h-[250px] sm:h-[500px] bg-[#09090b] rounded-xl sm:rounded-2xl border border-white/5 flex items-center justify-center p-4 sm:p-8 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <img 
            src={anaGorsel} 
            alt={urunAdi} 
            className={`max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110 ${tukendiMi ? 'grayscale opacity-60' : ''}`}
          />
        </div>
        
        {/* SAĞ TARAF: BİLGİLER */}
        <div className="flex flex-col justify-center">
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-white/5 border border-white/10 text-slate-400 text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest w-fit">
              KOD: {product.sku || pId.slice(-6).toUpperCase() || "BLGN"}
            </span>
            
            {tukendiMi ? (
               <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest w-fit">
                 TÜKENDİ
               </span>
            ) : (
               <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.2)] w-fit">
                 STOKTA VAR {adetGosterilecekMi ? `(${product.stokAdedi})` : ""}
               </span>
            )}
            
            {/* İNDİRİM KUTUSU: w-fit ile yazının boyuna göre ayarlandı! */}
            {indirimOrani > 0 && !tukendiMi && (
              <span className="w-fit bg-gradient-to-r from-orange-500 to-red-600 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30 animate-pulse">
                🔥 %{indirimOrani} İNDİRİM
              </span>
            )}
          </div>

          {/* BAŞLIK: Mobilde küçültüldü */}
          <h1 className="text-xl sm:text-4xl font-black uppercase tracking-tight mb-4 sm:mb-6 text-white leading-snug sm:leading-tight">
            {urunAdi}
          </h1>

          {/* KARGO: Mobilde daha derli toplu */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6 bg-[#050814]/80 p-3 sm:p-4 rounded-xl border border-white/5">
            <div className="text-2xl sm:text-3xl text-[#00e5ff]">🚚</div>
            <div className="flex flex-col text-xs sm:text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">HIZLI KARGO</span>
              <span className="text-slate-200 mt-0.5">{timeLeft} <strong className="text-[#10b981] font-black tracking-wide">{shippingMessage}</strong></span>
            </div>
          </div>

          {/* FİYAT ALANI: Mobilde fontlar küçüldü ve iç içe girmesi engellendi */}
          <div className="bg-gradient-to-br from-[#121214] to-[#09090b] border border-[#00e5ff]/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] blur-[100px] opacity-10"></div>
            
            <div className="flex flex-col justify-center relative z-10">
               {indirimVarMi ? (
                  <>
                    <span className="text-slate-500 text-xs sm:text-sm line-through font-bold mb-1">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                    <span className="text-2xl sm:text-4xl font-black text-[#00e5ff] drop-shadow-md">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                  </>
               ) : (
                  <span className="text-2xl sm:text-4xl font-black text-white">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
               )}
            </div>

            <div className="sm:text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 relative z-10">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Havale / EFT Seçeneği</span>
              <div className="flex items-end sm:justify-end gap-1">
                <span className="text-xl sm:text-2xl font-black text-[#10b981]">{havaleFiyati.toLocaleString("tr-TR")}</span>
                <span className="text-sm font-bold text-[#10b981] mb-0.5">TL</span>
              </div>
              {havaleYuzdesi > 0 && (
                 <span className="inline-block mt-1 sm:mt-2 bg-[#10b981]/10 text-[#10b981] text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-md border border-[#10b981]/20 w-fit">
                   KASADA %{havaleYuzdesi} İNDİRİM
                 </span>
              )}
            </div>
          </div>

          {/* MASAÜSTÜ SEPETE EKLE BUTONLARI (Mobilde gizlenir) */}
          <div className="hidden sm:flex items-center gap-4 mt-2">
            <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-xl p-2 w-auto min-w-[120px] h-14">
              <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold transition-colors">-</button>
              <span className="text-white font-black text-lg w-10 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold transition-colors">+</button>
            </div>

            <div className="flex-1 relative">
              <button 
                type="button" 
                onClick={handleAddToCart} 
                disabled={addingToCart || tukendiMi} 
                className={`w-full h-14 font-black rounded-xl uppercase tracking-widest text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-3 
                ${tukendiMi ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5' : 'bg-[#00e5ff] hover:bg-[#00c4db] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]'}`}
              >
                {!tukendiMi && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                )}
                {tukendiMi ? "TÜKENDİ" : "Sepete At"}
              </button>
              
              {addedSuccess && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-xs font-black px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce flex items-center gap-2 whitespace-nowrap z-50">
                  <span>✅</span><span>Başarıyla Sepete Eklendi!</span>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                type="button" 
                onClick={handleToggleFavorite} 
                className={`w-14 h-14 rounded-xl border flex items-center justify-center text-2xl transition-all duration-300 
                ${isFav ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#050814] border-white/10 hover:border-white/30 text-white hover:bg-white/5'}`}
              >
                {isFav ? "❤️" : "🤍"}
              </button>
              {favMessage && <div className="absolute -top-12 -right-4 bg-[#09090b] border border-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">{favMessage}</div>}
            </div>
          </div>
          
        </div>
      </div>

      {/* ŞEFİM İŞTE YAPIŞKAN MOBİL ALT BAR (Sadece telefonda görünür) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-2xl border-t border-[#00e5ff]/20 px-3 py-3 flex flex-col gap-2 sm:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        
        {/* Mobil Üst Satır: Fiyat ve Adet */}
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Havale Fiyatı</span>
            <span className="text-xl font-black text-[#10b981] leading-none">{havaleFiyati.toLocaleString("tr-TR")} <span className="text-xs">TL</span></span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#050814] border border-white/10 rounded-lg p-1 h-9">
            <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-8 h-full flex items-center justify-center text-white font-bold">-</button>
            <span className="text-white font-black text-sm w-4 text-center">{quantity}</span>
            <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-8 h-full flex items-center justify-center text-white font-bold">+</button>
          </div>
        </div>

        {/* Mobil Alt Satır: Favori ve Sepete Ekle Butonları */}
        <div className="flex gap-2 h-12 relative">
          <button 
            type="button" 
            onClick={handleToggleFavorite} 
            className={`w-12 h-full rounded-xl border flex items-center justify-center text-xl transition-all 
            ${isFav ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-[#050814] border-white/10 text-white'}`}
          >
            {isFav ? "❤️" : "🤍"}
          </button>

          <button 
            type="button" 
            onClick={handleAddToCart} 
            disabled={addingToCart || tukendiMi} 
            className={`flex-1 h-full font-black rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 
            ${tukendiMi ? 'bg-zinc-900 text-zinc-600 border border-white/5' : 'bg-[#00e5ff] active:bg-[#00c4db] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'}`}
          >
            {tukendiMi ? "TÜKENDİ" : "SEPETE AT"}
          </button>

          {addedSuccess && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-[10px] font-black px-4 py-2 rounded-lg shadow-xl animate-bounce flex items-center gap-1.5 whitespace-nowrap">
              <span>✅</span><span>Sepete Eklendi!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}