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
            
            {/* 🔥 İYZİCO'NUN BEYNİNİ EZEN KÜRESEL CSS ENJEKSİYONU */}
            <style dangerouslySetInnerHTML={{__html: `
                @media (min-width: 768px) {
                    /* İyzico'nun ana form kutusunun 400px'lik sınırını kırıp 850px yapıyoruz */
                    #iyzipay-checkout-form, 
                    .iyzipay-responsive, 
                    #iyzico-checkout-form,
                    [class*="iyzipay-"], 
                    [id*="iyzipay-"] {
                        max-width: 850px !important;
                        width: 850px !important;
                        min-width: 850px !important;
                    }
                    /* Formun içindeki girdileri (kart no, isim) geniş ekrana yayıyoruz */
                    .iyzi-co-container, .iyzi-box {
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                }
            `}} />

            {/* YÜKLENİYOR SİMGEALTI */}
            {loading && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Güvenli Ödeme Açılıyor...</p>
                </div>
            )}
            
            {/* FORM YUVASI */}
            <div className="w-full flex items-center justify-center">
                <div id="iyzico-form-wrapper" className="w-full flex justify-center"></div>
            </div>
            
        </div>
    );
}