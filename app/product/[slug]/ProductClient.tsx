"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { useCompare } from "@/app/CompareContext";
import { X, Gamepad2, ChevronLeft, ChevronRight, ShoppingCart, Heart, GitCompare, Share2, Star, Zap, Info, Gauge, Crosshair } from "lucide-react";
import Link from "next/link"; // 🚀 BREADCRUMB İÇİN LİNK EKLENDİ

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 
  const { karsilastirmayaEkle, setPopupAcik } = useCompare(); 
  
  const [activeTab, setActiveTab] = useState("teknik");
  const [seciliCozunurluk, setSeciliCozunurluk] = useState("1080P");
  const [seciliIslemci, setSeciliIslemci] = useState("i5"); 

  const [reviewName, setReviewName] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([] as any[]);
  const [questions, setQuestions] = useState([] as any[]);
  const [reviewsLoading, setReviewsLoading] = useState(true); 
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);

  const [seciliResimIndex, setSeciliResimIndex] = useState(0);
  const [fade, setFade] = useState(false); 
  const touchStartRef = useRef(0);
  const [lightboxAcik, setLightboxAcik] = useState(false);
  
  const tabsRef = useRef<HTMLDivElement>(null);

  const fpsVerileri: any = product.fps_testleri || {};
  const dbOyunlar = Object.keys(fpsVerileri);
  
  const pId = product?._id?.toString() || product?.id?.toString() || "urun";
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc: any, curr: any) => acc + Number(curr.rating), 0) / totalReviews).toFixed(1) : "0.0";

  const handleToggleFavorite = async () => {
    const oncekiDurum = isFav; setIsFav(!oncekiDurum); 
    try {
      const res = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: String(pId) }) });
      if (res.status === 401) { setIsFav(oncekiDurum); toast.error("Giriş yapın."); return; }
      if (!res.ok) setIsFav(oncekiDurum);
    } catch (error) { setIsFav(oncekiDurum); }
  };

  const handleCompare = () => { karsilastirmayaEkle(product); setTimeout(() => { if (typeof setPopupAcik === "function") setPopupAcik(true); }, 100); };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try { const res = await fetch("/api/favorites"); if (res.ok) { const data = await res.json(); setIsFav(data.favorites?.includes(pId) || false); } } catch (error) {}
    }; checkFavoriteStatus();
  }, [pId]);

  useEffect(() => {
    const fetchCanliYorumlar = async () => {
      setReviewsLoading(true); 
      try { 
         const res = await fetch("/api/reviews?productId=" + pId); 
         const result = await res.json(); 
         if (result.success) { 
            setReviews(result.data.filter((item: any) => item.type === "review")); 
            setQuestions(result.data.filter((item: any) => item.type === "question")); 
         } 
      } catch (error) {}
      setReviewsLoading(false); 
    }; 
    fetchCanliYorumlar();
  }, [pId]);

  useEffect(() => {
    if (lightboxAcik) document.body.style.overflow = "hidden"; else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [lightboxAcik]);

  const urunAdi = product.isim || product.name || "İsimsiz Ürün";
  const normalFiyat = Number(product.regular_price || product.fiyat || product.price || 0);
  const indirimliFiyat = product.indirimliFiyat ? Number(product.indirimliFiyat) : null;
  const gecerliFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;
  const havaleYuzdesi = product.havaleIndirimi !== undefined ? Number(product.havaleIndirimi) : 5;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault(); if (!reviewText.trim()) return toast.error("Yorum yazın!"); setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: pId, type: "review", name: reviewName, text: reviewText, rating: reviewRating }) });
      if (res.ok) { toast.success("Yorumunuz gönderildi!"); setReviewText(""); setReviewName(""); setReviewRating(5); } else toast.error("Hata oluştu.");
    } catch (error) {} setIsSubmitting(false);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault(); if (!questionText.trim()) return toast.error("Soru yazın!"); setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: pId, type: "question", name: questionName, text: questionText }) });
      if (res.ok) { toast.success("Sorunuz gönderildi!"); setQuestionText(""); setQuestionName(""); } else toast.error("Hata oluştu.");
    } catch (error) {} setIsSubmitting(false);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    try { sepeteEkle({ id: String(pId), isim: urunAdi, fiyat: gecerliFiyat, resim: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400", varyasyon: "Standart Model", havaleIndirimi: havaleYuzdesi }); toast.success("Sepete eklendi!"); } catch (error) {} finally { setAddingToCart(false); }
  };
  
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: urunAdi, text: "Bu ürüne bak!", url: window.location.href }); } catch (err) {} } else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success("Bağlantı kopyalandı"); }
  };

  const handleReviewClick = () => {
    setActiveTab("yorumlar");
    if (tabsRef.current) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = tabsRef.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  if (!product) return <div className="text-center p-10 text-[#00e5ff] font-bold">Yükleniyor...</div>;

  const indirimVarMi = indirimliFiyat !== null && normalFiyat > indirimliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  const havaleFiyati = gecerliFiyat - (gecerliFiyat * havaleYuzdesi) / 100;

  let resimler = [product.resim || "https://via.placeholder.com/600"];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) { resimler = product.images.map((img: any) => typeof img === "string" ? img : (img?.src || resimler[0])); }

  const degistirResim = (yeniIndex: number) => { if (yeniIndex === seciliResimIndex) return; setFade(true); setTimeout(() => { setSeciliResimIndex(yeniIndex); setFade(false); }, 200); };
  const sonrakiResim = () => degistirResim((seciliResimIndex + 1) % resimler.length);
  const oncekiResim = () => degistirResim((seciliResimIndex - 1 + resimler.length) % resimler.length);
  
  const handleTouchStart = (e: React.TouchEvent) => touchStartRef.current = e.touches[0].clientX;
  const handleTouchEnd = (e: React.TouchEvent) => { const fark = touchStartRef.current - e.changedTouches[0].clientX; if (fark > 40) sonrakiResim(); else if (fark < -40) oncekiResim(); };

  // Kategoriyi veritabanından dinamik alıyoruz, yoksa "Ekran Kartları" diyoruz.
  const kategoriIsmi = product.kategori || "Ekran Kartları";
  const kategoriSlug = product.kategoriSlug || "ekran-kartlari";

  const renderFpsSection = () => (
    <div className="bg-[#09090b] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col w-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] select-none touch-manipulation">
       <div className="flex-1 w-full flex flex-col items-center">
          <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-3 mb-5 w-full">
             {[{ id: "i5", top: "INTEL i5", bottom: "RYZEN 5" }, { id: "i7", top: "INTEL i7", bottom: "RYZEN 7" }, { id: "i9", top: "INTEL i9", bottom: "RYZEN 9" }].map((islemci) => (
                <button key={islemci.id} onClick={() => setSeciliIslemci(islemci.id as any)} className={`flex-1 min-w-[30%] flex flex-col items-center justify-center py-2 px-1 sm:px-2 rounded-xl border transition-all touch-manipulation ${seciliIslemci === islemci.id ? "bg-[#121215] border-[#00d2ff] text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]" : "bg-black border-white/5 text-slate-500 hover:text-white"}`}>
                   <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">{islemci.top}</span>
                   <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider mt-0.5">{islemci.bottom}</span>
                </button>
             ))}
          </div>

          <div className="flex justify-center gap-2 p-1 bg-black rounded-full w-fit mb-6 border border-white/5">
             {["1080P", "2K", "4K"].map(res => (
                <button key={res} onClick={() => setSeciliCozunurluk(res)} className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all touch-manipulation ${seciliCozunurluk === res ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>{res}</button>
             ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 w-full mb-4">
             {dbOyunlar.length > 0 ? dbOyunlar.map(oyun => (
                <div key={oyun} className="w-[100px] sm:w-[110px] flex-shrink-0 bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col transition-all hover:scale-105 hover:border-[#f59e0b]/50">
                   <div className="h-16 bg-zinc-900 relative flex items-center justify-center p-2 text-center text-white/70 text-[10px] font-black uppercase">
                      {oyun.toLowerCase().includes("valorant") || oyun.toLowerCase().includes("cs") ? (
                        <Crosshair className="w-8 h-8 absolute opacity-10" />
                      ) : (
                        <Gamepad2 className="w-8 h-8 absolute opacity-10" />
                      )}
                      <span className="relative z-10 drop-shadow-md">{oyun}</span>
                   </div>
                   <div className="bg-[#f59e0b]/10 border-t border-[#f59e0b]/20 p-2 text-center">
                      <span className="block text-[#f59e0b] text-base sm:text-lg font-black leading-none">{fpsVerileri[oyun]?.[seciliIslemci]?.[seciliCozunurluk] || "-"}</span>
                      <span className="text-[#f59e0b] text-[9px] font-bold">FPS</span>
                   </div>
                </div>
             )) : <div className="text-center text-gray-500 text-sm w-full py-4">Oyun testi verisi bulunamadı. Lütfen panelden ekleyin.</div>}
          </div>

          <div className="w-full text-center mt-2 border-t border-white/5 pt-3">
             <span className="text-[9px] sm:text-[10px] text-gray-500/70 font-medium tracking-wide">
                * Gösterilen FPS değerleri global donanım inceleme platformları ve bağımsız test laboratuvarları baz alınarak derlenmiş ortalama değerlerdir.
             </span>
          </div>
       </div>
    </div>
  );

  return (
    // 🚀 DÜZELTME 1: Alt boşluk pb-32'den pb-16'ya düşürüldü (Tam kıvamında) 🚀
    <div className="bg-[#050505] text-white font-sans pb-7 sm:pb-10 relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        body { -webkit-tap-highlight-color: transparent; }
        button, img, a, .select-none { -webkit-touch-callout: none; user-select: none; }
        .badge-rosette-page { position: absolute; top: 15px; right: 15px; width: 70px; height: 70px; background: #e60000; clip-path: polygon(50% 0%, 60% 10%, 75% 5%, 80% 20%, 95% 25%, 90% 40%, 100% 50%, 90% 60%, 95% 75%, 80% 80%, 75% 95%, 60% 90%, 50% 100%, 40% 90%, 25% 95%, 20% 80%, 5% 75%, 10% 60%, 0% 50%, 10% 40%, 5% 25%, 20% 20%, 25% 5%, 40% 10%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 20; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5)); pointer-events: none; }
        .badge-rosette-page span:first-child { font-size: 18px; font-weight: 900; line-height: 1; margin-top: 5px; }
        .badge-rosette-page span:last-child { font-size: 11px; font-weight: 900; line-height: 1; }
      `}} />

      <div className="max-w-[1200px] mx-auto sm:px-6 py-0 sm:py-10 flex flex-col md:flex-row gap-0 sm:gap-8 lg:gap-12 relative items-start">
        
        {/* SOL KOLON (RESİMLER) */}
        <div className="w-full md:w-[45%] flex flex-col relative md:sticky md:top-28 h-max mb-6 sm:mb-0 transition-all duration-500">
          
          <div className="flex items-center gap-2 mb-2 sm:mb-4 px-4 sm:px-0 pt-4 sm:pt-0">
             {tukendiMi ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> TÜKENDİ</div>
             ) : (
                <div className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span> STOKTA VAR</div>
             )}
          </div>

          <div 
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-square sm:aspect-[4/3] bg-transparent sm:bg-white/[0.02] sm:backdrop-blur-xl sm:border sm:border-white/5 sm:rounded-2xl flex items-center justify-center p-0 sm:p-6 overflow-hidden mb-2 group select-none"
          >
            {indirimVarMi && !tukendiMi && (
              <div className="badge-rosette-page"><span>%{indirimOrani}</span><span>İNDİRİM</span></div>
            )}
            
            <button onClick={(e) => { e.preventDefault(); oncekiResim(); }} className="hidden sm:flex absolute left-3 z-30 w-10 h-10 bg-black/50 border border-white/10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00d2ff] hover:text-black hover:scale-110 touch-manipulation"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={(e) => { e.preventDefault(); sonrakiResim(); }} className="hidden sm:flex absolute right-3 z-30 w-10 h-10 bg-black/50 border border-white/10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00d2ff] hover:text-black hover:scale-110 touch-manipulation"><ChevronRight className="w-6 h-6" /></button>

            <img 
              onClick={() => setLightboxAcik(true)}
              src={resimler[seciliResimIndex]} 
              alt={urunAdi} 
              className={`w-full h-full object-contain cursor-zoom-in sm:filter sm:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ${fade ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'} ${tukendiMi ? "grayscale opacity-50" : ""}`} 
            />
          </div>

          {resimler.length > 1 && (
            <div className="flex sm:hidden justify-center gap-2 mt-2 mb-2 px-4 select-none">
              {resimler.map((_, idx) => (
                <button key={idx} onClick={() => degistirResim(idx)} className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation ${seciliResimIndex === idx ? 'w-6 bg-[#00d2ff]' : 'w-2 bg-zinc-800'}`} />
              ))}
            </div>
          )}

          {resimler.length > 1 && (
            <div className="hidden sm:flex gap-3 overflow-x-auto pb-2 select-none [&::-webkit-scrollbar]:hidden">
              {resimler.map((img: string, idx: number) => (
                <button key={idx} onClick={() => degistirResim(idx)} className={`w-20 h-20 flex-shrink-0 bg-white/[0.02] border rounded-xl p-2 transition-all duration-300 flex items-center justify-center touch-manipulation ${seciliResimIndex === idx ? "border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]" : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"}`}>
                  <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          <div className="hidden md:block mt-8">
             <h3 className="text-lg font-black uppercase mb-4 text-white flex items-center gap-2 select-none">
               <Gauge className="w-5 h-5 text-[#00d2ff]" /> Performans Testleri
             </h3>
             {renderFpsSection()}
          </div>
        </div>

        {/* SAĞ KOLON (BİLGİLER VE SEPET) */}
        <div className="w-full md:w-[55%] flex flex-col px-4 sm:px-0 mt-4 sm:mt-0">
          
          {/* 🚀 YENİ: KATEGORİ YOLU (BREADCRUMB) EKLENDİ 🚀 */}
          <div className="flex items-center gap-2 mb-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 select-none">
             <Link href="/" className="hover:text-[#00d2ff] transition-colors">Ana Sayfa</Link>
             <span className="text-gray-700">/</span>
             <Link href={`/kategori/${kategoriSlug}`} className="hover:text-[#00d2ff] transition-colors text-gray-300">
                {kategoriIsmi}
             </Link>
          </div>

          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 select-none touch-manipulation">
             <div className="text-xs sm:text-sm font-black text-[#00d2ff] tracking-[0.2em] uppercase">
                {product.marka || "BİLGİN PC"}
             </div>
             <div onClick={handleReviewClick} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm cursor-pointer group">
                <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${Number(avgRating) >= s ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}`} />)}
                </div>
                <span className="text-gray-400 font-bold ml-1 group-hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
                   {reviewsLoading ? 'Güncelleniyor...' : (totalReviews > 0 ? `${avgRating} (${totalReviews} Yorum)` : 'Henüz Değerlendirilmedi')}
                </span>
             </div>
          </div>

          <h1 className="text-xl sm:text-4xl font-black uppercase tracking-tight leading-snug sm:leading-tight mb-6 sm:mb-8 select-none">
            {urunAdi}
          </h1>

          <div className="hidden sm:block relative rounded-3xl bg-[#09090b] p-6 sm:p-8 mb-6 sm:mb-8 border border-[#00e5ff]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)] overflow-hidden select-none">
             {indirimVarMi && !tukendiMi && <div className="text-gray-500 text-sm sm:text-lg line-through font-bold mb-1">{normalFiyat.toLocaleString("tr-TR")} TL</div>}
             <div className="text-3xl sm:text-5xl font-black leading-none mb-5 text-white">
                {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-xl sm:text-2xl text-[#00d2ff]">TL</span>
             </div>

             {havaleYuzdesi > 0 && !tukendiMi && (
               <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                 <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
                 <span className="text-[#10b981] font-black tracking-wider text-xs sm:text-sm">HAVALE: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 0})} TL</span>
               </div>
             )}
          </div>

          <div className="flex gap-2 sm:gap-4 mb-8 sm:mb-10 select-none">
             <button onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`hidden sm:flex flex-1 h-14 sm:h-16 rounded-2xl font-black text-sm sm:text-lg uppercase tracking-widest items-center justify-center gap-2 sm:gap-3 transition-all touch-manipulation ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#00e5ff] text-black hover:bg-[#00c4db] shadow-[0_0_20px_rgba(0,229,255,0.2)]'}`}>
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" /> {tukendiMi ? "Tükendi" : "Sepete Ekle"}
             </button>
             <button onClick={handleToggleFavorite} className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl flex items-center justify-center border transition-all touch-manipulation ${isFav ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#09090b] border-white/10 hover:border-[#00d2ff] hover:text-[#00d2ff]'}`} title="Favori">
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFav ? 'fill-red-500' : ''}`} />
             </button>
             <button onClick={handleCompare} className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center transition-all touch-manipulation hover:border-[#00d2ff] hover:text-[#00d2ff]" title="Karşılaştır">
                <GitCompare className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>
             <button onClick={handleShare} className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center transition-all touch-manipulation hover:border-[#00d2ff] hover:text-[#00d2ff]" title="Paylaş">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>
          </div>

          <div className="block md:hidden mb-10 select-none">
             <h3 className="text-lg font-black uppercase mb-4 text-white flex items-center gap-2">
               <Gauge className="w-5 h-5 text-[#00d2ff]" /> Performans Testleri
             </h3>
             {renderFpsSection()}
          </div>

          <div ref={tabsRef} className="flex overflow-x-auto gap-2 border-b border-white/10 pb-3 mb-6 select-none [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#00d2ff]/50 [&::-webkit-scrollbar-thumb]:rounded-full scroll-mt-24">
             <button onClick={() => setActiveTab('teknik')} className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all uppercase touch-manipulation tracking-widest ${activeTab === 'teknik' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Teknik Özellikler</button>
             <button onClick={() => setActiveTab('yorumlar')} className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all uppercase touch-manipulation tracking-widest ${activeTab === 'yorumlar' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Yorumlar</button>
             <button onClick={() => setActiveTab('sorular')} className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all uppercase touch-manipulation tracking-widest ${activeTab === 'sorular' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Sorular</button>
          </div>

          <div className="min-h-[150px] mb-4">

             {activeTab === 'teknik' && (
                <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden select-none">
                   {product.teknik_ozellikler && Object.keys(product.teknik_ozellikler).length > 0 ? (
                      Object.entries(product.teknik_ozellikler).map(([key, val], i) => (
                         <div key={i} className={`flex justify-between p-4 sm:p-5 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs w-1/2">{key}</span>
                            <span className="text-white font-medium text-right w-1/2 text-xs sm:text-sm">{val as string}</span>
                         </div>
                      ))
                   ) : (<div className="p-8 text-center text-gray-500 text-sm">Teknik detay girilmemiş.</div>)}
                </div>
             )}

             {activeTab === 'yorumlar' && (
                <div className="space-y-6">
                   <form onSubmit={handleSubmitReview} className="bg-[#09090b] border border border-white/5 p-5 sm:p-6 rounded-2xl">
                      <h3 className="text-base font-black uppercase mb-4 tracking-wide text-white">Yorum Yap</h3>
                      <div className="flex gap-1.5 mb-4">
                         {[1,2,3,4,5].map(s => (
                            <button type="button" key={s} onClick={() => setReviewRating(s)} className={`text-2xl transition-all touch-manipulation ${reviewRating >= s ? 'text-[#d4af37]' : 'text-gray-700'}`}>★</button>
                         ))}
                      </div>
                      <input type="text" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#00d2ff] outline-none mb-3" />
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Ürün hakkında ne düşünüyorsunuz?" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#00d2ff] outline-none mb-3 min-h-[80px] resize-none" />
                      <button disabled={isSubmitting} className="w-full sm:w-auto bg-[#00d2ff] text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-[#00c4db] transition-all touch-manipulation">{isSubmitting ? '...' : 'Gönder'}</button>
                   </form>

                   <div className="space-y-3">
                      {reviewsLoading ? (
                         <div className="text-center text-[#00d2ff] py-8 text-sm font-bold animate-pulse uppercase tracking-widest">
                            Yorumlar Güncelleniyor...
                         </div>
                      ) : reviews.length > 0 ? reviews.map((r, i) => (
                         <div key={i} className="bg-[#09090b] border border-white/5 p-5 rounded-2xl">
                            <div className="flex justify-between items-start mb-2">
                               <strong className="text-white font-bold text-sm">{r.name || "Anonim"}</strong>
                               <div className="text-[#d4af37] text-[10px]">{"★".repeat(Number(r.rating))}{"☆".repeat(5-Number(r.rating))}</div>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{r.text}</p>
                            {(r.answer || r.reply || r.adminReply || r.cevap) && (
                               <div className="mt-3 bg-[#00d2ff]/10 border-l-2 border-[#00d2ff] p-3 rounded-r-xl">
                                  <span className="text-[#00d2ff] font-black text-[9px] uppercase block mb-1">Bilgin PC Yanıtı</span>
                                  <p className="text-gray-300 text-xs sm:text-sm">{r.answer || r.reply || r.adminReply || r.cevap}</p>
                               </div>
                            )}
                         </div>
                      )) : (
                         <div className="text-center text-gray-500 py-6 text-sm">İlk yorumu sen yap!</div>
                      )}
                   </div>
                </div>
             )}

             {activeTab === 'sorular' && (
                <div className="space-y-6">
                   <form onSubmit={handleSubmitQuestion} className="bg-[#09090b] border border-white/5 p-5 sm:p-6 rounded-2xl">
                      <h3 className="text-base font-black uppercase mb-4 tracking-wide text-white">Soru Sor</h3>
                      <input type="text" value={questionName} onChange={e => setQuestionName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#00d2ff] outline-none mb-3" />
                      <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Ürünle ilgili ne öğrenmek istersiniz?" className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#00d2ff] outline-none mb-3 min-h-[80px] resize-none" />
                      <button disabled={isSubmitting} className="w-full sm:w-auto bg-[#00d2ff] text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-[#00c4db] transition-all touch-manipulation">{isSubmitting ? '...' : 'Gönder'}</button>
                   </form>

                   <div className="space-y-3">
                      {reviewsLoading ? (
                         <div className="text-center text-[#00d2ff] py-8 text-sm font-bold animate-pulse uppercase tracking-widest">
                            Sorular Güncelleniyor...
                         </div>
                      ) : questions.length > 0 ? questions.map((q, i) => (
                         <div key={i} className="bg-[#09090b] border border-white/5 p-5 rounded-2xl">
                            <span className="text-white font-bold block mb-1 text-sm">❓ {q.name || "Müşteri"}</span>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{q.text}</p>
                            {(q.answer || q.reply || q.adminReply || q.cevap) && (
                               <div className="mt-3 bg-[#00d2ff]/10 border-l-2 border-[#00d2ff] p-3 rounded-r-xl">
                                  <span className="text-[#00d2ff] font-black text-[9px] uppercase block mb-1">Bilgin PC Yanıtı</span>
                                  <p className="text-gray-300 text-xs sm:text-sm">{q.answer || q.reply || q.adminReply || q.cevap}</p>
                               </div>
                            )}
                         </div>
                      )) : (
                         <div className="text-center text-gray-500 py-6 text-sm">Henüz soru yok. İlk soran sen ol!</div>
                      )}
                   </div>
                </div>
             )}
          </div>
          
        </div>
      </div>

      {/* 🚀 DÜZELTME 2: Açıklama alanındaki resimlerin de altındaki gereksiz boşluk (mb) sıfırlandı 🚀 */}
      {product.aciklama && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 pb-2 border-t border-white/10 select-none touch-manipulation">
           <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest mb-6 text-white flex items-center gap-3 select-none">
             <Info className="w-5 h-5 sm:w-6 sm:h-6 text-[#00d2ff]" /> Ürün Açıklaması
           </h2>
           <div className="prose prose-invert max-w-none select-none touch-manipulation 
              [&_*]:!select-none [&_*]:!-webkit-touch-callout-none
              [&_img]:w-full [&_img]:h-auto [&_img]:!m-0 [&_img]:!border-none [&_img]:!rounded-none [&_img]:block [&_img]:mt-6 [&_img]:mb-0
              [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-8
              [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-200 [&_h3]:mb-2 [&_h3]:mt-6
              [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:text-sm sm:[&_p]:text-base [&_p]:mb-2" 
              dangerouslySetInnerHTML={{ __html: product.aciklama }} 
           />
        </div>
      )}

      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 z-50 flex items-center justify-between shadow-[0_-20px_40px_rgba(0,0,0,0.8)] select-none">
         <div className="flex flex-col">
            {indirimVarMi && !tukendiMi && <span className="text-gray-500 text-[11px] line-through font-medium mb-0.5">{normalFiyat.toLocaleString("tr-TR")} ₺</span>}
            <span className="text-[22px] font-black text-white leading-none mb-1.5">{gecerliFiyat.toLocaleString("tr-TR")} <span className="text-[#00d2ff] text-lg">₺</span></span>
            
            {havaleYuzdesi > 0 && !tukendiMi && (
               <span className="text-[#10b981] text-[10px] font-black tracking-wide flex items-center gap-1">
                 <Zap className="w-3 h-3" /> HAVALE: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 0})} ₺
               </span>
            )}
         </div>
         <button onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`h-12 px-6 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all touch-manipulation ${tukendiMi ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00d2ff] text-black shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:bg-[#00c4db]'}`}>
            <ShoppingCart className="w-4 h-4" /> {tukendiMi ? "Tükendi" : "Sepete Ekle"}
         </button>
      </div>

      {lightboxAcik && (
        <div 
          onTouchStart={handleTouchStart} 
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none"
        >
           <button onClick={() => setLightboxAcik(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-50 touch-manipulation"><X className="w-6 h-6" /></button>
           
           <button onClick={(e) => { e.stopPropagation(); oncekiResim(); }} className="hidden sm:flex absolute left-6 w-14 h-14 bg-white/10 rounded-full items-center justify-center hover:bg-[#00d2ff] hover:text-black transition-colors z-50 touch-manipulation"><ChevronLeft className="w-8 h-8" /></button>
           
           <img src={resimler[seciliResimIndex]} className={`w-full sm:max-w-full sm:max-h-[85vh] object-contain sm:rounded-xl shadow-2xl transition-all duration-300 ${fade ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`} alt="" />
           
           <button onClick={(e) => { e.stopPropagation(); sonrakiResim(); }} className="hidden sm:flex absolute right-6 w-14 h-14 bg-white/10 rounded-full items-center justify-center hover:bg-[#00d2ff] hover:text-black transition-colors z-50 touch-manipulation"><ChevronRight className="w-8 h-8" /></button>
        </div>
      )}

    </div>
  );
}