"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../CartContext"; 

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 

  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);

  // POPUP (MODAL) STATE'LERİ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "qa">("reviews");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const pId = product?._id?.toString() || product?.id?.toString() || "urun";
  const gercekKod = product?.sku || pId.slice(-6).toUpperCase();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      try {
        const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
        const isProductFav = currentFavs.some((item: any) => String(item.id) === String(pId));
        setIsFav(isProductFav);
      } catch (e) {}
    }
  }, [pId]);

  // Popup açıldığında arkaplanın kaymasını engelle
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setShowReviewForm(false);
      setShowQuestionForm(false);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

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

  const handleToggleFavorite = () => {
    if (typeof window === "undefined") return;
    try {
      const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
      const existingIndex = currentFavs.findIndex((item: any) => String(item.id) === String(pId));
      let updatedFavs = [...currentFavs];
      
      if (existingIndex > -1) {
        updatedFavs.splice(existingIndex, 1);
        setIsFav(false);
      } else {
        updatedFavs.push({
          id: String(pId),
          name: product.isim || product.name,
          price: Number(product.indirimliFiyat || product.price || product.fiyat || 0),
          image: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400",
          slug: product.slug || pId
        });
        setIsFav(true);
      }
      localStorage.setItem("user_favorites", JSON.stringify(updatedFavs));
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (e) {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.isim || product.name || "Bilgin PC Market",
          text: "Şu efsane ürüne bir bak!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Paylaşım iptal edildi", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <div className="min-h-screen bg-[#050814] text-white pb-24 sm:pb-10 font-sans overflow-x-hidden relative">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 sm:py-10 sm:px-6">
        
        {/* SOL: GÖRSEL SLIDER */}
        <div className="w-full md:w-1/2 md:rounded-3xl bg-transparent sm:bg-[#09090b] sm:border sm:border-white/5 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {resimler.map((img: string, idx: number) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center flex justify-center items-center h-[350px] sm:h-[500px] relative">
                <img src={img} alt={`${urunAdi} - ${idx + 1}`} className={`max-w-full max-h-full object-contain p-4 sm:p-8 ${tukendiMi ? 'grayscale opacity-50' : ''}`} />
              </div>
            ))}
          </div>
          {resimler.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
              {resimler.map((_: any, dotIdx: number) => (
                <div key={dotIdx} className="w-2 h-2 rounded-full bg-[#00e5ff] opacity-50 shadow-[0_0_5px_#00e5ff]" />
              ))}
            </div>
          )}
        </div>
        
        {/* SAĞ: BİLGİLER */}
        <div className="w-full md:w-1/2 px-4 sm:px-0 mt-4 sm:mt-0 flex flex-col justify-center">
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {tukendiMi ? (
               <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md tracking-wider">TÜKENDİ</span>
            ) : (
               <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md tracking-wider">STOKTA VAR {adetGosterilecekMi ? `(${product.stokAdedi})` : ""}</span>
            )}
            {indirimVarMi && !tukendiMi && (
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md uppercase">🔥 %{indirimOrani} İNDİRİM</span>
            )}
            <span className="bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black px-2 py-1 rounded-md uppercase ml-auto">KOD: {gercekKod}</span>
          </div>

          <h1 className="text-lg sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-snug sm:leading-tight mb-2">
            {urunAdi}
          </h1>

          {/* YILDIZLAR -> Tıklanınca Modalı Açar */}
          <div onClick={() => { setActiveTab("reviews"); setIsModalOpen(true); }} className="flex items-center gap-2 mb-5 cursor-pointer group w-fit">
            <div className="flex text-amber-400 text-[13px] sm:text-sm tracking-widest">★★★★★</div>
            <span className="text-slate-400 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors underline decoration-white/20 underline-offset-4">24 Değerlendirme</span>
            <span className="text-slate-600 text-[11px] sm:text-xs">|</span>
            <span className="text-slate-400 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors underline decoration-white/20 underline-offset-4">8 Soru & Cevap</span>
          </div>

          <div className="relative rounded-2xl bg-[#09090b] p-4 sm:p-6 mb-5 border border-[#00e5ff]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="mb-4">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Kredi Kartı Tek Çekim</span>
              {indirimVarMi ? (
                <div className="flex items-end gap-2">
                  <span className="text-zinc-500 text-xs line-through font-bold mb-0.5">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                  <span className="text-xl sm:text-3xl font-black text-white leading-none">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                </div>
              ) : (
                <span className="text-xl sm:text-3xl font-black text-white leading-none">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
              )}
            </div>

            <div>
              <span className="text-[#10b981] text-[10px] font-bold uppercase tracking-widest block mb-1">Havale / EFT Fiyatı</span>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-3xl font-black text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] leading-none">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                {havaleYuzdesi > 0 && <span className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[9px] font-bold px-2 py-0.5 rounded uppercase">%{havaleYuzdesi} İndirim</span>}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-lg">💳</span>
              <span className="text-amber-400 text-xs sm:text-sm font-bold tracking-wide">9 ve 12 Taksit İmkanları</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#09090b] border border-white/5 p-3 sm:p-4 rounded-xl mb-5">
            <div className="text-2xl sm:text-3xl">🚚</div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">HIZLI KARGO AVANTAJI</span>
              <span className="text-xs sm:text-sm font-medium mt-0.5">{timeLeft} <strong className="text-[#10b981] font-black">{shippingMessage}</strong></span>
            </div>
          </div>

          <div className="hidden sm:block relative mt-1 mb-4">
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-16 rounded-xl font-black text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-between px-6 ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:bg-[#00c4db] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]'}`}>
              <div className="flex items-center gap-3">
                {!tukendiMi && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                <span>{tukendiMi ? "STOK TÜKENDİ" : "SEPETE EKLE"}</span>
              </div>
              {!tukendiMi && (
                 <div className="bg-black/10 border border-black/10 px-3 py-1 rounded-lg flex flex-col items-end leading-tight">
                   <span className="text-[10px] opacity-80 font-bold tracking-widest">HAVALE İLE</span>
                   <span className="text-base">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                 </div>
              )}
            </button>
            {addedSuccess && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-xs font-black px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce whitespace-nowrap">✅ Başarıyla Sepete Eklendi!</div>}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={handleToggleFavorite} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${isFav ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#09090b] border-white/10 hover:bg-white/5 text-white'}`}>
              {isFav ? "❤️ Favorilerde" : "🤍 Favoriye Ekle"}
            </button>
            <button onClick={handleShare} className="flex-1 py-3 rounded-xl border border-white/10 bg-[#09090b] hover:bg-white/5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white transition-all">
              {copied ? "✅ Kopyalandı" : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> Paylaş / Kopyala</>}
            </button>
          </div>

          {/* YORUMLAR VE SORULAR BUTONLARI -> Modalı Açar */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
            <button onClick={() => { setActiveTab("reviews"); setIsModalOpen(true); }} className="flex-1 py-3 rounded-xl border border-white/5 bg-[#050814] hover:bg-white/5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 transition-all">
              ⭐ Ürün Yorumları
            </button>
            <button onClick={() => { setActiveTab("qa"); setIsModalOpen(true); }} className="flex-1 py-3 rounded-xl border border-white/5 bg-[#050814] hover:bg-white/5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 transition-all">
              💬 Soru & Cevap
            </button>
          </div>
          
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#050814]/95 backdrop-blur-xl border-t border-white/10 p-3 sm:hidden z-[90]">
        <div className="relative">
          <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-14 rounded-xl font-black text-[13px] uppercase tracking-widest flex items-center justify-between px-4 ${tukendiMi ? 'bg-zinc-800 text-zinc-600' : 'bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)]'}`}>
            <div className="flex items-center gap-2">
              {!tukendiMi && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              <span>{tukendiMi ? "STOK TÜKENDİ" : "SEPETE EKLE"}</span>
            </div>
            {!tukendiMi && (
               <div className="bg-black/10 border border-black/10 px-2 py-1 rounded-md flex flex-col items-end leading-none">
                 <span className="text-[8px] opacity-80 font-bold tracking-widest mb-0.5">HAVALE İLE</span>
                 <span className="text-[11px]">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
               </div>
            )}
          </button>
          {addedSuccess && <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-[10px] font-black px-4 py-2 rounded-lg shadow-xl animate-bounce whitespace-nowrap">✅ Sepete Eklendi!</div>}
        </div>
      </div>

      {/* ŞEFİM: İŞTE O EFSANEVİ AKILLI POPUP (MODAL) SİSTEMİ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center">
          
          {/* Arkaplan Cam Efekti */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Pencere Kutusu */}
          <div className="relative w-full sm:w-[600px] bg-[#0b1329] border border-[#00e5ff]/20 rounded-t-3xl sm:rounded-3xl max-h-[90vh] sm:max-h-[80vh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] sm:shadow-[0_0_50px_rgba(0,229,255,0.1)]">
            
            {/* Mobilde kaydırma çubuğu görseli */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 sm:hidden"></div>

            {/* Başlık ve Kapat Butonu */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="font-black text-lg uppercase tracking-wider text-white">Müşteri Deneyimi</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            {/* Sekmeler (Tabs) */}
            <div className="flex border-b border-white/5">
              <button onClick={() => setActiveTab("reviews")} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "reviews" ? "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/5" : "border-transparent text-slate-400 hover:text-slate-200"}`}>
                ⭐ Yorumlar (24)
              </button>
              <button onClick={() => setActiveTab("qa")} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "qa" ? "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/5" : "border-transparent text-slate-400 hover:text-slate-200"}`}>
                💬 Sorular (8)
              </button>
            </div>

            {/* İçerik Alanı (Kaydırılabilir) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              
              {/* YORUMLAR SEKMESİ */}
              {activeTab === "reviews" && (
                <div className="animate-fade-in">
                  
                  {/* Puan Özeti Tablosu */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center bg-[#050814] border border-white/5 p-6 rounded-2xl mb-6">
                    <div className="flex flex-col items-center justify-center w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0">
                      <span className="text-5xl font-black text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">4.8</span>
                      <div className="text-amber-400 text-lg mt-1 tracking-widest">★★★★★</div>
                      <span className="text-xs text-slate-400 mt-2 font-medium">24 Değerlendirme</span>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-2/3">
                      {[5, 4, 3, 2, 1].map((star, idx) => {
                        const percents = [85, 10, 5, 0, 0];
                        return (
                          <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <span className="w-12 text-right">{star} Yıldız</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percents[idx]}%` }}></div>
                            </div>
                            <span className="w-8">{percents[idx]}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Yorum Yap Butonu ve Formu */}
                  <div className="mb-8">
                    {!showReviewForm ? (
                      <button onClick={() => setShowReviewForm(true)} className="w-full py-3 bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#00e5ff]/20 transition-colors">
                        ✍️ Bu Ürünü Değerlendir
                      </button>
                    ) : (
                      <div className="bg-[#050814] p-5 rounded-xl border border-[#00e5ff]/20 animate-fade-in">
                        <h4 className="font-bold text-white mb-4 text-sm">Deneyimini Paylaş</h4>
                        <div className="flex gap-2 mb-4 text-2xl text-slate-600 cursor-pointer">
                          <span className="hover:text-amber-400 transition-colors">★</span><span className="hover:text-amber-400 transition-colors">★</span><span className="hover:text-amber-400 transition-colors">★</span><span className="hover:text-amber-400 transition-colors">★</span><span className="hover:text-amber-400 transition-colors">★</span>
                        </div>
                        <input type="text" placeholder="İsminiz (Sadece baş harfi görünür)" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3" />
                        <textarea rows={3} placeholder="Ürün hakkında ne düşünüyorsunuz?" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3"></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-xs font-bold uppercase hover:bg-white/10">İptal</button>
                          <button onClick={() => { alert("Şefim yorum onaylanmak üzere sisteme düştü!"); setShowReviewForm(false); }} className="flex-1 py-2 bg-[#00e5ff] text-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#00c4db]">Gönder</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Örnek Yorumlar Listesi */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#09090b] p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00e5ff] to-blue-600 flex items-center justify-center text-xs font-black text-white">M</div>
                          <div>
                            <p className="text-white text-xs font-bold">M*** Y***</p>
                            <div className="text-amber-400 text-[10px] tracking-widest">★★★★★</div>
                          </div>
                        </div>
                        <span className="text-slate-500 text-[10px]">2 gün önce</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">Paketleme çok sağlamdı, kargo ertesi gün elime ulaştı. Performansı muazzam, düşünmeden alabilirsiniz. Bilgin PC ailesine teşekkürler!</p>
                    </div>

                    <div className="bg-[#09090b] p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-black text-white">A</div>
                          <div>
                            <p className="text-white text-xs font-bold">A*** K***</p>
                            <div className="text-amber-400 text-[10px] tracking-widest">★★★★<span className="text-slate-600">★</span></div>
                          </div>
                        </div>
                        <span className="text-slate-500 text-[10px]">1 hafta önce</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">Ürün güzel, tek eksiği kutu içeriğinde ekstra kablo olmamasıydı. Yine de fiyatına göre en iyi performans veren model bu.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SORULAR SEKMESİ */}
              {activeTab === "qa" && (
                <div className="animate-fade-in">
                  
                  {/* Soru Sor Butonu ve Formu */}
                  <div className="mb-6">
                    {!showQuestionForm ? (
                      <button onClick={() => setShowQuestionForm(true)} className="w-full py-3 bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#00e5ff]/20 transition-colors">
                        ❓ Mağazaya Soru Sor
                      </button>
                    ) : (
                      <div className="bg-[#050814] p-5 rounded-xl border border-[#00e5ff]/20 animate-fade-in">
                        <h4 className="font-bold text-white mb-3 text-sm">Sorunuzu İletin</h4>
                        <textarea rows={3} placeholder="Ürünle ilgili ne öğrenmek istersiniz?" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3"></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => setShowQuestionForm(false)} className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-xs font-bold uppercase hover:bg-white/10">İptal</button>
                          <button onClick={() => { alert("Sorunuz mağazaya iletildi!"); setShowQuestionForm(false); }} className="flex-1 py-2 bg-[#00e5ff] text-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#00c4db]">Gönder</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Örnek Soru Cevap Listesi */}
                  <div className="flex flex-col gap-4">
                    
                    <div className="bg-[#050814] rounded-xl border border-white/5 overflow-hidden">
                      <div className="p-4 bg-[#09090b]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-slate-700 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Soru</span>
                          <span className="text-slate-400 text-xs font-medium">B*** E*** (3 gün önce)</span>
                        </div>
                        <p className="text-slate-300 text-xs">Merhaba, bu ekran kartı 500W güç kaynağı ile sorunsuz çalışır mı?</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-[#00e5ff]/5 to-transparent border-l-2 border-[#00e5ff]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#00e5ff] text-black text-[9px] px-2 py-0.5 rounded font-bold uppercase">Cevap</span>
                          <span className="text-[#00e5ff] text-xs font-bold">Bilgin PC Mağazası</span>
                        </div>
                        <p className="text-slate-300 text-xs">Merhaba değerli müşterimiz, evet sisteminizde kaliteli bir 500W güç kaynağı varsa bu model için yeterli olacaktır. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Tailwind için custom scrollbar ve animasyon stil tanımları (sayfaya özel) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}