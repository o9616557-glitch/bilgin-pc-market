"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useCart } from "../../CartContext"; 
import toast from "react-hot-toast";
import { Gamepad2 } from "lucide-react";

export default function ProductClient({ product, allProducts = [] }: { product: Record<string, any>; allProducts?: any[] }) {
  const { sepeteEkle } = useCart(); 
  
  // 🚀 ZIRHLI HAFIZALAR
  const [seciliCozunurluk, setSeciliCozunurluk] = useState("1080P");
  const [seciliIslemci, setSeciliIslemci] = useState("i5");

  const fpsVerileri: any = {
    Valorant: {
      i5: { "1080P": "450+", "2K": "320+", "4K": "180+" },
      r5: { "1080P": "510+", "2K": "360+", "4K": "195+" },
      i7: { "1080P": "620+", "2K": "460+", "4K": "260+" }
    },
    CS2: {
      i5: { "1080P": "380+", "2K": "260+", "4K": "140+" },
      r5: { "1080P": "410+", "2K": "290+", "4K": "160+" },
      i7: { "1080P": "550+", "2K": "380+", "4K": "230+" }
    },
    GTAV: {
      i5: { "1080P": "165+", "2K": "120+", "4K": "70+" },
      r5: { "1080P": "180+", "2K": "135+", "4K": "80+" },
      i7: { "1080P": "220+", "2K": "170+", "4K": "105+" }
    },
    PUBG: {
      i5: { "1080P": "210+", "2K": "150+", "4K": "90+" },
      r5: { "1080P": "235+", "2K": "175+", "4K": "105+" },
      i7: { "1080P": "290+", "2K": "220+", "4K": "135+" }
    }
  };

  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const pId = product?._id?.toString() || product?.id?.toString() || "urun";

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

          <h1 className="text-lg sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-snug sm:leading-tight mb-5 break-words">
            {urunAdi}
          </h1>

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

          <div className="hidden sm:flex items-center gap-3 mb-6">
            <button onClick={handleToggleFavorite} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${isFav ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-[#09090b] border-white/10 hover:bg-white/5 text-white"}`}>
              {isFav ? "❤️ Favorilerde" : "🤍 Favoriye Ekle"}
            </button>
            <button onClick={handleShare} className="flex-1 py-3 rounded-xl border border-white/10 bg-[#09090b] hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all">
              {copied ? "🟩 Kopyalandı" : "📤 Paylaş / Kopyala"}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 🎮 OYUN PERFORMANS TESTİ ALANI (SEKMESİZ, ORİJİNAL) */}
          {/* ========================================================================= */}
          <div className="bg-[#09090b] border border-white/5 p-4 sm:p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#00e5ff]" />
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">Oyun Performans Testi</h2>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest block mb-3">FPS Testinde Kullanılan İşlemciler:</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button onClick={() => setSeciliIslemci("i5")} className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all ${seciliIslemci === "i5" ? "bg-[#121215] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-[#050814] border-white/5 text-slate-400"}`}>
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${seciliIslemci === "i5" ? "text-blue-400" : ""}`}>İ5 13400F</span>
                </button>
                <button onClick={() => setSeciliIslemci("r5")} className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all ${seciliIslemci === "r5" ? "bg-[#121215] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-[#050814] border-white/5 text-slate-400"}`}>
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${seciliIslemci === "r5" ? "text-red-400" : ""}`}>RYZEN 5 7500F</span>
                </button>
                <button onClick={() => setSeciliIslemci("i7")} className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all ${seciliIslemci === "i7" ? "bg-[#121215] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]" : "bg-[#050814] border-white/5 text-slate-400"}`}>
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff]"></span>
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${seciliIslemci === "i7" ? "text-[#00e5ff]" : ""}`}>İ7 14700K</span>
                </button>
              </div>
            </div>

            <div className="flex bg-[#050814] p-1.5 rounded-2xl border border-white/5 mb-6 relative z-10">
              {["1080P", "2K", "4K"].map((res) => (
                <button key={res} onClick={() => setSeciliCozunurluk(res)} className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${seciliCozunurluk === res ? "bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]" : "text-slate-500 hover:text-white"}`}>
                  {res}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
              {[{ ad: "VALORANT", kod: "Valorant" }, { ad: "CS:2", kod: "CS2" }, { ad: "GTA V", kod: "GTAV" }, { ad: "PUBG", kod: "PUBG" }].map((oyun) => (
                <div key={oyun.kod} className="bg-[#050814] border border-white/5 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center transition-all hover:border-[#00e5ff]/30">
                  <span className="text-slate-500 font-black text-[10px] sm:text-[11px] tracking-widest uppercase mb-2 sm:mb-3">{oyun.ad}</span>
                  <span className="text-3xl sm:text-4xl font-black text-white mb-1">
                    {fpsVerileri?.[oyun.kod]?.[seciliIslemci]?.[seciliCozunurluk] || "0"}
                  </span>
                  <span className="text-[#00e5ff] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">FPS</span>
                </div>
              ))}
            </div>
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

    </div>
  );
}