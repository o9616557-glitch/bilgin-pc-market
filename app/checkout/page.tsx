"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 
export default function CheckoutPage() {
  // 🚀 ŞEFİM: "status" eklendi. Bu sayede oturumun yüklenip yüklenmediğini bileceğiz.
  const { data: session, status } = useSession(); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
const router = useRouter();
  useEffect(() => {
    // 🚀 SİHİRLİ DOKUNUŞ: Eğer oturum bilgisi hala "aranıyorsa/yükleniyorsa" BEKLE!
    if (status === "loading") return;

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
        const res = await fetch("/api/siparis-olustur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: parsedCart,
            customerDetails: {
              ...fallbackCustomer,
              // 🚀 SİPARİŞ ARTIK KESİN OLARAK SENİN MAİLİNE MÜHÜRLENECEK
              email: session?.user?.email || fallbackCustomer.email 
            },
            totalPrice: calculatedTotal
          })
        });

        const data = await res.json();

        // NÜKLEER BYPASS: Formu ekrana zorla basmak yerine, İyzico'nun Güvenli Ödeme Sayfasına uçuruyoruz!
        if (data.success && data.data?.paymentPageUrl) {
          window.location.href = data.data.paymentPageUrl;
        } else {
          setErrorMsg(data.error || data.data?.errorMessage || "İyzico ödeme linki alınamadı.");
          setLoading(false);
        }
      } catch (error: any) {
        setErrorMsg("Bağlantı hatası: " + error.message);
        setLoading(false);
      }
    }

    fetchRealPaymentForm();
    
  // 🚀 ŞEFİM DİKKAT: status ve session buraya eklendi ki, oturum gelince sistem tetiklensin!
  }, [status, session]); 

  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-4">
      {loading && !errorMsg && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Güvenli Ödeme Merkezine Yönlendiriliyorsunuz...</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl w-full max-w-md text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">!</div>
          <h3 className="text-red-400 font-bold mb-2">Ödeme Başlatılamadı</h3>
          <p className="text-slate-300 text-sm">{errorMsg}</p>
          <button onClick={() => router.back()} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#121215] border border-white/10 rounded-xl text-slate-400 hover:text-[#00e5ff] hover:border-[#00e5ff]/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
  <svg className="w-5 h-5 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
  <span className="font-bold tracking-wide uppercase">Geri Git</span>
</button>
        </div>
      )}
    </div>
  );
}