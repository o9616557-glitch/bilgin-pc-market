"use client";
import React, { useState, useRef } from "react";
import { Star, Server, Truck, Headset, Search, MapPin, Palette } from "lucide-react";

export default function SurukleVeRenkTesti() {
  // 1. RENK PALETİ (Tıklayınca ikonların rengini değiştirecek motor)
  const renkSecenekleri = [
    { text: "text-cyan-400", bg: "bg-cyan-400" },
    { text: "text-rose-400", bg: "bg-rose-400" },
    { text: "text-emerald-400", bg: "bg-emerald-400" },
    { text: "text-purple-400", bg: "bg-purple-400" },
    { text: "text-orange-400", bg: "bg-orange-400" },
    { text: "text-blue-400", bg: "bg-blue-400" },
    { text: "text-amber-400", bg: "bg-amber-400" }
  ];

  // 2. VARSAYILAN KUTU LİSTESİ
  const varsayilanMenu = [
    { id: "favoriler", isim: "Favoriler", ikon: Star, renk: "text-purple-400" },
    { id: "sistemler", isim: "Sistemler", ikon: Server, renk: "text-emerald-400" },
    { id: "kargolar", isim: "Kargolar", ikon: Truck, renk: "text-rose-400" },
    { id: "destek", isim: "Destek", ikon: Headset, renk: "text-orange-400" },
    { id: "sorgula", isim: "Sorgula", ikon: Search, renk: "text-blue-400" },
    { id: "adresler", isim: "Adresler", ikon: MapPin, renk: "text-cyan-400" },
  ];

  const [menuListesi, setMenuListesi] = useState(varsayilanMenu);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false); // Düzenleme butonunu kontrol eder
  
  // Sürüklenen öğenin hafızası
  const suruklenenOgeRef = useRef<number | null>(null);

  // 🚀 3. SIVI (FLUID) KAYMA MOTORU: Kutu diğerinin üzerine geldiği an onu ittirir!
  const handleDragEnter = (hedefIndex: number) => {
    const suruklenenIndex = suruklenenOgeRef.current;
    
    // Eğer aynı kutunun üzerindeysen veya henüz sürüklemiyorsan bir şey yapma
    if (suruklenenIndex === null || suruklenenIndex === hedefIndex) return;

    // Listeyi canlı olarak anında değiştir (Kaçma efekti buradan gelir)
    setMenuListesi((eskiListe) => {
      const yeniListe = [...eskiListe];
      // Sürüklenen öğeyi kopart
      const suruklenenOge = yeniListe.splice(suruklenenIndex, 1)[0];
      // Hedeflenen araya sokuştur
      yeniListe.splice(hedefIndex, 0, suruklenenOge);
      return yeniListe;
    });

    // Hafızadaki sırayı da hemen güncelle ki titreme yapmasın
    suruklenenOgeRef.current = hedefIndex;
  };

  // 🎨 4. RENK DEĞİŞTİRME MOTORU
  const renkDegistir = (id: string, yeniRenk: string) => {
    setMenuListesi(eskiListe => 
      eskiListe.map(kutu => kutu.id === id ? { ...kutu, renk: yeniRenk } : kutu)
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10 flex flex-col items-center pt-20">
      
      <div className="w-full max-w-3xl">
        
        {/* Üst Kısım ve Düzenle Butonu */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">
              HESAP YÖNETİMİ (KİŞİSELLEŞTİRME TESTİ)
            </h2>
            
            <button 
              onClick={() => setDuzenlemeModu(!duzenlemeModu)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all uppercase tracking-widest ${
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
        <div className="flex flex-wrap gap-4 sm:gap-6 w-full">
          {menuListesi.map((item, index) => {
            const IkonBileseni = item.ikon;
            
            return (
              <div
                key={item.id}
                // Sadece Düzenleme Modundaysa sürüklemeye izin ver
                draggable={duzenlemeModu} 
                onDragStart={() => (suruklenenOgeRef.current = index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => (suruklenenOgeRef.current = null)}
                className={`flex flex-col items-center gap-2 group w-[80px] sm:w-[100px] transition-transform duration-200 ${
                  duzenlemeModu ? "cursor-move hover:scale-105" : "cursor-pointer"
                }`}
              >
                
                {/* Ana Kutu */}
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0f172a] flex items-center justify-center transition-all duration-300 ${
                    duzenlemeModu 
                    ? "border-2 border-dashed border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse" 
                    : "border border-slate-800 shadow-lg group-hover:bg-white/[0.05]"
                }`}>
                  <IkonBileseni className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300 ${item.renk}`} />
                </div>
                
                {/* İsim */}
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 transition-colors">
                  {item.isim}
                </span>

                {/* 🎨 RENK PALETİ (Sadece Düzenleme Modunda Açılır) */}
                {duzenlemeModu && (
                  <div className="flex gap-1.5 mt-2 bg-slate-900/80 p-2 rounded-xl border border-slate-700 shadow-xl">
                    {renkSecenekleri.map(renkObj => (
                      <div 
                        key={renkObj.bg} 
                        onClick={() => renkDegistir(item.id, renkObj.text)}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full cursor-pointer hover:scale-125 transition-transform ${renkObj.bg} ${
                          item.renk === renkObj.text ? "ring-2 ring-white scale-110" : ""
                        }`}
                      ></div>
                    ))}
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