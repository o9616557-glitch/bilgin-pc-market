"use client";
import { useCompare } from "./CompareContext"; 
import { X, MinusCircle } from "lucide-react";
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

  // 🚀 ŞEFİM BİNGO: Genişlik tam %19 daraltıldı! (280px -> 226px)
  const sutunGenisligi = karsilastirilanlar.length === 1 ? "100%" : (karsilastirilanlar.length * 226) + "px";

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#09090b] border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.1)] relative">
        
        {/* Üst Başlık */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#00e5ff]">⚖️</span> TEKNİK KARŞILAŞTIRMA
            </h2>
            <p className="text-slate-400 text-xs mt-1">{karsilastirilanlar.length} ürün yan yana kıyaslanıyor</p>
          </div>
          <button onClick={() => setPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Karşılaştırma Alanı (Sağa Sola Kaydırma Motoru) */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-grow">
          {karsilastirilanlar.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">[ Karşılaştırılacak Ürün Seçilmedi ]</div>
          ) : (
            <div className="flex flex-col gap-6" style={{ minWidth: sutunGenisligi }}>
              
              {/* ANA GÖRSEL VE VİTRİN SATIRI */}
              <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: "repeat(" + karsilastirilanlar.length + ", 1fr)" }}>
                {karsilastirilanlar.map((urun, idx) => {
                  const fiyat = Number(urun.indirimliFiyat || urun.fiyat || urun.price || 0);
                  const resim = urun.resimler ? urun.resimler[0] : urun.resim;
                  return (
                    <div key={idx} className="bg-[#121215] border border-slate-800/80 rounded-2xl flex flex-col relative border-b-2 border-b-[#00e5ff]/20 overflow-hidden group">
                      
                      <button onClick={() => karsilastirmadanCikar(urun._id || urun.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors z-10 bg-[#09090b] p-1.5 rounded-xl border border-slate-700">
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      
                      <Link href={"/product/" + (urun.slug || urun._id)} onClick={() => setPopupAcik(false)} className="p-3 sm:p-4 flex flex-col flex-grow hover:bg-slate-800/40 transition-colors cursor-pointer">
                        <div className="h-24 sm:h-32 w-full bg-[#09090b] rounded-xl p-2 flex items-center justify-center mb-3 sm:mb-4 border border-slate-800">
                          {resim ? <img src={resim} alt="urun" className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" /> : <span className="text-xs text-slate-600">Görsel Yok</span>}
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
                <div key={ozellikAdi}>
                  <div className="text-slate-400 font-bold text-xs uppercase bg-[#121215]/50 p-2 sm:p-3 rounded-xl border border-slate-800/40 mb-2">
                    {ozellikAdi}
                  </div>
                  
                  <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: "repeat(" + karsilastirilanlar.length + ", 1fr)" }}>
                    {karsilastirilanlar.map((urun, idx) => {
                      const deger = urun.teknik_ozellikler ? urun.teknik_ozellikler[ozellikAdi] : null;
                      return (
                        <div key={idx} className="bg-[#121215] border border-slate-700 p-2 sm:p-3 rounded-sm text-xs sm:text-sm text-white font-medium flex items-center min-h-[40px] sm:min-h-[48px] shadow-sm hover:border-[#00e5ff]/50 transition-colors">
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

        {/* Alt Panel */}
        <div className="p-4 sm:p-5 border-t border-slate-800 shrink-0 bg-[#050814] rounded-b-3xl flex justify-between items-center">
          <button onClick={karsilastirmayiTemizle} className="text-slate-500 text-xs sm:text-sm hover:text-red-400 font-bold underline transition-colors">Listeyi Temizle</button>
          <button onClick={() => setPopupAcik(false)} className="bg-[#00e5ff] text-black font-black px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Kapat ve Dön
          </button>
        </div>

      </div>
    </div>
  );
}