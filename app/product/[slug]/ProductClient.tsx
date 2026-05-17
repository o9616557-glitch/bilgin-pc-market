"use client";

import React, { useState, useEffect, useRef } from "react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface Review {
  id: number;
  parent_id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
}

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("aciklama");

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  // 🎮 FPS SİMÜLATÖRÜ STATE'LERİ
  const [selectedCpu, setSelectedCpu] = useState("mid");
  const [selectedRes, setSelectedRes] = useState<"1080p" | "1440p">("1080p");

  // ARAMA VE KIYASLAMA STATE'LERİ
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompareProduct, setSelectedCompareProduct] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // APİ STATE'LERİ
  const [reviews, setReviews] = useState<Review[]>([]);         
  const [questions, setQuestions] = useState<Review[]>([]);       
  const [replies, setReplies] = useState<Review[]>([]);           
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ reviewer: "", email: "", review: "", rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState({ type: "", text: "" });

  const [newQuestion, setNewQuestion] = useState({ name: "", email: "", question: "" });
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionSuccessMessage, setQuestionSuccessMessage] = useState({ type: "", text: "" });

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (allProducts.length > 0) {
      const fallback = allProducts.find((p: any) => p.id !== product.id);
      if (fallback) setSelectedCompareProduct(fallback);
    }
  }, [product, allProducts]);

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
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchReviewsAndQuestions = async () => {
    if (!product || !product.id) return;
    setLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews?product=${product.id}`);
      if (response.ok) {
        const data: Review[] = await response.json();
        const normalReviews = data.filter((item: Review) => Number(item.parent_id) === 0 && !item.review.includes("[SORU]"));
        const customerQuestions = data.filter((item: Review) => Number(item.parent_id) === 0 && item.review.includes("[SORU]"));
        const adminReplies = data.filter((item: Review) => Number(item.parent_id) > 0);

        setReviews(normalReviews);
        setQuestions(customerQuestions);
        setReplies(adminReplies);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviewsAndQuestions();
  }, [product]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewSuccessMessage({ type: "", text: "" });

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          reviewer: newReview.reviewer,
          reviewer_email: newReview.email,
          review: newReview.review,
          rating: newReview.rating,
          is_question: false
        })
      });

      if (!response.ok) throw new Error("Gönderilemedi");
      setReviewSuccessMessage({ type: "success", text: "Yorumunuz panele iletildi şefim!" });
      fetchReviewsAndQuestions();
    } catch (err) {
      setReviewSuccessMessage({ type: "error", text: "Yorum gönderilirken bir hata oluştu." });
    } finally {
      setTimeout(() => {
        setSubmittingReview(false);
        if (reviewSuccessMessage.type === "success") {
          setShowReviewForm(false);
          setNewReview({ reviewer: "", email: "", review: "", rating: 5 });
        }
        setReviewSuccessMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuestion(true);
    setQuestionSuccessMessage({ type: "", text: "" });

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          reviewer: newQuestion.name,
          reviewer_email: newQuestion.email,
          review: newQuestion.question,
          rating: 0,
          is_question: true
        })
      });

      if (!response.ok) throw new Error("Gönderilemedi");
      setQuestionSuccessMessage({ type: "success", text: "Sorunuz başarıyla iletildi!" });
      fetchReviewsAndQuestions();
    } catch (error) {
      setQuestionSuccessMessage({ type: "error", text: "Sorunuz iletilirken bir teknik hata oluştu." });
    } finally {
      setTimeout(() => {
        setSubmittingQuestion(false);
        setNewQuestion({ name: "", email: "", question: "" });
        setQuestionSuccessMessage({ type: "", text: "" });
      }, 4000);
    }
  };

  const galleryImages = product.images || [];
  const hasMultipleImages = galleryImages.length > 1;

  const nextImage = (e: React.MouseEvent) => { e.preventDefault(); if (galleryImages.length > 0) setActiveImageIndex((prev) => (prev + 1) % galleryImages.length); };
  const prevImage = (e: React.MouseEvent) => { e.preventDefault(); if (galleryImages.length > 0) setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); };

  const handleAddToCart = () => {
    setAddingToCart(true);
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({ id: product.id, name: product.name, price: product.price || product.regular_price, image: galleryImages[0]?.src || "/placeholder.png", slug: product.slug, quantity: quantity });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));

    setTimeout(() => {
      setAddingToCart(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000); 
    }, 850);
  };

  const stoktaVar = product.stock_status === "instock";
  const regularPrice = Number(product.regular_price || 0);
  const currentPrice = Number(product.price || 0);
  const isSale = product.on_sale === true || product.on_sale === "true" || (regularPrice > currentPrice && currentPrice > 0);
  const eskiFiyat = regularPrice > currentPrice ? regularPrice : (isSale ? Math.round(currentPrice * 1.15) : 0);
  const havaleFiyati = currentPrice * 0.95;

  const activeMapping: Record<string, string> = {
    model: "Model",
    grafik_motoru: "Grafik Motoru",
    ai_performansi: "AI Performansı",
    bus_standarti: "Bus Standartı",
    opengl: "OpenGL",
    bellek: "Bellek Kapasitesi",
    saat_hizi: "Saat Hızı",
    cuda_cekirdegi: "CUDA Çekirdeği",
    bellek_hizi: "Bellek Hızı",
    bellek_arayuzu: "Bellek Arayüzü",
    cozunurluk: "Maksimum Çözünürlük",
    maksimum_ekran_destegi: "Maksimum Ekran Desteği",
    boyutlar: "Boyutlar",
    tavsiye_edilen_guc_kaynagi: "Tavsiye Edilen Güç Kaynağı (PSU)",
    guc_baglantilari: "Güç Bağlantıları",
    yuva: "Yuva Tipi",
    aura_sync: "Aura Sync / RGB"
  };

  const getSpecsList = (targetProduct: any) => {
    if (!targetProduct) return [];
    const specsMap = new Map<string, any>();
    
    Object.entries(activeMapping).forEach(([key, label]: [string, string]) => {
      const metaValue = targetProduct.meta_data?.find((m: any) => m.key === key)?.value || targetProduct.acf?.[key];
      if (metaValue) {
        specsMap.set(key, { label, value: String(metaValue) });
      }
    });

    targetProduct.attributes?.forEach((attr: any) => {
      const matchKey = Object.keys(activeMapping).find((k: string) => k === attr.name?.toLowerCase() || activeMapping[k].toLowerCase() === attr.name?.toLowerCase());
      if (matchKey) {
        specsMap.set(matchKey, { label: activeMapping[matchKey], value: attr.options?.join(', ') });
      } else if (attr.name && attr.options) {
        specsMap.set(attr.name.toLowerCase(), { label: attr.name, value: attr.options.join(', ') });
      }
    });

    return Array.from(specsMap.values());
  };

  const finalTechSpecs = getSpecsList(product);
  
  const cpuMultipliers: Record<string, number> = { entry: 0.85, mid: 0.93, high: 1.00, extreme: 1.10 };
  const gamesConfig = [
    { id: "pubg", label: "PUBG: BATTLEGROUNDS", maxFps: 400, default1080p: 210, default1440p: 140, color: "from-amber-500 to-orange-600" },
    { id: "valorant", label: "VALORANT", maxFps: 600, default1080p: 450, default1440p: 320, color: "from-rose-500 to-red-600" },
    { id: "cs2", label: "Counter-Strike 2 (CS2)", maxFps: 550, default1080p: 380, default1440p: 260, color: "from-sky-500 to-blue-600" }
  ];
  
  const processedFpsData = gamesConfig.map((game: any) => {
    const acfKey = `${game.id}_${selectedRes}_fps`; 
    const baseFps = Number(product.meta_data?.find((m: any) => m.key === acfKey)?.value || product.acf?.[acfKey]) || (selectedRes === "1080p" ? game.default1080p : game.default1440p);
    const calculatedFps = Math.round(baseFps * (cpuMultipliers[selectedCpu] || 1.0));
    return {
      label: game.label,
      fps: calculatedFps,
      percentage: Math.min((calculatedFps / game.maxFps) * 100, 100),
      color: game.color
    };
  });

  // 🚀 GERİ GELEN YILDIZLAMA VE TARİH YARDIMCI FONKSİYONLARI (SIFIR HATA)
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400 text-sm">
        {[...Array(5)].map((_, index) => <span key={index}>{index < rating ? '★' : '☆'}</span>)}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const reviewsRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8 font-medium">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl shadow-lg relative z-10">
          
          {/* GÖRSEL ALANI */}
          <div className="flex flex-col gap-4 relative group">
            <div className="w-full bg-transparent p-0 sm:p-6 rounded-md overflow-hidden aspect-square relative flex items-center justify-center cursor-pointer">
              {galleryImages.map((img: any, index: number) => (
                <PhotoView key={index} src={img.src}>
                  <img src={img.src} alt={product.name} className={`max-h-full max-w-full object-contain transform group-hover:scale-[1.02] transition-transform duration-500 ${activeImageIndex === index ? "block" : "hidden"}`} />
                </PhotoView>
              ))}
            </div>

            {hasMultipleImages && (
              <div className="flex items-center justify-between gap-3 bg-[#050814]/40 border border-white/5 p-2 rounded-md">
                <button type="button" onClick={prevImage} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">←</button>
                <div className="flex-1 flex justify-center items-center gap-1.5 flex-wrap">
                  {galleryImages.map((_: any, index: number) => (
                    <button key={index} type="button" onClick={() => setActiveImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === index ? 'bg-blue-500 w-4' : 'bg-white/20'}`} />
                  ))}
                </div>
                <button type="button" onClick={nextImage} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">→</button>
              </div>
            )}
          </div>

          {/* DETAY VE FİYAT ALANI */}
          <div className="flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="bg-white/5 border border-white/10 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full">KOD: {product.sku || product.id}</span>
                {stoktaVar ? <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full">STOKTA VAR</span> : <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full">TÜKENDİ</span>}
                {isSale && <span className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">💎 BÜYÜK FIRSAT ÜRÜNÜ</span>}
              </div>

              <div className="flex items-center gap-2 mb-2">
                {renderStars(Number(reviewsRating))}
                <span className="text-[11px] font-bold text-slate-400">{reviewsRating} / ({reviews.length} Yorum)</span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 text-slate-100">{product.name}</h1>
              
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-md mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">Havale Fiyatı (%5 İndirimli)</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">{havaleFiyati.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Kredi Kartı Tek Çekim</span>
                  {isSale && eskiFiyat > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                      <span className="text-xs line-through text-red-400 font-bold">{eskiFiyat.toLocaleString('tr-TR')} TL</span>
                      <span className="text-sm sm:text-base font-black text-slate-200">{currentPrice.toLocaleString('tr-TR')} TL</span>
                    </div>
                  ) : <span className="text-sm sm:text-base font-black text-slate-200">{currentPrice.toLocaleString('tr-TR')} TL</span>}
                </div>
              </div>

              <div className="bg-blue-600/5 border border-blue-500/10 rounded-md p-2.5 mb-3 flex items-center gap-2 text-xs font-bold text-blue-400 shadow-inner">
                <span>💳</span>
                <span>Kredi Kartına 12 Taksit Seçeneği!</span>
              </div>

              <div className="flex items-center gap-3 mb-4 bg-[#050814]/50 p-3 rounded-md border border-blue-500/20">
                <div className="text-xl text-blue-400 animate-pulse">🚀</div>
                <div className="flex flex-col text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] text-blue-400">HIZLI KARGO AVANTAJI</span>
                  <span className="text-slate-300 mt-0.5">{timeLeft}</span>
                  <span className={`font-black text-sm uppercase ${shippingMessage === "BUGÜN KARGODA!" ? "text-emerald-400" : "text-amber-400"}`}>{shippingMessage}</span>
                </div>
              </div>
            </div>

            {/* MASAÜSTÜ SEPET VE FAVORİ ALANI */}
            <div className="border-t border-white/5 pt-4 mt-2 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-md p-1.5 min-w-[100px]">
                  <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">-</button>
                  <span className="px-2 font-black text-sm text-white">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">+</button>
                </div>
                
                <button type="button" onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className={`flex-1 font-black py-3 px-6 rounded-md uppercase tracking-wider text-xs sm:text-sm ${addedSuccess ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
                  {addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ SEPETE EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
                </button>

                <button type="button" onClick={() => setIsFav(!isFav)} className={`w-12 h-12 rounded-md border flex items-center justify-center text-xl transition-all ${isFav ? "bg-red-600 border-red-500 text-white shadow" : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-400"}`}>
                  <span className={isFav ? "text-white" : "text-slate-400"}>❤️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AKORDEON DEPARTMANI */}
        <div className="max-w-6xl mx-auto mt-6 sm:mt-10 flex flex-col gap-6">
          <div className="bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 rounded-xl shadow-lg flex flex-col overflow-hidden">
            
            {/* AÇIKLAMA */}
            <div className="border-b border-white/5">
              <button type="button" onClick={() => toggleAccordion("aciklama")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                <span className="text-sm font-black uppercase tracking-widest text-blue-400">🛠️ Ürün Açıklaması</span>
                <span className="text-blue-400">▼</span>
              </button>
              <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "aciklama" ? "max-h-[5000px] pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 text-slate-300 text-sm" dangerouslySetInnerHTML={{ __html: product.description || "Açıklama yok." }} />
              </div>
            </div>

            {/* TEKNİK ÖZELLİKLER */}
            {finalTechSpecs.length > 0 && (
              <div className="border-b border-white/5">
                <button type="button" onClick={() => toggleAccordion("teknik")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                  <span className="text-sm font-black uppercase tracking-widest text-blue-400">⚙️ Teknik Özellikler ({finalTechSpecs.length})</span>
                  <span className="text-blue-400">▼</span>
                </button>
                <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "teknik" ? "max-h-[5000px] pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                     <div className="border-t border-white/5 pt-3">
                       <table className="w-full text-left text-sm">
                         <tbody>
                           {finalTechSpecs.map((spec: any, i: number) => (
                             <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                               <td className="py-2.5 font-bold text-slate-400 w-5/12 uppercase tracking-wide text-[11px]">{spec.label}</td>
                               <td className="py-2.5 text-slate-200 font-semibold">{spec.value}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                </div>
              </div>
            )}

            {/* FPS PERFORMANS LABORATUVARI PANELI */}
            <div className="border-b border-white/5">
              <button type="button" onClick={() => toggleAccordion("fps_paneli")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                <span className="text-sm font-black uppercase tracking-widest text-amber-500">🎮 Oyun FPS Performans Laboratuvarı</span>
                <span className="text-amber-500">▼</span>
              </button>
              <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "fps_paneli" ? "max-h-[1000px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-white/5 pt-4 space-y-4">
                  
                  <div className="flex items-center gap-2 bg-[#050814] p-1 border border-white/5 rounded-lg w-max text-xs">
                    <button type="button" onClick={() => setSelectedRes("1080p")} className={`px-4 py-1.5 rounded font-bold uppercase transition-all ${selectedRes === '1080p' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Full HD (1080p)</button>
                    <button type="button" onClick={() => setSelectedRes("1440p")} className={`px-4 py-1.5 rounded font-bold uppercase transition-all ${selectedRes === '1440p' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>2K Ultra (1440p)</button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] text-center font-bold">
                    {[
                      { id: "entry", label: "Giriş Seviye" },
                      { id: "mid", label: "Orta Seviye" },
                      { id: "high", label: "Üst Seviye" },
                      { id: "extreme", label: "Ekstrem" }
                    ].map((cpu) => (
                      <button key={cpu.id} type="button" onClick={() => setSelectedCpu(cpu.id)} className={`p-2 rounded border transition-all ${selectedCpu === cpu.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-[#050814]/40 border-white/5 text-slate-400'}`}>{cpu.label}</button>
                    ))}
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {processedFpsData.map((game: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300 uppercase tracking-wide">{game.label}</span>
                          <span className="text-amber-400 font-black">{game.fps} FPS</span>
                        </div>
                        <div className="w-full bg-[#050814] h-2 rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full bg-gradient-to-r ${game.color} rounded-full transition-all duration-500`} style={{ width: `${game.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* ÜRÜN KARŞILAŞTIRMA LAB */}
            <div>
              <button type="button" onClick={() => toggleAccordion("karsilastir")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                <span className="text-sm font-black uppercase tracking-widest text-emerald-400">⚖️ Ürün Karşılaştırma Laboratuvarı</span>
                <span className="text-emerald-400">▼</span>
              </button>
              <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "karsilastir" ? "max-h-[3000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-white/5 pt-4">
                  <div className="relative mb-5" ref={dropdownRef}>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Kıyaslamak İstediğiniz Diğer Ürünü Seçin</label>
                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-[#050814] border border-white/10 rounded-lg p-3 text-xs text-left text-slate-300 flex justify-between items-center hover:border-blue-500 transition-colors">
                      <span>{selectedCompareProduct ? selectedCompareProduct.name : "Ürün Seçilmedi..."}</span>
                      <span>▼</span>
                    </button>
                    {isDropdownOpen && compareOptions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 max-h-56 bg-[#0b1329] border border-white/10 rounded-lg overflow-y-auto z-50 p-1 shadow-2xl">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ürün adı ara..." className="w-full bg-[#050814] border border-white/5 rounded p-2 text-xs text-white focus:outline-none mb-1" />
                        {filteredOptions.map((item: any) => (
                          <div key={item.id} onClick={() => { setSelectedCompareProduct(item); setIsDropdownOpen(false); setSearchQuery(""); }} className="p-2 text-xs hover:bg-blue-600 rounded cursor-pointer text-slate-300 hover:text-white uppercase font-bold">{item.name}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedCompareProduct ? (
                    (() => {
                      const opponentSpecs = getSpecsList(selectedCompareProduct);
                      const allCompareLabels = Array.from(new Set([
                        ...finalTechSpecs.map((s: any) => s.label.toLowerCase()),
                        ...opponentSpecs.map((s: any) => s.label.toLowerCase())
                      ]));

                      return (
                        <div className="w-full bg-[#050814]/40 border border-white/5 rounded-xl p-4 overflow-x-auto shadow-inner">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-black">
                                <th className="pb-3 w-4/12">TEKNİK ÖZELLİK</th>
                                <th className="pb-3 w-4/12 text-blue-400">BU ÜRÜN</th>
                                <th className="pb-3 w-4/12 text-emerald-400">KARŞILAŞTIRILAN ÜRÜN</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {allCompareLabels.map((lowerLabel: any, i: number) => {
                                const currentItem = finalTechSpecs.find((s: any) => s.label.toLowerCase() === lowerLabel);
                                const opponentItem = opponentSpecs.find((s: any) => s.label.toLowerCase() === lowerLabel);
                                const displayLabel = currentItem?.label || opponentItem?.label || lowerLabel;
                                
                                return (
                                  <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 font-bold text-slate-400 uppercase tracking-wider text-[10px]">{displayLabel}</td>
                                    <td className="py-3 text-slate-200 font-bold pr-3">{currentItem?.value || "-"}</td>
                                    <td className="py-3 text-emerald-400 font-bold">{opponentItem?.value || "-"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-4 text-slate-600 text-xs">Kıyaslanacak rakip ürün listesi yüklenemedi şefim.</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MOBİL PANEL VE FAVORİ KOMBİNASYONU */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Havale Fiyatı</span>
            <span className="text-base font-black text-emerald-400">{havaleFiyati.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsFav(!isFav)} className={`w-10 h-10 rounded-md border flex items-center justify-center text-lg ${isFav ? "bg-red-600 border-red-500 text-white" : "bg-white/5 border-white/10"}`}>
              <span className={isFav ? "text-white" : "text-slate-400"}>❤️</span>
            </button>
            <button type="button" onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className="font-black py-2.5 px-5 rounded-md uppercase text-xs text-white bg-blue-600">
              {addingToCart ? "..." : addedSuccess ? "✅" : "Sepete Ekle"}
            </button>
          </div>
        </div>

      </div>
    </PhotoProvider>
  );
}