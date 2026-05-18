"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Vercel'in hafızasındaki o eski sahte ürün kodunu yok ettik, sadece gerçek sepeti çekiyoruz
    const savedCart = localStorage.getItem("cart");
    if (savedCart && savedCart !== "[]") {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
      const calculatedTotal = parsed.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0);
      setTotal(calculatedTotal);
    }
  }, []);

  // 👑 SİLME İŞLEMİ EKLENDİ: Eksiye düşerse veya çöp kutusuna basılırsa ürünü tamamen siler
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
      }).filter(item => item.quantity > 0); // Adet 0'a inerse otomatik çöpe atar
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setTotal(updated.reduce((acc, item) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0));
  };

  // Sayfa yüklenirken o zıplama/kayma hatasını önleyen zırh
  if (!isMounted) return null;

  return (
    // 👑 SEVDİĞİN O TAM EKRAN TASARIM GERİ GELDİ
    <div className="min-h-screen bg-[#050814] text-white p-4 md:p-8 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tight border-b border-slate-800 pb-4">
          🛒 ALIŞVERİŞ SEPETİNİZ
        </h1>

        {cart.length === 0 ? (
          // SEPET BOŞKEN BİLE EKRAN KÜÇÜLMEYECEK, ORTADA ŞIK DURACAK
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-800 rounded-2xl backdrop-blur-sm">
             <div className="text-6xl mb-6 opacity-50">🛒</div>
             <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Sepetiniz Boş</h2>
             <p className="text-slate-400 mb-8 text-center max-w-sm">Sepetinizde henüz hiçbir ürün bulunmuyor. Dükkandaki efsane sistemlere göz atmak ister misiniz?</p>
             <a href="/" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_4px_24px_rgba(37,99,235,0.4)]">
                Dükkana Dön
             </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SOL TARAF: ÜRÜN LİSTESİ */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm relative group">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-sm shrink-0">
                      PC
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-200 line-clamp-2 max-w-md pr-8">{item.name}</h3>
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

                    {/* 🗑️ ÇÖP KUTUSU İKONU (SİLME BUTONU) */}
                    <button 
                      onClick={() => updateQuantity(item.id, 'remove')} 
                      className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                      title="Ürünü Sepetten Çıkar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/* SAĞ TARAF: SİPARİŞ ÖZETİ */}
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
        )}
      </div>
    </div>
  );
}