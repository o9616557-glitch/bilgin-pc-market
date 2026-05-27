"use client";
import { useCompare } from "./CompareContext"; 
import { X, MinusCircle } from "lucide-react";

export default function ComparePopup() {
  const { karsilastirilanlar, karsilastirmadanCikar, popupAcik, setPopupAcik, karsilastirmayiTemizle } = useCompare();

  if (!popupAcik) return null;

  // 🚀 BİNGO: Seçilen ürünlerin içindeki tüm farklı teknik özellikleri otomatik toplayan akıllı motor!
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

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-[#09090b] border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.1)] relative">
        
        {/* Üst Başlık */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#00e5ff]">⚖️</span> TEKNİK KARŞILAŞTIRMA
            </h2>
            <p className="text-slate-400 text-xs mt-1">{karsilastirilanlar.length} ürün yan yana kıyaslanıyor (Maksimum 3)</p>
          </div>
          <button onClick={() => setPopupAcik(false)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-red-500/20 hover:border-red-500 rounded-xl p-2.5 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Karşılaştırma Alanı */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
          {karsilastirilanlar.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">[ Karşılaştırılacak Ürün Seçilmedi ]</div>
          ) : (
            <div className="grid gap-4 overflow-x-auto pb-4" style={{ gridTemplateColumns: "180px repeat(" + karsilastirilanlar.length + ", minmax(240px, 1fr))" }}>
              
              {/* ANA GÖRSEL VE VİTRİN SATIRI */}
              <div className="flex items-center text-slate-500 font-black text-xs uppercase tracking-wider border-b border-slate-800/50 pb-4">ÜRÜN VİTRİNİ</div>
              {karsilastirilanlar.map((urun, idx) => {
                const fiyat = Number(urun.indirimliFiyat || urun.fiyat || urun.price || 0);
                const resim = urun.resimler ? urun.resimler[0] : urun.resim;
                return (
                  <div key={idx} className="bg-[#121215] border border-slate-800/80 rounded-2xl p-4 flex flex-col relative border-b-2 border-b-[#00e5ff]/20">
                    <button onClick={() => karsilastirmadanCikar(urun._id || urun.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 transition-colors">
                      <MinusCircle className="w-5 h-5" />
                    </button>
                    <div className="h-28 w-full bg-[#09090b] rounded-xl p-2 flex items-center justify-center mb-3 border border-slate-800">
                      {resim ? <img src={resim} alt="urun" className="max-h-full object-contain" /> : <span className="text-xs text-slate-600">Görsel Yok</span>}
                    </div>
                    <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-2 mb-2 h-10 leading-tight">{urun.isim || urun.name}</h3>
                    <div className="text-[#00e5ff] font-black text-base sm:text-lg mt-auto">{fiyat.toLocaleString("tr-TR")} TL</div>
                  </div>
                );
              })}

              {/* DİNAMİK TEKNİK ÖZELLİK SATIRLARI (Veritabanından ne gelirse otomatik basar) */}
              {tumOzellikAnahtarlari.map((ozellikAdi) => (
                <>
                  {/* Sol Sütun: Özelliğin Adı (Örn: CUDA Çekirdeği) */}
                  <div className="flex items-center text-slate-400 font-bold text-xs uppercase bg-[#121215]/50 p-3 rounded-xl border border-slate-800/40">
                    {ozellikAdi}
                  </div>
                  
                  {/* Sağ Sütunlar: Ürünlerin o özelliğe ait değerleri */}
                  {karsilastirilanlar.map((urun, idx) => {
                    const deger = urun.teknik_ozellikler ? urun.teknik_ozellikler[ozellikAdi] : null;
                    return (
                      <div key={idx} className="bg-[#121215] border border-slate-800/50 p-3 rounded-xl text-xs sm:text-sm text-white font-medium flex items-center">
                        {deger || "-"}
                      </div>
                    );
                  })}
                </>
              ))}

            </div>
          )}
        </div>

        {/* Alt Panel */}
        <div className="p-5 border-t border-slate-800 shrink-0 bg-[#050814] rounded-b-3xl flex justify-between items-center">
          <button onClick={karsilastirmayiTemizle} className="text-slate-500 text-xs sm:text-sm hover:text-red-400 font-bold underline transition-colors">Listeyi Temizle</button>
          <button onClick={() => setPopupAcik(false)} className="bg-[#00e5ff] text-black font-black px-6 sm:px-8 py-3 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Kapat ve Alışverişe Dön
          </button>
        </div>

      </div>
    </div>
  );
}