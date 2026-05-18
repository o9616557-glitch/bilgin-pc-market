"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("cart");
    if (savedCart && savedCart !== "[]") {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
      const calculatedTotal = parsed.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);
      setTotal(calculatedTotal);
    }
  }, []);

  // 👑 SİLME ÖZELLİĞİ: Ürünü sepetten çıkarır veya adet 0'a düşerse yok eder
  const updateQuantity = (id: number, type: 'increase' | 'decrease' | 'remove') => {
    let updated = [...cart];

    if (type === 'remove') {
      updated = updated.filter(item => item.id !== id);
    } else {
      updated = updated.map(item => {
        if (item.id === id) {
          const currentQty = item.quantity || 1;
          const newQty = type === 'increase' ? currentQty + 1 : currentQty - 1;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0); // 0'a düşen ürünü siler
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setTotal(updated.reduce((acc, item) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0));
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050814] text-white p-4 md:p-8 lg:p-12 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tight border-b border-slate-800 pb-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          ALIŞVERİŞ SEPETİNİZ
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0B1121] border border-[#1A233A] rounded-2xl">
             <div className="text-6xl mb-6 opacity-50">🛒</div>
             <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Sepetiniz Boş</h2>
             <a href="/" className="mt-4 bg-[#3B5BDB] hover:bg-[#2F4ABB] text-white font-bold py-3 px-8 rounded-xl transition-all">
                Dükkana Dön
             </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SOL TARAF: ÜRÜN LİSTESİ */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-[#0B1121] border border-[#1A233A] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  
                  {/* Ürün Bilgisi */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-[#050814] border border-[#1A233A] flex items-center justify-center font-bold text-blue-500 text-sm shrink-0">
                      PC
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-white line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-[#3B5BDB] font-bold mt-1">{parseFloat(item.price).toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>

                  {/* Kontroller ve Fiyat */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 mt-4 sm:mt-0">
                    
                    {/* Miktar Seçici */}
                    <div className="flex items-center bg-[#050814] rounded-lg p-1 border border-[#1A233A]">
                      <button onClick={() => updateQuantity(item.id, 'decrease')} className="w-8 h-8 flex items-center justify-center font-bold text-white hover:text-[#3B5BDB] transition-all">-</button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, 'increase')} className="w-8 h-8 flex items-center justify-center font-bold text-white hover:text-[#3B5BDB] transition-all">+</button>
                    </div>
                    
                    {/* Toplam Fiyat */}
                    <span className="text-base font-bold text-white shrink-0 min-w-[90px] text-right">
                      {(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('tr-TR')} TL
                    </span>

                    {/* 🗑️ ÇÖP KUTUSU İKONU - YEPYENİ! */}
                    <button 
                      onClick={() => updateQuantity(item.id, 'remove')} 
                      className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                      title="Ürünü Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/* SAĞ TARAF: SİPARİŞ ÖZETİ */}
            <div className="lg:col-span-4 bg-[#0B1121] border border-[#1A233A] rounded-xl p-6 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">SİPARİŞ ÖZETİ</h2>
              
              <div className="space-y-4 text-sm border-b border-[#1A233A] pb-6 text-slate-400">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-bold text-white">{total.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo Dağıtım</span>
                  <span className="text-[#00FF88] font-bold uppercase">ÜCRETSİZ</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-slate-400">GENEL TOPLAM</span>
                <span className="text-xl md:text-2xl font-bold text-white">
                  {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </span>
              </div>

              {/* 👑 MOBİLİ KÖKTEN ÇÖZEN O EFSANE YÖNLENDİRME LİNKİ BURADA DA VAR */}
              <a 
                href={`/checkout?t=${Date.now()}`}
                className="flex justify-center items-center w-full bg-[#3B5BDB] hover:bg-[#2F4ABB] text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider transition-all"
              >
                GÜVENLİ ÖDEMEYE GEÇ ➔
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}