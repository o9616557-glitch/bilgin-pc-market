"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { useCompare } from "@/app/CompareContext";
import { X, Gamepad2, ChevronLeft, ChevronRight, ShoppingCart, Heart, GitCompare, Share2, Info, Star, Zap } from "lucide-react";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  // ==========================================
  // 🚀 SENİN MEVCUT MOTORLARIN (HİÇ DOKUNULMADI) 🚀
  // ==========================================
  const { sepeteEkle } = useCart(); 
  const { karsilastirmayaEkle, setPopupAcik } = useCompare(); 
  
  const [activeTab, setActiveTab] = useState("aciklama"); // Varsayılan sekme: Açıklama
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
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [seciliResimIndex, setSeciliResimIndex] = useState(0);
  const [fade, setFade] = useState(false); 
  const touchStartRef = useRef(0);
  const [lightboxAcik, setLightboxAcik] = useState(false);

  const fpsVerileri: any = product.fps_testleri || {};
  const dbOyunlar = Object.keys(fpsVerileri);
  const pId = product?._id?.toString() || product?.id?.toString() || "urun";
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc: any, curr: any) => acc + Number(curr.rating), 0) / totalReviews).toFixed(1) : "0.0";

  const showToast = (message: string) => { setToastMessage(message); setTimeout(() => setToastMessage(""), 4000); };

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
      try { const res = await fetch("/api/reviews?productId=" + pId); const result = await res.json(); if (result.success) { setReviews(result.data.filter((item: any) => item.type === "review")); setQuestions(result.data.filter((item: any) => item.type === "question")); } } catch (error) {}
    }; fetchCanliYorumlar();
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
    e.preventDefault(); if (!reviewText.trim()) return showToast("Yorum yazın!"); setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: pId, type: "review", name: reviewName, text: reviewText, rating: reviewRating }) });
      if (res.ok) { showToast("Yorumunuz gönderildi!"); setReviewText(""); setReviewName(""); setReviewRating(5); } else showToast("Hata oluştu.");
    } catch (error) {} setIsSubmitting(false);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault(); if (!questionText.trim()) return showToast("Soru yazın!"); setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: pId, type: "question", name: questionName, text: questionText }) });
      if (res.ok) { showToast("Sorunuz gönderildi!"); setQuestionText(""); setQuestionName(""); } else showToast("Hata oluştu.");
    } catch (error) {} setIsSubmitting(false);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    try { sepeteEkle({ id: String(pId), isim: urunAdi, fiyat: gecerliFiyat, resim: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400", varyasyon: "Standart Model", havaleIndirimi: havaleYuzdesi }); toast.success("Sepete eklendi!"); } catch (error) {} finally { setAddingToCart(false); }
  };
  
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: urunAdi, text: "Bu ürüne bak!", url: window.location.href }); } catch (err) {} } else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success("Bağlantı kopyalandı"); }
  };

  if (!product) return <div className="text-center p-10 text-[#00d2ff] font-bold">Yükleniyor...</div>;

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
  const handleTouchEnd = (e: React.TouchEvent) => { const fark = touchStartRef.current - e.changedTouches[0].clientX; if (fark > 30) sonrakiResim(); else if (fark < -30) oncekiResim(); };

  // ==========================================
  // 🚀 ULTIMATE ARAYÜZ TASARIMI 🚀
  // ==========================================
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-24 sm:pb-10">
      
      {/* İndirim Rozeti İçin CSS (Sadece sayfa içi) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .badge-rosette-page { position: absolute; top: 15px; left: 15px; width: 80px; height: 80px; background: #e60000; clip-path: polygon(50% 0%, 60% 10%, 75% 5%, 80% 20%, 95% 25%, 90% 40%, 100% 50%, 90% 60%, 95% 75%, 80% 80%, 75% 95%, 60% 90%, 50% 100%, 40% 90%, 25% 95%, 20% 80%, 5% 75%, 10% 60%, 0% 50%, 10% 40%, 5% 25%, 20% 20%, 25% 5%, 40% 10%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 20; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5)); }
        .badge-rosette-page span:first-child { font-size: 20px; font-weight: 900; line-height: 1; margin-top: 5px; }
        .badge-rosette-page span:last-child { font-size: 13px; font-weight: 900; line-height: 1; }
      `}} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* === SOL: GALERİ ALANI === */}
        <div className="w-full md:w-[45%] flex flex-col relative md:sticky md:top-24 h-max">
          
          <div className="flex items-center gap-2 mb-4">
             {tukendiMi ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black px-3 py-1.5 rounded-lg tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> TÜKENDİ</div>
             ) : (
                <div className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-black px-3 py-1.5 rounded-lg tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span> STOKTA VAR</div>
             )}
          </div>

          <div 
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-square sm:aspect-[4/3] bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-center p-6 overflow-hidden mb-4 group"
          >
            {indirimVarMi && !tukendiMi && (
              <div className="badge-rosette-page"><span>%{indirimOrani}</span><span>İNDİRİM</span></div>
            )}
            
            <button onClick={(e) => { e.preventDefault(); oncekiResim(); }} className="absolute left-3 z-30 w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00d2ff] hover:text-black hover:scale-110"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={(e) => { e.preventDefault(); sonrakiResim(); }} className="absolute right-3 z-30 w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#00d2ff] hover:text-black hover:scale-110"><ChevronRight className="w-6 h-6" /></button>

            <img 
              onClick={() => setLightboxAcik(true)}
              src={resimler[seciliResimIndex]} 
              alt={urunAdi} 
              className={`max-w-full max-h-full object-contain cursor-zoom-in filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ${fade ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'} ${tukendiMi ? "grayscale opacity-50" : ""}`} 
            />
          </div>

          {resimler.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
              {resimler.map((img: string, idx: number) => (
                <button key={idx} onClick={() => degistirResim(idx)} className={`w-20 h-20 flex-shrink-0 bg-white/[0.02] border rounded-xl p-2 transition-all duration-300 flex items-center justify-center ${seciliResimIndex === idx ? "border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]" : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"}`}>
                  <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === SAĞ: ÜRÜN BİLGİLERİ VE AKSİYONLAR === */}
        <div className="w-full md:w-[55%] flex flex-col">
          
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
             <div className="text-sm font-black text-gray-500 tracking-[0.2em] uppercase">{product.marka || "BİLGİN PC"}</div>
             <div className="flex items-center gap-2 text-sm">
                <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${Number(avgRating) >= s ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}`} />)}
                </div>
                <span className="text-gray-400 font-bold ml-1">{totalReviews > 0 ? `${avgRating} (${totalReviews})` : 'Yeni Ürün'}</span>
             </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-8">
            {urunAdi}
          </h1>

          {/* Premium Fiyat Kutusu */}
          <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden group">
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00d2ff]/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#00d2ff]/30 transition-colors"></div>
             
             {indirimVarMi && !tukendiMi && <div className="text-gray-500 text-lg line-through font-bold mb-1">{normalFiyat.toLocaleString("tr-TR")} TL</div>}
             <div className="text-4xl sm:text-5xl font-black leading-none mb-6">
                {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-2xl text-[#00d2ff]">TL</span>
             </div>

             {havaleYuzdesi > 0 && !tukendiMi && (
               <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2.5 rounded-xl">
                 <Zap className="w-5 h-5 text-[#10b981]" />
                 <span className="text-[#10b981] font-black tracking-wider text-sm">HAVALE: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 0})} TL</span>
               </div>
             )}
          </div>

          {/* Aksiyon Butonları (PC İçin) */}
          <div className="hidden sm:flex gap-4 mb-10">
             <button onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`flex-1 h-16 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${tukendiMi ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#00d2ff] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,210,255,0.4)]'}`}>
                <ShoppingCart className="w-6 h-6" /> {tukendiMi ? "Tükendi" : "Sepete Ekle"}
             </button>
             <button onClick={handleToggleFavorite} className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${isFav ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 hover:border-[#00d2ff] hover:text-[#00d2ff]'}`} title="Favori">
                <Heart className={`w-6 h-6 ${isFav ? 'fill-red-500' : ''}`} />
             </button>
             <button onClick={handleCompare} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:border-[#00d2ff] hover:text-[#00d2ff]" title="Karşılaştır">
                <GitCompare className="w-6 h-6" />
             </button>
             <button onClick={handleShare} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:border-[#00d2ff] hover:text-[#00d2ff]" title="Paylaş">
                <Share2 className="w-6 h-6" />
             </button>
          </div>

          {/* SEKMELER MENÜSÜ */}
          <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-4 mb-6 [&::-webkit-scrollbar]:hidden">
             <button onClick={() => setActiveTab('aciklama')} className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all uppercase tracking-widest ${activeTab === 'aciklama' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Detay</button>
             <button onClick={() => setActiveTab('teknik')} className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all uppercase tracking-widest ${activeTab === 'teknik' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Teknik</button>
             <button onClick={() => setActiveTab('fps')} className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all uppercase tracking-widest ${activeTab === 'fps' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>FPS Testi</button>
             <button onClick={() => setActiveTab('yorumlar')} className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all uppercase tracking-widest ${activeTab === 'yorumlar' ? 'bg-[#00d2ff] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Yorumlar</button>
          </div>

          {/* SEKME İÇERİKLERİ */}
          <div className="min-h-[300px]">
             
             {/* Açıklama */}
             {activeTab === 'aciklama' && (
                <div className="prose prose-invert max-w-none 
                   [&_img]:w-full [&_img]:rounded-2xl [&_img]:my-6 [&_img]:border [&_img]:border-white/5
                   [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mb-4
                   [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:text-[15px]" 
                   dangerouslySetInnerHTML={{ __html: product.aciklama || "<p class='text-gray-500'>Açıklama bulunamadı.</p>" }} 
                />
             )}

             {/* Teknik Özellikler */}
             {activeTab === 'teknik' && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                   {product.teknik_ozellikler && Object.keys(product.teknik_ozellikler).length > 0 ? (
                      Object.entries(product.teknik_ozellikler).map(([key, val], i) => (
                         <div key={i} className={`flex justify-between p-4 sm:p-5 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs sm:text-sm w-1/2">{key}</span>
                            <span className="text-white font-medium text-right w-1/2 text-sm">{val as string}</span>
                         </div>
                      ))
                   ) : (<div className="p-8 text-center text-gray-500">Teknik detay girilmemiş.</div>)}
                </div>
             )}

             {/* FPS Testi */}
             {activeTab === 'fps' && (
                <div className="space-y-6">
                   <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl w-fit mb-6 border border-white/10">
                      {["1080P", "2K", "4K"].map(res => (
                         <button key={res} onClick={() => setSeciliCozunurluk(res)} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${seciliCozunurluk === res ? 'bg-[#00d2ff] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>{res}</button>
                      ))}
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {dbOyunlar.length > 0 ? dbOyunlar.map(oyun => (
                         <div key={oyun} className="bg-white/[0.02] border border-[#00d2ff]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-[#00d2ff]/50 transition-colors">
                            <span className="text-gray-400 font-black text-[10px] tracking-widest uppercase mb-3">{oyun}</span>
                            <span className="text-4xl font-black text-white">{fpsVerileri[oyun]?.["i5"]?.[seciliCozunurluk] || "-"}</span>
                            <span className="text-[#00d2ff] text-[10px] font-bold mt-1 uppercase">FPS</span>
                         </div>
                      )) : <div className="col-span-full p-8 text-center text-gray-500">FPS verisi yok.</div>}
                   </div>
                </div>
             )}

             {/* Yorumlar ve Sorular */}
             {activeTab === 'yorumlar' && (
                <div className="space-y-8">
                   <form onSubmit={handleSubmitReview} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                      <h3 className="text-lg font-black uppercase mb-4 tracking-wide text-white">Yorum Yap</h3>
                      <div className="flex gap-2 mb-6">
                         {[1,2,3,4,5].map(s => (
                            <button type="button" key={s} onClick={() => setReviewRating(s)} className={`text-2xl transition-all ${reviewRating >= s ? 'text-[#d4af37]' : 'text-gray-700'}`}>★</button>
                         ))}
                      </div>
                      <input type="text" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#00d2ff] outline-none mb-4" />
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Ürün hakkında ne düşünüyorsunuz?" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#00d2ff] outline-none mb-4 min-h-[100px] resize-none" />
                      <button disabled={isSubmitting} className="w-full sm:w-auto bg-[#00d2ff] text-black font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-white transition-all">{isSubmitting ? '...' : 'Gönder'}</button>
                   </form>

                   <div className="space-y-4">
                      {reviews.length > 0 ? reviews.map((r, i) => (
                         <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-3">
                               <strong className="text-white font-bold">{r.name || "Anonim"}</strong>
                               <div className="text-[#d4af37] text-xs">{"★".repeat(Number(r.rating))}{"☆".repeat(5-Number(r.rating))}</div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{r.text}</p>
                            {(r.answer || r.reply) && (
                               <div className="mt-4 bg-[#00d2ff]/10 border-l-2 border-[#00d2ff] p-4 rounded-r-xl">
                                  <span className="text-[#00d2ff] font-black text-[10px] uppercase block mb-1">Bilgin PC Yanıtı</span>
                                  <p className="text-gray-300 text-sm">{r.answer || r.reply}</p>
                               </div>
                            )}
                         </div>
                      )) : <div className="text-center text-gray-500 py-8">Henüz yorum yok. İlk yorumu sen yap!</div>}
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* MOBİL YAPIŞKAN SEPET BUTONU */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 px-6 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
         <div className="flex flex-col">
            {indirimVarMi && !tukendiMi && <span className="text-gray-500 text-[10px] line-through">{normalFiyat.toLocaleString("tr-TR")} ₺</span>}
            <span className="text-2xl font-black text-white leading-none">{gecerliFiyat.toLocaleString("tr-TR")} ₺</span>
         </div>
         <button onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`h-12 px-6 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tukendiMi ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00d2ff] text-black shadow-[0_0_20px_rgba(0,210,255,0.3)]'}`}>
            <ShoppingCart className="w-4 h-4" /> {tukendiMi ? "Tükendi" : "Sepete Ekle"}
         </button>
      </div>

      {/* LIGHTBOX (Tıklanınca Büyüyen Resim) */}
      {lightboxAcik && (
        <div onClick={() => setLightboxAcik(false)} className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"><X className="w-6 h-6" /></button>
           <img src={resimler[seciliResimIndex]} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" alt="" />
        </div>
      )}

    </div>
  );
}