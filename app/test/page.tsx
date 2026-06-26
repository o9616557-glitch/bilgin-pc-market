"use client";
import React, { useState, useRef } from "react";
import { Star, Server, Truck, Headset, Search, MapPin, Palette, CheckCircle2, Box } from "lucide-react";

export default function SurukleVeRenkTesti() {
  // 🎨 1. İNSANLARIN EN ÇOK KULLANDIĞI TAM 21 ÖZEL RENK PALETİ
  const renkSecenekleri = [
    { text: "text-white", bg: "bg-white border-slate-300" }, // 1. Beyaz
    { text: "text-slate-900", bg: "bg-slate-900 border-slate-600" }, // 2. Siyah
    { text: "text-slate-400", bg: "bg-slate-400 border-slate-400" }, // 3. Gri
    { text: "text-red-500", bg: "bg-red-500 border-red-500" }, // 4. Kırmızı
    { text: "text-rose-500", bg: "bg-rose-500 border-rose-500" }, // 5. Gül Kırmızısı
    { text: "text-orange-500", bg: "bg-orange-500 border-orange-500" }, // 6. Turuncu
    { text: "text-amber-500", bg: "bg-amber-500 border-amber-500" }, // 7. Kehribar
    { text: "text-yellow-400", bg: "bg-yellow-400 border-yellow-400" }, // 8. Sarı
    { text: "text-lime-400", bg: "bg-lime-400 border-lime-400" }, // 9. Açık Yeşil
    { text: "text-green-500", bg: "bg-green-500 border-green-500" }, // 10. Canlı Yeşil
    { text: "text-emerald-400", bg: "bg-emerald-400 border-emerald-400" }, // 11. Zümrüt Yeşili
    { text: "text-teal-400", bg: "bg-teal-400 border-teal-400" }, // 12. Turkuaz Yeşil
    { text: "text-cyan-400", bg: "bg-cyan-400 border-cyan-400" }, // 13. Açık Mavi (Cyan)
    { text: "text-sky-400", bg: "bg-sky-400 border-sky-400" }, // 14. Gökyüzü Mavisi
    { text: "text-blue-500", bg: "bg-blue-500 border-blue-500" }, // 15. Kral Mavisi
    { text: "text-indigo-400", bg: "bg-indigo-400 border-indigo-400" }, // 16. Çivit Mavisi
    { text: "text-violet-500", bg: "bg-violet-500 border-violet-500" }, // 17. Menekşe
    { text: "text-purple-500", bg: "bg-purple-500 border-purple-500" }, // 18. Mor
    { text: "text-fuchsia-400", bg: "bg-fuchsia-400 border-fuchsia-400" }, // 19. Fuşya
    { text: "text-pink-500", bg: "bg-pink-500 border-pink-500" }, // 20. Pembe
    { text: "text-stone-400", bg: "bg-stone-400 border-stone-500" }, // 21. Taş Grisi
  ];

  // 🚀 2. DİNAMİK 50 ADET KUTU ÜRETİM MOTORU
  // Testi tam simüle etmek için senin temel 6 ikonunu döngüyle 50 adete tamamlıyoruz şefim.
  const anaIkonlar = [
    { isim: "Favoriler", ikon: Star, varsayilanRenk: "text-purple-500" },
    { isim: "Sistemler", ikon: Server, varsayilanRenk: "text-emerald-400" },
    { isim: "Kargolar", ikon: Truck, varsayilanRenk: "text-rose-500" },
    { isim: "Destek", ikon: Headset, varsayilanRenk: "text-orange-500" },
    { id_kod: "sorgula", isim: "Sorgula", ikon: Search, varsayilanRenk: "text-blue-500" },
    { isim: "Adresler", ikon: MapPin, varsayilanRenk: "text-cyan-400" },
  ];

  const elliKutuUret = () => {
    let geciciListe = [];
    for (let i = 1; i <= 50; i++) {
      const şablon = anaIkonlar[(i - 1) % anaIkonlar.length]; // İkonları sırayla döndürür
      geciciListe.push({
        id: `kutu-${i}`,
        isim: `${şablon.isim} ${i}`,
        ikon: şablon.ikon,
        renk: şablon.varsayilanRenk
      });
    }
    return geciciListe;
  };

  const [menuListesi, setMenuListesi] = useState(elliKutuUret);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [seciliKutuId, setSeciliKutuId] = useState<string | null>(null);
  
  const suruklenenOgeRef = useRef<number | null>(null);

  // 🔄 3. AKICI YER DEĞİŞTİRME MOTORU (50 Kutu arasında da tıkır tıkır kayar)
  const handleDragEnter = (hedefIndex: number) => {
    const suruklenenIndex = suruklenenOgeRef.current;
    if (suruklenenIndex === null || suruklenenIndex === hedefIndex) return;

    setMenuListesi((eskiListe) => {
      const yeniListe = [...eskiListe];
      const suruklenenOge = yeniListe.splice(suruklenenIndex, 1)[0];
      yeniListe.splice(hedefIndex, 0, suruklenenOge);
      return yeniListe;
    });
    suruklenenOgeRef.current = hedefIndex;
  };

  // 🎨 4. BOYAMA MOTORU
  const renkUygula = (yeniRenk: string) => {
    if (!seciliKutuId) return;
    setMenuListesi(eskiListe => 
      eskiListe.map(kutu => kutu.id === seciliKutuId ? { ...kutu, renk: yeniRenk } : kutu)
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-10 flex flex-col items-center pt-8 sm:pt-16">
      
      <div className="w-full max-w-3xl flex flex-col h-[85vh]">
        
        {/* Üst Başlık Alanı */}
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4 shrink-0">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest">
                HESAP YÖNETİMİ (50 KUTU VE 21 RENK MOTORU)
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">Ekranda tam 50 adet kutu simüle edilmiştir.</p>
            </div>
            
            <button 
              onClick={() => {
                setDuzenlemeModu(!duzenlemeModu);
                setSeciliKutuId(null);
              }}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-widest shrink-0 ${
                duzenlemeModu 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Palette className="w-4 h-4" />
              {duzenlemeModu ? "KAYDET BİTİR" : "MENÜYÜ DÜZENLE"}
            </button>
        </div>

        {/* 📦 50 KUTUNUN YAŞADIĞI İÇTEN KAYDIRMALI PENCERE */}
        {/* max-h ve overflow-y-auto sayesinde 50 kutu sayfayı patlatmaz, kendi içinde kayar */}
        <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-900 rounded-2xl p-4 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="grid grid-cols-5 gap-y-6 gap-x-2 w-full">
            {menuListesi.map((item, index) => {
              const IkonBileseni = item.ikon;
              const isSecili = seciliKutuId === item.id;
              
              return (
                <div
                  key={item.id}
                  draggable={duzenlemeModu}
                  onDragStart={() => (suruklenenOgeRef.current = index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => (suruklenenOgeRef.current = null)}
                  onClick={() => {
                    if (duzenlemeModu) setSeciliKutuId(item.id);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  {/* Kutu Tasarımı */}
                  <div className={`relative w-full aspect-square max-w-[64px] rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      duzenlemeModu && isSecili
                      ? "bg-slate-800 border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,255,0.4)] scale-110 z-20"
                      : duzenlemeModu && !isSecili
                      ? "bg-[#0f172a]/60 border-2 border-dashed border-slate-800 opacity-60 hover:opacity-100"
                      : "bg-[#0f172a] border border-slate-800 shadow-lg group-hover:bg-white/[0.05]"
                  }`}>
                    <IkonBileseni className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 ${item.renk}`} />
                    
                    {duzenlemeModu && isSecili && (
                      <div className="absolute -top-1.5 -right-1.5 bg-[#020617] rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Kutu İsmi */}
                  <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide text-center truncate w-full px-0.5 ${duzenlemeModu && isSecili ? "text-cyan-400" : "text-slate-400"}`}>
                    {item.isim}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🎨 5. EN ALTA ALINAN GENİŞ, 21'Lİ SABİT RENK PALETİ */}
        {duzenlemeModu && (
          <div className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl shrink-0 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-3">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                🎨 Önce yukarıdan bir kutuya basın, sonra aşağıdaki 21 renkten birine tıklayın
              </span>
            </div>
            
            {/* 21 Renk burada ferah ferah yan yana listelenir */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-h-[110px] overflow-y-auto py-1">
              {renkSecenekleri.map((renkObj, i) => (
                <button 
                  key={i} 
                  onClick={() => renkUygula(renkObj.text)}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center shadow-lg border-2 ${renkObj.bg} ${!seciliKutuId ? "opacity-40 grayscale" : "opacity-100"}`}
                  disabled={!seciliKutuId}
                ></button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}