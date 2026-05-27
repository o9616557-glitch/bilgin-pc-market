"use client";
// 🚀 BİNGO: İkisi de app klasöründe olduğu için bağlantıyı direkt yan dosya (./) olarak ayarladık!
import { useCompare } from "./CompareContext"; 
import { X, CheckCircle2, MinusCircle } from "lucide-react";

export default function ComparePopup() {
  const { karsilastirilanlar, karsilastirmadanCikar, popupAcik, setPopupAcik, karsilastirmayiTemizle } = useCompare();

  if (!popupAcik) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#09090b] border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.1)] relative">
        
        {/* Üst Başlık */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#00e5ff]">⚖️</span> Ürün Karşılaştırma
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">{karsilastirilanlar.length} ürün seçildi (Maksimum 3)</p>
          </div>
          <button onClick={() => setPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* İçerik / Karşılaştırma Tablosu */}
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-auto">
          {karsilastirilanlar.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Karşılaştırmak için henüz ürün seçmediniz.</div>
          ) : (
            <div className="flex gap-4 min-w-max md:min-w-0">
              {karsilastirilanlar.map((urun, index) => {
                const fiyat = Number(urun.indirimliFiyat || urun.fiyat || urun.price || 0);
                const resim = urun.resimler?.[0] || urun.resim;

                return (
                  <div key={index} className="w-[260px] sm:flex-1 bg-[#121215] border border-slate-800 rounded-2xl p-4 flex flex-col relative">
                    <button onClick={() => karsilastirmadanCikar(urun._id || urun.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 bg-[#09090b] p-1.5 rounded-lg transition-colors">
                      <MinusCircle className="w-5 h-5" />
                    </button>
                    
                    <div className="h-32 w-full bg-[#09090b] rounded-xl p-2 flex items-center justify-center mb-4">
                      {resim ? <img src={resim} alt="urun" className="max-h-full object-contain" /> : <span>Görsel Yok</span>}
                    </div>
                    
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 h-10">{urun.isim || urun.name}</h3>
                    <div className="text-[#00e5ff] font-black text-lg mb-4">{fiyat.toLocaleString("tr-TR")} TL</div>
                    
                    <div className="space-y-2 mt-auto border-t border-slate-800/80 pt-4">
                      <div className="text-xs text-slate-400 flex justify-between"><span className="font-bold">Kategori:</span> <span className="text-white">{urun.kategori || "-"}</span></div>
                      <div className="text-xs text-slate-400 flex justify-between"><span className="font-bold">Stok:</span> <span className="text-white">{urun.stokAdedi || "Bilinmiyor"}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alt Butonlar */}
        <div className="p-4 sm:p-6 border-t border-slate-800 shrink-0 bg-[#050814] rounded-b-3xl flex justify-between items-center">
          <button onClick={karsilastirmayiTemizle} className="text-slate-400 text-sm hover:text-white font-bold underline transition-colors">Listeyi Temizle</button>
          <button onClick={() => setPopupAcik(false)} className="bg-[#00e5ff] text-black font-black px-8 py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Karşılaştırmayı Kapat
          </button>
        </div>

      </div>
    </div>
  );
}