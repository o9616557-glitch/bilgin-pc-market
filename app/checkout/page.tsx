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
        <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-4 md:p-12">
            
            {/* Yükleniyor Ekranı */}
            {loading && (
                <div className="text-center animate-fade-in">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#3b82f6] mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <h2 className="text-xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                        Güvenli Ödeme Kanalı Açılıyor
                    </h2>
                    <p className="text-slate-500 mt-2 text-xs font-semibold">Lütfen bekleyiniz...</p>
                </div>
            )}
            
            {/* 🎯 PC'DE GENİŞ VE ŞIK GÖRÜNEN YENİ PANEL DÜZENİ */}
            {formContent && (
                <div className="w-full max-w-5xl bg-[#0b1329] border border-slate-800/60 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-12 transition-all duration-700 scale-100 opacity-100">
                    
                    {/* SOL TARAF: Şık Bilgilendirme ve Sipariş Özeti Paneli (Ekranı doldurması için) */}
                    <div className="md:col-span-5 bg-[#0f1934] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/60">
                        <div>
                            <div className="flex items-center gap-2 text-blue-500 font-black tracking-wider text-sm mb-6 uppercase">
                                🔒 BILGIN PC MARKET SECURITY
                            </div>
                            <h3 className="text-2xl font-black mb-2 leading-tight">Siparişiniz Güvende</h3>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                Ödemeniz İyzico altyapısıyla 256-Bit SSL sertifikası koruması altında şifrelenerek tamamlanır. Kart bilgileriniz asla sunucularımızda saklanmaz.
                            </p>
                        </div>
                        
                        {/* Alt kısımdaki profesyonel damga */}
                        <div className="mt-8 pt-6 border-t border-slate-800/40 flex items-center gap-3 text-slate-400 text-xs font-bold">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Canlı API Bağlantısı Aktif
                        </div>
                    </div>

                    {/* SAĞ TARAF: Genişletilmiş İyzico Form Alanı */}
                    <div className="md:col-span-7 bg-white p-6 md:p-10 flex items-center justify-center">
                        <div id="iyzico-form-wrapper" className="w-full"></div>
                    </div>

                </div>
            )}
            
        </div>
    );
}