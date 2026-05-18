"use client";

import React, { useState, useEffect, useRef } from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import ProductGallery from "./components/ProductGallery";
import ProductShare from "./components/ProductShare";
import ProductSpecs from "./components/ProductSpecs";
import ProductFps from "./components/ProductFps";
import ProductCompare from "./components/ProductCompare";
import ProductReviews from "./components/ProductReviews";
import ProductQuestions from "./components/ProductQuestions";

interface Review { id: number; parent_id: number; review: string; rating: number; }

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("aciklama");

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  
  const [topReviewsCount, setTopReviewsCount] = useState(0);
  const [topRating, setTopRating] = useState(0);

  const reviewsRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (section: string) => setOpenAccordion(openAccordion === section ? null : section);

  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" }); }, [product?.id]);

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

    const fetchTopData = async () => {
      try {
        // 🚀 BROWSER HAFIZASINI KIRAN LİNK BURAYA DA EKLENDİ!
        const res = await fetch(`/api/reviews?product=${product.id}&_t=${Date.now()}`, { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          const data: Review[] = await res.json();
          const normalReviews = data.filter((item: Review) => Number(item.parent_id) === 0 && !item.review.includes("[SORU]"));
          setTopReviewsCount(normalReviews.length);
          if (normalReviews.length > 0) {
            const avg = normalReviews.reduce((sum, r) => sum + r.rating, 0) / normalReviews.length;
            setTopRating(Number(avg.toFixed(1)));
          }
        }
      } catch (e) { console.error(e); }
    };
    if (product?.id) fetchTopData();

    return () => clearInterval(timer);
  }, [product?.id]);

  const scrollToReviewsSection = () => {
    setOpenAccordion("topluluk");
    setTimeout(() => { reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = currentCart.findIndex((item: any) => item.id === product.id);
    if (existing > -1) currentCart[existing].quantity += quantity;
    else { currentCart.push({ id: product.id, name: product.name, price: product.price || product.regular_price, image: product.images?.[0]?.src || "/placeholder.png", slug: product.slug, quantity: quantity }); }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => { setAddingToCart(false); setAddedSuccess(true); setTimeout(() => setAddedSuccess(false), 2000); }, 850);
  };

  const stoktaVar = product.stock_status === "instock";
  const regularPrice = Number(product.regular_price || 0);
  const currentPrice = Number(product.price || 0);
  const isSale = product.on_sale === true || product.on_sale === "true" || (regularPrice > currentPrice && currentPrice > 0);
  const eskiFiyat = regularPrice > currentPrice ? regularPrice : (isSale ? Math.round(currentPrice * 1.15) : 0);
  const havaleFiyati = currentPrice * 0.95;

  return (
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8 font-medium">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl shadow-lg relative z-10">
          <ProductGallery images={product.images || []} productName={product.name} />
          <div className="flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="bg-white/5 border border-white/10 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full">KOD: {product.sku || product.id}</span>
                {stoktaVar ? <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full">STOKTA VAR</span> : <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full">TÜKENDİ</span>}
                {isSale && <span className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">💎 BÜYÜK FIRSAT ÜRÜNÜ</span>}
              </div>
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 text-slate-100">{product.name}</h1>
              <div className="flex items-center gap-2 mb-3 bg-white/[0.02] border border-white/5 p-2 rounded-md w-max">
                <div className="flex items-center gap-0.5 text-amber-400 text-xs">{[...Array(5)].map((_, i) => <span key={i}>{i < (topRating || 5) ? '★' : '☆'}</span>)}</div>
                <button type="button" onClick={scrollToReviewsSection} className="text-[11px] font-bold tracking-wide text-blue-400 hover:text-blue-300 hover:underline transition-colors">{topReviewsCount > 0 ? `${topRating} Puan (${topReviewsCount} Kullanıcı Yorumu)` : "İlk değerlendiren siz olun veya soru sorun"}</button>
              </div>
              <div className="flex items-center gap-3 mb-3 bg-[#050814]/50 p-3 rounded-md border border-blue-500/20">
                <div className="text-xl text-blue-400 animate-pulse">🚀</div>
                <div className="flex flex-col text-xs"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] text-blue-400">HIZLI KARGO AVANTAJI</span><span className="text-slate-300 mt-0.5">{timeLeft}</span><span className={`font-black text-sm uppercase ${shippingMessage === "BUGÜN KARGODA!" ? "text-emerald-400" : "text-amber-400"}`}>{shippingMessage}</span></div>
              </div>
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-md mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">Havale Fiyatı (%5 İndirimli)</span><span className="text-xl sm:text-2xl font-black text-emerald-400">{havaleFiyati.toLocaleString('tr-TR')} TL</span></div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex flex-col justify-center"><span className="text-[10px] text-slate-500 block font-bold">Kredi Kartı Tek Çekim</span>{isSale && eskiFiyat > 0 ? (<div className="flex flex-wrap items-center gap-1.5 sm:justify-end"><span className="text-xs line-through text-slate-400 font-bold">{eskiFiyat.toLocaleString('tr-TR')} TL</span><span className="text-sm sm:text-base font-black text-slate-200">{currentPrice.toLocaleString('tr-TR')} TL</span></div>) : <span className="text-sm sm:text-base font-black text-slate-200">{currentPrice.toLocaleString('tr-TR')} TL</span>}</div>
              </div>
              <div className="bg-blue-600/5 border border-blue-500/10 rounded-md p-2.5 mb-3 flex items-center gap-2 text-xs font-bold text-blue-400 shadow-inner">💳 Kredi Kartına 12 Taksit Seçeneği!</div>
              <ProductShare />
            </div>
            <div className="border-t border-white/5 pt-4 mt-2 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-md p-1.5 min-w-[100px]"><button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">-</button><span className="px-2 font-black text-sm text-white">{quantity}</span><button type="button" onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">+</button></div>
                <button type="button" onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className={`flex-1 font-black py-3 px-6 rounded-md uppercase tracking-wider text-xs sm:text-sm ${addedSuccess ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"} text-white`}>{addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ SEPETE EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}</button>
                <button type="button" onClick={() => setIsFav(!isFav)} className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xl transition-all hover:bg-white/10"><span>{isFav ? "❤️" : "🤍"}</span></button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 sm:mt-10 flex flex-col gap-6">
          <div className="bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="border-b border-white/5"><button type="button" onClick={() => toggleAccordion("aciklama")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 group transition-all"><span className="text-sm font-bold tracking-wide text-slate-200 group-hover:text-blue-400 transition-colors">🛠️ Ürün Açıklaması</span><span className="text-slate-500 group-hover:text-blue-400 transition-colors">▼</span></button><div className={`grid transition-all duration-300 ease-in-out ${openAccordion === "aciklama" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><div className="px-4 pb-4 border-t border-white/5 pt-3 text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || "Açıklama yok." }} /></div></div></div>
            <div className="border-b border-white/5"><button type="button" onClick={() => toggleAccordion("teknik")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 group transition-all"><span className="text-sm font-bold tracking-wide text-slate-200 group-hover:text-blue-400 transition-colors">⚙️ Teknik Özellikler</span><span className="text-slate-500 group-hover:text-blue-400 transition-colors">▼</span></button><div className={`grid transition-all duration-300 ease-in-out ${openAccordion === "teknik" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><ProductSpecs product={product} /></div></div></div>
            <div className="border-b border-white/5"><button type="button" onClick={() => toggleAccordion("fps_paneli")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 group transition-all"><span className="text-sm font-bold tracking-wide text-slate-200 group-hover:text-blue-400 transition-colors">🎮 Oyun FPS Performans Laboratuvarı</span><span className="text-slate-500 group-hover:text-blue-400 transition-colors">▼</span></button><div className={`grid transition-all duration-300 ease-in-out ${openAccordion === "fps_paneli" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><ProductFps product={product} /></div></div></div>
            <div className="border-b border-white/5" ref={reviewsRef}><button type="button" onClick={() => toggleAccordion("topluluk")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 group transition-all"><span className="text-sm font-bold tracking-wide text-slate-200 group-hover:text-blue-400 transition-colors">💬 Kullanıcı Yorumları</span><span className="text-slate-500 group-hover:text-blue-400 transition-colors">▼</span></button><div className={`grid transition-all duration-300 ease-in-out ${openAccordion === "topluluk" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><div className="px-4 pb-4 border-t border-white/5"><ProductReviews productId={product.id} /></div></div></div></div>
            <div className="border-b border-white/5"><button type="button" onClick={() => toggleAccordion("sorusor")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 group transition-all"><span className="text-sm font-bold tracking-wide text-slate-200 group-hover:text-blue-400 transition-colors">❓ Mağazaya Soru Sor</span><span className="text-slate-500 group-hover:text-blue-400 transition-colors">▼</span></button><div className={`grid transition-all duration-300 ease-in-out ${openAccordion === "sorusor" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><div className="px-4 pb-4 border-t border-white/5"><ProductQuestions productId={product.id} /></div></div></div></div>
            <div><button type="button" onClick={() => toggleAccordion("karsilastir")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 group transition-all"><span className="text-sm font-bold tracking-wide text-slate-200 group-hover:text-blue-400 transition-colors">⚖️ Ürün Karşılaştırma Laboratuvarı</span><span className="text-slate-500 group-hover:text-blue-400 transition-colors">▼</span></button><div className={`grid transition-all duration-300 ease-in-out ${openAccordion === "karsilastir" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><ProductCompare product={product} allProducts={allProducts} /></div></div></div>
          </div>
        </div>

        {/* MOBİL PANEL */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden">
          <div className="flex flex-col"><span className="text-[9px] font-bold text-emerald-400 uppercase">Havale Fiyatı</span><span className="text-base font-black text-emerald-400">{havaleFiyati.toLocaleString('tr-TR')} TL</span></div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsFav(!isFav)} className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-lg"><span>{isFav ? "❤️" : "🤍"}</span></button>
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className={`font-black py-2.5 px-5 rounded-md uppercase text-xs text-white ${addedSuccess ? "bg-emerald-500" : "bg-blue-600"}`}>{addingToCart ? "..." : addedSuccess ? "✅ SEPETE EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}</button>
          </div>
        </div>

      </div>
    </PhotoProvider>
  );
}