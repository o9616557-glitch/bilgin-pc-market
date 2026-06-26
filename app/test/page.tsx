"use client";
import React, { useState, useRef } from "react";
import { Star, Server, Truck, Headset, Search, MapPin, Palette, X } from "lucide-react";

export default function SurukleVeRenkTesti() {
  // 🎨 1. GELİŞMİŞ RENK PALETİ
  const renkSecenekleri = [
    { text: "text-white", bg: "bg-white border-slate-300" },
    { text: "text-slate-900", bg: "bg-slate-900 border-slate-500" },
    { text: "text-slate-400", bg: "bg-slate-400 border-slate-400" },
    { text: "text-red-500", bg: "bg-red-500 border-red-500" },
    { text: "text-orange-500", bg: "bg-orange-500 border-orange-500" },
    { text: "text-amber-400", bg: "bg-amber-400 border-amber-400" },
    { text: "text-yellow-400", bg: "bg-yellow-400 border-yellow-400" },
    { text: "text-lime-400", bg: "bg-lime-400 border-lime-400" },
    { text: "text-emerald-400", bg: "bg-emerald-400 border-emerald-400" },
    { text: "text-cyan-400", bg: "bg-cyan-400 border-cyan-400" },
    { text: "text-blue-500", bg: "bg-blue-500 border-blue-500" },
    { text: "text-indigo-400", bg: "bg-indigo-400 border-indigo-400" },
    { text: "text-purple-500", bg: "bg-purple-500 border-purple-500" },
    { text: "text-fuchsia-400", bg: "bg-fuchsia-400 border-fuchsia-400" },
    { text: "text-rose-500", bg: "bg-rose-500 border-rose-500" },
  ];

  // 2. VARSAYILAN KUTU LİSTESİ
  const varsayilanMenu = [
    { id: "favoriler", isim: "Favoriler", ikon: Star, renk: "text-purple-500" },
    { id: "sistemler", isim: "Sistemler", ikon: Server, renk: "text-emerald-400" },
    { id: "kargolar", isim: "Kargolar", ikon: Truck, renk: "text-rose-500" },
    { id: "destek", isim: "Destek", ikon: Headset, renk: "text-orange-500" },
    { id: "sorgula", isim: "Sorgula", ikon: Search, renk: "text-blue-500" },
    { id: "adresler", isim: "Adresler", ikon: MapPin, renk: "text-cyan-400" },
  ];

  const [menuListesi, setMenuListesi] = useState(varsayilanMenu);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [aktifRenkKutusu, setAktifRenkKutusu] = useState<string | null>(null); // YENİ: Hangi kutuya tıklandığını tutar
  
  const suruklenenOgeRef = useRef<number | null>(null);

  // 🚀 3. SIVI (FLUID) KAYMA MOTORU (Yer değiştirme aynen korunuyor)
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

  // 🎨 4. RENK DEĞİŞTİRME MOTORU
  const renkDegistir = (id: string, yeniRenk: string) => {
    setMenuListesi(eskiListe => 
      eskiListe.map(kutu => kutu.id === id ? { ...kutu, renk: yeniRenk } : kutu)
    );
    // İstersen renk seçtikten sonra paleti otomatik kapattırabilirsin: setAktifRenkKutusu(null);
  };

  // Düzenleme modunu kapatırken açık kalan renk penceresini de temizle
  const handleDuzenlemeModuGecis = () => {
    setDuzenlemeModu(!duzenlemeModu);
    setAktifRenkKutusu(null); 
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-10 flex flex-col items-center pt-10 sm:pt-20 relative">
      
      {/* 🌑 KARANLIK SİNEMA PERDESİ (OVERLAY) */}
      {/* Sadece bir kutuya tıklandığında ekranı karartır */}
      {aktifRenkKutusu && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-all cursor-pointer"
          onClick={() => setAktifRenkKutusu(null)} // Boşluğa tıklayınca paleti kapatır
          title="Kapatmak için boşluğa tıklayın"
        ></div>
      )}

      <div className="w-full max-w-3xl z-10">
        
        {/* Üst Kısım ve Düzenle Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-slate-800 pb-4 gap-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest text-center sm:text-left">
              HESAP YÖNETİMİ (SİNEMA MODU TESTİ)
            </h2>
            
            <button 
              onClick={handleDuzenlemeModuGecis}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-widest w-full sm:w-auto relative z-[105] ${
                duzenlemeModu 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Palette className="w-4 h-4" />
              {duzenlemeModu ? "KAYDET BİTİR" : "MENÜYÜ DÜZENLE"}
            </button>
        </div>

        {/* Kutuların Dizildiği Alan */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 w-full relative">
          {menuListesi.map((item, index) => {
            const IkonBileseni = item.ikon;
            const isAktif = aktifRenkKutusu === item.id;
            
            return (
              <div
                key={item.id}
                draggable={duzenlemeModu && !isAktif} // Odak modundayken sürüklemeyi durdur ki yanlışlıkla kaymasın
                onDragStart={() => (suruklenenOgeRef.current = index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => (suruklenenOgeRef.current = null)}
                // Kutunun Tıklanma Olayı: Eğer düzenleme modundaysa, tıklandığında kendisini aktif renk kutusu yapar
                onClick={() => {
                  if (duzenlemeModu) {
                    setAktifRenkKutusu(isAktif ? null : item.id);
                  }
                }}
                // Eğer kutu aktifse z-index ile karanlık perdenin üstüne çıkartıyoruz (z-[101])
                className={`flex flex-col items-center gap-2 group transition-all duration-300 ${
                  duzenlemeModu && !isAktif ? "cursor-move hover:scale-105" : "cursor-pointer"
                } ${isAktif ? "relative z-[101] scale-110" : "relative z-10"}`}
              >
                
                {/* Ana Kutu */}
                <div className={`relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    duzenlemeModu && !isAktif
                    ? "bg-[#0f172a] border-2 border-dashed border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse" 
                    : isAktif 
                    ? "bg-slate-800 border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    : "bg-[#0f172a] border border-slate-800 shadow-lg group-hover:bg-white/[0.05]"
                }`}>
                  <IkonBileseni className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-300 ${item.renk}`} />
                  
                  {/* Odak Modunda Çarpı İşareti Çıkar */}
                  {isAktif && (
                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg border-2 border-slate-900">
                      <X className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* İsim */}
                <span className={`text-[11px] sm:text-xs font-bold transition-colors tracking-wide ${isAktif ? "text-white" : "text-slate-300"}`}>
                  {item.isim}
                </span>

                {/* 🎨 ODAK MODU (FOCUS) AÇILIR RENK PENCERESİ */}
                {/* Sadece aktif olan kutunun altında görünür */}
                {isAktif && (
                  <div 
                    className="absolute top-[105%] left-1/2 -translate-x-1/2 w-[90px] sm:w-[100px] bg-slate-900 rounded-xl border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] p-2 mt-2"
                    onClick={(e) => e.stopPropagation()} // Palet içindeki tıklamaların kutuyu kapatmasını engeller
                  >
                    {/* Yana Kaydırmalı Grid Renk Sistemi */}
                    <div className="grid grid-rows-3 grid-flow-col gap-2 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pb-1 px-0.5">
                      {renkSecenekleri.map(renkObj => (
                        <div 
                          key={renkObj.bg} 
                          onClick={() => renkDegistir(item.id, renkObj.text)}
                          className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 snap-center rounded-full cursor-pointer border hover:scale-125 transition-transform flex items-center justify-center shadow-md ${renkObj.bg} ${
                            item.renk === renkObj.text ? "ring-2 ring-offset-1 ring-offset-slate-900 ring-white scale-110" : ""
                          }`}
                        ></div>
                      ))}
                    </div>
                    {/* Kaydırma Efekti Gölgesi */}
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none rounded-r-xl"></div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}