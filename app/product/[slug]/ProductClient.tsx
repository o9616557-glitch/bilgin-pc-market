"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { useCompare } from "@/app/CompareContext";
import { Scale, Gamepad2, MessageSquare, Settings2, X } from "lucide-react";
export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 
  const { karsilastirmayaEkle, setPopupAcik } = useCompare();
  const [teknikPopupAcik, setTeknikPopupAcik] = useState(false);
   const [seciliCozunurluk, setSeciliCozunurluk] = useState<"1080p" | "2K" | "4K">("1080p");
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "qa">("reviews");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5); 
  const [newQuestionName, setNewQuestionName] = useState(""); 
  const [newQuestionText, setNewQuestionText] = useState("");

  const pId = product?._id?.toString() || product?.id?.toString() || "urun";

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / totalReviews).toFixed(1) : "0.0";
  
  const getRatingPercent = (star: number) => {
    if (totalReviews === 0) return 0;
    const count = reviews.filter(r => Number(r.rating) === star).length;
    return Math.round((count / totalReviews) * 100);
  };
  const ratingPercents = [getRatingPercent(5), getRatingPercent(4), getRatingPercent(3), getRatingPercent(2), getRatingPercent(1)];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 4000); 
  };

  const handleToggleFavorite = async () => {
    const oncekiDurum = isFav;
    setIsFav(!oncekiDurum); 

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: String(product._id || product.id) })
      });

    if (res.status === 401) {
      setIsFav(oncekiDurum); 
      toast.error("Favorilere eklemek için lütfen giriş yapın. 🔒", {
        style: { background: '#121215', color: '#fff', border: '1px solid #334155', borderRadius: '12px' },
        iconTheme: { primary: '#00e5ff', secondary: '#000' },
      });
      return; 
    }

    if (!res.ok) {
      setIsFav(oncekiDurum);
      toast.error("Bir sorun oluştu, lütfen tekrar deneyin.");
    }
    } catch (error) {
      setIsFav(oncekiDurum);
      console.error("Favori hatası:", error);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          const ids = data.favorites || [];
          
          if (ids.includes(pId)) {
            setIsFav(true);
          } else {
            setIsFav(false);
          }
        }
      } catch (error) {
        console.error("Favori durumu çekilemedi");
      }
    };

    checkFavoriteStatus();
  }, [pId]);

  useEffect(() => {
    const fetchCanliYorumlar = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${pId}`);
        const result = await res.json();
        if (result.success) {
          setReviews(result.data.filter((item: any) => item.type === "review"));
          setQuestions(result.data.filter((item: any) => item.type === "question"));
        }
      } catch (error) {}
    };
    fetchCanliYorumlar();
  }, [pId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      try {
        const currentFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
        setIsFav(currentFavs.some((item: any) => String(item.id) === String(pId)));
      } catch (e) {}
    }
  }, [pId]);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else {
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
        setTimeLeft(`${pad(15 - now.getHours())}:${pad(59 - now.getMinutes())}:${pad(59 - now.getSeconds())} içinde`);
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

  const handleAddToCart = () => {
    setAddingToCart(true);
    try {
      sepeteEkle({
        id: String(pId),
        isim: urunAdi,
        fiyat: gecerliFiyat,
        resim: product.resim || (product.images && product.images[0]?.src) || "https://via.placeholder.com/400", 
        varyasyon: "Standart Model",
        // 🚀 BİNGO! EKSİK OLAN PARÇA BURASIYDI! ARTIK ÇANTAYA GİRİYOR!
        havaleIndirimi: havaleYuzdesi
      });
      
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
      }, 2000);
      
    } catch (error) {
      toast.error("Bir hata oluştu, eklenemedi!");
      console.error("Sepete eklenirken hata:", error);
    } finally {
      setAddingToCart(false);
    }
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

  const submitReview = async () => {
    if (!newReviewText.trim()) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: pId, type: "review", name: newReviewName.trim() ? newReviewName : "Misafir Kullanıcı",
          rating: newReviewRating, text: newReviewText
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Yorumunuz başarıyla alındı! Moderatör onayından sonra yayınlanacaktır.");
        setNewReviewText(""); setNewReviewName(""); setNewReviewRating(5); setShowReviewForm(false);
      }
    } catch (error) { showToast("Gönderilirken bir hata oluştu."); }
  };

  const submitQuestion = async () => {
    if (!newQuestionText.trim()) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: pId, type: "question", name: newQuestionName.trim() ? newQuestionName : "Misafir Kullanıcı", rating: 5, text: newQuestionText
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Sorunuz mağazaya iletildi! En kısa sürede cevaplanacaktır.");
        setNewQuestionText(""); setNewQuestionName(""); setShowQuestionForm(false);
      }
    } catch (error) { showToast("Gönderilirken bir hata oluştu."); }
  };

  if (!product) return <div className="text-center p-10 text-[#00e5ff] font-bold">Yükleniyor...</div>;

  const indirimVarMi = indirimliFiyat !== null && normalFiyat > indirimliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  const adetGosterilecekMi = product.stokAdedi !== null && product.stokAdedi !== undefined && product.stokAdedi !== "" && Number(product.stokAdedi) > 0;
  const havaleFiyati = gecerliFiyat - (gecerliFiyat * havaleYuzdesi) / 100;
  const resimler = product.images && product.images.length > 0 ? product.images.map((i:any) => i.src) : [product.resim || "https://via.placeholder.com/600"];

  return (
    <div className="min-h-screen bg-[#050814] text-white pb-28 sm:pb-10 font-sans overflow-x-hidden relative max-w-[100vw]">
      
      <div className={`fixed top-24 right-5 z-[9999] bg-[#09090b] border border-[#00e5ff]/50 shadow-[0_0_30px_rgba(0,229,255,0.2)] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-500 transform ${toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <span className="text-[#00e5ff] text-2xl">✓</span>
        <p className="text-sm">{toastMessage}</p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 sm:py-10 sm:px-6">
        
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
          </div>

          <h1 className="text-lg sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-snug sm:leading-tight mb-2 break-words">
            {urunAdi}
          </h1>

          <div onClick={() => { setActiveTab("reviews"); setIsModalOpen(true); }} className="flex items-center gap-2 mb-5 cursor-pointer group w-fit">
            <div className="flex text-amber-400 text-[13px] sm:text-sm tracking-widest">
              {Number(avgRating) >= 1 ? "★" : "☆"}
              {Number(avgRating) >= 2 ? "★" : "☆"}
              {Number(avgRating) >= 3 ? "★" : "☆"}
              {Number(avgRating) >= 4 ? "★" : "☆"}
              {Number(avgRating) >= 5 ? "★" : "☆"}
            </div>
            <span className="text-slate-400 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors underline decoration-white/20 underline-offset-4">{reviews.length} Değerlendirme</span>
            <span className="text-slate-600 text-[11px] sm:text-xs">|</span>
            <span className="text-slate-400 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors underline decoration-white/20 underline-offset-4">{questions.length} Soru Cevap</span>
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
              <span className="text-lg">💳</span><span className="text-amber-400 text-xs sm:text-sm font-bold tracking-wide">9 ve 12 Taksit İmkanları</span>
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
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-16 rounded-xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-between px-6 mb-3 ${tukendiMi ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:bg-[#00c4db]'}`}>
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

          <div className="hidden sm:flex items-center gap-3 mb-3">
            <button onClick={handleToggleFavorite} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${isFav ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#09090b] border-white/10 hover:bg-white/5 text-white'}`}>
              {isFav ? "❤️ Favorilerde" : "🤍 Favoriye Ekle"}
            </button>
            <button onClick={handleShare} className="flex-1 py-3 rounded-xl border border-white/10 bg-[#09090b] hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all">
              {copied ? "✅ Kopyalandı" : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> Paylaş / Kopyala</>}
            </button>
          </div>
      
        </div>
      </div>



{/* 🚀 NEON DENİZ MAVİSİ 4'LÜ AKSİYON BARI */}
        <div className="grid grid-cols-4 gap-2 my-6 px-1">
          
          {/* 1. KARŞILAŞTIR */}
          <button
            onClick={(e) => {
              e.preventDefault();
              karsilastirmayaEkle(product);
              setPopupAcik(true);
            }}
            className="flex flex-col items-center justify-center gap-1 bg-[#00e5ff]/5 border border-[#00e5ff]/30 hover:border-[#00e5ff] text-slate-300 hover:text-[#00e5ff] p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] backdrop-blur-sm group"
          >
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter text-center">Karşılaştır</span>
          </button>

          {/* 2. FPS TESTİ */}
          <a href="#fps-testi" className="flex flex-col items-center justify-center gap-1 bg-[#00e5ff]/5 border border-[#00e5ff]/30 hover:border-[#00e5ff] text-slate-300 hover:text-[#00e5ff] p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] backdrop-blur-sm group">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter text-center">FPS Testi</span>
          </a>

          {/* 3. YORUMLAR (🚀 ŞEFİM BİNGO: SENİN ORİJİNAL KODUNLA BİREBİR AYNI) */}
          <button
            onClick={() => {
              setActiveTab("reviews"); 
              setIsModalOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 bg-[#00e5ff]/5 border border-[#00e5ff]/30 hover:border-[#00e5ff] text-slate-300 hover:text-[#00e5ff] p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] backdrop-blur-sm group"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter text-center">Yorumlar</span>
          </button>

          {/* 4. TEKNİK BİLGİLER */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setTeknikPopupAcik(true);
            }}
            className="flex flex-col items-center justify-center gap-1 bg-[#00e5ff]/5 border border-[#00e5ff]/30 hover:border-[#00e5ff] text-slate-300 hover:text-[#00e5ff] p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] backdrop-blur-sm group"
          >
            <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter text-center leading-none">Teknik<br/>Bilgiler</span>
          </button>

        </div>
        
        {/* 🚀 YEPYENİ: SADECE BU ÜRÜNE ÖZEL TEKNİK BİLGİLER PENCERESİ (POPUP) */}
        {teknikPopupAcik && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#09090b] border border-[#00e5ff]/50 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.2)] relative">
              
              {/* Başlık */}
              <div className="flex justify-between items-center p-5 border-b border-slate-800 shrink-0">
                <h2 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Settings2 className="w-6 h-6 text-[#00e5ff]" /> 
                  TEKNİK ÖZELLİKLER
                </h2>
                <button onClick={() => setTeknikPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Liste İçeriği */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-grow">
                <div className="flex flex-col gap-2">
                  {product.teknik_ozellikler && Object.entries(product.teknik_ozellikler).map(([anahtar, deger]) => (
                    <div key={anahtar} className="flex justify-between items-center py-3 border-b border-slate-800/50 hover:bg-slate-800/40 px-3 rounded-lg transition-colors">
                      <span className="text-[#00e5ff] font-bold text-xs sm:text-sm uppercase tracking-wide w-1/2">{anahtar}</span>
                      <span className="text-white font-medium text-sm text-right w-1/2">{deger as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alt Buton */}
              <div className="p-5 border-t border-slate-800 shrink-0 bg-[#050814] rounded-b-3xl text-center">
                <button onClick={() => setTeknikPopupAcik(false)} className="w-full bg-[#00e5ff] text-black font-black px-6 py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  Kapat
                </button>
              </div>

            </div>
          </div>
        )}

{/* ========================================================================= */}
          {/* 🎮 EKRAN KARTI FPS TESTİ (Direkt Açık - 1080p/2K/4K Şalterli) */}
          {/* ========================================================================= */}
          <div id="fps-testi" className="mt-8 mb-6 bg-[#09090b] border border-[#00e5ff]/20 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.05)]">
            
            {/* Arka plan ışıması */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00e5ff] blur-[80px] opacity-10 pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4 border-b border-white/5 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Gamepad2 className="w-6 h-6 text-[#00e5ff]" /> 
                  Oyun Performans Testi
                </h3>
                {/* 🚀 BİNGO: İŞLEMCİ İSİMLERİ BURADA KABAK GİBİ YAZIYOR */}
                <div className="inline-flex items-center gap-2 bg-[#121215] border border-white/10 px-3 py-1.5 rounded-lg">
                   <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Test Sistemi:</span>
                   <span className="text-[#00e5ff] text-[10px] sm:text-xs font-black uppercase tracking-wider">Intel Core i5 / AMD Ryzen 5</span>
                </div>
              </div>

              {/* 🚀 BİNGO: 1080p - 2K - 4K ŞALTERİ GERİ GELDİ */}
              <div className="flex bg-[#121215] p-1 rounded-xl border border-white/5 shrink-0 self-stretch sm:self-auto z-10 relative mt-2 sm:mt-0">
                {["1080p", "2K", "4K"].map((res) => (
                  <button
                    key={res}
                    onClick={() => setSeciliCozunurluk(res as "1080p" | "2K" | "4K")}
                    className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      seciliCozunurluk === res 
                        ? "bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]" 
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* OYUN KARTLARI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10 mt-2">
              
              {/* VALORANT */}
              <div className="bg-[#121215] border border-white/5 hover:border-[#00e5ff]/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors group">
                <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-2">Valorant</span>
                <span className="text-2xl font-black text-white group-hover:text-[#00e5ff] transition-colors leading-none">
                  {seciliCozunurluk === "1080p" ? "450+" : seciliCozunurluk === "2K" ? "320+" : "180+"}
                </span>
                <span className="text-[#00e5ff] text-[9px] font-bold mt-1 uppercase opacity-80">FPS</span>
              </div>

              {/* CS2 */}
              <div className="bg-[#121215] border border-white/5 hover:border-[#00e5ff]/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors group">
                <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-2">CS:2</span>
                <span className="text-2xl font-black text-white group-hover:text-[#00e5ff] transition-colors leading-none">
                  {seciliCozunurluk === "1080p" ? "380+" : seciliCozunurluk === "2K" ? "260+" : "140+"}
                </span>
                <span className="text-[#00e5ff] text-[9px] font-bold mt-1 uppercase opacity-80">FPS</span>
              </div>

              {/* GTA V */}
              <div className="bg-[#121215] border border-white/5 hover:border-[#00e5ff]/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors group">
                <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-2">GTA V</span>
                <span className="text-2xl font-black text-white group-hover:text-[#00e5ff] transition-colors leading-none">
                  {seciliCozunurluk === "1080p" ? "165+" : seciliCozunurluk === "2K" ? "120+" : "70+"}
                </span>
                <span className="text-[#00e5ff] text-[9px] font-bold mt-1 uppercase opacity-80">FPS</span>
              </div>

              {/* PUBG */}
              <div className="bg-[#121215] border border-white/5 hover:border-[#00e5ff]/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors group">
                <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-2">PUBG</span>
                <span className="text-2xl font-black text-white group-hover:text-[#00e5ff] transition-colors leading-none">
                  {seciliCozunurluk === "1080p" ? "210+" : seciliCozunurluk === "2K" ? "150+" : "90+"}
                </span>
                <span className="text-[#00e5ff] text-[9px] font-bold mt-1 uppercase opacity-80">FPS</span>
              </div>

            </div>
          </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#050814]/95 backdrop-blur-xl border-t border-white/10 p-3 sm:hidden z-[90] pb-safe max-w-[100vw]">
        <div className="flex items-center gap-2 max-w-full">
          
          <button onClick={handleToggleFavorite} className={`w-14 h-14 flex-shrink-0 rounded-xl border flex items-center justify-center text-xl transition-all ${isFav ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#09090b] border-white/10 text-white'}`}>
            {isFav ? "❤️" : "🤍"}
          </button>
          
          <button onClick={handleShare} className="w-14 h-14 flex-shrink-0 rounded-xl border border-white/10 bg-[#09090b] flex items-center justify-center text-white transition-all">
            {copied ? "✅" : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
          </button>

          <div className="relative flex-1 h-14">
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`w-full h-full rounded-xl font-black text-[13px] uppercase tracking-widest flex items-center justify-between px-4 ${tukendiMi ? 'bg-zinc-800 text-zinc-600' : 'bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.2)]'}`}>
              <span>{tukendiMi ? "TÜKENDİ" : "SEPETE EKLE"}</span>
              {!tukendiMi && (
                <div className="flex flex-col items-end bg-black/10 px-2 py-1 rounded">
                   <span className="text-[8px] font-bold opacity-80 leading-none mb-0.5">HAVALE</span>
                   <span className="text-[11px] font-black leading-none">{havaleFiyati.toLocaleString("tr-TR")} TL</span>
                </div>
              )}
            </button>
            {addedSuccess && <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#10b981] text-black text-[10px] font-black px-4 py-2 rounded-lg shadow-xl animate-bounce whitespace-nowrap">✅ Eklendi!</div>}
          </div>

        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-[999999] flex justify-center items-center p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
  {/* Arka plan tıklaması */}
  <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
  <div className="relative w-full sm:w-[600px] mx-auto bg-[#09090b] border border-[#00e5ff]/50 rounded-3xl flex flex-col max-h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.2)]">
              {/* Üst Başlık */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0 bg-[#050814]">
                <h2 className="font-black text-xl uppercase tracking-wider text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#00e5ff]" />
                  MÜŞTERİ DENEYİMİ
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all z-10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sekmeler (Google Çeviriye karşı zırhlandırıldı!) */}
              <div className="flex border-b border-slate-800 shrink-0 bg-[#121215]/50">
                <button 
                  onClick={() => setActiveTab("reviews")} 
                  className={"flex-1 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all " + (activeTab === "reviews" ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff]/10" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30")}
                >
                  ⭐ Yorumlar
                </button>
                <button 
                  onClick={() => setActiveTab("qa")} 
                  className={"flex-1 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all " + (activeTab === "qa" ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff]/10" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30")}
                >
                  💬 Soru ve Cevap
                </button>
              </div>

              {/* İçerik Alanı Başlangıcı */}
              <div className="custom-scrollbar overflow-y-auto p-4 sm:p-6 flex-none h-[60vh] sm:h-[450px] flex flex-col text-slate-300 bg-[#09090b]">
              {activeTab === "reviews" && (
                <div className="animate-fade-in flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row gap-6 items-center bg-[#050814] border border-white/5 p-6 rounded-2xl mb-6 shrink-0">
                    <div className="flex flex-col items-center justify-center w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0">
                      <span className="text-5xl font-black text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">{avgRating}</span>
                      <div className="text-amber-400 text-lg mt-1 tracking-widest">
                        {Number(avgRating) >= 1 ? "★" : "☆"}
                        {Number(avgRating) >= 2 ? "★" : "☆"}
                        {Number(avgRating) >= 3 ? "★" : "☆"}
                        {Number(avgRating) >= 4 ? "★" : "☆"}
                        {Number(avgRating) >= 5 ? "★" : "☆"}
                      </div>
                      <span className="text-xs text-slate-400 mt-2 font-medium">{reviews.length} Değerlendirme</span>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-2/3">
                      {[5, 4, 3, 2, 1].map((star, idx) => {
                        const percent = ratingPercents[idx];
                        return (
                          <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <span className="w-12 text-right">{star} Yıldız</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="w-8">{percent}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-6 shrink-0">
                    {!showReviewForm ? (
                      <button onClick={() => setShowReviewForm(true)} className="w-full py-3 bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] rounded-xl font-bold text-xs uppercase hover:bg-[#00e5ff]/20">
                        ✍️ Bu Ürünü Değerlendir
                      </button>
                    ) : (
                      <div className="bg-[#050814] p-5 rounded-xl border border-[#00e5ff]/20 animate-fade-in">
                        <h4 className="font-bold text-white mb-4 text-sm">Deneyimini Paylaş</h4>
                        <div className="flex gap-2 mb-4 text-3xl cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} onClick={() => setNewReviewRating(star)} className={`${star <= newReviewRating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                          ))}
                        </div>
                        <input value={newReviewName} onChange={(e) => setNewReviewName(e.target.value)} type="text" placeholder="İsminiz (Sadece baş harfi görünür)" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm mb-3 focus:border-[#00e5ff]/50 outline-none" />
                        <textarea value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} rows={3} placeholder="Ürün hakkında ne düşünüyorsunuz?" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm mb-3 focus:border-[#00e5ff]/50 outline-none"></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-xs font-bold uppercase">İptal</button>
                          <button onClick={submitReview} className="flex-1 py-2 bg-[#00e5ff] text-black rounded-lg text-xs font-black uppercase">Gönder</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 pb-10">
                    {reviews.length > 0 ? reviews.map((rev: any) => (
                      <div key={rev._id} className="bg-[#09090b] p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#00e5ff] flex items-center justify-center text-xs font-black text-black">{rev.name.charAt(0)}</div>
                            <div>
                              <p className="text-white text-sm font-extrabold tracking-wide">{rev.name}</p>
                              <div className="text-amber-400 text-[10px]">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</div>
                            </div>
                          </div>
                          <span className="text-slate-500 text-[10px]">{new Date(rev.tarih).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <p className="text-slate-100 text-sm leading-relaxed mt-2 break-words">{rev.text}</p>
                        
                        {rev.answer && (
                          <div className="mt-3 bg-[#050814] p-3 rounded-xl border-l-2 border-[#00e5ff] text-sm">
                            <span className="text-[#00e5ff] font-black block mb-1">Mağaza Cevabı:</span>
                            <span className="text-slate-100 break-words">{rev.answer}</span>
                          </div>
                        )}
                      </div>
                    )) : <div className="text-center py-6 text-slate-500 text-sm">İlk yorumu sen yap!</div>}
                  </div>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="animate-fade-in flex flex-col h-full">
                  <div className="mb-6 shrink-0">
                    {!showQuestionForm ? (
                      <button onClick={() => setShowQuestionForm(true)} className="w-full py-3 bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] rounded-xl font-bold text-xs uppercase hover:bg-[#00e5ff]/20">
                        ❓ Mağazaya Soru Sor
                      </button>
                    ) : (
                      <div className="bg-[#050814] p-5 rounded-xl border border-[#00e5ff]/20 animate-fade-in">
                        <h4 className="font-bold text-white mb-3 text-sm">Sorunuzu İletin</h4>
                        <input value={newQuestionName} onChange={(e) => setNewQuestionName(e.target.value)} type="text" placeholder="İsminiz (Sadece baş harfi görünür)" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm mb-3 focus:border-[#00e5ff]/50 outline-none" />
                        <textarea value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} rows={3} placeholder="Ne öğrenmek istersiniz?" className="w-full bg-[#09090b] border border-white/10 p-3 rounded-lg text-sm mb-3 focus:border-[#00e5ff]/50 outline-none"></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => setShowQuestionForm(false)} className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-xs font-bold uppercase">İptal</button>
                          <button onClick={submitQuestion} className="flex-1 py-2 bg-[#00e5ff] text-black rounded-lg text-xs font-black uppercase">Gönder</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 pb-10">
                    {questions.length > 0 ? questions.map((q: any) => (
                      <div key={q._id} className="bg-[#050814] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 bg-[#09090b]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-slate-700 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Soru</span>
                            <span className="text-white text-sm font-extrabold tracking-wide">{q.name} <span className="text-slate-500 font-normal text-xs ml-1">({new Date(q.tarih).toLocaleDateString("tr-TR")})</span></span>
                          </div>
                          <p className="text-slate-100 text-sm leading-relaxed break-words">{q.text}</p>
                        </div>
                        {q.answer ? (
                          <div className="p-4 bg-gradient-to-r from-[#00e5ff]/5 to-transparent border-l-2 border-[#00e5ff]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-[#00e5ff] text-black text-[9px] px-2 py-0.5 rounded font-bold uppercase">Cevap</span>
                              <span className="text-[#00e5ff] text-xs font-bold">Bilgin PC Mağazası</span>
                            </div>
                            <p className="text-slate-100 text-sm leading-relaxed break-words">{q.answer}</p>
                          </div>
                        ) : <div className="p-3 text-[10px] text-slate-500 italic text-center">Mağaza henüz cevaplamadı.</div>}
                      </div>
                    )) : <div className="text-center py-6 text-slate-500 text-sm">İlk soruyu sen sor!</div>}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

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