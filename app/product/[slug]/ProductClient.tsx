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
      setReviewSuccessMessage({ type: "success", text: "Yorumunuz panele iletildi şefim! Onayladıktan sonra burada listelenecektir." });
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
      setQuestionSuccessMessage({ type: "success", text: "Sorunuz başarıyla WordPress panelinize gönderildi! Siz panelden onaylayıp cevap verdiğinizde listelenecektir." });
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

  // 🚀 HEPSİNİ GÖSTERME MOTORU: Sadece belirli alanlar değil, WP'den gelen TÜM nitelikler ve meta veriler listelenir!
  const attrSpecs = product.attributes?.map((attr: any) => ({ label: attr.name, value: attr.options?.join(', ') })) || [];
  const metaSpecs = product.meta_data?.filter((m: any) => m.value && typeof m.value === 'string' && !m.key.startsWith('_')).map((m: any) => ({ label: m.key, value: m.value })) || [];
  const acfSpecs = product.acf ? Object.entries(product.acf).filter(([_, val]) => val && typeof val === 'string').map(([key, val]) => ({ label: key, value: String(val) })) : [];
  
  const allSpecsMap = new Map();
  attrSpecs.forEach((s: any) => allSpecsMap.set(s.label.toLowerCase(), s));
  metaSpecs.forEach((s: any) => allSpecsMap.set(s.label.toLowerCase(), s));
  acfSpecs.forEach((s: any) => allSpecsMap.set(s.label.toLowerCase(), s));
  const finalTechSpecs = Array.from(allSpecsMap.values());
  
  // RAKİP ÜRÜNÜN ÖZELLİKLERİ (KARŞILAŞTIRMA İÇİN)
  const getOpponentSpecs = (opp: any) => {
    if (!opp) return [];
    const oAttrs = opp.attributes?.map((attr: any) => ({ label: attr.name, value: attr.options?.join(', ') })) || [];
    const oMeta = opp.meta_data?.filter((m: any) => m.value && typeof m.value === 'string' && !m.key.startsWith('_')).map((m: any) => ({ label: m.key, value: m.value })) || [];
    const oAcf = opp.acf ? Object.entries(opp.acf).filter(([_, val]) => val && typeof val === 'string').map(([key, val]) => ({ label: key, value: String(val) })) : [];
    const oMap = new Map();
    oAttrs.forEach((s: any) => oMap.set(s.label.toLowerCase(), s));
    oMeta.forEach((s: any) => oMap.set(s.label.toLowerCase(), s));
    oAcf.forEach((s: any) => oMap.set(s.label.toLowerCase(), s));
    return Array.from(oMap.values());
  };

  const compareOptions = allProducts.filter((p: any) => p.id !== product.id);
  const filteredOptions = compareOptions.filter((item: any) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));

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

            {/* 🚀 7. OK VE ÇİZGİLER (NOKTALAR) KESİN OLARAK ALTA ALINDI */}
            {hasMultipleImages && (
              <div className="flex items-center justify-between gap-3 bg-[#050814]/40 border border-white/5 p-2 rounded-md">
                <button onClick={prevImage} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">←</button>
                <div className="flex-1 flex justify-center items-center gap-1.5 flex-wrap">
                  {galleryImages.map((_: any, index: number) => (
                    <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === index ? 'bg-blue-500 w-4' : 'bg-white/20'}`} />
                  ))}
                </div>
                <button onClick={nextImage} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">→</button>
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

              {/* 🚀 5. TAKSİT BİLGİSİ İSTEDİĞİN GİBİ DÜZELTİLDİ */}
              <div className="bg-blue-600/5 border border-blue-500/10 rounded-md p-2.5 mb-3 flex items-center gap-2 text-xs font-bold text-blue-400 shadow-inner">
                <span>💳</span>
                <span>Kredi Kartına 12 Taksit Seçeneği!</span>
              </div>

              {/* 🚀 4. HIZLI KARGO LOGOSU VE DETAYLI SAYAÇ */}
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
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">-</button>
                  <span className="px-2 font-black text-sm text-white">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500">+</button>
                </div>
                
                <button onClick={handleAddToCart} disabled={addingToCart || addedSuccess || !stoktaVar} className={`flex-1 font-black py-3 px-6 rounded-md uppercase tracking-wider text-xs sm:text-sm ${addedSuccess ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
                  {addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ SEPETE EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
                </button>

                {/* 🚀 3. FAVORİ BUTONU: Sepetin yanına çekildi, kapkırmızı yanıyor basılınca */}
                <button type="button" onClick={() => setIsFav(!isFav)} className={`w-12 h-12 rounded-md border flex items-center justify-center text-xl transition-all ${isFav ? "bg-red-600/10 border-red-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
                  <span className={isFav ? "text-red-500 scale-110" : "text-slate-400"}>❤️</span>
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
              <button onClick={() => toggleAccordion("aciklama")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
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
                <button onClick={() => toggleAccordion("teknik")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
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

            {/* KULLANICI YORUMLARI */}
            <div className="border-b border-white/5">
              <button onClick={() => toggleAccordion("topluluk")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                <span className="text-sm font-black uppercase tracking-widest text-blue-400">💬 Kullanıcı Yorumları ({reviews.length})</span>
                <span className="text-blue-400">▼</span>
              </button>
              <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "topluluk" ? "max-h-[5000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-5 space-y-6">
                    
                    {!showReviewForm && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#050814]/50 border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl font-black text-amber-400">{reviewsRating}</span>
                          <div className="text-xs text-slate-400">
                            {renderStars(Number(reviewsRating))}
                            <p className="mt-0.5 font-bold">{reviews.length} Değerlendirme</p>
                          </div>
                        </div>
                        <button onClick={() => setShowReviewForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2.5 rounded-md text-xs uppercase tracking-wider">
                          Yorum Yap & Puanla
                        </button>
                      </div>
                    )}

                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#0b1329] border border-blue-500/30 flex flex-col gap-4 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h3 className="text-blue-400 font-black text-xs uppercase">Deneyiminizi Yazın</h3>
                          <button type="button" onClick={() => setShowReviewForm(false)} className="text-slate-500 hover:text-white">✕</button>
                        </div>

                        {reviewSuccessMessage.text && (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-bold text-center text-blue-400">
                            {reviewSuccessMessage.text}
                          </div>
                        )}

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black uppercase text-slate-500">Puan Ver</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className={`text-xl ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-600'}`}>★</button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input required type="text" value={newReview.reviewer} onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2 text-xs focus:outline-none" placeholder="Adınız Soyadınız" />
                          <input required type="email" value={newReview.email} onChange={(e) => setNewReview({ ...newReview, email: e.target.value })} className="bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2 text-xs focus:outline-none" placeholder="E-posta Adresiniz" />
                        </div>

                        <textarea required value={newReview.review} onChange={(e) => setNewReview({ ...newReview, review: e.target.value })} rows={3} className="w-full bg-[#050814]/50 border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none" placeholder="Ürün yorumunuzu buraya girin..." />

                        <button type="submit" disabled={submittingReview} className="sm:self-end bg-blue-600 text-white font-black px-6 py-2 rounded-md text-xs uppercase tracking-widest">
                          {submittingReview ? "Gönderiliyor..." : "Yorumu Gönder"}
                        </button>
                      </form>
                    )}

                    <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review) => {
                            const reviewReply = replies.filter((r: Review) => Number(r.parent_id) === Number(review.id));
                            return (
                              <div key={review.id} className="p-4 rounded-xl bg-[#050814]/40 border border-white/5 space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="text-xs font-black text-slate-200 block">{review.reviewer}</span>
                                    <span className="text-[9px] text-slate-500">{formatDate(review.date_created)}</span>
                                  </div>
                                  {renderStars(review.rating)}
                                </div>
                                <div className="text-slate-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: review.review }} />
                                
                                {reviewReply.map((rep: Review) => (
                                  <div key={rep.id} className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-lg ml-4">
                                    <div className="text-[10px] text-emerald-400 font-black uppercase mb-1">👨‍💻 Mağaza Yetkilisi Yanıtı</div>
                                    <div className="text-slate-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: rep.review }} />
                                  </div>
                                ))}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-6 text-slate-500 text-xs">Bu ürüne henüz yorum yapılmadı şefim.</div>
                        )}
                    </div>
                 </div>
              </div>
            </div>

            {/* MAĞAZAYA SORU SOR & CEVAP MOTORU */}
            <div className="border-b border-white/5">
              <button onClick={() => toggleAccordion("sorusor")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                <span className="text-sm font-black uppercase tracking-widest text-blue-400">❓ Mağazaya Soru Sor ({questions.length})</span>
                <span className="text-blue-400">▼</span>
              </button>
              <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "sorusor" ? "max-h-[5000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-5 space-y-6">
                    
                    <form onSubmit={handleQuestionSubmit} className="p-4 rounded-xl bg-[#050814]/40 border border-white/5 flex flex-col gap-3">
                      <textarea required value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} rows={3} className="w-full bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none" placeholder="Ürünle ilgili merak ettiğiniz soruyu buraya yazın..." />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input required type="text" value={newQuestion.name} onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })} className="bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-2 text-xs focus:outline-none" placeholder="Adınız" />
                        <input required type="email" value={newQuestion.email} onChange={(e) => setNewQuestion({ ...newQuestion, email: e.target.value })} className="bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-2 text-xs focus:outline-none" placeholder="E-Posta Adresiniz" />
                      </div>
                      {questionSuccessMessage.text && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs font-bold text-center text-emerald-400">
                          {questionSuccessMessage.text}
                        </div>
                      )}
                      <button type="submit" disabled={submittingQuestion} className="sm:self-end bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black px-6 py-2 rounded-md text-xs uppercase tracking-widest">
                        {submittingQuestion ? "İletiliyor..." : "Soruyu Gönder"}
                      </button>
                    </form>

                    <div className="space-y-4">
                      {questions.length > 0 ? (
                        questions.map((q: Review) => {
                          const cleanQuestionText = q.review.replace("[SORU]", "").trim();
                          
                          // 🚀 MUTLAK KİMLİK DOĞRULAMASI: Parent_id ve id kesin sayı olarak karşılaştırılır, admin cevapları anında düşer!
                          const questionReplies = replies.filter((r: Review) => Number(r.parent_id) === Number(q.id));

                          return (
                            <div key={q.id} className="p-4 rounded-xl bg-[#050814]/20 border border-white/5 flex flex-col gap-3">
                              <div>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-1">
                                  <span className="text-blue-400">❓ Müşteri Sorusu ({q.reviewer})</span>
                                  <span>{formatDate(q.date_created)}</span>
                                </div>
                                <p className="text-slate-200 text-xs pl-2 border-l border-blue-500/40">{cleanQuestionText}</p>
                              </div>
                              
                              {questionReplies.length > 0 ? (
                                questionReplies.map((reply: Review) => (
                                  <div key={reply.id} className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg ml-3 shadow-inner animate-fade-in">
                                    <div className="text-[10px] text-emerald-400 font-black uppercase mb-1">👨‍💻 Mağaza Yetkilisi Cevabı</div>
                                    <div className="text-slate-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: reply.review }} />
                                  </div>
                                ))
                              ) : (
                                <div className="text-[10px] text-slate-600 font-bold italic ml-3">⚙️ Bu soru mağaza yetkilisi tarafından inceleniyor...</div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-slate-500 text-xs border border-white/5 border-dashed rounded-lg">Bu ürün için henüz soru sorulmamış şefim.</div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

            {/* 🚀 2. KARŞILAŞTIRMA LAB: Sıkışık düzen kalktı, iki ürünün TÜM özellikleri listeleniyor */}
            <div>
              <button onClick={() => toggleAccordion("karsilastir")} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5">
                <span className="text-sm font-black uppercase tracking-widest text-emerald-400">⚖️ Ürün Karşılaştırma Laboratuvarı</span>
                <span className="text-emerald-400">▼</span>
              </button>
              <div className={`px-4 overflow-hidden transition-all duration-300 ${openAccordion === "karsilastir" ? "max-h-[4000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-white/5 pt-4">
                  <div className="relative mb-5" ref={dropdownRef}>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Kıyaslamak İstediğiniz Diğer Ürünü Seçin</label>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-[#050814] border border-white/10 rounded-lg p-3 text-xs text-left text-slate-300 flex justify-between items-center hover:border-blue-500 transition-colors">
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
                      const opponentSpecs = getOpponentSpecs(selectedCompareProduct);
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
                              {allCompareLabels.map((lowerLabel: any, i) => {
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
            <button type="button" onClick={() => setIsFav(!isFav)} className={`w-10 h-10 rounded-md border flex items-center justify-center text-lg ${isFav ? "bg-red-600/10 border-red-500" : "bg-white/5 border-white/10"}`}>
              <span className={isFav ? "text-red-500" : "text-slate-400"}>❤️</span>
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