"use client";
import { useEffect, Suspense } from "react";

function SiparisTakipContent() {
    // 🎯 NEXT.JS'İ ARADAN ÇIKARTTIK: Tarayıcının yerel motoruyla linkteki ?status= değerini çekiyoruz.
    // Bu kod %100 saf JavaScript/TypeScript standardıdır, ASLA hata veremez!
    const paymentStatus = typeof window !== "undefined" 
        ? new URLSearchParams(window.location.search).get("status") 
        : null;

    useEffect(() => {
        // Ödeme başarılıysa, sepeti tarayıcı hafızasından temizle
        if (paymentStatus === "success") {
            localStorage.removeItem("cart");
        }
    }, [paymentStatus]);

    return (
        <div className="text-center bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-3xl max-w-lg backdrop-blur-md shadow-2xl">
            {paymentStatus === "success" ? (
                /* 🌟 BAŞARILI ÖDEME DUYURUSU */
                <>
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-3xl flex items-center justify-center rounded-full mx-auto mb-6 animate-bounce">
                        ✓
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-emerald-400 uppercase tracking-tight">SİPARİŞİNİZ ALINDI!</h1>
                    <p className="text-slate-300 text-sm mt-4 leading-relaxed font-medium">
                        Ödemeniz İyzico tarafından başarıyla onaylandı. Bilgisayar bileşenleriniz uzman ekibimiz tarafından hazırlanmak üzere sıraya alındı.
                    </p>
                </>
            ) : (
                /* ❌ BAŞARISIZ VEYA HATA DUYURUSU */
                <>
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 text-3xl flex items-center justify-center rounded-full mx-auto mb-6">
                        ✕
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-red-400 uppercase tracking-tight">ÖDEME GERÇEKLEŞMEDİ</h1>
                    <p className="text-slate-300 text-sm mt-4 leading-relaxed font-medium">
                        Ödeme işlemi sırasında bir sorun oluştu veya kart onaylanmadı. Lütfen bilgilerinizi kontrol ederek sepetinizden tekrar deneyin.
                    </p>
                </>
            )}

            {/* Alt Kontrol Butonları */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" className="px-6 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 font-bold text-xs rounded-xl uppercase tracking-wider transition-all">
                    Ana Sayfaya Dön
                </a>
                <a href="/sepet" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-xl uppercase tracking-wider shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all">
                    Sepetime Geri Dön
                </a>
            </div>
        </div>
    );
}

// 👑 ANA SAYFA GİRİŞİ (Suspense koruması yerinde kalıyor)
export default function SiparisTakipPage() {
    return (
        <div className="min-h-screen bg-[#050814] text-white flex flex-col items-center justify-center p-4">
            <Suspense fallback={
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Sipariş Durumu Okunuyor...</p>
                </div>
            }>
                <SiparisTakipContent />
            </Suspense>
        </div>
    );
}