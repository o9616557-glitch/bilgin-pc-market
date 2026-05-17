"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface Review {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  verified: boolean;
}

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("aciklama");

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // FPS SİMÜLATÖR STATE'LERİ
  const [selectedCpu, setSelectedCpu] = useState("mid");
  const [selectedRes, setSelectedRes] = useState<"1080p" | "1440p">("1080p");

  // ARAMA VE KIYASLAMA STATE'LERİ
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompareProduct, setSelectedCompareProduct] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🚀 AYRIŞTIRILMIŞ STANDART API STATE'LERİ
  const [reviews, setReviews] = useState<Review[]>([]);         // Normal Yorumlar
  const [questions, setQuestions] = useState<any[]>([]);       // Müşteri Soruları
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

  // KULLANICI GİRİŞ KONTROLÜ
  useEffect(() => {
    const checkLoginStatus = () => {
      const hasToken = localStorage.getItem("token") || localStorage.getItem("user") || localStorage.getItem("jwt") || localStorage.getItem("userToken");
      const hasCookie = document.cookie.includes("token") || document.cookie.includes("wordpress_logged_in");
      setIsLoggedIn(!!hasToken || !!hasCookie);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

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

  // 🚀 APİ'DEN VERİLERİ ÇEKİP AKILLI AYRIŞTIRMA YAPMA MOTORU
  const fetchReviewsAndQuestions = async () => {
    if (!product || !product.id) return;
    setLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews?product=${product.id}`);
      if (response.ok) {
        const data: any[] = await response.json();
        
        // 1. İçinde [SORU] etiketi OLMAYANLAR ve admin cevabı olmayan kök yorumlar
        const normalReviews = data.filter(item => !item.review.includes("[SORU]"));
        
        // 2. İçinde [SORU] etiketi OLAN Kök Sorular
        const customerQuestions = data.filter(item => item.review.includes("[SORU]"));

        setReviews(normalReviews);
        setQuestions(customerQuestions);
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

  // 🚀 YORUM GÖNDERME MOTORU
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
      
      setReviewSuccessMessage({ type: "success", text: "Yorumunuz başarıyla iletildi şefim! Onaylandıktan sonra yayına girecektir." });
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

  // 🚀 GERÇEK SORU GÖNDERME MOTORU
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
          is_question: true // Sistem bunu algılayıp [SORU] yapacak
        })
      });

      if (!response.ok) throw new Error("Gönderilemedi");

      setQuestionSuccessMessage({ type: "success", text: "Sorunuz başarıyla WordPress panelinize gönderildi! Cevaplandığında burada listelenecektir." });
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

  if (!product) return <div className="min-h-screen bg-[#050814]"></div>;

  const galleryImages = product.images || [];

  const nextImage = (e: React.MouseEvent) => { e.preventDefault(); if (galleryImages.length > 0) setActiveImageIndex((prev) => (prev + 1) % galleryImages.length); };
  const prevImage = (e: React.MouseEvent) => { e.preventDefault(); if (galleryImages.length > 0) setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); };

  // 🚀 EKSİKSİZ SEPET VE SAYAÇ TETİKLEME MOTORU
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
    
    // 💥 ÜST SEPET SAYACININ ANINDA ÇALIŞMASI İÇİN TÜM OLASI SİNYALLERİ ATEŞLİYORUZ
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    if ((window as any).updateCartCount) (window as any).updateCartCount();

    setTimeout(() => {
      setAddingToCart(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000); 
    }, 800);
  };

  const stoktaVar = product.stock_status === "instock";
  const hasMultipleImages = galleryImages.length > 1;
  const regularPrice = Number(product.regular_price || 0);
  const currentPrice = Number(product.price || 0);
  const isSale = product.on_sale === true || product.on_sale === "true" || (regularPrice > currentPrice && currentPrice > 0);
  const kartFiyati = currentPrice;
  const eskiFiyat = regularPrice > currentPrice ? regularPrice : (isSale ? Math.round(currentPrice * 1.15) : 0);
  const havaleFiyati = kartFiyati * 0.95;

  const productCategories = product.categories?.map((cat: any) => cat.slug?.toLowerCase()) || [];
  const isKoltuk = productCategories.some((s: string) => s.includes("koltuk"));
  const isSSD = productCategories.some((s: string) => s.includes("ssd"));
  const isPCorGPU = !isKoltuk && !isSSD && productCategories.some((slug: string) => ["hazir-sistem", "ekran-karti", "masaustu-bilgisayarlar", "laptop-bilgisayar", "hazir-sistem-bilgisayarlar", "ekran-kartlari"].includes(slug));
  const currentCategoryType = isKoltuk ? "oyuncu-koltugu" : isSSD ? "ssd" : isPCorGPU ? "ekran-karti" : "genel";

  const categoryMappings: Record<string, Record<string, string>> = {
    "ekran-karti": { model: "Model", grafik_motoru: "Grafik Motoru", ai_performansi: "AI Performansı", bus_standarti: "Bus Standartı", opengl: "OpenGL", bellek: "Bellek Kapasitesi", saat_hizi: "Saat Hızı", cuda_cekirdegi: "CUDA Çekirdeği", bellek_hizi: "Bellek Hızı", bellek_arayuzu: "Bellek Arayüzü", cozunurluk: "Maksimum Çözünürlük", boyutlar: "Boyutlar", tavsiye_edilen_guc_kaynagi: "Tavsiye Edilen PSU", guc_baglantilari: "Güç Bağlantıları", yuva: "Yuva Tipi", aura_sync: "Aura Sync / RGB" },
    "oyuncu-koltugu": { malzeme_tipi: "Döşeme Malzemesi", kol_destegi: "Kol Desteği Sınıfı", amortisör: "Amortisör Klasmanı", tasima_kapasitesi: "Maksimum Taşıma", mekanizma: "Yatış Mekanizması", ayak_malzemesi: "Ayak Yıldız Tabanı", yastik_destegi: "Bel & Boyun Yastığı", koltuk_boyutu: "Ürün Ölçüleri / Boyut" },
    "ssd": { okuma_hizi: "Okuma Hızı (MB/s)", yazma_hizi: "Yazma Hızı (MB/s)", arabirim: "Bağlantı Arayüzü", tbw_degeri: "Yazım Ömrü (TBW)", nvme_versiyon: "NVMe Sürümü", flash_tipi: "NAND Flash Tipi" },
    "genel": { garanti: "Garanti Süresi", mensei: "Üretim Yeri" }
  };

  const activeMapping = categoryMappings[currentCategoryType] || categoryMappings["genel"];
  const dynamicCustomSpecs = Object.entries(activeMapping).map(([key, label]) => ({ label, value: product.meta_data?.find((m: any) => m.key === key)?.value || product.acf?.[key] })).filter(spec => spec.value !== undefined && spec.value !== null && spec.value !== "");
  const finalTechSpecs = dynamicCustomSpecs.length > 0 ? dynamicCustomSpecs : (product.attributes?.map((attr: any) => ({ label: attr.name, value: attr.options?.join(', ') })) || []);
  
  const compareOptions = allProducts.filter((p: any) => p.id !== product.id);
  const filteredOptions = compareOptions.filter((item: any) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  useEffect(() => { if (compareOptions.length > 0 && !selectedCompareProduct) setSelectedCompareProduct(compareOptions[0]); }, [compareOptions, selectedCompareProduct]);
  const comparisonRows = Object.entries(activeMapping).map(([key, label]) => ({ label, current: product.meta_data?.find((m: any) => m.key === key)?.value || product.acf?.[key] || "-", opponent: selectedCompareProduct?.meta_data?.find((m: any) => m.key === key)?.value || selectedCompareProduct?.acf?.[key] || "-" })).filter(row => row.current !== "-" || row.opponent !== "-");

  const cpuMultipliers: Record<string, number> = { entry: 0.85, mid: 0.93, high: 1.00, extreme: 1.10 };
  const gamesConfig = [
    { id: "pubg", label: "PUBG: BATTLEGROUNDS", maxFps: 400, default1080p: 210, default1440p: 140, color: "from-amber-500 to-orange-600" },
    { id: "valorant", label: "VALORANT", maxFps: 600, default1080p: 450, default1440p: 320, color: "from-rose-500 to-red-600" },
    { id: "cs2", label: "Counter-Strike 2 (CS2)", maxFps: 550, default1080p: 380, default1440p: 260, color: "from-sky-500 to-blue-600" }
  ];
  const processedFpsData = gamesConfig.map(game => {
    const acfKey = `${game.id}_${selectedRes}_fps`; 
    const baseFps = Number(product.meta_data?.find((m: any) => m.key === acfKey)?.value || product.acf?.[acfKey]) || (selectedRes === "1080p" ? game.default1080p : game.default1440p);
    return { label: game.label, fps: Math.round(baseFps * (cpuMultipliers[selectedCpu] || 1.0)), percentage: Math.min((Math.round(baseFps * (cpuMultipliers[selectedCpu] || 1.0)) / game.maxFps) * 100, 100), color: game.color };
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5 text-amber-400 text-sm">
      {[...Array(5)].map((_, index) => <span key={index}>{index < rating ? '★' : '☆'}</span>)}
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const reviewsRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg relative z-10">
          
          {/* GÖRSEL ALANI */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-transparent p-0 sm:p-6 rounded-md overflow-hidden aspect-square relative group flex items-center justify-center cursor-pointer">
              {galleryImages.map((img: any, index: number) => (
                <PhotoView key={index} src={img.src}>
                  <img src={img.src} alt={product.name} className={`max-h-full max-w-full object-contain transform group-hover:scale-[1.03] transition-transform duration-700 ease-out ${activeImageIndex === index ? "block" : "hidden"}`} />
                </PhotoView>
              ))}
            </div>

            {/* 🚀 GERİ GELEN NOKTALAR VE NAVİGASYON */}
            <div className="flex items-center justify-between gap-3 bg-[#050814]/40 border border-white/5 p-2 rounded-md">
              <button onClick={prevImage} disabled={!hasMultipleImages} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 disabled:opacity-10 transition-all">←</button>
              <div className="flex-1 flex justify-center items-center">
                {hasMultipleImages ? (
                  <div className="flex justify-center items-center gap-1.5 flex-wrap">
                    {galleryImages.map((_: any, index: number) => (
                      <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === index ? 'bg-blue-500 w-4' : 'bg-white/20'}`} />
                    ))}
                  </div>
                ) : <span className="text-[10px] text-slate-500 font-bold uppercase">Tek Görsel</span>}
              </div>
              <button onClick={nextImage} disabled={!hasMultipleImages} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 disabled:opacity-10 transition-all">→</button>
            </div>
          </div>

          {/* DETAY VE SATIN ALMA ALANI */}
          <div className="flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {isSale && <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">💎 BÜYÜK FIRSAT</span>}
                {stoktaVar ? <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span> STOKTA</span> : <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full">TÜKENDİ</span>}
                
                {/* 🚀 GERİ GELEN KOD (SKU) */}
                <span className="bg-white/5 border border-white/10 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full">
                  KOD: {product.sku || product.id}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {renderStars(Number(reviewsRating))}
                <span className="text-[11px] font-bold text-slate-400">{reviewsRating} / ({reviews.length}) Değerlendirme</span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{product.name}</h1>
              
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-md mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-inner">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">Havale / EFT Fiyatı</span>
                  <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{havaleFiyati.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Kredi Kartı</span>
                  {isSale && eskiFiyat > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                      <span className="text-xs line-through text-blue-400 font-bold">{eskiFiyat.toLocaleString('tr-TR')} TL</span>
                      <span className="text-sm sm:text-base font-black text-slate-200 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{kartFiyati.toLocaleString('tr-TR')} TL</span>
                    </div>
                  ) : <span className="text-sm font-bold text-slate-300">{kartFiyati.toLocaleString('tr-TR')} TL</span>}
                </div>
              </div>

              {/* 🚀 GERİ GELEN PAYLAŞIM İKONLARI */}
              <div className="flex items-center gap-3 mb-4 bg-[#050814]/30 border border-white/5 p-2 rounded-md w-max">
                <span className="text-[10px] font-bold uppercase text-slate-500">Paylaş:</span>
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[11px] cursor-pointer hover:bg-blue-600">🔗</div>
                  <div className="w-7 h-7 rounded-md bg-green-500/10 flex items-center justify-center text-[11px] text-green-400 cursor-pointer">WP</div>
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center text-[11px] text-blue-400 cursor-pointer">X</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2 bg-[#050814]/50 border border-blue-500/20 p-3 rounded-md shadow-inner">
                <div className="text-2xl text-blue-400 animate-pulse">🚚</div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium"><strong className="text-blue-400">{timeLeft}</strong></span>
                  <span className={`text-xs sm:text-sm font-black uppercase ${shippingMessage === "BUGÜN KARGODA!" ? "text-emerald-400" : "text-amber-400"}`}>{shippingMessage}</span>
                </div>
              </div>
            </div>

            {/* SEPET KONTROLLERİ */}
            <div className="border-t border-white/5 pt-4 mt-2 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-md p-1.5 min-w-[110px]">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">-</button>
                  <span className="px-2 font-black text-sm text-white">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">+</button>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <button onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className={`flex-1 font-black py-3 px-6 rounded-md uppercase tracking-wider transition-all text-xs sm:text-sm ${addedSuccess ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white"}`}>
                    {addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ SEPETE EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AKORDEON DEPARTMANI */}
        <div className="max-w-6xl mx-auto mt-6 sm:mt-10 relative z-10 flex flex-col gap-6 sm:gap-8">
          <div className="bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden">
            
            {/* AÇIKLAMA */}
            <div className="border-b border-white/5 last:border-0">
              <button onClick={() => toggleAccordion("aciklama")} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5">
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">🛠️ Ürün Açıklaması</span>
                <span className="text-blue-400">▼</span>
              </button>
              <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-500 ${openAccordion === "aciklama" ? "max-h-[5000px] pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3" dangerouslySetInnerHTML={{ __html: product.description || "Açıklama yok." }} />
              </div>
            </div>

            {/* TEKNİK ÖZELLİKLER */}
            {finalTechSpecs.length > 0 && (
              <div className="border-b border-white/5 last:border-0">
                <button onClick={() => toggleAccordion("teknik")} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5">
                  <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">⚙️ Teknik Özellikler</span>
                  <span className="text-blue-400">▼</span>
                </button>
                <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-500 ${openAccordion === "teknik" ? "max-h-[5000px] pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                     <div className="border-t border-white/5 pt-3 overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                         <tbody>
                           {finalTechSpecs.map((spec: any, i: number) => (
                             <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                               <td className="py-3 pr-4 font-bold text-slate-400 w-5/12 md:w-1/4">{spec.label}</td>
                               <td className="py-3 text-slate-300">{spec.value}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                </div>
              </div>
            )}

            {/* 🚀 TOPLULUK DEĞERLENDİRME (NORMAL YORUMLAR) */}
            <div className="border-b border-white/5 last:border-0">
              <button onClick={() => toggleAccordion("topluluk")} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5">
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">💬 Topluluk Değerlendirme ({reviews.length})</span>
                <span className="text-blue-400">▼</span>
              </button>
              <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-500 ${openAccordion === "topluluk" ? "max-h-[5000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-5 space-y-6">
                    
                    {!showReviewForm && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-5 rounded-xl bg-[#050814]/50 border border-white/5 shadow-inner">
                        <div className="flex flex-col items-center">
                          <span className="text-5xl font-black text-amber-400">{reviewsRating}</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-start gap-1">
                          {renderStars(Number(reviewsRating))}
                          <p className="text-slate-300 font-bold text-lg">{reviews.length} Oyuncu Değerlendirmesi</p>
                        </div>
                        <button onClick={() => isLoggedIn ? setShowReviewForm(true) : router.push('/giris')} className={`sm:ml-auto font-black px-6 py-3 rounded-lg text-xs uppercase tracking-wider ${isLoggedIn ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300"}`}>
                          {isLoggedIn ? "Yorum Yap & Puanla" : "Yorum İçin Giriş Yap"}
                        </button>
                      </div>
                    )}

                    {showReviewForm && isLoggedIn && (
                      <form onSubmit={handleReviewSubmit} className="p-5 rounded-xl bg-[#0b1329] border border-blue-500/30 flex flex-col gap-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="text-blue-400 font-black uppercase">Deneyiminizi Paylaşın</h3>
                          <button type="button" onClick={() => setShowReviewForm(false)} className="text-slate-500 hover:text-red-400">✕</button>
                        </div>

                        {reviewSuccessMessage.text && (
                          <div className={`p-3 rounded-lg border text-xs font-bold text-center ${reviewSuccessMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            {reviewSuccessMessage.text}
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-500">Puanınız</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className={`text-2xl ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-600'}`}>★</button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input required type="text" value={newReview.reviewer} onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none" placeholder="Adınız Soyadınız" />
                          <input required type="email" value={newReview.email} onChange={(e) => setNewReview({ ...newReview, email: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none" placeholder="E-posta adresiniz" />
                        </div>

                        <textarea required value={newReview.review} onChange={(e) => setNewReview({ ...newReview, review: e.target.value })} rows={4} className="w-full bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-3 text-sm focus:outline-none resize-none" placeholder="Ürünle ilgili düşüncelerinizi yazın..." />

                        <button type="submit" disabled={submittingReview} className="sm:self-end bg-blue-600 text-white font-black px-8 py-3 rounded-lg text-xs uppercase tracking-widest disabled:opacity-50">
                          {submittingReview ? "Gönderiliyor..." : "Yorumu Gönder"}
                        </button>
                      </form>
                    )}

                    {/* YORUMLAR LİSTESİ */}
                    <div className="space-y-4">
                        {loadingReviews ? (
                          <div className="text-center py-10 text-slate-500 text-xs animate-pulse">Değerlendirmeler çekiliyor...</div>
                        ) : reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="p-5 rounded-xl bg-[#050814]/40 border border-white/5 shadow-inner">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">{review.reviewer.substring(0, 2).toUpperCase()}</div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-black text-slate-200 flex items-center gap-1.5">{review.reviewer}</span>
                                      <span className="text-[10px] font-medium text-slate-500">{formatDate(review.date_created)}</span>
                                    </div>
                                </div>
                                <div className="sm:ml-auto">{renderStars(review.rating)}</div>
                              </div>
                              <div className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: review.review }} />
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-slate-500 text-xs bg-[#050814]/20 rounded-lg border border-white/5 border-dashed">Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yapın şefim!</div>
                        )}
                    </div>
                 </div>
              </div>
            </div>

            {/* 🚀 6. MAĞAZAYA SORU SOR SEKMESİ (STANDART API ENTEGRASYONLU) */}
            <div className="border-b border-white/5 last:border-0">
              <button onClick={() => toggleAccordion("sorusor")} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5">
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">❓ Mağazaya Soru Sor ({questions.length})</span>
                <span className="text-blue-400">▼</span>
              </button>
              <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-500 ${openAccordion === "sorusor" ? "max-h-[5000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-5 space-y-6">
                    
                    {/* Soru Sorma Formu (Herkese Açık) */}
                    <form onSubmit={handleQuestionSubmit} className="p-5 rounded-xl bg-[#050814]/40 border border-white/5 shadow-inner flex flex-col gap-4">
                      <div>
                        <h3 className="text-white font-black text-base">Ürün hakkında merak ettikleriniz mi var?</h3>
                        <p className="text-xs text-slate-500 mt-1">Sorularınız WP panelinize düşer, verdiğiniz cevaplar otomatik olarak ürünün altında listelenir.</p>
                      </div>

                      {questionSuccessMessage.text && (
                        <div className={`p-3 rounded-lg border text-xs font-bold text-center ${questionSuccessMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {questionSuccessMessage.text}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input required type="text" value={newQuestion.name} onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })} className="bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none" placeholder="Adınız" />
                        <input required type="email" value={newQuestion.email} onChange={(e) => setNewQuestion({ ...newQuestion, email: e.target.value })} className="bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none" placeholder="E-Posta Adresiniz" />
                      </div>

                      <textarea required value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} rows={4} className="w-full bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-3 text-sm focus:outline-none resize-none" placeholder="Ürünle ilgili sorunuzu buraya yazın..." />

                      <button type="submit" disabled={submittingQuestion} className="sm:self-end bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black px-8 py-3 rounded-lg text-xs uppercase tracking-widest disabled:opacity-50">
                        {submittingQuestion ? "İletiliyor..." : "Soruyu Gönder"}
                      </button>
                    </form>

                    {/* SORULAR VE CEVAPLAR LİSTESİ */}
                    <div className="space-y-6 pt-4">
                      {questions.length > 0 ? (
                        questions.map((q) => {
                          // PHP etiketini temizleyip ekrana temiz basıyoruz
                          const cleanQuestionText = q.review.replace("[SORU]", "").trim();
                          return (
                            <div key={q.id} className="p-5 rounded-xl bg-[#050814]/20 border border-white/5 space-y-4">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-blue-400">❓ Soru - {q.reviewer}</span>
                                <span className="text-slate-500">{formatDate(q.date_created)}</span>
                              </div>
                              <p className="text-slate-200 text-sm pl-2 border-l-2 border-blue-500/50">{cleanQuestionText}</p>
                              
                              {/* Eğer bu soruya admin panelinden "Cevap" verildiyse (WordPress yorum yanıt sistemi) */}
                              {/* WooCommerce standart API'si hiyerarşik comment yanıtlarını içerebiliyor, eğer cevap varsa buraya yerleşecek */}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-slate-500 text-xs bg-[#050814]/10 border border-white/5 border-dashed rounded-lg">Bu ürün için henüz soru sorulmamış şefim. İlk soruyu siz sorun!</div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* MOBİL PANEL */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Havale Fiyatı</span>
            <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{havaleFiyati.toLocaleString('tr-TR')} TL</span>
          </div>
          <button onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className={`font-black py-2.5 px-4 rounded-md uppercase text-xs tracking-wider ${addedSuccess ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"}`}>
            {addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
          </button>
        </div>

      </div>
    </PhotoProvider>
  );
}