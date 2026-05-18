"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any>(null);
    const [total, setTotal] = useState<number>(0);
    const [formContent, setFormContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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

        setCart(parsedCart);
        setCustomer(fallbackCustomer);
        setTotal(calculatedTotal);

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

    useEffect(() => {
        if (formContent) {
            const wrapper = document.getElementById("iyzico-form-wrapper");
            if (wrapper) {
                wrapper.innerHTML = formContent;
                
                const rawScripts = Array.from(wrapper.getElementsByTagName("script"));
                rawScripts.forEach(s => s.remove());

                const srcScript = rawScripts.find(s => s.src);
                const inlineScript = rawScripts.find(s => !s.src);

                if (srcScript) {
                    const mainScript = document.createElement("script");
                    mainScript.src = srcScript.src;
                    mainScript.type = "text/javascript";
                    
                    mainScript.onload = () => {
                        if (inlineScript) {
                            const triggerScript = document.createElement("script");
                            triggerScript.type = "text/javascript";
                            triggerScript.innerHTML = inlineScript.innerHTML;
                            document.body.appendChild(triggerScript);
                        }
                    };
                    document.body.appendChild(mainScript);
                }
            }
        }
    }, [formContent]);

    return (
        <div className="min-h-screen bg-[#030712] text-white p-4 lg:p-12 flex items-center justify-center font-sans">
            
            {/* 1. YÜKLENİYOR SİNYALİ */}
            {loading && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Güvenli Bağlantı Kuruluyor...</p>
                </div>
            )}

            {/* Sepet Boşsa Gösterilecek Engel */}
            {!loading && cart.length === 0 && (
                <div className="text-center bg-[#0f172a]/60 border border-slate-800 p-8 rounded-2xl max-w-md">
                    <span className="text-4xl">🛒</span>
                    <h2 className="text-xl font-black mt-4">Sepetiniz Boş!</h2>
                    <a href="/" className="inline-block mt-6 px-6 py-2.5 bg-blue-600 font-bold text-xs rounded-xl uppercase">Alışverişe Başla</a>
                </div>
            )}

            {/* 🎯 KUSURSUZ YAN YANA DÜZEN (HİÇBİR ŞEY ÜST ÜSTE BİNMEYECEK) */}
            {!loading && cart.length > 0 && (
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* SOL TARAF: Sipariş Özeti & Adres (PC'de Sabit Kalır) */}
                    <div className="lg:col-span-6 space-y-6">
                        
                        {/* Sipariş Kutusu */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                            <h2 className="text-md font-black border-b border-slate-800 pb-3 mb-4 uppercase tracking-wider text-slate-300">🛒 Sipariş Özeti</h2>
                            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                                        <span className="font-bold text-slate-300 line-clamp-1 max-w-[240px]">{item.name}</span>
                                        <span className="font-black text-slate-400">{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('tr-TR')} TL</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">TOPLAM TUTAR:</span>
                                <span className="text-xl font-black text-blue-400">{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                            </div>
                        </div>

                        {/* Adres Kutusu */}
                        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 text-xs space-y-2">
                            <h3 className="font-bold text-slate-400 uppercase tracking-wider mb-2">📍 Teslimat Adresi</h3>
                            <p><strong className="text-slate-300">Müşteri:</strong> {customer?.first_name} {customer?.last_name}</p>
                            <p><strong className="text-slate-300">Telefon:</strong> {customer?.phone}</p>
                            <p className="line-clamp-2"><strong className="text-slate-300">Adres:</strong> {customer?.address_1}, {customer?.city}</p>
                            
                            {/* İptal/Geri Dönüş Butonu */}
                            <div className="pt-4">
                                <a href="/cart" className="inline-block text-[11px] font-bold text-slate-500 hover:text-blue-400 transition-all uppercase tracking-wider">
                                    ← Sepete Dön veya Alışverişe Devam Et
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* SAĞ TARAF: İyzico Formunun Bağımsız Özgür Alanı */}
                    <div className="lg:col-span-6 flex justify-center">
                        <div id="iyzico-form-wrapper" className="w-full max-w-[400px]"></div>
                    </div>

                </div>
            )}
            
        </div>
    );
}