"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [formContent, setFormContent] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedCustomer = localStorage.getItem("customerDetails");

    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    const fallbackCustomer = savedCustomer ? JSON.parse(savedCustomer) : {
      first_name: "Bilgin", last_name: "PC Müşterisi",
      email: "destek@bilginpcmarket.com", phone: "05551234567",
      address_1: "Kadıköy Teknoloji Sokak No:34", city: "İstanbul",
      postcode: "34000"
    };

    const calculatedTotal = parsedCart.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);

    async function fetchRealPaymentForm() {
      if (parsedCart.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/iyzico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: parsedCart,
            customerDetails: fallbackCustomer,
            totalPrice: calculatedTotal
          })
        });
        const data = await res.json();
        
        if (data.success && data.data?.checkoutFormContent) {
          setFormContent(data.data.checkoutFormContent);
        }
      } catch (error) {
        console.error("Ödeme başlatma hatası:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRealPaymentForm();
  }, []);

  // 👑 NİHAİ ÇÖZÜM: createContextualFragment (Mobil tarayıcıları %100 ikna eder)
  useEffect(() => {
    if (formContent) {
      const wrapper = document.getElementById("iyzico-form-wrapper");
      if (wrapper) {
        // 1. Olası çift yüklemeleri önlemek için yuvayı tamamen temizliyoruz
        wrapper.innerHTML = "";
        
        // 2. İyzico kodunu tarayıcının doğal bir parçası gibi işliyoruz
        const fragment = document.createRange().createContextualFragment(formContent);
        
        // 3. Organik olarak sayfaya ekliyoruz (Telefon bunu tehdit olarak algılamaz)
        wrapper.appendChild(fragment);
      }
    }
  }, [formContent]);

  return (
    <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4">
      
      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Güvenli Ödeme Açılıyor...</p>
        </div>
      )}

      {/* İyzico formu burada belirecek */}
      <div id="iyzico-form-wrapper" className="w-full max-w-2xl flex justify-center"></div>

    </div>
  );
}