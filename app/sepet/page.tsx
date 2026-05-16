"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  slug: string;
  quantity: number;
}

export default function CartAndCheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bacs"); 
  
  // 🚀 İYZİCO FORMU İÇİN YENİ STATE:
  const [iyzicoForm, setIyzicoForm] = useState<string | null>(null);

  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", city: "", district: "", fullAddress: ""
  });

  const searchParams = useSearchParams();
  const paymentStatus = searchParams?.get("payment");

  // 🚀 İYZİCO ÖDEME SONRASI BAŞARI EKRANINI YAKALAMA
  useEffect(() => {
    if (paymentStatus === "success") {
      setIsOrderSuccess(true);
      setCreatedOrderId(Math.floor(Math.random() * 90000) + 10000); // Temsili Sipariş No
      setCart([]);
      localStorage.removeItem("user_cart");
      window.dispatchEvent(new Event("cart_updated"));
    } else if (paymentStatus === "failed") {
      setError("Ödeme reddedildi. Lütfen kart bilgilerinizi veya bakiyenizi kontrol edin.");
    }
  }, [paymentStatus]);

  useEffect(() => {
    const storedCart = localStorage.getItem("user_cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // 🚀 İYZİCO FORMUNU EKRANDA ÇALIŞTIRAN ÖZEL MOTOR (GÜVENLİK İÇİN)
  useEffect(() => {
    if (iyzicoForm) {
      const container = document.getElementById("iyzico-container");
      if (container) {
        container.innerHTML = iyzicoForm;
        const scriptElement = container.querySelector("script");
        if (scriptElement) {
          const newScript = document.createElement("script");
          newScript.text = scriptElement.innerHTML || scriptElement.text;
          document.body.appendChild(newScript);
        }
      }
    }
  }, [iyzicoForm]);

  const handleQuantityChange = (id: number, delta: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("user_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const handleRemoveItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("user_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const rawPrice = item.price.replace(/[^\d]/g, ""); 
      const cleanPrice = parseFloat(rawPrice);
      const finalPrice = cleanPrice > 1000000 ? cleanPrice / 100 : cleanPrice;
      return total + (isNaN(finalPrice) ? 0 : finalPrice * item.quantity);
    }, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // 🚀 EĞER KREDİ KARTI SEÇİLMİŞSE, İYZİCO MOTORUNU UYANDIR!
    if (paymentMethod === "credit_card") {
      try {
        const res = await fetch("/api/iyzico-baslat", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            cart, 
            checkoutForm, 
            totalAmount: getCartTotal()
          })
        });
        const data = await res.json();
        
        if (data.success && data.formContent) {
          setIyzicoForm(data.formContent); // Formu ekrana çak!
          setIsSubmitting(false);
          return; // İşlemi burada durdur, müşteri iyzico formunu doldursun
        } else {
          setError(data.error || "İyzico bağlantısı kurulamadı. API şifrelerinizi kontrol edin.");
        }
      } catch (err) {
        setError("İyzico sunucusuna ulaşılamadı.");
      }
      setIsSubmitting(false);
      return;
    }

    // HAVALE İSE NORMAL SİPARİŞİ OLUŞTUR (Eski sistem)
    try {
      const res = await fetch("/api/siparis-olustur", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, checkoutForm, paymentMethod, paymentMethodTitle: "Banka Havalesi / EFT" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrderId(data.orderId);
        setIsOrderSuccess(true);
        setCart([]);
        localStorage.removeItem("user_cart");
        window.dispatchEvent(new Event("cart_updated"));
      } else {
        setError(data.error || "Sipariş işlenirken bir sorun oluştu.");
      }
    } catch (err) {
      setError("Bağlantı hatası: Sunucuya ulaşılamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex items-center justify-center p-4 text-white font-sans">
        <div className="w-full max-w-md bg-[#0b1120] border border-white/5 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">✓</div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wide">Ödeme Başarılı!</h1>
            <p className="text-slate-400 text-xs font-medium">Siparişiniz onaylandı ve donanımlarınız hazırlanıyor.</p>
          </div>
          <div className="p-4 bg-[#050810] border border-white/5 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Sipariş No:</span>
            <span className="text-lg font-black text-blue-500 block">#{createdOrderId}</span>
          </div>
          <Link href="/siparis-takip" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl block text-center mt-2 transition-colors">
            Siparişimi Takip Et
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4 font-sans relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#0b1120] border border-white/5 rounded-3xl space-y-6 shadow-xl max-w-xl mx-auto">
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-xl">
              Donanımlara Göz At
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
               {/* SEPET ÜRÜNLERİ (Aynı tasarımı korudum şefim) */}
              <div className="bg-[#0b1120] border border-white/5 p-4 md:p-6 rounded-3xl shadow-xl">
                <h2 className="text-base font-black uppercase tracking-wide border-b border-white/5 pb-3 mb-4">Alışveriş Sepetiniz</h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#050810] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 relative group hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4 w-full sm:w-auto pr-6 sm:pr-0">
                        <div className="w-16 h-16 bg-[#0b1120] rounded-xl border border-white/5 p-2 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xs uppercase line-clamp-2 tracking-wide pr-2">{item.name}</h3>
                          <span className="text-blue-500 font-black text-xs block mt-1">{item.price} TL</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t border-white/5 sm:border-none">
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-slate-500 hover:text-rose-500 transition-colors p-2 bg-white/5 rounded-lg" title="Ürünü Çıkar">
                           Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl">
                <h2 className="text-base font-black uppercase tracking-wide border-b border-white/5 pb-3 mb-6">Teslimat & Ödeme</h2>
                {error && <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-semibold text-center">{error}</div>}
                
                {/* 🚀 İYZİCO FORMU EKRANA GELDİYSE SADECE ONU GÖSTER! */}
                {iyzicoForm ? (
                   <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                       <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Güvenli Ödeme Ağı</span>
                     </div>
                     {/* İYZİCO BURANIN İÇİNE OTURACAK: */}
                     <div id="iyzico-container" className="w-full bg-white rounded-2xl overflow-hidden min-h-[400px]"></div>
                     <button type="button" onClick={() => setIyzicoForm(null)} className="w-full text-slate-400 hover:text-white text-xs underline mt-2 text-center">İptal Et ve Geri Dön</button>
                   </div>
                ) : (
                  <form onSubmit={handleSubmitOrder} className="space-y-5">
                    {/* KLASİK MÜŞTERİ BİLGİLERİ */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">Adınız</label><input type="text" required value={checkoutForm.firstName} onChange={(e) => setCheckoutForm({...checkoutForm, firstName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" /></div>
                      <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">Soyadınız</label><input type="text" required value={checkoutForm.lastName} onChange={(e) => setCheckoutForm({...checkoutForm, lastName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">E-Posta</label><input type="email" required value={checkoutForm.email} onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" /></div>
                      <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">Telefon</label><input type="text" required value={checkoutForm.phone} onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">Şehir</label><input type="text" required value={checkoutForm.city} onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" /></div>
                      <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">İlçe</label><input type="text" required value={checkoutForm.district} onChange={(e) => setCheckoutForm({...checkoutForm, district: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" /></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-slate-500 ml-1">Adres</label><textarea rows={2} required value={checkoutForm.fullAddress} onChange={(e) => setCheckoutForm({...checkoutForm, fullAddress: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs resize-none" /></div>
                    
                    <div className="space-y-3 pt-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 ml-1 border-b border-white/5 pb-2 block mb-3">Ödeme Yöntemi</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setPaymentMethod("bacs")} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === "bacs" ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "bg-[#050810] border-white/5 text-slate-400"}`}><div className="text-[10px] font-black uppercase tracking-wide">Havale / EFT</div></button>
                        <button type="button" onClick={() => setPaymentMethod("credit_card")} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === "credit_card" ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "bg-[#050810] border-white/5 text-slate-400"}`}><div className="text-[10px] font-black uppercase tracking-wide">Kredi Kartı</div></button>
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-white/5 space-y-5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-black uppercase text-slate-400">Genel Toplam</span>
                        <span className="text-xl font-black text-emerald-400">{getCartTotal().toLocaleString('tr-TR')} TL</span>
                      </div>
                      
                      {/* BUTON DEĞİŞİYOR: İYZİCO'YA GEÇİYOR */}
                      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-slate-400 text-white font-black uppercase text-xs py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        {isSubmitting ? "Bağlanıyor..." : paymentMethod === "credit_card" ? "Güvenli Ödemeye Geç" : "Siparişi Tamamla"}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}