"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    if (parsedCart.length === 0) {
      setErrorMsg("Sepetiniz boş görünüyor. Lütfen önce sepete ürün ekleyin.");
      setLoading(false);
      return;
    }

    const calculatedTotal = parsedCart.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);

    async function fetchRealPaymentForm() {
      try {
        // ŞEFİM: ADRES BURADA DÜZELTİLDİ! "/api/iyzico" YERİNE "/api/siparis-olustur" OLDU.
        const res = await fetch("/api/siparis-olustur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: parsedCart,
            customerDetails: fallbackCustomer,
            totalPrice: calculatedTotal
          })
        });
        const data = await res.json();

        // NÜKLEER BYPASS: Formu ekrana zorla basmak yerine, İyzico'nun Güvenli Ödeme Sayfasına uçuruyoruz!
        if (data.success && data.data?.paymentPageUrl) {
          window.location.href = data.data.paymentPageUrl;
        } else {
          // Eğer API'den ret gelirse kırmızı radarda sebebi yazar
          setErrorMsg(data.error || data.data?.errorMessage || "İyzico ödeme linki alınamadı.");
          setLoading(false);
        }
      } catch (error: any) {
        setErrorMsg("Bağlantı hatası: " + error.message);
        setLoading(false);
      }
    }

    fetchRealPaymentForm();
  }, []);

  return (
    <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4">
      
      {/* ARTIK BEKLEME EKRANINDA "YÖNLENDİRİLİYORSUNUZ" YAZACAK */}
      {loading && !errorMsg && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Güvenli Ödeme Merkezine Yönlendiriliyorsunuz...</p>
        </div>
      )}

      {/* GİZLİ HATALARI GÖSTEREN KIRMIZI RADAR */}
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
      
    </div>
  );
}