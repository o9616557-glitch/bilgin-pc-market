"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { useCompare } from "@/app/CompareContext";
import { X, Gamepad2 } from "lucide-react";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 
  const { karsilastirmayaEkle, setPopupAcik } = useCompare(); 
  
  // 🚀 ZIRHLI HAFIZALAR (MOTOR)
  const [activeTab, setActiveTab] = useState("reviews");
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
  const [teknikPopupAcik, setTeknikPopupAcik] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fpsVerileri: any = {
    Valorant: { i5: { "1080P": "450+", "2K": "320+", "4K": "180+" }, i7: { "1080P": "540+", "2K": "390+", "4K": "210+" }, i9: { "1080P": "620+", "2K": "460+", "4K": "260+" } },
    CS2: { i5: { "1080P": "380+", "2K": "260+", "4K": "140+" }, i7: { "1080P": "460+", "2K": "310+", "4K": "180+" }, i9: { "1080P": "550+", "2K": "380+", "4K": "230+" } },
    GTAV: { i5: { "1080P": "165+", "2K": "120+", "4K": "70+" }, i7: { "1080P": "190+", "2K": "145+", "4K": "85+" }, i9: { "1080P": "220+", "2K": "170+", "4K": "105+" } },
    PUBG: { i5: { "1080P": "210+", "2K": "150+", "4K": "90+" }, i7: { "1080P": "250+", "2K": "180+", "4K": "110+" }, i9: { "1080P": "290+", "2K": "220+", "4K": "135+" } }
  };

  const pId = product?._id?.toString() || product?.id?.toString() || "urun";
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc: any, curr: any) => acc + Number(curr.rating), 0) / totalReviews).toFixed(1) : "0.0";

  const showToast = (message: string) => { setToastMessage(message); setTimeout(() => setToastMessage(""), 4000); };

  const handleToggleFavorite = async () => {
    const oncekiDurum = isFav; setIsFav(!oncekiDurum); 
    try {
      const res = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: String(pId) }) });
      if (res.status === 401) { setIsFav(oncekiDurum); toast.error("Favorilere eklemek için lütfen giriş yapın."); return; }
      if (!res.ok) { setIsFav(oncekiDurum); toast.error("Bir sorun oluştu."); }
    } catch (error) { setIsFav(oncekiDurum); }
  };

  const handleCompare = () => { karsilastirmayaEkle(product); setTimeout(() => { if (typeof setPopupAcik === "function") setPopupAcik(true); }, 100); };

  useEffect(() => {
    const checkFavoriteStatus = async () => { try { const res = await fetch("/api/favorites"); if (res.ok) { const data = await res.json(); setIsFav(data.favorites?.includes(pId) || false); } } catch (error) {} };
    checkFavoriteStatus();
  }, [pId]);

  useEffect(() => {
    const fetchCanliYorumlar = async () => { try { const res = await fetch("/api/reviews?productId=" + pId); const result = await res.json(); if (result.success) { setReviews(result.data.filter((item: any) => item.type === "review")); setQuestions(result.data.filter((item: any) => item.type === "question")); } } catch (error) {} };
    fetchCanliYorumlar();
  }, [pId]);

  useEffect(() => { if (teknikPopupAcik) document.body.style.overflow = "hidden"; else document.body.style.overflow = "unset"; return () => { document.body.style.overflow = "unset"; }; }, [teknikPopupAcik]);

  useEffect(() => {
    const calculateShipping = () => {
      const now = new Date();
      if (now.getHours() < 16) { const pad = (n: number) => n.toString().padStart(2, "0"); setTimeLeft(pad(15 - now.getHours()) + ":" + pad(59 - now.getMinutes()) + ":" + pad(59 - now.getSeconds()) + " içinde"); setShippingMessage("BUGÜN KARGODA!"); } 
      else { setTimeLeft("Saat 16:00'ı geçtiği için"); setShippingMessage("YARIN KARGODA!"); }
    };
    calculateShipping(); const timer = setInterval(calculateShipping, 1000); return () => clearInterval(timer);
  }, []);

  const urunAdi = product.isim || product.name || "İsimsiz Ürün";
  const normalFiyat = Number(product.regular_price || product.fiyat || product.price || 0);
  const indirimliFiyat = product.indirimliFiyat ? Number(product.indirimliFiyat) : null;
  const gecerliFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;
  const havaleYuzdesi = product.havaleIndirimi !== undefined ? Number(product.havaleIndirimi) : 5;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault(); if (!reviewText.trim()) return showToast("Lütfen bir yorum yazın!"); setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: pId, type: "review", name: reviewName, text: reviewText, rating: reviewRating }) });
      if (res.ok) { showToast("Yorumunuz onaya gönderildi! 🚀"); setReviewText(""); setReviewName(""); setReviewRating(5); } else showToast("Bir hata oluştu, giriş yaptığınızdan emin olun.");
    } catch (error) { showToast("Bağlantı hatası oluştu!"); } setIsSubmitting(false);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault(); if (!questionText.trim()) return showToast("Lütfen bir soru yazın!"); setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: pId, type: "question", name: questionName, text: questionText }) });
      if (res.ok) { showToast("Sorunuz onaya gönderildi! 🚀"); setQuestionText(""); setQuestionName(""); } else showToast("Bir hata oluştu, giriş yaptığınızdan emin olun.");
    } catch (error) { showToast("Bağlantı hatası oluştu!"); } setIsSubmitting(false);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    try { sepeteEkle({ id: String(pId), isim: urunAdi, fiyat: gecerliFiyat, resim: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400", varyasyon: "Standart Model", havaleIndirimi: havaleYuzdesi }); setAddedSuccess(true); setTimeout(() => setAddedSuccess(false), 2000); } 
    catch (error) { toast.error("Eklenemedi!"); } finally { setAddingToCart(false); }
  };
  
  const handleShare = async () => { if (navigator.share) { try { await navigator.share({ title: urunAdi, text: "Şu efsane ürüne bir bak!", url: window.location.href }); } catch (err) {} } else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  
  const getPopupTitle = () => {
    if (activeTab === "reviews") return { icon: "⭐", text: "Müşteri Yorumları" };
    if (activeTab === "questions") return { icon: "💬", text: "Soru ve Cevaplar" };
    if (activeTab === "tech") return { icon: "⚙️", text: "Teknik Bilgiler" };
    if (activeTab === "fps") return { icon: "🎮", text: "FPS Test Sonuçları" };
    return { icon: "⚡", text: "Sistem Bilgileri" };
  };

  if (!product) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-[#00e5ff] font-bold text-xl">Yükleniyor...</div>;

  const indirimVarMi = indirimliFiyat !== null && normalFiyat > indirimliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  const adetGosterilecekMi = product.stokAdedi !== null && product.stokAdedi !== undefined && product.stokAdedi !== "" && Number(product.stokAdedi) > 0;
  const havaleFiyati = gecerliFiyat - (gecerliFiyat * havaleYuzdesi) / 100;
  const resimler = product.images && product.images.length > 0 ? product.images.map((i:any) => i.src) : [product.resim || "https://via.placeholder.com/600"];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100 pb-40 sm:pb-10 font-sans overflow-x-hidden relative max-w-[100vw]">
      {/* BAŞARI MESAJI TOAST */}
      <div className={`fixed top-24 right-5 z-[9999999] bg-slate-900/90 backdrop-blur-md border border-[#00e5ff]/50 shadow-[0_0_30px_rgba(0,229,255,0.2)] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-500 transform ${toastMessage ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
        <span className="text-[#00e5ff] text-2xl drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">✓</span>
        <p className="text-sm tracking-wide">{toastMessage}</p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 sm:py-10 sm:px-6">
        
        {/* SOL: GÖRSELLER */}
        <div className="w-full md:w-1/2 md:rounded-3xl bg-transparent sm:bg-slate-900/20 sm:backdrop-blur-sm sm:border sm:border-slate-800/60 relative shadow-2xl">
          <div className="flex overflow-x-auto snap-x snap-mandatory w-full scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {resimler.map((img: string, idx: number) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center flex justify-center items-center h-[350px] sm:h-[500px] relative">
                <img src={img} alt={urunAdi + " - " + (idx + 1)} className={`max-w-full max-h-full object-contain p-4 sm:p-8 drop-shadow-2xl transition-all duration-500 hover:scale-105 ${tukendiMi ? "grayscale opacity-50" : ""}`} />
              </div>
            ))}
          </div>
        </div>
        
        {/* SAĞ: ÜRÜN BİLGİLERİ */}
        <div className="w-full md:w-1/2 px-4 sm:px-0 mt-4 sm:mt-0 flex flex-col justify-center">
          
          {/* ETİKETLER */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tukendiMi ? (
               <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-lg tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.2)]">TÜKENDİ</span>
            ) : (
               <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-lg tracking-wider shadow-[0_0_10px_rgba(0,229,255,0.2)]">STOKTA VAR {adetGosterilecekMi ? "(" + product.stokAdedi + ")" : ""}</span>
            )}
            {indirimVarMi && !tukendiMi && (
              <span className="bg-gradient-to-r from-orange-500 to-rose-600 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-lg uppercase shadow-lg shadow-orange-500/20">🔥 %{indirimOrani} İNDİRİM</span>
            )}
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-snug sm:leading-tight mb-3 break-words drop-shadow-md">
            {urunAdi}
          </h1>

          {/* YILDIZLAR */}
          <div onClick={() => { setActiveTab("reviews"); setTeknikPopupAcik(true); }} className="flex items-center gap-2 mb-6 cursor-pointer group w-fit bg-slate-900/30 border border-slate-800/60 px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all duration-300">
            <div className="flex text-amber-400 text-[14px] sm:text-base tracking-widest drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
              {Number(avgRating) >= 1 ? "★" : "☆"}{Number(avgRating) >= 2 ? "★" : "☆"}{Number(avgRating) >= 3 ? "★" : "☆"}{Number(avgRating) >= 4 ? "★" : "☆"}{Number(avgRating) >= 5 ? "★" : "☆"}
            </div>
            <span className="text-slate-300 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors">{reviews.length} Değerlendirme</span>
          </div>

          {/* FİYAT KUTUSU (MODERN GLASSMORPHISM) */}
          <div className="relative rounded-2xl bg-slate-900/40 backdrop-blur-xl p-5 sm:p-7 mb-6 border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden group hover:border-[#00e5ff]/40 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00e5ff] blur-[120px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="mb-5 relative z-10">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Kredi Kartı Tek Çekim</span>
              {indirimVarMi ? (
                <div className="flex items-end gap-3">
                  <span className="text-slate-500 text-sm line-through font-bold mb-1">{normalFiyat.toLocaleString("tr-TR")} TL</span>
                  <span className="text-2xl sm:text-4xl font-black text-white leading-none tracking-tight">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
                </div>
              ) : (
                <span className="text-2xl sm:text-4xl font-black text-white leading-none tracking-tight">{gecerliFiyat.toLocaleString("tr-TR")} TL</span>
              )}
            </div>
            <div className="relative z-10">
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Havale / EFT Fiyatı</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-4xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)] leading-none tracking-tight">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                {havaleYuzdesi > 0 && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase">%{havaleYuzdesi} İndirim</span>}
              </div>
            </div>
          </div>

          {/* KARGO KUTUSU */}
          <div className="flex items-center gap-4 bg-slate-900/30 backdrop-blur-sm border border-slate-800 p-4 sm:p-5 rounded-2xl mb-6 shadow-lg">
            <div className="text-2xl sm:text-4xl drop-shadow-md">🚀</div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase mb-1">Hızlı Kargo Avantajı</span>
              <span className="text-xs sm:text-sm font-medium text-slate-200">{timeLeft} <strong className="text-emerald-400 font-black">{shippingMessage}</strong></span>
            </div>
          </div>

          {/* MASAÜSTÜ SEPETE EKLE */}
          <div className="hidden sm:block relative mt-2 mb-6">
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-16 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-500 flex items-center justify-between px-6 mb-3 ${tukendiMi ? "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700" : "bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-[1.02]"}`}>
              <div className="flex items-center gap-3">
                {!tukendiMi && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                <span>{tukendiMi ? "STOK TÜKENDİ" : "SEPETE EKLE"}</span>
              </div>
              {!tukendiMi && (
                 <div className="bg-black/15 px-3 py-1.5 rounded-xl flex flex-col items-end leading-tight backdrop-blur-sm">
                   <span className="text-[10px] opacity-90 font-bold">HAVALE İLE</span><span className="text-base tracking-tight">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                 </div>
              )}
            </button>
            {addedSuccess && <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.6)] animate-bounce">✅ Sepete Eklendi!</div>}
          </div>

          {/* MASAÜSTÜ: FAVORİ, KARŞILAŞTIR VE PAYLAŞ */}
          <div className="hidden sm:flex items-center gap-3 mb-6">
            <button onClick={handleToggleFavorite} className={`flex-1 py-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-in-out ${isFav ? "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "bg-slate-900/40 border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white"}`}>
              {isFav ? "❤️ Favorilerde" : "🤍 Favoriye Ekle"}
            </button>
            <button onClick={handleCompare} className="flex-1 py-3.5 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/80 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all duration-300 ease-in-out">
              ⚖️ Karşılaştır
            </button>
            <button onClick={handleShare} className="flex-1 py-3.5 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/80 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all duration-300 ease-in-out">
              {copied ? "🟩 Kopyalandı" : "📤 Paylaş / Kopyala"}
            </button>
          </div>

          {/* MASAÜSTÜ: 4'LÜ HIZLI BUTON (MODERN) */}
          <div className="hidden sm:grid grid-cols-4 gap-3 mb-6 z-10 relative">
            {[
              { id: "tech", icon: "⚙️", label: "Teknik" },
              { id: "fps", icon: "🎮", label: "FPS Testi" },
              { id: "reviews", icon: "⭐", label: "Yorumlar" },
              { id: "questions", icon: "💬", label: "Sorular" }
            ].map((btn) => (
              <button key={btn.id} onClick={(e) => { e.preventDefault(); setActiveTab(btn.id); setTeknikPopupAcik(true); }} className="group flex flex-col items-center justify-center gap-2 bg-slate-900/40 border border-slate-700 hover:border-[#00e5ff]/50 hover:bg-slate-800/60 text-slate-400 hover:text-[#00e5ff] py-4 rounded-2xl transition-all duration-500 ease-in-out shadow-lg">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-500">{btn.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors duration-500">{btn.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 📱 YENİ NESİL KONTROL MERKEZİ MOBİL ALT BAR (ULTRA MODERN) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-xl border-t border-slate-800/80 p-3 z-[50] flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* KAYDIRILABİLİR ALAN */}
        <div className="flex items-center gap-2.5 overflow-x-auto scroll-smooth whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
           <button onClick={() => { setActiveTab("tech"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 hover:border-[#00e5ff] transition-all duration-300"><span className="text-sm">⚙️</span><span className="text-[11px] font-black uppercase tracking-wider">Teknik</span></button>
           <button onClick={() => { setActiveTab("fps"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 hover:border-[#00e5ff] transition-all duration-300"><span className="text-sm">🎮</span><span className="text-[11px] font-black uppercase tracking-wider">FPS</span></button>
           <div className="w-[1px] h-6 bg-slate-700 shrink-0 mx-1"></div>
           <button onClick={handleCompare} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 hover:border-[#00e5ff] transition-all duration-300"><span className="text-sm">⚖️</span><span className="text-[11px] font-black uppercase tracking-wider">Kıyasla</span></button>
           <button onClick={handleToggleFavorite} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 hover:border-red-500 transition-all duration-300"><span className="text-sm">{isFav ? "❤️" : "🤍"}</span><span className="text-[11px] font-black uppercase tracking-wider">Favori</span></button>
           <div className="w-[1px] h-6 bg-slate-700 shrink-0 mx-1"></div>
           <button onClick={() => { setActiveTab("reviews"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 hover:border-[#00e5ff] transition-all duration-300"><span className="text-sm">⭐</span><span className="text-[11px] font-black uppercase tracking-wider">Yorumlar</span></button>
           <button onClick={() => { setActiveTab("questions"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 hover:border-[#00e5ff] transition-all duration-300"><span className="text-sm">💬</span><span className="text-[11px] font-black uppercase tracking-wider">Sorular</span></button>
        </div>
        
        <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-14 font-black uppercase tracking-wider rounded-xl flex items-center justify-between px-5 transition-all duration-500 ${tukendiMi ? "bg-slate-800 text-slate-500 border border-slate-700" : "bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.4)]"}`}>
           <span className="text-base">{tukendiMi ? "TÜKENDİ" : "SEPETE EKLE"}</span>
           {!tukendiMi && <div className="flex flex-col items-end leading-tight"><span className="text-[9px] opacity-90 font-black">HAVALE İLE</span><span className="text-sm font-black">{havaleFiyati.toLocaleString("tr-TR")} TL</span></div>}
        </button>
      </div>

      {/* 💎 MODERN BUZLU CAM POPUP */}
      {teknikPopupAcik && (
        <div className="fixed inset-0 z-[999999] flex justify-center items-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-500">
          <div className="absolute inset-0 hidden sm:block" onClick={() => setTeknikPopupAcik(false)}></div>
          
          <div className="relative w-full h-full sm:max-h-[85vh] sm:w-[750px] mx-auto bg-slate-900/80 backdrop-blur-2xl sm:border sm:border-slate-700 sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* OYUNCU ARKAPLAN DETAYI */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-0 overflow-hidden opacity-[0.02]">
               <Gamepad2 className="w-48 h-48 sm:w-64 sm:h-64 text-white mb-4" />
               <span className="text-5xl sm:text-6xl font-black tracking-[0.5em] text-white uppercase ml-4">GAMING</span>
            </div>

            {/* BAŞLIK VE X TUŞU (DAHA KOYU VE BELİRGİN HEADER) */}
            <div className="flex justify-between items-center px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-700/80 shrink-0 bg-slate-950/95 shadow-lg relative z-30">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-3 drop-shadow-md">
                <span className="text-[#00e5ff] text-2xl drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">{getPopupTitle().icon}</span> 
                {getPopupTitle().text}
              </h2>
              <button onClick={() => setTeknikPopupAcik(false)} className="text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="scroll-smooth overflow-y-auto flex-1 p-5 sm:p-8 flex flex-col text-slate-200 bg-transparent relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
               <div className="pb-10">
                  
                  {/* 1. YORUMLAR SEKMESİ */}
                  {activeTab === "reviews" && (
                     <div className="space-y-6">
                        <form onSubmit={handleSubmitReview} className="mb-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl relative z-20 shadow-lg">
                           <h3 className="text-[#00e5ff] font-black text-sm uppercase tracking-wider mb-4 drop-shadow-sm">Değerlendirme Yap</h3>
                           <div className="flex gap-2 mb-5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <button type="button" key={star} onClick={() => setReviewRating(star)} className={`text-2xl sm:text-3xl transition-all duration-300 hover:scale-110 ${reviewRating >= star ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "text-slate-600 hover:text-amber-400/50"}`}>★</button>
                              ))}
                           </div>
                           <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3 transition-all duration-300 placeholder-slate-500" />
                           <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Bu donanım hakkında ne düşünüyorsun? Performansı nasıl?" className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 min-h-[120px] mb-4 resize-none transition-all duration-300 placeholder-slate-500" required />
                           <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-[#00e5ff] text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl hover:bg-[#00c4db] transition-all duration-500 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                              {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
                           </button>
                        </form>

                        {reviews.length === 0 ? <p className="text-center py-8 text-slate-400 font-medium bg-slate-800/20 rounded-2xl border border-slate-700/50 transition-all duration-500">Bu ürüne henüz yorum yapılmamış. İlk yorumu sen yap!</p> : reviews.map((rev, i) => (
                           <div key={i} className="mb-5 pb-5 border-b border-slate-700/50 relative z-10">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold text-white text-base">{rev.name || "İsimsiz"}</span>
                                 <span className="text-amber-400 text-sm drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">{"★".repeat(Number(rev.rating))}{"☆".repeat(5 - Number(rev.rating))}</span>
                              </div>
                              <p className="text-sm text-slate-300 mb-3 leading-relaxed">{rev.text}</p>
                              {(rev.answer || rev.reply || rev.adminReply || rev.cevap) && (
                                 <div className="ml-4 p-4 bg-[#00e5ff]/5 border-l-2 border-[#00e5ff] rounded-r-xl mt-3 backdrop-blur-sm">
                                    <span className="font-black text-[#00e5ff] text-[10px] uppercase block mb-1.5 tracking-wider">Yetkili Cevabı:</span>
                                    <p className="text-sm text-slate-200">{rev.answer || rev.reply || rev.adminReply || rev.cevap}</p>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}

                  {/* 2. SORULAR SEKMESİ */}
                  {activeTab === "questions" && (
                     <div className="space-y-6">
                        <form onSubmit={handleSubmitQuestion} className="mb-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl relative z-20 shadow-lg">
                           <h3 className="text-[#00e5ff] font-black text-sm uppercase tracking-wider mb-4 drop-shadow-sm">Soru Sor</h3>
                           <input type="text" value={questionName} onChange={(e) => setQuestionName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3 transition-all duration-300 placeholder-slate-500" />
                           <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Bu ürünle ilgili merak ettiğin bir şey mi var? Bize sor..." className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 min-h-[120px] mb-4 resize-none transition-all duration-300 placeholder-slate-500" required />
                           <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-[#00e5ff] text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl hover:bg-[#00c4db] transition-all duration-500 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                              {isSubmitting ? "Gönderiliyor..." : "Soruyu Gönder"}
                           </button>
                        </form>
                        {questions.length === 0 ? <p className="text-center py-8 text-slate-400 font-medium bg-slate-800/20 rounded-2xl border border-slate-700/50 transition-all duration-500">Henüz soru sorulmamış. İlk soran sen ol!</p> : questions.map((q, i) => (
                           <div key={i} className="mb-5 pb-5 border-b border-slate-700/50 relative z-10">
                              <span className="font-bold text-white text-base block mb-2">❓ {q.name || "Müşteri"}:</span>
                              <p className="text-sm text-slate-300 mb-4 leading-relaxed">{q.text}</p>
                              {(q.answer || q.reply || q.adminReply || q.cevap) && (
                                 <div className="ml-4 p-4 bg-[#00e5ff]/5 border-l-2 border-[#00e5ff] rounded-r-xl mt-3 backdrop-blur-sm">
                                    <span className="font-black text-[#00e5ff] text-[10px] uppercase block mb-1.5 tracking-wider">Yetkili Cevabı:</span>
                                    <p className="text-sm text-slate-200">{q.answer || q.reply || q.adminReply || q.cevap}</p>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}

                  {/* 3. TEKNİK BİLGİLER */}
                  {activeTab === "tech" && product.teknik_ozellikler && Object.keys(product.teknik_ozellikler).length > 0 ? (
                     <div className="grid grid-cols-1 gap-0">
                        {Object.entries(product.teknik_ozellikler).map(([anahtar, deger]) => (
                           <div key={anahtar} className="flex justify-between items-center py-4 px-4 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors duration-300 rounded-lg">
                              <span className="text-slate-400 font-bold text-[11px] sm:text-xs uppercase w-1/2 tracking-wider">{anahtar}</span>
                              <span className="text-slate-100 font-semibold text-xs sm:text-sm w-1/2 text-right">{deger as string}</span>
                           </div>
                        ))}
                     </div>
                  ) : activeTab === "tech" && <p className="text-center py-8 text-slate-400 font-medium bg-slate-800/20 rounded-2xl border border-slate-700/50">Teknik detay bulunamadı.</p>}

                  {/* 4. FPS TESTİ */}
                  {activeTab === "fps" && (
                     <div className="space-y-6 mt-2">
                        <div>
                           <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest block mb-3">İşlemci Düzeyi:</span>
                           <div className="flex gap-2 sm:gap-3">
                              {[{ id: "i5", top: "INTEL i5", bottom: "RYZEN 5" }, { id: "i7", top: "INTEL i7", bottom: "RYZEN 7" }, { id: "i9", top: "INTEL i9", bottom: "RYZEN 9" }].map((islemci) => (
                                 <button key={islemci.id} onClick={() => setSeciliIslemci(islemci.id as "i5" | "i7" | "i9")} className={"flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-500 ease-in-out " + (seciliIslemci === islemci.id ? "bg-slate-800 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]" : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white")}>
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">{islemci.top}</span>
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-1 opacity-80">{islemci.bottom}</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest block mb-3 mt-5">Çözünürlük:</span>
                           <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 transition-all duration-500">
                              {["1080P", "2K", "4K"].map((res) => (
                                 <button key={res} onClick={() => setSeciliCozunurluk(res as "1080P" | "2K" | "4K")} className={"flex-1 py-3 rounded-lg text-[11px] sm:text-xs font-black uppercase transition-all duration-500 ease-in-out " + (seciliCozunurluk === res ? "bg-[#00e5ff] text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105" : "text-slate-400 hover:text-white")}>{res}</button>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-5 mt-8">
                           {[{ ad: "Valorant", kod: "Valorant" }, { ad: "CS:2", kod: "CS2" }, { ad: "GTA V", kod: "GTAV" }, { ad: "PUBG", kod: "PUBG" }].map((oyun) => (
                              <div key={oyun.kod} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-[#00e5ff]/50 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-500 ease-in-out shadow-lg group">
                                 <span className="text-slate-400 font-black text-[11px] tracking-widest uppercase mb-3 group-hover:text-slate-200 transition-colors duration-500">{oyun.ad}</span>
                                 <span className="text-4xl font-black text-white drop-shadow-md transition-all duration-500 ease-in-out">{(fpsVerileri as any)[oyun.kod]?.[seciliIslemci]?.[seciliCozunurluk] || "0"}</span>
                                 <span className="text-[#00e5ff] text-[11px] font-bold mt-2 uppercase tracking-widest">FPS</span>
                              </div>
                           ))}
                        </div>

                        <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-5 rounded-2xl flex gap-4 items-start mt-8 backdrop-blur-sm">
                           <span className="text-[#00e5ff] text-2xl drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">ℹ️</span>
                           <p className="text-slate-300 text-[11px] sm:text-xs font-medium leading-relaxed">
                           <strong className="font-black text-[#00e5ff] tracking-widest block mb-1.5 uppercase">Müşteri Bilgilendirmesi:</strong> 
                              Yukarıdaki FPS değerleri ortalama test sonuçlarıdır. Oyun içi haritaya, anlık çatışma sahnelerine, arka planda çalışan uygulamalara ve ortam sıcaklığına göre FPS değerlerinde dalgalanmalar olabilir. Kesin taahhüt değildir.
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* SADECE MASAÜSTÜNDE GÖRÜNEN ALT KAPATMA BUTONU */}
            <div className="hidden sm:block p-5 border-t border-slate-700/80 shrink-0 bg-slate-950/95 rounded-b-3xl z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
              <button onClick={() => setTeknikPopupAcik(false)} className="w-full bg-slate-800 text-slate-200 border border-slate-600 font-black px-8 py-4 rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-300 uppercase tracking-widest text-sm shadow-lg">Kapat</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}