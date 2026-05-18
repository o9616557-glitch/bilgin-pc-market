"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // SAHTE ÜRÜN KODU TAMAMEN SİLİNDİ! Artık hafıza boşsa, sepet boş kalacak.
    const savedCart = localStorage.getItem("cart");
    if (savedCart && savedCart !== "[]") {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
      const calculatedTotal = parsed.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);
      setTotal(calculatedTotal);
    }
  }, []);

  // 👑 SİLME ÖZELLİĞİ (Efsanevi tasarıma entegre edildi)
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
      }).filter(item => item.quantity > 0);
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setTotal(updated.reduce((acc, item) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0));
  };

  if (!isMounted) return null;

  return (
    // 👑 SEVDİĞİN O GENİŞ, TAM EKRAN VE CAM GİBİ PARLAYAN TASARIM GERİ GELDİ!
    <div className="min-h-screen bg-[#050814] text-white p-4 md:p-8 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tight border-b border-slate-800 pb-4">
          🛒 ALIŞVERİŞ SEPETİNİZ
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-800 rounded-2xl backdrop-blur-sm">
             <div className="text-6xl mb-6 opacity-50">🛒</div>
             <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Sepetiniz Boş</h2>
             <p className="text-slate-400 mb-8 text-center max-w-sm">Sepetinizde henüz hiçbir ürün bulunmuyor. Dükkandaki efsane sistemlere göz atmak ister misiniz?</p>
             <a href="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-8 rounded-xl transition-all shadow-[0_4px_24px_rgba(37,99,235,0.4)]">
                Dükkana Dön
             </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SOL TARAF: Ürün Listesi */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-sm shrink-0">
                      PC
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-200 line-clamp-2 max-w-md">{item.name}</h3>
                      <p className="text-xs text-blue-400 font-black mt-1">{parseFloat(item.price).toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/60 mt-4 sm:mt-0">
                    <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                      <button onClick={() => updateQuantity(item.id, 'decrease')} className="w-8 h-8 flex items-center justify-center font-black text-slate-400 hover:text-white transition-all text-lg">-</button>
                      <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, 'increase')} className="w-8 h-8 flex items-center justify-center font-black text-slate-400 hover:text-white transition-all text-lg">+</button>
                    </div>
                    
                    <span className="text-sm md:text-base font-black text-slate-100 shrink-0 min-w-[90px] text-right">
                      {(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('tr-TR')} TL
                    </span>

                    {/* 🗑️ ÇÖP KUTUSU İKONU (Kusursuz tasarıma zarar vermeden eklendi) */}
                    <button 
                      onClick={() => updateQuantity(item.id, 'remove')} 
                      className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
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

            {/* SAĞ TARAF: Sipariş Özeti */}
            <div className="lg:col-span-4 bg-slate-900/20 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Sipariş Özeti</h2>
              
              <div className="space-y-3 text-xs border-b border-slate-800 pb-4 text-slate-400">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-bold text-slate-200">{total.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo Dağıtım</span>
                  <span className="text-green-400 font-bold uppercase">Ücretsiz</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400">GENEL TOPLAM</span>
                <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </span>
              </div>

              {/* O HARİKA MOR-MAVİ BUTON VE MOBİL UYUMLU İYZİCO LİNKİ BURADA! */}
              <a 
                href={`/checkout?t=${Date.now()}`}
                className="flex justify-center items-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl text-xs md:text-sm uppercase tracking-widest shadow-[0_4px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_24px_rgba(79,70,229,0.6)] transition-all active:scale-[0.98]"
              >
                Güvenli Ödemeye Geç ➔
              </a>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}