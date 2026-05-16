"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
  const [paymentMethod, setPaymentMethod] = useState("bacs"); // bacs = havale, credit_card = kredi kartı
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", city: "", district: "", fullAddress: ""
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("user_cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    const fetchUserData = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) return;
      try {
        const res = await fetch("/api/account", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (res.ok && data.customer) {
          const b = data.customer.billing;
          setCheckoutForm({
            firstName: b.first_name || "", lastName: b.last_name || "", email: b.email || "",
            phone: b.phone || "", city: b.city || "", district: b.state || "", fullAddress: b.address_1 || ""
          });
          localStorage.setItem("temp_user_id", data.customer.id);
        }
      } catch (err) {}
    };
    fetchUserData();
  }, []);

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

  // 🚀 SIFIRLARI YUTMAYAN YENİ NOKTA-VİRGÜL MATEMATİK TERAZİSİ
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Fiyattaki nokta, boşluk ve TL yazılarını temizler, saf sayıyı kurtarır
      const rawPrice = item.price.replace(/[^\d]/g, ""); 
      const cleanPrice = parseFloat(rawPrice);
      
      // Eğer fiyat WooCommerce'den binlik ayracı olmadan geldiyse korur, geldiyse düzeltir
      const finalPrice = cleanPrice > 1000000 ? cleanPrice / 100 : cleanPrice;
      
      return total + (isNaN(finalPrice) ? 0 : finalPrice * item.quantity);
    }, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const userId = localStorage.getItem("temp_user_id");

    try {
      const res = await fetch("/api/siparis-olustur", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cart, 
          checkoutForm, 
          paymentMethod, 
          paymentMethodTitle: paymentMethod === "credit_card" ? "Online Kredi Kartı" : "Banka Havalesi / EFT",
          userId: userId || undefined 
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrderId(data.orderId);
        setIsOrderSuccess(true);
        setCart([]);
        localStorage.removeItem("user_cart");
        localStorage.removeItem("temp_user_id");
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
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-[#0b1120] border border-white/5 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wide">Siparişiniz Alındı!</h1>
            <p className="text-slate-400 text-xs font-medium">Donanımların hazırlık aşamasına geçildi.</p>
          </div>
          <div className="p-4 bg-[#050810] border border-white/5 rounded-2xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Sipariş Numarası</span>
            <span className="text-lg font-black text-blue-500 mt-1 block">#{createdOrderId}</span>
          </div>
          <Link href="/siparis-takip" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl block text-center mt-2">
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
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Sepetiniz Şu An Boş</h2>
            </div>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-xl">
              Donanımlara Göz At
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#0b1120] border border-white/5 p-4 md:p-6 rounded-3xl shadow-xl">
                <h2 className="text-base font-black uppercase tracking-wide border-b border-white/5 pb-3 mb-4">Alışveriş Sepetiniz</h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#050810] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 relative group">
                      
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
                        <div className="flex items-center bg-[#0b1120] border border-white/5 rounded-xl p-1">
                          <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white font-bold text-sm">-</button>
                          <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                          <button type="button" onClick={() => handleQuantityChange(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white font-bold text-sm">+</button>
                        </div>
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-slate-500 hover:text-rose-500 transition-colors p-2 md:p-1 bg-white/5 md:bg-transparent rounded-lg md:rounded-none" title="Ürünü Çıkar">
                          <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl">
                <h2 className="text-base font-black uppercase tracking-wide border-b border-white/5 pb-3 mb-4">Teslimat & Ödeme</h2>
                {error && <div className="mb-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-semibold text-center">{error}</div>}
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Adınız" required value={checkoutForm.firstName} onChange={(e) => setCheckoutForm({...checkoutForm, firstName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50" />
                    <input type="text" placeholder="Soyadınız" required value={checkoutForm.lastName} onChange={(e) => setCheckoutForm({...checkoutForm, lastName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" placeholder="E-Posta" required value={checkoutForm.email} onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50" />
                    <input type="text" placeholder="Telefon" required value={checkoutForm.phone} onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Şehir" required value={checkoutForm.city} onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50" />
                    <input type="text" placeholder="İlçe" required value={checkoutForm.district} onChange={(e) => setCheckoutForm({...checkoutForm, district: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <textarea rows={2} placeholder="Açık Adres" required value={checkoutForm.fullAddress} onChange={(e) => setCheckoutForm({...checkoutForm, fullAddress: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/50 resize-none" />
                  
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ödeme Yöntemi</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setPaymentMethod("bacs")} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === "bacs" ? "bg-blue-600/10 border-blue-500 text-white" : "bg-[#050810] border-white/5 text-slate-400"}`}>
                        <div className="text-[10px] font-black uppercase">Havale / EFT</div>
                      </button>
                      {/* 🚀 KAPIDA ÖDEME KALDIRILDI, YERİNE KREDİ KARTI GELDİ! */}
                      <button type="button" onClick={() => setPaymentMethod("credit_card")} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === "credit_card" ? "bg-blue-600/10 border-blue-500 text-white" : "bg-[#050810] border-white/5 text-slate-400"}`}>
                        <div className="text-[10px] font-black uppercase">Kredi Kartı</div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wide">Genel Toplam</span>
                      {/* 🚀 43 YERİNE ARTIK ASLANLAR GİBİ 43.000 TL BASACAK ALAN: */}
                      <span className="text-lg font-black text-emerald-400 tracking-wide">{getCartTotal().toLocaleString('tr-TR')} TL</span>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs py-4 rounded-xl transition-all">
                      {isSubmitting ? "İşleniyor..." : "Siparişi Tamamla"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}