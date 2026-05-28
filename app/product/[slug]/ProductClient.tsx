"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { useCompare } from "@/app/CompareContext";
import { Settings2, X } from "lucide-react";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 
  const { karsilastirmayaEkle, setPopupAcik } = useCompare();
  
  // 🚀 ZIRHLI HAFIZALAR
  const [activeTab, setActiveTab] = useState("reviews");
  const [seciliCozunurluk, setSeciliCozunurluk] = useState("1080p");
  const [seciliIslemci, setSeciliIslemci] = useState("i5");

  const fpsVerileri: any = {
    Valorant: {
      i5: { "1080p": "450+", "2K": "320+", "4K": "180+" },
      i7: { "1080p": "540+", "2K": "390+", "4K": "210+" },
      i9: { "1080p": "620+", "2K": "460+", "4K": "260+" }
    },
    CS2: {
      i5: { "1080p": "380+", "2K": "260+", "4K": "140+" },
      i7: { "1080p": "460+", "2K": "310+", "4K": "180+" },
      i9: { "1080p": "550+", "2K": "380+", "4K": "230+" }
    },
    GTAV: {
      i5: { "1080p": "165+", "2K": "120+", "4K": "70+" },
      i7: { "1080p": "190+", "2K": "145+", "4K": "85+" },
      i9: { "1080p": "220+", "2K": "170+", "4K": "105+" }
    },
    PUBG: {
      i5: { "1080p": "210+", "2K": "150+", "4K": "90+" },
      i7: { "1080p": "250+", "2K": "180+", "4K": "110+" },
      i9: { "1080p": "290+", "2K": "220+", "4K": "135+" }
    }
  };

  const [teknikPopupAcik, setTeknikPopupAcik] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [reviews, setReviews] = useState([] as any[]);
  const [questions, setQuestions] = useState([] as any[]);

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

  useEffect(() => {
    if (teknikPopupAcik) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [teknikPopupAcik]);

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

  if (!product) return <div className="text-center p-10 text-[#00e5ff] font-bold">Yükleniyor...</div>;

  const indirimVarMi = indirimliFiyat !== null && normalFiyat > indirimliFiyat;
  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
  const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
  const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
  const adetGosterilecekMi = product.stokAdedi !== null && product.stokAdedi !== undefined && product.stokAdedi !== "" && Number(product.stokAdedi) > 0;
  const havaleFiyati = gecerliFiyat - (gecerliFiyat * havaleYuzdesi) / 100;
  const resimler = product.images && product.images.length > 0 ? product.images.map((i:any) => i.src) : [product.resim || "https://via.placeholder.com/600"];

  return (
    <div className="min-h-screen bg-[#050814] text-white pb-32 sm:pb-10 font-sans overflow-x-hidden relative max-w-[100vw]">
      
      {/* BAŞARI MESAJI TOAST */}
      <div className={`fixed top-24 right-5 z-[9999] bg-[#09090b] border border-[#00e5ff]/50 shadow-[0_0_30px_rgba(0,229,255,0.2)] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 transform ${toastMessage ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
        <span className="text-[#00e5ff] text-2xl">✓</span>
        <p className="text-sm">{toastMessage}</p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 sm:py-10 sm:px-6">
        
        {/* SOL: GÖRSELLER */}
        <div className="w-full md:w-1/2 md:rounded-3xl bg-transparent sm:bg-[#09090b] sm:border sm:border-white/5 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {resimler.map((img: string, idx: number) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center flex justify-center items-center h-[350px] sm:h-[500px] relative">
                <img src={img} alt={urunAdi + " - " + (idx + 1)} className={`max-w-full max-h-full object-contain p-4 sm:p-8 ${tukendiMi ? "grayscale opacity-50" : ""}`} />
              </div>
            ))}
          </div>
        </div>
        
        {/* SAĞ: ÜRÜN BİLGİLERİ */}
        <div className="w-full md:w-1/2 px-4 sm:px-0 mt-4 sm:mt-0 flex flex-col justify-center">
          
          {/* STOK BİLGİSİ */}
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
              {Number(avgRating) >= 1 ? "★" : "☆"}
              {Number(avgRating) >= 2 ? "★" : "☆"}
              {Number(avgRating) >= 3 ? "★" : "☆"}
              {Number(avgRating) >= 4 ? "★" : "☆"}
              {Number(avgRating) >= 5 ? "★" : "☆"}
            </div>
            <span className="text-slate-400 text-[11px] sm:text-xs font-medium group-hover:text-white transition-colors underline decoration-white/20 underline-offset-4">{reviews.length} Değerlendirme</span>
          </div>

          {/* FİYAT KUTUSU */}
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

          {/* KARGO */}
          <div className="flex items-center gap-4 bg-[#09090b] border border-white/5 p-3 sm:p-4 rounded-xl mb-5">
            <div className="text-2xl sm:text-3xl">🚚</div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">HIZLI KARGO AVANTAJI</span>
              <span className="text-xs sm:text-sm font-medium mt-0.5">{timeLeft} <strong className="text-[#10b981] font-black">{shippingMessage}</strong></span>
            </div>
          </div>

          {/* MASAÜSTÜ SEPETE EKLE */}
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

          {/* MASAÜSTÜ FAVORİ VE PAYLAŞ BUTONLARI */}
          <div className="hidden sm:flex items-center gap-3 mb-3">
            <button onClick={handleToggleFavorite} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${isFav ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-[#09090b] border-white/10 hover:bg-white/5 text-white"}`}>
              {isFav ? "❤️ Favorilerde" : "🤍 Favoriye Ekle"}
            </button>
            <button onClick={handleShare} className="flex-1 py-3 rounded-xl border border-white/10 bg-[#09090b] hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all">
              {copied ? "🟩 Kopyalandı" : "📤 Paylaş / Kopyala"}
            </button>
          </div>

          {/* 💎 KİBAR VE MODERN ANA BUTON */}
          <div className="my-4 z-10 relative">
            <button
              onClick={(e) => { e.preventDefault(); setActiveTab("reviews"); setTeknikPopupAcik(true); }}
              className="w-full flex items-center justify-center gap-3 bg-[#121215] border border-white/10 hover:border-[#00e5ff]/50 text-white p-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.05)] hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] group"
            >
              <Settings2 className="w-5 h-5 text-[#00e5ff] group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-sm font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">Sistem Genetiği & Müşteri Deneyimi</span>
            </button>
          </div>

        </div>
      </div>

      {/* 📱 MOBİL SABİT ALT BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#050814]/95 backdrop-blur-md border-t border-slate-800 p-3 z-[50] flex gap-2">
        <button onClick={handleToggleFavorite} className="w-12 h-12 flex items-center justify-center bg-[#121215] border border-slate-700 hover:border-[#00e5ff] rounded-xl text-white transition-colors text-lg">
          {isFav ? "❤️" : "🤍"}
        </button>
        <button onClick={handleShare} className="w-12 h-12 flex items-center justify-center bg-[#121215] border border-slate-700 hover:border-[#00e5ff] rounded-xl text-white transition-colors text-lg">
          📤
        </button>
        <button type="button" onClick={handleAddToCart} disabled={addingToCart || tukendiMi} className={`flex-1 font-black uppercase tracking-wider rounded-xl flex flex-col items-center justify-center transition-all ${tukendiMi ? "bg-zinc-800 text-zinc-500" : "bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:bg-[#00c4db]"}`}>
           <span className="text-sm">{tukendiMi ? "TÜKENDİ" : "SEPETE EKLE"}</span>
           {!tukendiMi && <span className="text-[9px] opacity-80">Havale: {havaleFiyati.toLocaleString("tr-TR")} TL</span>}
        </button>
      </div>

      {/* 💎 KİBAR VE MODERN 4 SEKMELİ POPUP */}
      {teknikPopupAcik && (
        <div className="fixed inset-0 z-[999999] flex justify-center items-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="absolute inset-0" onClick={() => setTeknikPopupAcik(false)}></div>
          
          <div className="relative w-full sm:w-[700px] mx-auto bg-[#09090b] border border-[#00e5ff]/30 rounded-3xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.1)]">
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/5 shrink-0 bg-[#121215] relative overflow-hidden">
              <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 relative z-10">
                <span className="text-[#00e5ff] text-xl">⚡</span> 
                Sistem ve Kullanıcı Deneyimi
              </h2>
              <button onClick={() => setTeknikPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#09090b] border border-white/5 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all z-10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex overflow-x-auto whitespace-nowrap border-b border-white/5 shrink-0 bg-[#09090b] relative z-10 custom-scrollbar">
              <button onClick={() => setActiveTab("reviews")} className={"px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all " + (activeTab === "reviews" ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff]/5" : "text-slate-500 hover:text-slate-300")}>⭐ Yorumlar</button>
              <button onClick={() => setActiveTab("questions")} className={"px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all " + (activeTab === "questions" ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff]/5" : "text-slate-500 hover:text-slate-300")}>💬 Soru & Cevap</button>
              <button onClick={() => setActiveTab("tech")} className={"px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all " + (activeTab === "tech" ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff]/5" : "text-slate-500 hover:text-slate-300")}>⚙️ Teknik Bilgiler</button>
              <button onClick={() => setActiveTab("fps")} className={"px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all " + (activeTab === "fps" ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff]/5" : "text-slate-500 hover:text-slate-300")}>🎮 FPS Testi</button>
            </div>

            <div className="custom-scrollbar overflow-y-auto p-4 sm:p-6 flex-none h-[65vh] sm:h-[500px] flex flex-col text-slate-300 bg-[#09090b]">
               
               {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {reviews.length === 0 ? <p className="text-center py-5 text-slate-500 font-medium">Bu ürüne henüz yorum yapılmamış.</p> : reviews.map((rev, i) => (
                       <div key={i} className="mb-4 pb-4 border-b border-white/5">
                          <div className="flex justify-between items-center mb-2">
                             <span className="font-bold text-white">{rev.name || "İsimsiz"}</span>
                             <span className="text-amber-400 text-xs">{"★".repeat(Number(rev.rating))}{"☆".repeat(5 - Number(rev.rating))}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{rev.text}</p>
                          {(rev.reply || rev.adminReply) && (
                            <div className="ml-4 p-3 bg-[#00e5ff]/5 border-l-2 border-[#00e5ff] rounded-r-lg mt-2">
                              <span className="font-black text-[#00e5ff] text-[10px] uppercase block mb-1">Yetkili Cevabı:</span>
                              <p className="text-sm text-slate-300">{rev.reply || rev.adminReply}</p>
                            </div>
                          )}
                       </div>
                    ))}
                  </div>
               )}

               {activeTab === "questions" && (
                  <div className="space-y-4">
                    {questions.length === 0 ? <p className="text-center py-5 text-slate-500 font-medium">Henüz soru sorulmamış.</p> : questions.map((q, i) => (
                       <div key={i} className="mb-4 pb-4 border-b border-white/5">
                          <span className="font-bold text-white block mb-1">❓ {q.name || "Müşteri"}:</span>
                          <p className="text-sm text-slate-300 mb-3">{q.text}</p>
                          {(q.reply || q.adminReply) && (
                            <div className="ml-4 p-3 bg-[#00e5ff]/5 border-l-2 border-[#00e5ff] rounded-r-lg mt-2">
                              <span className="font-black text-[#00e5ff] text-[10px] uppercase block mb-1">Yetkili Cevabı:</span>
                              <p className="text-sm text-slate-300">{q.reply || q.adminReply}</p>
                            </div>
                          )}
                       </div>
                    ))}
                  </div>
               )}

               {activeTab === "tech" && product.teknik_ozellikler && Object.keys(product.teknik_ozellikler).length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                       {Object.entries(product.teknik_ozellikler).map(([anahtar, deger]) => (
                          <div key={anahtar} className="flex justify-between items-center py-3 border-b border-white/5 px-3 rounded-lg">
                            <span className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase w-1/2">{anahtar}</span>
                            <span className="text-white font-medium text-xs sm:text-sm w-1/2 text-right">{deger as string}</span>
                          </div>
                       ))}
                   </div>
               ) : activeTab === "tech" && <p className="text-center py-10 text-slate-500 font-medium">Teknik detay bulunamadı.</p>}

               {activeTab === "fps" && (
                    <div className="space-y-6">
                      <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/30 p-4 rounded-xl flex gap-3 items-start">
                        <span className="text-[#00e5ff] text-xl">ℹ️</span>
                        <p className="text-[#00e5ff] text-[11px] sm:text-xs font-medium leading-relaxed opacity-90">
                          <strong className="font-black tracking-wider">ÖNEMLİ NOT:</strong> FPS değerleri laboratuvar test sonuçlarıdır.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#121215] p-4 rounded-2xl border border-white/5">
                        <div className="w-full sm:w-auto">
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">İşlemci:</span>
                          <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/5">
                            {[{ id: "i5", label: "i5 / R5" }, { id: "i7", label: "i7 / R7" }, { id: "i9", label: "i9 / R9" }].map((islemci) => (
                              <button key={islemci.id} onClick={() => setSeciliIslemci(islemci.id as "i5" | "i7" | "i9")} className={"flex-1 px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase transition-all " + (seciliIslemci === islemci.id ? "bg-[#00e5ff]/20 border border-[#00e5ff] text-white" : "text-slate-400")}>{islemci.label}</button>
                            ))}
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">Çözünürlük:</span>
                          <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/5">
                            {["1080p", "2K", "4K"].map((res) => (
                              <button key={res} onClick={() => setSeciliCozunurluk(res as "1080p" | "2K" | "4K")} className={"flex-1 px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase transition-all " + (seciliCozunurluk === res ? "bg-[#00e5ff] text-black" : "text-slate-400")}>{res}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[{ ad: "Valorant", kod: "Valorant" }, { ad: "CS:2", kod: "CS2" }, { ad: "GTA V", kod: "GTAV" }, { ad: "PUBG", kod: "PUBG" }].map((oyun) => (
                          <div key={oyun.kod} className="bg-[#09090b] border border-[#00e5ff]/40 rounded-2xl p-5 flex flex-col items-center justify-center">
                            <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-2">{oyun.ad}</span>
                            <span className="text-3xl font-black text-white">{(fpsVerileri as any)[oyun.kod]?.[seciliIslemci]?.[seciliCozunurluk] || "0"}</span>
                            <span className="text-[#00e5ff] text-[10px] font-bold mt-1.5 uppercase">FPS</span>
                          </div>
                        ))}
                      </div>
                   </div>
               )}
            </div>

            <div className="p-4 sm:p-5 border-t border-white/5 shrink-0 bg-[#121215] rounded-b-3xl z-10">
              <button onClick={() => setTeknikPopupAcik(false)} className="w-full bg-[#00e5ff] text-black font-black px-8 py-4 sm:py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">Anladım, Kapat</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}