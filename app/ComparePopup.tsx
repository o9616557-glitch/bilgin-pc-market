"use client";
import { useCompare } from "./CompareContext"; 
import { X, MinusCircle, Trash2 } from "lucide-react";
import Link from "next/link"; 
import { Toaster } from "react-hot-toast"; 

export default function ComparePopup() {
  const { karsilastirilanlar, karsilastirmadanCikar, popupAcik, setPopupAcik, karsilastirmayiTemizle } = useCompare();

  if (!popupAcik) return null;

  const tumOzellikAnahtarlari: string[] = [];
  karsilastirilanlar.forEach((urun) => {
    if (urun.teknik_ozellikler) {
      Object.keys(urun.teknik_ozellikler).forEach((anahtar) => {
        if (!tumOzellikAnahtarlari.includes(anahtar)) {
          tumOzellikAnahtarlari.push(anahtar);
        }
      });
    }
  });

  const getGridStyle = () => {
    return { 
      // 1fr özelliği sayesinde kalan tüm boşluğu eşit olarak paylaşırlar
      gridTemplateColumns: `repeat(${karsilastirilanlar.length}, minmax(160px, 1fr))`, 
      justifyContent: "start" 
    };
  };
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-all">
      
      
      
      <div className="absolute inset-0 hidden sm:block" onClick={() => setPopupAcik(false)}></div>
      
      {/* PENCERE BOYUTU */}
      <div className="relative w-full h-full sm:max-h-[85vh] sm:max-w-4xl mx-auto bg-[#09090b]/60 backdrop-blur-2xl sm:border sm:border-[#00e5ff]/30 sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.15)]">
        
        {/* HEADER (TAVAN) */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5 shrink-0 bg-[#121215] relative z-20">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#00e5ff] text-xl sm:text-2xl">⚖️</span> TEKNİK KARŞILAŞTIRMA
            </h2>
            <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
              <span className="text-slate-400 text-[10px] sm:text-xs font-medium">{karsilastirilanlar.length} ürün kıyaslanıyor</span>
              <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase">Max 3 Adet</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {karsilastirilanlar.length > 0 && (
              <button onClick={karsilastirmayiTemizle} className="text-slate-400 hover:text-white bg-[#09090b] border border-white/5 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all" title="Listeyi Temizle">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            <button onClick={() => setPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#09090b] border border-white/5 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* İÇERİK ALANI */}
        <div className="overflow-y-auto overflow-x-auto flex-1 p-4 sm:p-6 flex flex-col text-slate-300 bg-transparent relative z-10">
          <div className="pb-10">
            {karsilastirilanlar.length === 0 ? (
              <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">[ Karşılaştırılacak Ürün Seçilmedi ]</div>
            ) : (
              // 🚀 ŞEFİM İŞTE BURASI: w-fit yerine w-full yapıldı, soldaki gereksiz boşluk/kayma engellendi.
              <div className="flex flex-col gap-6 w-full">
                
                {/* ANA GÖRSEL VE VİTRİN SATIRI */}
                <div className="grid gap-3 sm:gap-4 w-full" style={getGridStyle()}>
                  {karsilastirilanlar.map((urun, idx) => {
                    const fiyat = Number(urun.indirimliFiyat || urun.fiyat || urun.price || 0);
                    const resim = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
                    
                    return (
                      <div key={idx} className="bg-[#121215]/80 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col relative border-b-2 border-b-[#00e5ff]/50 overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        
                        <button onClick={() => karsilastirmadanCikar(urun._id || urun.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors z-10 bg-[#050814] p-1.5 rounded-xl border border-white/10">
                          <MinusCircle className="w-5 h-5" />
                        </button>
                        
                        <Link href={"/product/" + (urun.slug || urun._id)} onClick={() => setPopupAcik(false)} className="p-3 sm:p-4 flex flex-col flex-grow hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="h-24 sm:h-32 w-full bg-[#050814] rounded-xl p-2 flex items-center justify-center mb-3 sm:mb-4 border border-white/10 overflow-hidden">
                            {resim ? (
                              <img 
                                src={resim} 
                                alt={urun.isim || "ürün"} 
                                className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                                onError={(e) => {
                                  e.currentTarget.onerror = null; 
                                  e.currentTarget.src = "https://via.placeholder.com/300x300/121215/475569?text=Gorsel+Yok";
                                }}
                              />
                            ) : (
                              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Görsel Yok</span>
                            )}
                          </div>
                          <h3 className="text-white font-bold text-xs sm:text-sm mb-2 leading-snug group-hover:text-[#00e5ff] transition-colors">{urun.isim || urun.name}</h3>
                          <div className="text-[#00e5ff] font-black text-lg sm:text-xl mt-auto">{fiyat.toLocaleString("tr-TR")} TL</div>
                        </Link>

                      </div>
                    );
                  })}
                </div>

                {/* DİNAMİK TEKNİK ÖZELLİK SATIRLARI */}
                {tumOzellikAnahtarlari.map((ozellikAdi) => (
                  <div key={ozellikAdi} className="mt-2 w-full">
                    
                    {/* 🚀 ŞEFİM İŞTE BURASI: pl-1 (sol ufak boşluk) tamamen silindi, sıfıra sıfır sola dayandı. */}
                    <div className="text-[#00e5ff] font-black text-[11px] sm:text-xs uppercase tracking-widest mb-2 text-left">
                      {ozellikAdi}
                    </div>
                    
                    <div className="grid gap-3 sm:gap-4 w-full" style={getGridStyle()}>
                      {karsilastirilanlar.map((urun, idx) => {
                        const deger = urun.teknik_ozellikler ? urun.teknik_ozellikler[ozellikAdi] : null;
                        return (
                          <div key={idx} className="bg-[#121215]/80 border border-white/10 p-2 sm:p-3 rounded-md text-xs sm:text-sm text-white font-medium flex items-center justify-start min-h-[40px] sm:min-h-[48px] shadow-sm hover:border-[#00e5ff]/50 transition-colors">
                            {deger || "-"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>

        {/* FOOTER (TABAN) */}
        <div className="hidden sm:block p-4 sm:p-5 border-t border-white/5 shrink-0 bg-[#121215] rounded-b-3xl z-20">
          <button onClick={() => setPopupAcik(false)} className="w-full bg-[#00e5ff] text-black font-black px-8 py-4 sm:py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}