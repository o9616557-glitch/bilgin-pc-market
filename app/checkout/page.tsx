"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const [loading, setLoading] = useState(true);
    const [formContent, setFormContent] = useState<string | null>(null);

    useEffect(() => {
        // Sepetteki gerçek verileri hafızadan çekip arkadaki kasaya (API) yolluyoruz
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

    // İyzico formunu ekrana indiren ana motor
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
        <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4">
            
            {/* SADECE YÜKLENİRKEN GÖRÜNEN HALKA */}
            {loading && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Güvenli Ödeme Açılıyor...</p>
                </div>
            )}

            {/* FORMUN DOĞACAĞI, ARKASI TAMAMEN BOŞ OLAN YUVA */}
            <div id="iyzico-form-wrapper" className="w-full flex justify-center"></div>
            
        </div>
    );
}