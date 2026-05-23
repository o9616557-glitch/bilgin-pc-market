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

  // ŞEFİM: MongoDB'nin harfli/sayılı o güçlü ID'sini garantiye alıyoruz
  const pId = product?._id?.toString() || product?.id?.toString() || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      // Number yerine String kullandık ki MongoDB ID'lerinde hata vermesin
      const isProductFav = currentFavs.some((item: any) => String(item.id) === String(pId));
      setIsFav(isProductFav);
    }
  }, [pId]);

  // Kargo Sayacı
  useEffect(() => {
    const calculateShipping = () => {
      const now = new Date();
      if (now.getHours() < 16) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        setTimeLeft(`${pad(15 - now.getHours())}:${pad(59 - now.getMinutes())}:${pad(59 - now.getSeconds())} içinde sipariş verirseniz`);
        setShippingMessage("BUGÜN KARGODA!");
      } else {
        setTimeLeft("Saat 16:00'ı geçtiği için siparişiniz");
        setShippingMessage("YARIN KARGODA!");
      }
    };
    calculateShipping();
    const timer = setInterval(calculateShipping, 1000);
    return () => clearInterval(timer);
  }, []);

  // ŞEFİM: KUSURSUZ SEPET MOTORU!
  const handleAddToCart = () => {
    setAddingToCart(true);
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // İŞTE HATA BURADAYDI! Number() yerine String() yaptık, artık asla çökmeyecek!
    const existingIndex = currentCart.findIndex((item: any) => String(item.id) === String(pId));
    
    const gecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);
    const urunGorseli = product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400x400?text=Gorsel+Yok";

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
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    
    setTimeout(() => { 
      setAddingToCart(false); 
      setAddedSuccess(true); 
      setTimeout(() => setAddedSuccess(false), 2000); 
    }, 400);
  };

  const handleToggleFavorite = () => {
    if (typeof window === "undefined") return;
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
  };

  if (!product) {
    return <div className="text-center p-20 text-[#00e5ff] font-black text-2xl animate-pulse">Ürün Bilgileri Çekiliyor Şefim...</div>;
  }

  // Fiyat ve Stok Matematiği
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

  const anaGorsel = product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/600x600?text=Gorsel+Bulunamadi";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white py-10 px-4 sm:px-6 lg:px-8 font-medium font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#0b1329]/60 backdrop-blur-2xl border border-[#00e5ff]/10 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.03)]">
        
        {/* SOL TARAF: GÖRSEL */}
        <div className="relative w-full h-[350px] sm:h-[500px] bg-[#09090b] rounded-2xl border border-white/5 flex items-center justify-center p-8 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <img 
            src={anaGorsel} 
            alt={urunAdi} 
            className={`max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110 ${tukendiMi ? 'grayscale opacity-60' : ''}`}
          />
        </div>
        
        {/* SAĞ TARAF: BİLGİLER VE SEPET */}
        <div className="flex flex-col justify-center">
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              KOD: {product.sku || pId.slice(-6).toUpperCase() || "BLGN"}
            </span>
            
            {tukendiMi ? (
               <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                 TÜKENDİ
               </span>
            ) : (
               <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                 STOKTA VAR {adetGosterilecekMi ? `(${product.stokAdedi})` : ""}
               </span>
            )}
            
            {indirimOrani > 0 && !tukendiMi && (
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30 animate-pulse">
                🔥 %{indirimOrani} İNDİRİM
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-6 text-white leading-tight">
            {urunAdi}
          </h1>

          <div className="flex items-center gap-4 mb-6 bg-[#050814]/80 p-4 rounded-xl border border-white/5">
            <div className="text-3xl text-[#00e5ff]">🚚</div>
            <div className="flex flex-col text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">HIZLI KARGO AVANTAJI</span>
              <span className="text-slate-200 mt-1">{timeLeft} <strong className="text-[#10b981] font-black tracking-wide">{shippingMessage}</strong></span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#121214] to-[#09090b] border border-[#00e5ff]/20 p-6 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] blur-[100px] opacity-10"></div>
            
            <div className="flex flex-col justify-center relative z-10">
               {indirimVarMi ? (
                  <>
                    <span className="text-slate-500 text-sm line-through font-bold mb-1">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                    <span className="text-4xl font-black text-[#00e5ff] drop-shadow-md">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                  </>
               ) : (
                  <span className="text-4xl font-black text-white">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
               )}
            </div>

            <div className="sm:text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-4 relative z-10">
              <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Havale / EFT ile İndirimli</span>
              <div className="flex items-end sm:justify-end gap-1">
                <span className="text-2xl font-black text-[#10b981]">{havaleFiyati.toLocaleString("tr-TR")}</span>
                <span className="text-base font-bold text-[#10b981] mb-0.5">TL</span>
              </div>
              {havaleYuzdesi > 0 && (
                 <span className="inline-block mt-2 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black px-2 py-1 rounded-md border border-[#10b981]/20">
                   KASADA %{havaleYuzdesi} İNDİRİM
                 </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-xl p-2 w-full sm:w-auto min-w-[120px] h-14">
              <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold transition-colors">-</button>
              <span className="text-white font-black text-lg w-10 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold transition-colors">+</button>
            </div>

            <div className="flex-1 w-full relative">
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

            <div className="relative w-full sm:w-auto">
              <button 
                type="button" 
                onClick={handleToggleFavorite} 
                className={`w-full sm:w-14 h-14 rounded-xl border flex items-center justify-center text-2xl transition-all duration-300 
                ${isFav ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#050814] border-white/10 hover:border-white/30 text-white hover:bg-white/5'}`}
              >
                {isFav ? "❤️" : "🤍"}
              </button>
              {favMessage && <div className="absolute -top-12 right-0 sm:-right-4 bg-[#09090b] border border-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">{favMessage}</div>}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}