"use client";
import { useCompare } from "./CompareContext"; 
import { X, MinusCircle, Trash2 } from "lucide-react";
import Link from "next/link"; 

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
      gridTemplateColumns: `repeat(${karsilastirilanlar.length}, minmax(160px, 220px))`, 
      justifyContent: "start" 
    };
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* 🚀 KUTU: Alt panel yok, sayfa gibi aşağı akacak */}
      <div className="bg-[#050814] border border-slate-800 rounded-2xl sm:rounded-3xl w-full h-[95vh] max-w-6xl flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.1)] relative overflow-hidden">
        
        {/* 🚀 TERTEMİZ HEADER: Sadece başlık, temizle butonu (ufak) ve X kapatma tuşu */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#09090b]">
          <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-[#00e5ff] text-xl sm:text-2xl">⚖️</span> TEKNİK KARŞILAŞTIRMA
          </h2>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Alt paneli sildiğimiz için Listeyi Temizle butonunu şık bir çöp kutusu olarak yukarı aldık */}
            {karsilastirilanlar.length > 0 && (
              <button onClick={karsilastirmayiTemizle} className="text-slate-500 hover:text-red-500 bg-[#121215] border border-slate-700 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl p-2 transition-all shrink-0" title="Listeyi Temizle">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            <button onClick={() => setPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2 transition-all shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* İçerik Alanı (Sayfa gibi aşağı kayar, altı tamamen sıfır) */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-grow bg-[#050814]">
          {karsilastirilanlar.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">[ Karşılaştırılacak Ürün Seçilmedi ]</div>
          ) : (
            <div className="flex flex-col gap-6 w-full min-w-max mx-auto pb-10">
              
              {/* Bilgilendirme Yazısı */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-xs font-medium">{karsilastirilanlar.length} ürün kıyaslanıyor</span>
                <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase">Max 3 Adet</span>
              </div>

              {/* ANA GÖRSEL VE VİTRİN SATIRI */}
              <div className="grid gap-3 sm:gap-4 w-full" style={getGridStyle()}>
                {karsilastirilanlar.map((urun, idx) => {
                  const fiyat = Number(urun.indirimliFiyat || urun.fiyat || urun.price || 0);
                  const resim = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
                  
                  return (
                    <div key={idx} className="bg-[#121215] border border-slate-800/80 rounded-2xl flex flex-col relative border-b-2 border-b-[#00e5ff]/20 overflow-hidden group">
                      
                      <button onClick={() => karsilastirmadanCikar(urun._id || urun.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors z-10 bg-[#09090b] p-1.5 rounded-xl border border-slate-700">
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      
                      <Link href={"/product/" + (urun.slug || urun._id)} onClick={() => setPopupAcik(false)} className="p-3 sm:p-4 flex flex-col flex-grow hover:bg-slate-800/40 transition-colors cursor-pointer">
                        <div className="h-24 sm:h-32 w-full bg-[#09090b] rounded-xl p-2 flex items-center justify-center mb-3 sm:mb-4 border border-slate-800 overflow-hidden">
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
                  
                  <div className="text-[#00e5ff] font-black text-[11px] sm:text-xs uppercase tracking-widest mb-2 pl-1">
                    {ozellikAdi}
                  </div>
                  
                  <div className="grid gap-3 sm:gap-4 w-full" style={getGridStyle()}>
                    {karsilastirilanlar.map((urun, idx) => {
                      const deger = urun.teknik_ozellikler ? urun.teknik_ozellikler[ozellikAdi] : null;
                      return (
                        <div key={idx} className="bg-[#121215] border border-slate-700 p-2 sm:p-3 rounded-md text-xs sm:text-sm text-white font-medium flex items-center min-h-[40px] sm:min-h-[48px] shadow-sm hover:border-[#00e5ff]/50 transition-colors">
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
    </div>
  );
}