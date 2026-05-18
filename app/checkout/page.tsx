"use client";
import { useEffect, useState, useRef } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [formContent, setFormContent] = useState<string | null>(null);
  
  // 👑 YENİ RADAR SİSTEMİ: Gizli hataları ekrana yansıtacak
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scriptInjected = useRef(false);

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

    // EĞER SEPET BOŞSA SİYAH EKRANDA KALMASIN, UYARI VERSİN
    if (parsedCart.length === 0) {
      setErrorMsg("Sepetiniz boş görünüyor. Lütfen önce sepete ürün ekleyin.");
      setLoading(false);
      return;
    }

    const calculatedTotal = parsedCart.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);

    async function fetchRealPaymentForm() {
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
        } else {
          // İYZİCO'DAN GELEN GİZLİ HATALARI EKRANA YAZDIR
          setErrorMsg(data.error || "İyzico formu oluşturulamadı (Geçersiz yanıt).");
        }
      } catch (error: any) {
        setErrorMsg("Bağlantı hatası: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRealPaymentForm();
  }, []);

  // 👑 NEŞTER YÖNTEMİ: İyzico kodunu parçalayarak Safari'yi bypass etme
  useEffect(() => {
    // Sadece bir kez çalışmasını garantiliyoruz
    if (formContent && !scriptInjected.current) {
      scriptInjected.current = true;
      
      const wrapper = document.getElementById("iyzico-form-wrapper");
      if (wrapper) {
        // 1. İyzico'dan gelen metnin içindeki <script> etiketini tam kalbinden söküp alıyoruz
        const scriptMatch = formContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        
        // 2. Kalan temiz HTML'i (Sadece div çerçevesi) alıyoruz
        const cleanHtml = formContent.replace(/<script[^>]*>[\s\S]*?<\/script>/i, '');
        
        // 3. Önce temiz çerçeveyi sayfaya güvenle yerleştiriyoruz
        wrapper.innerHTML = cleanHtml;
        
        // 4. Söktüğümüz saf JavaScript kodunu, tarayıcıya yepyeni bir komutmuş gibi zorla çalıştırtıyoruz
        if (scriptMatch && scriptMatch[1]) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.text = scriptMatch[1]; // Saf JS kodu
          document.body.appendChild(script);
        }
      }
    }
  }, [formContent]);

  return (
    <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4">
      
      {/* YÜKLENİYOR HALKASI */}
      {loading && !errorMsg && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Güvenli Ödeme Açılıyor...</p>
        </div>
      )}

      {/* 🛑 GİZLİ HATALARI GÖSTEREN KIRMIZI RADAR PANeli */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl w-full max-w-md text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">!</div>
          <h3 className="text-red-400 font-bold mb-2">Ödeme Başlatılamadı</h3>
          <p className="text-slate-300 text-sm">{errorMsg}</p>
          <a href="/sepet" className="mt-6 inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">
            Sepete Dön
          </a>
        </div>
      )}

      {/* İYZİCO FORM YUVASI */}
      <div id="iyzico-form-wrapper" className="w-full max-w-2xl flex justify-center"></div>

    </div>
  );
}