"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const [formContent, setFormContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        <div className="min-h-screen bg-[#050814] text-white flex flex-col items-center justify-center p-4">
            
            {/* 1. YÜKLENİYOR EKRANI */}
            {loading && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Güvenli Ödeme Kanalı Açılıyor...</p>
                </div>
            )}
            
            {/* 2. KUSURSUZ HİZALANMIŞ ÖDEME ALANI */}
            {formContent && (
                <div className="w-full max-w-[440px] flex flex-col transition-all duration-500 scale-100 opacity-100">
                    
                    {/* Üst Logo ve Güvenlik Başlığı */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px] tracking-wider uppercase mb-3">
                            🔒 256-Bit SSL Korunmalı Güvenli Kasa
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-white uppercase">BILGIN PC MARKET</h2>
                        <p className="text-slate-400 text-xs mt-1 font-medium">Ödemenizi kart bilgilerinizi girerek tamamlayın.</p>
                    </div>

                    {/* 🎯 İyzico Formunun Kusursuzca Yerleşeceği Yuva */}
                    <div className="w-full bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden border border-slate-200">
                        <div id="iyzico-form-wrapper" className="w-full p-2"></div>
                    </div>

                    {/* Alt Bilgilendirme Örtüsü */}
                    <div className="text-center mt-6 pt-4 border-t border-slate-900 flex items-center justify-center gap-2 text-slate-500 text-[11px] font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        iyzico Altyapısı ile Kart Bilgileriniz Güvendedir.
                    </div>

                </div>
            )}
            
        </div>
    );
}