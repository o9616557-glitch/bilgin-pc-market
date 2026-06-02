"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { useCompare } from "@/app/CompareContext";
import { X, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 
  const { karsilastirmayaEkle, setPopupAcik } = useCompare(); 
  
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

  const [seciliResimIndex, setSeciliResimIndex] = useState(0);
  const [fade, setFade] = useState(false); 
  const touchStartRef = useRef(0);

  // 🚀 BÜYÜK EKRAN MODAL (LIGHTBOX) HAFIZASI
  const [lightboxAcik, setLightboxAcik] = useState(false);

  const fpsVerileri: any = product.fps_testleri || {};
  const dbOyunlar = Object.keys(fpsVerileri);

  const pId = product?._id?.toString() || product?.id?.toString() || "urun";
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc: any, curr: any) => acc + Number(curr.rating), 0) / totalReviews).toFixed(1) : "0.0";

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 4000); 
  };

  const handleToggleFavorite = async () => {
    const oncekiDurum = isFav;
    setIsFav(!oncekiDurum); 
    try {
      const res = await fetch("/api/favorites", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: String(pId) })
      });
      if (res.status === 401) {
        setIsFav(oncekiDurum); 
        toast.error("Favorilere eklemek için lütfen giriş yapın. 🔒", {
          style: { background: "#121215", color: "#fff", border: "1px solid #334155", borderRadius: "12px" },
          iconTheme: { primary: "#00e5ff", secondary: "#000" },
        });
        return; 
      }
      if (!res.ok) { setIsFav(oncekiDurum); toast.error("Bir sorun oluştu."); }
    } catch (error) { setIsFav(oncekiDurum); }
  };

  const handleCompare = () => {
    karsilastirmayaEkle(product);
    setTimeout(() => {
      if (typeof setPopupAcik === "function") {
        setPopupAcik(true); 
      }
    }, 100);
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setIsFav(data.favorites?.includes(pId) || false);
        }
      } catch (error) {}
    };
    checkFavoriteStatus();
  }, [pId]);

  useEffect(() => {
    const fetchCanliYorumlar = async () => {
      try {
        const res = await fetch("/api/reviews?productId=" + pId);
        const result = await res.json();
        if (result.success) {
          setReviews(result.data.filter((item: any) => item.type === "review"));
          setQuestions(result.data.filter((item: any) => item.type === "question"));
        }
      } catch (error) {}
    };
    fetchCanliYorumlar();
  }, [pId]);

  // 🚀 POPUP VEYA LIGHTBOX AÇIKKEN ARKAPLANIN KAYMASINI ENGELLEME MOTORU
  useEffect(() => {
    if (teknikPopupAcik || lightboxAcik) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [teknikPopupAcik, lightboxAcik]);

  useEffect(() => {
    const calculateShipping = () => {
      const now = new Date();
      if (now.getHours() < 16) {
        const pad = (n: number) => n.toString().padStart(2, "0");
        setTimeLeft(pad(15 - now.getHours()) + ":" + pad(59 - now.getMinutes()) + ":" + pad(59 - now.getSeconds()) + " içinde");
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

  const urunAdi = product.isim || product.name || "İsimsiz Ürün";
  const normalFiyat = Number(product.regular_price || product.fiyat || product.price || 0);
  const indirimliFiyat = product.indirimliFiyat ? Number(product.indirimliFiyat) : null;
  const gecerliFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;
  const havaleYuzdesi = product.havaleIndirimi !== undefined ? Number(product.havaleIndirimi) : 5;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return showToast("Lütfen bir yorum yazın!");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: pId, type: "review", name: reviewName, text: reviewText, rating: reviewRating }),
      });
      if (res.ok) {
        showToast("Yorumunuz onaya gönderildi! 🚀");
        setReviewText(""); setReviewName(""); setReviewRating(5);
      } else {
        showToast("Bir hata oluştu, giriş yaptığınızdan emin olun.");
      }
    } catch (error) { showToast("Bağlantı hatası oluştu!"); }
    setIsSubmitting(false);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return showToast("Lütfen bir soru yazın!");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: pId, type: "question", name: questionName, text: questionText }),
      });
      if (res.ok) {
        showToast("Sorunuz onaya gönderildi! 🚀");
        setQuestionText(""); setQuestionName("");
      } else {
        showToast("Bir hata oluştu, giriş yaptığınızdan emin olun.");
      }
    } catch (error) { showToast("Bağlantı hatası oluştu!"); }
    setIsSubmitting(false);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    try {
      sepeteEkle({
        id: String(pId), isim: urunAdi, fiyat: gecerliFiyat,
        resim: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400", 
        varyasyon: "Standart Model", havaleIndirimi: havaleYuzdesi
      });
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (error) { toast.error("Eklenemedi!"); } 
    finally { setAddingToCart(false); }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: urunAdi, text: "Şu efsane ürüne bir bak!", url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const getPopupTitle = () => {
    if (activeTab === "reviews") return { icon: "⭐", text: "Müşteri Yorumları" };
    if (activeTab === "questions") return { icon: "💬", text: "Soru ve Cevaplar" };
    if (activeTab === "tech") return { icon: "⚙️", text: "Teknik Bilgiler" };
    if (activeTab === "fps") return { icon: "🎮", text: "FPS Test Sonuçları" };
    return { icon: "⚡", text: "Sistem Bilgileri" };
  };

  if (!product) return <div className="text-center p-10 text-[#00e5ff] font-bold">Yükleniyor...</div>;

  const indirimVarMi = indirimliFiyat !== null && normalFiyat > indirimliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  const adetGosterilecekMi = product.stokAdedi !== null && product.stokAdedi !== undefined && product.stokAdedi !== "" && Number(product.stokAdedi) > 0;
  const havaleFiyati = gecerliFiyat - (gecerliFiyat * havaleYuzdesi) / 100;

  let resimler = [product.resim || "https://via.placeholder.com/600"];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    resimler = product.images.map((img: any) => {
      if (typeof img === "string") return img;
      if (img && img.src) return img.src;
      return product.resim || "https://via.placeholder.com/600";
    });
  }

  const degistirResim = (yeniIndex: number) => {
    if (yeniIndex === seciliResimIndex) return;
    setFade(true); 
    setTimeout(() => {
      setSeciliResimIndex(yeniIndex); 
      setFade(false); 
    }, 200); 
  };

  const sonrakiResim = () => {
    degistirResim((seciliResimIndex + 1) % resimler.length);
  };

  const oncekiResim = () => {
    degistirResim((seciliResimIndex - 1 + resimler.length) % resimler.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const fark = touchStartRef.current - touchEnd;
    if (fark > 30) {
      sonrakiResim(); 
    } else if (fark < -30) {
      oncekiResim(); 
    }
  };

 return (
    <div className="min-h-screen bg-[#050814] text-white pb-9 sm:pb-10 font-sans overflow-x-hidden relative max-w-[100vw]">
      <div className={`fixed top-24 right-5 z-[9999999] bg-[#09090b] border border-[#00e5ff]/50 shadow-[0_0_30px_rgba(0,229,255,0.2)] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 transform ${toastMessage ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
        <span className="text-[#00e5ff] text-2xl">✓</span>
        <p className="text-sm">{toastMessage}</p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 sm:py-10 sm:px-6">
        
        <div className="w-full md:w-1/2 flex flex-col">
          
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full aspect-square sm:aspect-[4/3] max-h-[380px] sm:max-h-[460px] relative flex justify-center items-center overflow-hidden group select-none bg-transparent"
          >
            <button 
              onClick={(e) => { e.preventDefault(); oncekiResim(); }}
              className="hidden sm:block absolute left-2 z-30 bg-black/30 hover:bg-white/10 text-slate-300 hover:text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* 🚀 TIKLANABİLİR BÜYÜK RESİM ALANI (cursor-pointer eklendi) */}
            <div 
              onClick={() => setLightboxAcik(true)}
              className="w-full h-full p-4 sm:p-8 flex justify-center items-center relative z-10 cursor-pointer"
            >
              <img 
                src={resimler[seciliResimIndex]} 
                alt={urunAdi + " - " + (seciliResimIndex + 1)} 
                className={`max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ease-in-out ${fade ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'} ${tukendiMi ? "grayscale opacity-50" : ""}`} 
              />
            </div>

            <button 
              onClick={(e) => { e.preventDefault(); sonrakiResim(); }}
              className="absolute right-2 z-30 hidden sm:block bg-black/30 hover:bg-white/10 text-slate-300 hover:text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
            
            <div className="absolute bottom-2 right-4 z-20 rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/50 backdrop-blur-sm sm:hidden">
              {seciliResimIndex + 1} / {resimler.length}
            </div>
          </div>

          {resimler.length > 1 && (
            <div className="flex gap-4 justify-center mt-2 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {resimler.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); degistirResim(idx); }}
                  className={`w-14 h-14 sm:w-20 sm:h-20 transition-all duration-300 flex-shrink-0 flex items-center justify-center bg-transparent ${
                    seciliResimIndex === idx 
                      ? "scale-110 opacity-100 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" 
                      : "opacity-40 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img src={img} alt="Önizleme" className="max-w-full max-h-full object-contain filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]" />
                </button>
              ))}
            </div>
          )}

        </div>
        
        <div className="w-full md:w-1/2 px-4 sm:px-0 mt-6 md:mt-0 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {tukendiMi ? (
               <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md tracking-wider">TÜKENDİ</span>
            ) : (
               <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md tracking-wider">STOKTA VAR {adetGosterilecekMi ? "(" + product.stokAdedi + ")" : ""}</span>
            )}
            {indirimVarMi && !tukendiMi && (
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md uppercase">🔥 %{indirimOrani} İNDİRİM</span>
            )}
          </div>

          <h1 className="text-lg sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-snug sm:leading-tight mb-2 break-words">
            {urunAdi}
          </h1>

          <div onClick={() => { setActiveTab("reviews"); setTeknikPopupAcik(true); }} className="flex items-center gap-2 mb-5 cursor-pointer group w-fit">
            <div className="flex text-amber-400 text-[13px] sm:text-sm tracking-widest">
              {Number(avgRating) >= 1 ? "★" : "☆"}{Number(avgRating) >= 2 ? "★" : "☆"}{Number(avgRating) >= 3 ? "★" : "☆"}{Number(avgRating) >= 4 ? "★" : "☆"}{Number(avgRating) >= 5 ? "★" : "☆"}
            </div>
            <span className="text-slate-400 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors underline decoration-white/20 underline-offset-4">{reviews.length} Değerlendirme</span>
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
          </div>

          <div className="flex items-center gap-4 bg-[#09090b] border border-white/5 p-3 sm:p-4 rounded-xl mb-5">
            <div className="text-2xl sm:text-3xl">🚚</div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">HIZLI KARGO AVANTAJI</span>
              <span className="text-xs sm:text-sm font-medium mt-0.5">{timeLeft} <strong className="text-[#10b981] font-black">{shippingMessage}</strong></span>
            </div>
          </div>

          <div className="hidden sm:block relative mt-1 mb-4">
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-16 rounded-xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-between px-6 mb-3 ${tukendiMi ? "bg-zinc-800 text-zinc-500" : "bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:bg-[#00c4db]"}`}>
              <div className="flex items-center gap-3">
                {!tukendiMi && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                <span>{tukendiMi ? "STOK TÜKENDİ" : "SEPETE EKLE"}</span>
              </div>
              {!tukendiMi && (
                 <div className="bg-black/10 px-3 py-1 rounded-lg flex flex-col items-end leading-tight">
                   <span className="text-[10px] opacity-80 font-bold">HAVALE İLE</span><span className="text-base">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                 </div>
              )}
            </button>
            {addedSuccess && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-xs font-black px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce">✅ Başarıyla Sepete Eklendi!</div>}
          </div>

          <div className="hidden sm:flex items-center gap-3 mb-4">
            <button onClick={handleToggleFavorite} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${isFav ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-[#09090b] border-white/10 hover:bg-white/5 text-white"}`}>
              {isFav ? "❤️ Favorilerde" : "🤍 Favoriye Ekle"}
            </button>
            <button onClick={handleCompare} className="flex-1 py-3 rounded-xl border border-white/10 bg-[#09090b] hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all">
              ⚖️ Karşılaştır
            </button>
            <button onClick={handleShare} className="flex-1 py-3 rounded-xl border border-white/10 bg-[#09090b] hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all">
              {copied ? "🟩 Kopyalandı" : "📤 Paylaş / Kopyala"}
            </button>
          </div>

          <div className="hidden sm:grid grid-cols-4 gap-2 mb-6 z-10 relative">
            <button onClick={(e) => { e.preventDefault(); setActiveTab("tech"); setTeknikPopupAcik(true); }} className="flex flex-col items-center justify-center gap-1.5 bg-[#121215] border border-white/10 hover:border-[#00e5ff]/50 text-slate-300 hover:text-white p-3 rounded-xl transition-all">
              <span className="text-xl">⚙️</span><span className="text-[10px] font-black uppercase tracking-widest">Teknik</span>
            </button>
            <button onClick={(e) => { e.preventDefault(); setActiveTab("fps"); setTeknikPopupAcik(true); }} className="flex flex-col items-center justify-center gap-1.5 bg-[#121215] border border-white/10 hover:border-[#00e5ff]/50 text-slate-300 hover:text-white p-3 rounded-xl transition-all">
              <span className="text-xl">🎮</span><span className="text-[10px] font-black uppercase tracking-widest">FPS Testi</span>
            </button>
            <button onClick={(e) => { e.preventDefault(); setActiveTab("reviews"); setTeknikPopupAcik(true); }} className="flex flex-col items-center justify-center gap-1.5 bg-[#121215] border border-white/10 hover:border-[#00e5ff]/50 text-slate-300 hover:text-white p-3 rounded-xl transition-all">
              <span className="text-xl">⭐</span><span className="text-[10px] font-black uppercase tracking-widest">Yorumlar</span>
            </button>
            <button onClick={(e) => { e.preventDefault(); setActiveTab("questions"); setTeknikPopupAcik(true); }} className="flex flex-col items-center justify-center gap-1.5 bg-[#121215] border border-white/10 hover:border-[#00e5ff]/50 text-slate-300 hover:text-white p-3 rounded-xl transition-all">
              <span className="text-xl">💬</span><span className="text-[10px] font-black uppercase tracking-widest">Sorular</span>
            </button>
          </div>

        </div>
      </div>

      {/* 🚀 AÇIKLAMA GÖRSELLERİ ARASI SIFIR BOŞLUK YAPILDI ([&_img]:my-0 [&_img]:p-0) */}
      {product.aciklama && (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mt-10 mb-4 border-t border-white/10 pt-8">
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-6">
            Ürün Detayları ve İnceleme
          </h3>
          <div 
            className="prose prose-invert max-w-none text-slate-300 line-clamp-none 
                       [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:underline [&_h2]:decoration-[#00e5ff]/40 [&_h2]:underline-offset-[6px] [&_h2]:mt-8 [&_h2]:mb-4
                       [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:underline [&_h3]:decoration-[#00e5ff]/40 [&_h3]:underline-offset-[4px] [&_h3]:mt-6 [&_h3]:mb-3
                       [&_p]:text-sm [&_p]:sm:text-base [&_p]:leading-relaxed [&_p]:text-slate-300 [&_p]:mb-4
                       [&_img]:w-full [&_img]:max-w-5xl [&_img]:mx-auto [&_img]:border-none [&_img]:bg-transparent [&_img]:shadow-none [&_img]:my-0 [&_img]:p-0 [&_img]:block"
            dangerouslySetInnerHTML={{ __html: product.aciklama }}
          />
        </div>
      )}

      {/* MOBİL ALT BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#050814]/95 backdrop-blur-md border-t border-slate-800 p-2 z-[50] flex flex-col gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#121215] [&::-webkit-scrollbar-thumb]:bg-[#00e5ff]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
           <button onClick={() => { setActiveTab("tech"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-[#00e5ff] transition-colors"><span className="text-sm">⚙️</span><span className="text-[10px] font-black uppercase tracking-wider">Teknik</span></button>
           <button onClick={() => { setActiveTab("fps"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-[#00e5ff] transition-colors"><span className="text-sm">🎮</span><span className="text-[10px] font-black uppercase tracking-wider">FPS</span></button>
           <div className="w-[1px] h-5 bg-white/10 shrink-0 mx-0.5"></div>
           <button onClick={handleCompare} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-[#00e5ff] transition-colors"><span className="text-sm">⚖️</span><span className="text-[10px] font-black uppercase tracking-wider">Kıyasla</span></button>
           <button onClick={handleToggleFavorite} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-red-500 transition-colors"><span className="text-sm">{isFav ? "❤️" : "🤍"}</span><span className="text-[10px] font-black uppercase tracking-wider">Favori</span></button>
           <div className="w-[1px] h-5 bg-white/10 shrink-0 mx-0.5"></div>
           <button onClick={() => { setActiveTab("reviews"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-[#00e5ff] transition-colors"><span className="text-sm">⭐</span><span className="text-[10px] font-black uppercase tracking-wider">Yorumlar</span></button>
           <button onClick={() => { setActiveTab("questions"); setTeknikPopupAcik(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-[#00e5ff] transition-colors"><span className="text-sm">💬</span><span className="text-[10px] font-black uppercase tracking-wider">Sorular</span></button>
           <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white hover:border-[#00e5ff] transition-colors"><span className="text-sm">📤</span><span className="text-[10px] font-black uppercase tracking-wider">Paylaş</span></button>
        </div>
        
        <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-14 font-black uppercase tracking-wider rounded-xl flex items-center justify-between px-5 transition-all ${tukendiMi ? "bg-zinc-800 text-zinc-500" : "bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:bg-[#00c4db]"}`}>
           <span className="text-base">{tukendiMi ? "TÜKENDİ" : "SEPETE EKLE"}</span>
           {!tukendiMi && <div className="flex flex-col items-end leading-tight"><span className="text-[9px] opacity-80 font-black">HAVALE İLE</span><span className="text-sm font-black">{havaleFiyati.toLocaleString("tr-TR")} TL</span></div>}
        </button>
      </div>

      {/* 🚀 3. ADIM: EFSANE TAM EKRAN LIGHTBOX MODAL (X TUŞLU VE ARKA PLAN DOKUNMATİK KAPATMALI) */}
      {lightboxAcik && (
        <div 
          onClick={() => setLightboxAcik(false)}
          className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-md flex justify-center items-center p-4 transition-all duration-300 select-none animate-fadeIn"
        >
          {/* Üst Sağda X Kapatma Butonu */}
          <button 
            onClick={(e) => { e.stopPropagation(); setLightboxAcik(false); }}
            className="absolute top-6 right-6 z-[99999999] bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500 text-slate-400 hover:text-white rounded-2xl p-3 transition-all backdrop-blur-md shadow-lg"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Tam Ekran Devasa Görsel */}
          <div className="max-w-full max-h-[90vh] flex justify-center items-center p-2" onClick={(e) => e.stopPropagation()}>
            <img 
              src={resimler[seciliResimIndex]} 
              alt="Büyük Ekran İnceleme" 
              className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] animate-scaleUp"
            />
          </div>
        </div>
      )}

      {/* POPUP MERKEZİ */}
      {teknikPopupAcik && (
        <div className="fixed inset-0 z-[999999] flex justify-center items-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="absolute inset-0 hidden sm:block" onClick={() => setTeknikPopupAcik(false)}></div>
          <div className="relative w-full h-full sm:max-h-[90vh] sm:w-[700px] mx-auto bg-[#09090b]/60 backdrop-blur-2xl sm:border sm:border-[#00e5ff]/30 sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.15)]">
            
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-0 overflow-hidden opacity-[0.03]">
               <Gamepad2 className="w-48 h-48 sm:w-64 sm:h-64 text-[#00e5ff] mb-4" />
               <span className="text-5xl sm:text-6xl font-black tracking-[0.5em] text-[#00e5ff] uppercase ml-4">GAMING</span>
            </div>

            <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5 shrink-0 bg-[#121215] relative z-20">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#00e5ff] text-xl sm:text-2xl">{getPopupTitle().icon}</span> 
                {getPopupTitle().text}
              </h2>
              <button onClick={() => setTeknikPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#09090b] border border-white/5 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

           <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col text-slate-300 bg-transparent relative z-10">
               <div className="pb-10">
                  
                  {activeTab === "reviews" && (
                     <div className="space-y-4">
                        <form onSubmit={handleSubmitReview} className="mb-8 bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                           <h3 className="text-[#00e5ff] font-black text-sm uppercase tracking-wider mb-3">Değerlendirme Yap</h3>
                           <div className="flex gap-1 mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <button type="button" key={star} onClick={() => setReviewRating(star)} className={`text-2xl sm:text-3xl transition-all hover:scale-110 ${reviewRating >= star ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "text-slate-700 hover:text-amber-400/50"}`}>
                                    ★
                                 </button>
                              ))}
                           </div>
                           <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-[#050814] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3 transition-all" />
                           <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Bu donanım hakkında ne düşünüyorsun? Performansı nasıl?" className="w-full bg-[#050814] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 min-h-[100px] mb-4 resize-none transition-all" required />
                           <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-[#00e5ff] text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded-xl hover:bg-[#00c4db] transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                              {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
                           </button>
                        </form>

                        {reviews.length === 0 ? (
                           <p className="text-center py-5 text-slate-500 font-medium">Bu ürüne henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                        ) : (
                           reviews.map((rev, i) => (
                              <div key={i} className="mb-4 pb-4 border-b border-white/5 relative z-10">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-white">{rev.name || "İsimsiz"}</span>
                                    <span className="text-amber-400 text-xs drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">{"★".repeat(Number(rev.rating))}{"☆".repeat(5 - Number(rev.rating))}</span>
                                 </div>
                                 <p className="text-sm text-slate-400 mb-2">{rev.text}</p>
                                 {(rev.answer || rev.reply || rev.adminReply || rev.cevap) && (
                                    <div className="ml-4 p-3 bg-[#00e5ff]/5 border-l-2 border-[#00e5ff] rounded-r-lg mt-2">
                                       <span className="font-black text-[#00e5ff] text-[10px] uppercase block mb-1">Yetkili Cevabı:</span>
                                       <p className="text-sm text-slate-300">{rev.answer || rev.reply || rev.adminReply || rev.cevap}</p>
                                    </div>
                                 )}
                              </div>
                           ))
                        )}
                     </div>
                  )}

                  {/* 💬 SORULAR SEKMESİ */}
                  {activeTab === "questions" && (
                     <div className="space-y-4">
                        <form onSubmit={handleSubmitQuestion} className="mb-8 bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                           <h3 className="text-[#00e5ff] font-black text-sm uppercase tracking-wider mb-3">Soru Sor</h3>
                           <input type="text" value={questionName} onChange={(e) => setQuestionName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-[#050814] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 mb-3 transition-all" />
                           <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Bu ürünle ilgili merak ettiğin bir şey mi var? Bize sor..." className="w-full bg-[#050814] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 min-h-[100px] mb-4 resize-none transition-all" required />
                           <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-[#00e5ff] text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded-xl hover:bg-[#00c4db] transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                              {isSubmitting ? "Gönderiliyor..." : "Soruyu Gönder"}
                           </button>
                        </form>

                        {questions.length === 0 ? (
                           <p className="text-center py-5 text-slate-500 font-medium">Henüz soru sorulmamış. İlk soran sen ol!</p>
                        ) : (
                           questions.map((q, i) => (
                              <div key={i} className="mb-4 pb-4 border-b border-white/5 relative z-10">
                                 <span className="font-bold text-white block mb-1">❓ {q.name || "Müşteri"}:</span>
                                 <p className="text-sm text-slate-300 mb-3">{q.text}</p>
                                 {(q.answer || q.reply || q.adminReply || q.cevap) && (
                                    <div className="ml-4 p-3 bg-[#00e5ff]/5 border-l-2 border-[#00e5ff] rounded-r-lg mt-2">
                                       <span className="font-black text-[#00e5ff] text-[10px] uppercase block mb-1">Yetkili Cevabı:</span>
                                       <p className="text-sm text-slate-300">{q.answer || q.reply || q.adminReply || q.cevap}</p>
                                    </div>
                                 )}
                              </div>
                           ))
                        )}
                     </div>
                  )}

                  {/* ⚙️ TEKNİK BİLGİLER */}
                  {activeTab === "tech" && product.teknik_ozellikler && Object.keys(product.teknik_ozellikler).length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {Object.entries(product.teknik_ozellikler).map(([anahtar, deger]) => (
                           <div key={anahtar} className="flex justify-between items-center py-3 px-3 border-b border-white/10">
                              <span className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase w-1/2">{anahtar}</span>
                              <span className="text-white font-medium text-xs sm:text-sm w-1/2 text-right">{deger as string}</span>
                           </div>
                        ))}
                     </div>
                  ) : activeTab === "tech" && <p className="text-center py-10 text-slate-500 font-medium">Teknik detay bulunamadı.</p>}

                  {/* 🎮 AKILLI VE DİNAMİK FPS MOTORU */}
                  {activeTab === "fps" && (
                     <div className="space-y-4 mt-2">
                        <div>
                           <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">İşlemci Düzeyi:</span>
                           <div className="flex gap-2 sm:gap-3">
                              {[{ id: "i5", top: "INTEL i5", bottom: "RYZEN 5" }, { id: "i7", top: "INTEL i7", bottom: "RYZEN 7" }, { id: "i9", top: "INTEL i9", bottom: "RYZEN 9" }].map((islemci) => (
                                 <button key={islemci.id} onClick={() => setSeciliIslemci(islemci.id as "i5" | "i7" | "i9")} className={"flex-1 flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all " + (seciliIslemci === islemci.id ? "bg-[#121215] border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]" : "bg-[#050814] border-white/5 text-slate-400 hover:text-white")}>
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">{islemci.top}</span>
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-0.5">{islemci.bottom}</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2 mt-4">Çözünürlük:</span>
                           <div className="flex bg-[#050814] p-1.5 rounded-xl border border-white/5">
                              {["1080P", "2K", "4K"].map((res) => (
                                 <button key={res} onClick={() => setSeciliCozunurluk(res as "1080P" | "2K" | "4K")} className={"flex-1 py-3 rounded-lg text-[10px] sm:text-xs font-black uppercase transition-all " + (seciliCozunurluk === res ? "bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]" : "text-slate-400 hover:text-white")}>{res}</button>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
                           {dbOyunlar.length > 0 ? (
                             dbOyunlar.map((oyunKodu) => (
                                <div key={oyunKodu} className="bg-[#09090b]/80 backdrop-blur-md border border-[#00e5ff]/20 hover:border-[#00e5ff]/50 rounded-2xl p-5 flex flex-col items-center justify-center transition-all">
                                   <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-2">{oyunKodu}</span>
                                   <span className="text-3xl font-black text-white">{fpsVerileri[oyunKodu]?.[seciliIslemci]?.[seciliCozunurluk] || "-"}</span>
                                   <span className="text-[#00e5ff] text-[10px] font-bold mt-1.5 uppercase">FPS</span>
                                </div>
                             ))
                           ) : (
                             <div className="col-span-2 text-center py-8">
                               <p className="text-slate-500 font-medium text-sm">Bu ürün için henüz FPS test verisi girilmemiş.</p>
                             </div>
                           )}
                        </div>

                        <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-4 rounded-xl flex gap-3 items-start mt-6">
                           <span className="text-[#00e5ff] text-xl">ℹ️</span>
                           <p className="text-slate-400 text-[10px] sm:text-xs font-medium leading-relaxed opacity-90">
                           <strong className="font-black text-[#00e5ff] tracking-wider block mb-1">MÜŞTERİ BİLGİLENDİRMESİ:</strong> 
                              Yukarıdaki FPS değerleri ortalama test sonuçlarıdır. Kesin taahhüt değildir.
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className="hidden sm:block p-4 sm:p-5 border-t border-white/5 shrink-0 bg-[#121215] rounded-b-3xl z-20">
              <button onClick={() => setTeknikPopupAcik(false)} className="w-full bg-[#00e5ff] text-black font-black px-8 py-4 sm:py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}