"use client";

import React, { useState, useEffect, Suspense } from "react";
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

function SepetIcerigi() {
  // 🚀 SİHİRLİ DOKUNUŞ: Sepete varsayılan olarak hazır bir test ürünü koyduk şefim!
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 999,
      name: "İyzico Test Ürünü (RTX 4060 Ekran Kartı)",
      price: "15.000 TL",
      image: "",
      slug: "test-urun",
      quantity: 1
    }
  ]);
  
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card"); // Direkt Kredi Kartı Seçili Gelsin
  const [iyzicoForm, setIyzicoForm] = useState<string | null>(null);

  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "Ahmet", lastName: "Yılmaz", email: "test@gmail.com", phone: "5555555555", city: "İstanbul", district: "Kadıköy", fullAddress: "Moda Caddesi No:5"
  });

  const searchParams = useSearchParams();
  const paymentStatus = searchParams?.get("payment");

  useEffect(() => {
    if (paymentStatus === "success") {
      setIsOrderSuccess(true);
      setCreatedOrderId(Math.floor(Math.random() * 90000) + 10000);
      setCart([]);
    } else if (paymentStatus === "failed") {
      setError("Ödeme reddedildi. Lütfen kart bilgilerinizi kontrol edin.");
    }
  }, [paymentStatus]);

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

  const handleRemoveItem = (id: number) => {
    setCart([]);
  };

  const getCartTotal = () => {
    return 15000; // Sabit test fiyatı
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/iyzico-baslat", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, checkoutForm, totalAmount: getCartTotal() })
      });
      const data = await res.json();

      if (data.success && data.formContent) {
        setIyzicoForm(data.formContent);
      } else {
        setError(data.error || "İyzico bağlantısı kurulamadı. API şifrelerinizi kontrol edin.");
      }
    } catch (err) {
      setError("İyzico sunucusuna ulaşılamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-[#0b1120] border border-white/5 p-8 rounded-3xl text-center space-y-6">
          <div className="text-emerald-400 text-3xl">✓</div>
          <h1 className="text-xl font-black uppercase">Ödeme Başarılı!</h1>
          <p className="text-blue-500 font-black">Sipariş No: #{createdOrderId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SEPET SOL TARAF */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl">
              <h2 className="text-base font-black uppercase mb-4">Alışveriş Sepetiniz</h2>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="bg-[#050810] border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold uppercase">{item.name}</h3>
                      <span className="text-blue-500 font-black text-xs block mt-1">{item.price}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-slate-500 hover:text-rose-500 text-xs">Sil</button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs">Sepet boşaltıldı.</p>
              )}
            </div>
          </div>

          {/* TESLİMAT VE ÖDEME SAĞ TARAF */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl">
              <h2 className="text-base font-black uppercase mb-6">Teslimat & Ödeme</h2>
              {error && <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs text-center">{error}</div>}
              
              {iyzicoForm ? (
                 <div className="space-y-4">
                   <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-400 font-bold text-xs text-center">İYZİCO GÜVENLİ ÖDEME EKANI</div>
                   <div id="iyzico-container" className="w-full bg-white rounded-2xl overflow-hidden min-h-[400px]"></div>
                 </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Ad" required value={checkoutForm.firstName} onChange={(e) => setCheckoutForm({...checkoutForm, firstName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                    <input type="text" placeholder="Soyad" required value={checkoutForm.lastName} onChange={(e) => setCheckoutForm({...checkoutForm, lastName: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" placeholder="E-Posta" required value={checkoutForm.email} onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                    <input type="text" placeholder="Telefon" required value={checkoutForm.phone} onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                  </div>
                  <textarea placeholder="Adres" rows={2} required value={checkoutForm.fullAddress} onChange={(e) => setCheckoutForm({...checkoutForm, fullAddress: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-xs resize-none" />
                  
                  <div className="mt-8 pt-5 border-t border-white/5 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-slate-400">Toplam</span>
                      <span className="text-xl font-black text-emerald-400">15.000 TL</span>
                    </div>
                    
                    {/* İŞTE ARADIĞIMIZ O EFSANE BUTON ŞEFİM! */}
                    <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      {isSubmitting ? "Bağlanıyor..." : "Güvenli Ödemeye Geç"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CartAndCheckoutPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Yükleniyor...</div>}>
      <SepetIcerigi />
    </Suspense>
  );
}