"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any>(null);
    const [total, setTotal] = useState<number>(0);
    const [formContent, setFormContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Tarayıcı hafızasından gerçek sepeti ve adres verilerini çekiyoruz
        const savedCart = localStorage.getItem("cart");
        const savedCustomer = localStorage.getItem("customerDetails"); // Varsa form verisi

        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        // Eğer adresi doldurmadıysa test patlamasın diye yedek adres tanımlıyoruz
        const fallbackCustomer = savedCustomer ? JSON.parse(savedCustomer) : {
            first_name: "Bilgin", last_name: "PC Müşterisi",
            email: "destek@bilginpcmarket.com", phone: "05551234567",
            address_1: "Kadıköy Teknoloji Sokak No:34", city: "İstanbul",
            postcode: "34000"
        };

        // Toplam tutarı kuruşu kuruşuna hesapla
        const calculatedTotal = parsedCart.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);

        setCart(parsedCart);
        setCustomer(fallbackCustomer);
        setTotal(calculatedTotal);

        // 2. Gerçek verilerle bizim kasaya (API) ateş emri veriyoruz
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

    // İyzico script tetikleyicisi
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
        <div className="min-h-screen bg-[#030712] bg-gradient-to-b from-[#030712] to-[#0b1329] text-white p-4 md:p-12 font-sans relative overflow-x-hidden flex items-center justify-center">
            
            {/* Arka Plan Işık Hüzmeleri (Premium Efekt) */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* 1. YÜKLENİYOR SİNYALİ */}
            {loading && (
                <div className="text-center z-10">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500 mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-slate-300">GÜVENLİ BANKA BAĞLANTISI KORUNUYOR</h2>
                    <p className="text-slate-500 text-xs mt-1 font-semibold">SSL 256-Bit tünel hatları aktif ediliyor...</p>
                </div>
            )}

            {/* Sepet Boşsa Gösterilecek Engel */}
            {!loading && cart.length === 0 && (
                <div className="text-center bg-[#0f172a]/60 border border-slate-800 p-8 rounded-2xl max-w-md backdrop-blur-md">
                    <span className="text-4xl">🛒</span>
                    <h2 className="text-xl font-black mt-4">Sepetiniz Boş Şef!</h2>
                    <p className="text-slate-400 text-xs mt-2">Ödeme yapabilmek için önce sepetinize ürün eklemelisiniz.</p>
                    <a href="/" className="inline-block mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-xl uppercase transition-all">Alışverişe Başla ➔</a>
                </div>
            )}

            {/* 🎯 2. MUHTEŞEM LÜKS ARKA PLAN VE DASHBOARD DÜZENİ */}
            {!loading && cart.length > 0 && (
                <div className={`w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-500 ${formContent ? "filter blur-[1px] opacity-90 scale-100" : ""}`}>
                    
                    {/* SOL PANEL: Şık Dijital Fatura / Sipariş Özeti */}
                    <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <h2 className="text-xl font-black tracking-tight uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SİPARİŞ ÖZETİ</h2>
                                <span className="bg-blue-500/10 text-blue-400 font-extrabold text-[11px] px-3 py-1 rounded-full border border-blue-500/20">{cart.length} Parça Ürün</span>
                            </div>

                            {/* Ürün Listesi (Kaydırılabilir Premium Düzen) */}
                            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800/60 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-xs">
                                                PC
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-200 line-clamp-1 max-w-[280px]">{item.name}</h4>
                                                <p className="text-[11px] text-slate-500 font-semibold">Miktar: {item.quantity || 1} Adet</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-slate-300">{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('tr-TR')} TL</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Alt Toplam Kasası */}
                        <div className="mt-8 pt-6 border-t border-slate-800/80">
                            <div className="flex justify-between items-center bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl">
                                <div>
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Ödenecek Toplam Tutar</p>
                                    <p className="text-[10px] text-slate-500 font-medium">KDV ve tüm vergiler dahildir.</p>
                                </div>
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                    {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SAĞ PANEL: Teslimat Bilgileri ve Koruma Duvarı */}
                    <div className="lg:col-span-5 bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-300 mb-4 uppercase tracking-wide">📦 Teslimat Adresi</h3>
                            <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl text-xs space-y-2 font-medium text-slate-400">
                                <p><strong className="text-slate-200">Alıcı:</strong> {customer?.first_name} {customer?.last_name}</p>
                                <p><strong className="text-slate-200">Telefon:</strong> {customer?.phone}</p>
                                <p><strong className="text-slate-200">E-Posta:</strong> {customer?.email}</p>
                                <p className="line-clamp-2"><strong className="text-slate-200">Açık Adres:</strong> {customer?.address_1}, {customer?.city}</p>
                            </div>
                        </div>

                        {/* Siber Kalkan Müziği */}
                        <div className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                            <span className="text-base">🛡️</span>
                            <div>
                                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Uçtan Uca Şifreleme Kabini</h5>
                                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5 font-medium">
                                    Kart bilgileriniz İyzico sunucularına direkt kriptolanarak aktarılır. Bilgin PC Market asla ham kart verisi işlemez.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* 🎯 İYZİCO MODAL FORMUNUN HAVADA ASILI DOĞACAĞI GİZLİ YUVA */}
            <div id="iyzico-form-wrapper" className="absolute inset-0 z-50 pointer-events-none [&>*]:pointer-events-auto flex items-center justify-center"></div>
            
        </div>
    );
}