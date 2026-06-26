"use client";
import React, { useState, useRef } from "react";
import { Star, Server, Truck, Headset, Search, MapPin, Palette, CheckCircle2 } from "lucide-react";

export default function SurukleVeRenkTesti() {
  // 🎨 1. RENK SEÇENEKLERİ (Genişletilmiş 15 Renk)
  const renkSecenekleri = [
    { text: "text-white", bg: "bg-white border-slate-300" },
    { text: "text-slate-500", bg: "bg-slate-500 border-slate-400" },
    { text: "text-red-500", bg: "bg-red-500 border-red-500" },
    { text: "text-orange-500", bg: "bg-orange-500 border-orange-500" },
    { text: "text-amber-400", bg: "bg-amber-400 border-amber-400" },
    { text: "text-yellow-400", bg: "bg-yellow-400 border-yellow-400" },
    { text: "text-lime-400", bg: "bg-lime-400 border-lime-400" },
    { text: "text-emerald-400", bg: "bg-emerald-400 border-emerald-400" },
    { text: "text-cyan-400", bg: "bg-cyan-400 border-cyan-400" },
    { text: "text-blue-500", bg: "bg-blue-500 border-blue-500" },
    { text: "text-indigo-400", bg: "bg-indigo-400 border-indigo-400" },
    { text: "text-violet-500", bg: "bg-violet-500 border-violet-500" },
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
  const [seciliKutuId, setSeciliKutuId] = useState<string | null>(null); // Hangi kutuyu boyayacağımızı tutar
  
  const suruklenenOgeRef = useRef<number | null>(null);

  // 🚀 3. SÜRÜKLE BIRAK MOTORU
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

  // 🎨 4. SEÇİLİ KUTUYU BOYAMA MOTORU
  const renkUygula = (yeniRenk: string) => {
    if (!seciliKutuId) return; // Eğer kutu seçilmemişse hiçbir şey yapma
    
    setMenuListesi(eskiListe => 
      eskiListe.map(kutu => kutu.id === seciliKutuId ? { ...kutu, renk: yeniRenk } : kutu)
    );
  };

  // Düzenleme modunu aç/kapat
  const handleDuzenlemeModuGecis = () => {
    setDuzenlemeModu(!duzenlemeModu);
    setSeciliKutuId(null); // Mod kapanırken seçimi temizle
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-10 flex flex-col items-center pt-10 sm:pt-20">
      
      <div className="w-full max-w-3xl">
        
        {/* Üst Kısım ve Düzenle Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-4 gap-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest text-center sm:text-left">
              HESAP YÖNETİMİ (SABİT PALET TESTİ)
            </h2>
            
            <button 
              onClick={handleDuzenlemeModuGecis}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-widest w-full sm:w-auto ${
                duzenlemeModu 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Palette className="w-4 h-4" />
              {duzenlemeModu ? "KAYDET BİTİR" : "MENÜYÜ DÜZENLE"}
            </button>
        </div>

        {/* 🎨 SABİT GENİŞ RENK PALETİ (Sadece Düzenleme Modunda Açılır) */}
        {duzenlemeModu && (
          <div className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div className="text-center mb-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                🎨 Önce bir kutu seçin, ardından renk verin
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {renkSecenekleri.map((renkObj, i) => (
                <button 
                  key={i} 
                  onClick={() => renkUygula(renkObj.text)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center shadow-lg border-2 ${renkObj.bg} ${!seciliKutuId ? "opacity-50 grayscale" : "opacity-100"}`}
                  title="Renk seç"
                  disabled={!seciliKutuId} // Kutu seçilmediyse butonlar soluk durur ve basılmaz
                ></button>
              ))}
            </div>
          </div>
        )}

        {/* Kutuların Dizildiği Alan */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 w-full">
          {menuListesi.map((item, index) => {
            const IkonBileseni = item.ikon;
            const isSecili = seciliKutuId === item.id;
            
            return (
              <div
                key={item.id}
                draggable={duzenlemeModu} // Düzenleme modundayken her zaman sürüklenebilir
                onDragStart={() => (suruklenenOgeRef.current = index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => (suruklenenOgeRef.current = null)}
                
                // Düzenleme modundaysa kutuya tıklayarak onu seçili hale getir
                onClick={() => {
                  if (duzenlemeModu) setSeciliKutuId(item.id);
                }}
                
                className={`flex flex-col items-center gap-2 group transition-all duration-300 ${
                  duzenlemeModu ? "cursor-move" : "cursor-pointer"
                }`}
              >
                
                {/* Ana Kutu */}
                <div className={`relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    duzenlemeModu && isSecili
                    ? "bg-slate-800 border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,255,0.4)] scale-110" // Seçiliyse Parlar ve Büyür
                    : duzenlemeModu && !isSecili
                    ? "bg-[#0f172a] border-2 border-dashed border-slate-600 opacity-70 hover:opacity-100" // Düzenleme modunda seçili değilse kesik çizgili durur
                    : "bg-[#0f172a] border border-slate-800 shadow-lg group-hover:bg-white/[0.05]" // Normal Görünüm
                }`}>
                  <IkonBileseni className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-300 ${item.renk}`} />
                  
                  {/* Seçili Kutuya Yeşil Tik Eklendi */}
                  {duzenlemeModu && isSecili && (
                    <div className="absolute -top-2 -right-2 bg-[#020617] rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                  )}
                </div>
                
                {/* İsim */}
                <span className={`text-[11px] sm:text-xs font-bold transition-colors tracking-wide ${duzenlemeModu && isSecili ? "text-cyan-400" : "text-slate-300"}`}>
                  {item.isim}
                </span>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}