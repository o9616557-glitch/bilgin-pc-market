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

  const [paymentMethod, setPaymentMethod] = useState("bacs"); // bacs = havale, cod = kapıda ödeme
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: ""
  });

  // 1. Sayfa açıldığında sepeti ve eğer giriş yapılmışsa kullanıcı bilgilerini yükle
  useEffect(() => {
    const storedCart = localStorage.getItem("user_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Üye girişi yapılmışsa adres formunu otomatik doldurmak için WooCommerce verilerini çekmeye çalışıyoruz
    const fetchUserData = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) return;

      try {
        const res = await fetch("/api/account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (res.ok && data.customer) {
          const b = data.customer.billing;
          setCheckoutForm({
            firstName: b.first_name || "",
            lastName: b.last_name || "",
            email: b.email || "",
            phone: b.phone || "",
            city: b.city || "",
            district: b.state || "",
            fullAddress: b.address_1 || ""
          });
          // Müşteri ID'sini yerel hafızaya geçici pasla
          localStorage.setItem("temp_user_id", data.customer.id);
        }
      } catch (err) {
        console.error("Kullanıcı verileri çekilemedi.");
      }
    };

    fetchUserData();
  }, []);

  // Adet Güncelleme Motoru (+ / -)
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

  // Ürünü Sepetten Tamamen Atma
  const handleRemoveItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("user_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  // Toplam Tutar Hesaplama (Fiyattaki nokta ve boşlukları temizleyen hassas terazi)
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const cleanPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return total + (isNaN(cleanPrice) ? 0 : cleanPrice * item.quantity);
    }, 0);
  };

  // 🚀 SİPARİŞİ TAMAMLAMA VE VERİTABANINA YAZMA MOTORU
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const userId = localStorage.getItem("temp_user_id");

    try {
      const res = await fetch("/api/siparis-olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          checkoutForm,
          paymentMethod,
          userId: userId || undefined
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCreatedOrderId(data.orderId);
        setIsOrderSuccess(true);
        // Sipariş bitti, sepeti tamamen sıfırla
        setCart([]);
        localStorage.removeItem("user_cart");
        localStorage.removeItem("temp_user_id");
        window.dispatchEvent(new Event("cart_updated"));
      } else {
        setError(data.error || "Sipariş veritabanına işlenirken bir sorun oluştu.");
      }
    } catch (err) {
      setError("Bağlantı hatası: Sunucu komut merkezine ulaşılamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DURUM 1: SİPARİŞ BAŞARIYLA TAMAMLANDI EKRANI
  if (isOrderSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex items-center justify-center p-4 text-white font-sans">
        <div className="w-full max-w-md bg-[#0b1120] border border-white/5 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wide">Siparişiniz Alındı!</h1>
            <p className="text-slate-400 text-xs font-medium">Donanım canavarlarınız veritabanımıza başarıyla işlendi ve hazırlık aşamasına geçildi.</p>
          </div>
          <div className="p-4 bg-[#050810] border border-white/5 rounded-2xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Sipariş Numarası</span>
            <span className="text-lg font-black text-blue-500 mt-1 block">#{createdOrderId}</span>
          </div>
          <div className="pt-2">
            <Link href="/siparis-takip" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all block text-center shadow-lg shadow-blue-600/10">
              Siparişimi Takip Et
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4 font-sans relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* LİSTE BOMBOŞSA GÖSTERİLECEK ALAN */}
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#0b1120] border border-white/5 rounded-3xl space-y-6 shadow-xl max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Sepetiniz Şu An Boş</h2>
              <p className="text-slate-600 text-[11px] font-medium max-w-xs mx-auto">Dükkanımızdan ihtiyacınız olan donanımları seçip sepetinizi doldurabilirsiniz.</p>
            </div>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-xl transition-all">
              Donanımlara Göz At
            </Link>
          </div>
        ) : (
          /* 🌟 SEPETTE ÜRÜN VARSA ÇALIŞACAK ANA YAPILAR */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SOL TARAF: SEPETTEKİ ÜRÜNLERİN LİSTESİ (7 SÜTUN) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl">
                <h2 className="text-base font-black uppercase tracking-wide border-b border-white/5 pb-3 mb-4">Alışveriş Sepetiniz</h2>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#050810] border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4 relative group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#0b1120] rounded-xl border border-white/5 p-2 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xs uppercase line-clamp-1 pr-6 tracking-wide">{item.name}</h3>
                          <span className="text-blue-500 font-black text-xs block mt-1">{item.price} TL</span>
                        </div>
                      </div>

                      {/* ADET AYARLARI VE SİLME GRUBU */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center bg-[#0b1120] border border-white/5 rounded-xl p-1">
                          <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white font-bold text-xs">-</button>
                          <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                          <button type="button" onClick={() => handleQuantityChange(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white font-bold text-xs">+</button>
                        </div>
                        
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-slate-600 hover:text-rose-500 transition-colors p-1" title="Ürünü Çıkar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SAĞ TARAF: CHECKOUT VE ÖDEME FORMU (5 SÜTUN) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl">
                <h2 className="text-base font-black uppercase tracking-wide border-b border-white/5 pb-3 mb-4">Teslimat & Ödeme</h2>
                
                {error && (
                  <div className="mb-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {/* AD SOYAD GRUBU */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Adınız</label>
                      <input type="text" required value={checkoutForm.firstName} onChange={(e) => setCheckoutForm({...checkoutForm, firstName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Soyadınız</label>
                      <input type="text" required value={checkoutForm.lastName} onChange={(e) => setCheckoutForm({...checkoutForm, lastName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" />
                    </div>
                  </div>

                  {/* İLETİŞİM GRUBU */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">E-Posta Adresi</label>
                      <input type="email" required value={checkoutForm.email} onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Telefon</label>
                      <input type="text" required value={checkoutForm.phone} onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" />
                    </div>
                  </div>

                  {/* BÖLGE GRUBU */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Şehir</label>
                      <input type="text" required value={checkoutForm.city} onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">İlçe</label>
                      <input type="text" required value={checkoutForm.district} onChange={(e) => setCheckoutForm({...checkoutForm, district: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all" />
                    </div>
                  </div>

                  {/* AÇIK ADRES */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Açık Adres</label>
                    <textarea rows={2} required value={checkoutForm.fullAddress} onChange={(e) => setCheckoutForm({...checkoutForm, fullAddress: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3.5 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all resize-none" />
                  </div>

                  {/* 🚀 ÖDEME YÖNTEMLERİ SEÇİM ALANI */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ödeme Yöntemi</label>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setPaymentMethod("bacs")} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === "bacs" ? "bg-blue-600/10 border-blue-500 text-white" : "bg-[#050810] border-white/5 text-slate-400"}`}>
                        <div className="text-xs font-black uppercase">Havale / EFT</div>
                      </button>
                      
                      <button type="button" onClick={() => setPaymentMethod("cod")} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === "cod" ? "bg-blue-600/10 border-blue-500 text-white" : "bg-[#050810] border-white/5 text-slate-400"}`}>
                        <div className="text-xs font-black uppercase">Kapıda Ödeme</div>
                      </button>
                    </div>
                  </div>

                  {/* TOPLAM MATRAH VE TETİKLEME BUTONU */}
                  <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wide">Genel Toplam</span>
                      <span className="text-lg font-black text-emerald-400 tracking-wide">{getCartTotal().toLocaleString('tr-TR')} TL</span>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs py-4 rounded-xl transition-all shadow-lg shadow-blue-600/10">
                      {isSubmitting ? "Siparişiniz İşleniyor..." : "Siparişi Tamamla"}
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