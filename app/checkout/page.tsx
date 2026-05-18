"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const [formContent, setFormContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Sayfa açılır açılmaz bizim kasaya (API'ye) gidip formu istiyoruz
        async function fetchForm() {
            try {
                const res = await fetch("/api/iyzico", { method: "POST" });
                const data = await res.json();
                
                if (data.success && data.data?.checkoutFormContent) {
                    setFormContent(data.data.checkoutFormContent);
                } else {
                    console.error("Form alınamadı:", data);
                }
            } catch (error) {
                console.error("İstek hatası:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchForm();
    }, []);

    // 2. React/Next.js güvenliği nedeniyle doğrudan HTML içindeki scriptler çalışmaz. 
    // Bu ufak sihirli kod, İyzico'nun scriptini zorla çalıştırıp formu ekrana basar.
    useEffect(() => {
        if (formContent) {
            const wrapper = document.getElementById("iyzico-form-wrapper");
            if (wrapper) {
                wrapper.innerHTML = formContent;
                const scripts = wrapper.getElementsByTagName("script");
                for (let i = 0; i < scripts.length; i++) {
                    const script = document.createElement("script");
                    script.type = "text/javascript";
                    if (scripts[i].src) script.src = scripts[i].src;
                    else script.innerHTML = scripts[i].innerHTML;
                    document.body.appendChild(script);
                }
            }
        }
    }, [formContent]);

    return (
        <div className="min-h-screen bg-[#050814] text-white flex flex-col items-center justify-center p-6">
            
            {/* Yükleniyor Ekranı */}
            {loading && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#3b82f6] mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <h2 className="text-2xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                        Güvenli Ödeme Ağına Bağlanıyor
                    </h2>
                    <p className="text-slate-400 mt-2 font-semibold text-sm">256-Bit SSL ile korunmaktadır.</p>
                </div>
            )}
            
            {/* İyzico Formunun Doğacağı Kutu (Eğer form geldiyse beyaz bir arka planla şıkça açılır) */}
            <div 
                id="iyzico-form-wrapper" 
                className={`w-full max-w-3xl rounded-2xl overflow-hidden transition-all duration-700 ${formContent ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            ></div>
            
        </div>
    );
}