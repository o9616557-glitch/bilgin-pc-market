"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  
  // 👑 1. ÇÖZÜM: Ekranda kaymayı ve geç yüklenmeyi önleyecek kontrolcü
  const [isMounted, setIsMounted] = useState(false); 

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("cart");
    
    // Eğer hafızada gerçekten bir sepet varsa onu çekiyoruz
    if (savedCart && savedCart !== "[]") {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
      const calculatedTotal = parsed.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);
      setTotal(calculatedTotal);
    } else {
      // 👑 2. ÇÖZÜM: SAHTE TEST ÜRÜNÜ TAMAMEN SİLİNDİ! Artık sepet gerçekten boş kalacak.
      setCart([]);
      setTotal(0);
    }
  }, []);

  const updateQuantity = (id: number, type: 'increase' | 'decrease') => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = type === 'increase' ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setTotal(updated.reduce((acc, item) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0));
  };

  // 👑 AŞAMA 1: SAYFA YÜKLENİRKEN GÖRÜNTÜ ZIPLAMASIN DİYE ŞIK BİR LOADER GÖSTERİYORUZ
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
         <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Sepetiniz Hazırlanıyor...</p>
      </div>
    );
  }

  // 👑 AŞAMA 2: SEPET GERÇEKTEN BOŞSA SİYAH EKRAN YERİNE BİLGİ EKRANI VERİYORUZ
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4">
         <div className="text-6xl mb-6 opacity-50">🛒</div>
         <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Sepetiniz Boş</h2>
         <p className="text-slate-400 mb-8 text-center max-w-sm">Sepetinizde henüz hiçbir ürün bulunmuyor. Dükkandaki efsane sistemlere göz atmak ister misiniz?</p>
         <a href="/" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_4px_24px_rgba(37,99,235,0.4)]">
            Dükkana Dön
         </a>
      </div>
    );
  }

  // 👑 AŞAMA 3: GERÇEK VE DOLU SEPET EKRANI
  return (
    <div className="min-h-screen bg-[#050814] text-white p-4 md:p-8 lg:p-12 flex flex-col items-center">
      
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tight border-b border-slate-800 pb-4">
          🛒 ALIŞVERİŞ SEPETİNİZ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
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

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/60">
                  <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                    <button onClick={() => updateQuantity(item.id, 'decrease')} className="w-8 h-8 flex items-center justify-center font-black text-slate-400 hover:text-white transition-all text-lg">-</button>
                    <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 'increase')} className="w-8 h-8 flex items-center justify-center font-black text-slate-400 hover:text-white transition-all text-lg">+</button>
                  </div>
                  
                  <span className="text-sm md:text-base font-black text-slate-100 shrink-0">
                    {(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('tr-TR')} TL
                  </span>
                </div>

              </div>
            ))}
          </div>

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

            <a 
              href={`/checkout?t=${Date.now()}`}
              className="flex justify-center items-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl text-xs md:text-sm uppercase tracking-widest shadow-[0_4px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_24px_rgba(79,70,229,0.6)] transition-all active:scale-[0.98]"
            >
              Güvenli Ödemeye Geç ➔
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}