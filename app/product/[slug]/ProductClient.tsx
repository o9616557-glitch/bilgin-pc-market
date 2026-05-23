"use client";

import React, { useState, useEffect, useRef } from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useRouter } from "next/navigation";

import ProductGallery from "./components/ProductGallery";
import ProductShare from "./components/ProductShare";
import ProductSpecs from "./components/ProductSpecs";
import ProductFps from "./components/ProductFps";
import ProductCompare from "./components/ProductCompare";
import ProductReviews from "./components/ProductReviews";
import ProductQuestions from "./components/ProductQuestions";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("aciklama");

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  const [topDataLoading, setTopDataLoading] = useState(false);
  const [topReviewsCount, setTopReviewsCount] = useState(0);
  const [topQuestionsCount, setTopQuestionsCount] = useState(0);
  const [topRating, setTopRating] = useState(0);

  const [isFav, setIsFav] = useState(false);
  const [favMessage, setFavMessage] = useState("");

  const reviewsRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (section: string) => setOpenAccordion(openAccordion === section ? null : section);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      const isProductFav = currentFavs.some((item: any) => Number(item.id) === Number(product?._id || product?.id));
      setIsFav(isProductFav);
    }
  }, [product?._id, product?.id]);

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

  const scrollToReviewsSection = () => {
    setOpenAccordion("topluluk");
    setTimeout(() => { reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const pId = product._id || product.id;
    const existingIndex = currentCart.findIndex((item: any) => Number(item.id) === Number(pId));
    
    const gecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push({ 
        id: pId, 
        name: product.isim || product.name, 
        price: gecerliFiyat, 
        image: product.resim || product.images?.[0]?.src || "/placeholder.png", 
        slug: product.slug || pId, 
        quantity: quantity 
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    
    setTimeout(() => { setAddingToCart(false); setAddedSuccess(true); setTimeout(() => setAddedSuccess(false), 2000); }, 500);
  };

  const handleToggleFavorite = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("user_token");
    
    if (!token) {
      setFavMessage("⚠️ Önce Giriş Yapmalısınız!");
      setTimeout(() => {
        setFavMessage("");
        router.push("/giris");
      }, 1500);
      return;
    }

    const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    const pId = product._id || product.id;
    const existingIndex = currentFavs.findIndex((item: any) => Number(item.id) === Number(pId));

    let updatedFavs = [...currentFavs];
    if (existingIndex > -1) {
      updatedFavs.splice(existingIndex, 1);
      setIsFav(false);
      setFavMessage("💔 Çıkarıldı");
    } else {
      updatedFavs.push({
        id: pId,
        name: product.isim || product.name,
        price: Number(product.indirimliFiyat || product.price || product.fiyat || 0),
        image: product.resim || product.images?.[0]?.src || "/placeholder.png",
        slug: product.slug || pId
      });
      setIsFav(true);
      setFavMessage("❤️ Eklendi");
    }

    localStorage.setItem("user_favorites", JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event("favoritesUpdated"));
    setTimeout(() => setFavMessage(""), 2000);
  };

  const getTopText = () => {
    if (topDataLoading) return "Değerlendirmeler kontrol ediliyor...";
    if (topReviewsCount === 0 && topQuestionsCount === 0) return "İlk değerlendiren siz olun veya soru sorun";
    const parts = [];
    if (topReviewsCount > 0) parts.push(`${topReviewsCount} Yorum`);
    if (topQuestionsCount > 0) parts.push(`${topQuestionsCount} Soru`);
    return `${topRating > 0 ? topRating + ' Puan : ' : ''}${parts.join(' & ')}`;
  };

  if (!product) {
    return <div className="text-center p-10 text-white font-bold">Ürün bilgileri yükleniyor...</div>;
  }

  const urunAdi = product.isim || product.name || "İsimsiz Ürün";
  const normalFiyat = Number(product.regular_price || product.fiyat || product.price || 0);
  const gecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);
  const indirimVarMi = normalFiyat > gecerliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  
  // ŞEFİM: BURAYI DA KURŞUN GEÇİRMEZ YAPTIK. BOŞ OLUNCA SIFIR (0) SAYMAYACAK!
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  
  const havaleYuzdesi = product.havaleIndirimi !== undefined ? Number(product.havaleIndirimi) : 5;
  const havaleIndirimiTutari = (gecerliFiyat * havaleYuzdesi) / 100;
  const havaleFiyati = gecerliFiyat - havaleIndirimiTutari;

  return (
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8 font-medium">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl shadow-2xl">
          
          <ProductGallery images={product.resimler || product.images || (product.resim ? [product.resim] : [])} productName={urunAdi} />
          
          <div className="flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="bg-white/5 border border-white/10 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">KOD: {product.sku || product._id || product.id}</span>
                
                {tukendiMi ? (
                   <span className="bg-zinc-800/80 border border-zinc-600/50 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">TÜKENDİ</span>
                ) : (
                   <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                     STOKTA VAR {(product.stokAdedi !== null && product.stokAdedi !== undefined && product.stokAdedi !== "" && Number(product.stokAdedi) !== 10) ? `(${product.stokAdedi})` : ""}
                   </span>
                )}
                
                {indirimOrani > 0 && !tukendiMi && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/30">
                    🔥 %{indirimOrani} İNDİRİM
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 text-slate-100">{urunAdi}</h1>

              <div className="flex items-center gap-2 mb-3 bg-white/[0.02] border border-white/5 p-2 rounded-md w-max">
                <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                  {topDataLoading ? (
                    <span className="animate-pulse text-blue-400 font-bold text-[10px] tracking-widest uppercase">Yükleniyor...</span>
                  ) : (
                    [...Array(5)].map((_, i) => <span key={i}>{i < (topRating || 5) ? '★' : '☆'}</span>)
                  )}
                </div>
                <button type="button" disabled={topDataLoading} onClick={scrollToReviewsSection} className={`text-[11px] font-bold tracking-wide transition-colors ${topDataLoading ? 'text-slate-500 cursor-wait' : 'text-blue-400 hover:text-blue-300'}`}>
                  ({getTopText()})
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3 bg-[#050814]/50 p-3 rounded-md border border-blue-500/20">
                <div className="text-xl text-blue-400 animate-pulse">🚚</div>
                <div className="flex flex-col text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">HIZLI KARGO AVANTAJI</span>
                  <span className="text-slate-300 mt-0.5">{timeLeft} <strong className="text-emerald-400 font-black">{shippingMessage}</strong></span>
                </div>
              </div>

              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-md mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col justify-center">
                   {indirimVarMi ? (
                      <>
                        <span className="text-zinc-500 text-sm line-through font-bold">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                        <span className="text-3xl font-black text-[#00e5ff] drop-shadow-md shadow-cyan-500">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                      </>
                   ) : (
                      <span className="text-3xl font-black text-white">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                   )}
                </div>

                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Havale / EFT Seçeneği ile</span>
                  <div className="flex items-end sm:justify-end gap-1">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">{havaleFiyati.toLocaleString("tr-TR")}</span>
                    <span className="text-sm font-bold text-emerald-400 mb-0.5">TL</span>
                    {havaleYuzdesi > 0 && (
                       <span className="ml-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded">%{havaleYuzdesi} İndirim</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/5 border border-blue-500/10 rounded-md p-2.5 mb-3 flex items-center gap-2 text-xs font-bold text-blue-400 shadow-inner">
                💳 Kredi Kartına 12 Taksit Seçeneği
              </div>

              <ProductShare />
            </div>

            <div className="border-t border-white/5 pt-4 mt-2 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-md p-1.5 min-w-[100px]">
                  <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded text-white font-bold transition-colors">-</button>
                  <span className="text-white font-black w-8 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded text-white font-bold transition-colors">+</button>
                </div>

                <div className="flex-1 relative">
                  <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full font-black py-3 px-6 rounded-md uppercase tracking-wider text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-500/40'}`}>
                    {tukendiMi ? "TÜKENDİ" : "Sepete Ekle"}
                  </button>
                  {addedSuccess && (
                    <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce flex items-center gap-1.5 whitespace-nowrap">
                      <span>✅</span><span>Sepete Eklendi</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button type="button" onClick={handleToggleFavorite} className={`w-12 h-12 rounded-md border flex items-center justify-center text-xl transition-all ${isFav ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}>
                    {isFav ? "❤️" : "🤍"}
                  </button>
                  {favMessage && <div className="absolute -top-11 right-0 bg-[#0b1329] border border-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-md shadow-xl animate-fade-in whitespace-nowrap z-50">{favMessage}</div>}
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* MOBİL ALT SABİT BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Havale Fiyatı</span>
            <span className="text-base font-black text-emerald-400">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button type="button" onClick={handleToggleFavorite} className={`w-10 h-10 rounded-md border flex items-center justify-center text-lg ${isFav ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-white'}`}>
                {isFav ? "❤️" : "🤍"}
              </button>
            </div>
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`px-5 py-2.5 rounded-md font-black uppercase tracking-wider text-[11px] shadow-lg ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 active:bg-blue-700 text-white shadow-blue-600/20'}`}>
              {tukendiMi ? "TÜKENDİ" : "Sepete Ekle"}
            </button>
          </div>
        </div>

      </div>
    </PhotoProvider>
  );
}