"use client";

import React, { useState, useRef } from "react";
import { 
  Menu, X, ChevronRight, Cpu, Mouse, Keyboard, 
  Monitor, Headphones, Speaker, Palette, CheckCircle2
} from "lucide-react";

export default function KategoriTestSayfasi() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [seciliKategoriId, setSeciliKategoriId] = useState<number | null>(null);
  
  // Sürükle-bırak işlemi için hafıza referansı
  const suruklenenRef = useRef<number | null>(null);

  const renkSecenekleri = [
    { border: "border-cyan-500/50", hoverBorder: "hover:border-cyan-400", ikon: "text-cyan-400", hex: "bg-cyan-400" },
    { border: "border-emerald-500/50", hoverBorder: "hover:border-emerald-400", ikon: "text-emerald-400", hex: "bg-emerald-400" },
    { border: "border-purple-500/50", hoverBorder: "hover:border-purple-400", ikon: "text-purple-400", hex: "bg-purple-400" },
    { border: "border-rose-500/50", hoverBorder: "hover:border-rose-400", ikon: "text-rose-400", hex: "bg-rose-400" },
    { border: "border-amber-500/50", hoverBorder: "hover:border-amber-400", ikon: "text-amber-400", hex: "bg-amber-400" },
    { border: "border-slate-500/50", hoverBorder: "hover:border-slate-400", ikon: "text-slate-400", hex: "bg-slate-400" },
  ];

  // Kategoriler artık dinamik bir State içinde (Sıralama ve Renk tutar)
  const [kategoriler, setKategoriler] = useState([
    { id: 1, isim: "PC Bileşenleri", ikon: Cpu, renk: renkSecenekleri[0] },
    { id: 2, isim: "Oyuncu Fareleri", ikon: Mouse, renk: renkSecenekleri[1] },
    { id: 3, isim: "Mekanik Klavyeler", ikon: Keyboard, renk: renkSecenekleri[2] },
    { id: 4, isim: "Oyuncu Monitörleri", ikon: Monitor, renk: renkSecenekleri[0] },
    { id: 5, isim: "Kulaklık & Ses", ikon: Headphones, renk: renkSecenekleri[4] },
    { id: 6, isim: "Aksesuar & Diğer", ikon: Speaker, renk: renkSecenekleri[5] },
  ]);

  // Sürükleme Motoru (Yukarı/Aşağı yer değiştirme)
  const handleDragEnter = (hedefIndex: number) => {
    const suruklenenIndex = suruklenenRef.current;
    if (suruklenenIndex === null || suruklenenIndex === hedefIndex) return;

    setKategoriler((eskiListe) => {
      const yeniListe = [...eskiListe];
      const suruklenenOge = yeniListe.splice(suruklenenIndex, 1)[0];
      yeniListe.splice(hedefIndex, 0, suruklenenOge);
      return yeniListe;
    });
    
    suruklenenRef.current = hedefIndex;
  };

  // Paletten renk seçildiğinde çalışır
  const renkUygula = (secilenRenk: any) => {
    if (seciliKategoriId !== null) {
      setKategoriler(eski => 
        eski.map(k => k.id === seciliKategoriId ? { ...k, renk: secilenRenk } : k)
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Arka Plan Dekorasyonu */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center z-10">
        <h1 className="text-2xl font-black mb-6 text-slate-300 tracking-wider uppercase">
          Kategori Menüsü Test Alanı
        </h1>
        
        {/* HAMBURGER BUTONU */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-3 bg-[#0f172a] border border-slate-700 hover:border-cyan-500/50 px-6 py-4 rounded-2xl shadow-lg transition-all group"
        >
          <Menu className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="font-bold text-slate-300 group-hover:text-white transition-colors">Kategoriler</span>
        </button>
      </div>

      {/* YANDAN AÇILAN SİBER MENÜ */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* SAĞA DOĞRU KAYARAK AÇILAN PANEL (Left-0 ve Translate-X) */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-md bg-[#0b1121] border-r border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[100] transform transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 shrink-0">
          <h2 className="text-lg font-black text-white uppercase tracking-widest">Alışveriş Yap</h2>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsPaletteOpen(!isPaletteOpen);
                if(isPaletteOpen) setSeciliKategoriId(null);
              }}
              title={isPaletteOpen ? "Düzenlemeyi Kapat" : "Kategorileri Düzenle"}
              className={`p-2 rounded-xl transition-all ${isPaletteOpen ? 'bg-emerald-900 border border-emerald-500/50' : 'hover:bg-slate-800/50 border border-transparent'}`}
            >
              <Palette className={`w-5 h-5 ${isPaletteOpen ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`} />
            </button>

            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RENK PALETİ */}
        {isPaletteOpen && (
          <div className="p-4 border-b border-slate-800/50 bg-slate-900/30 flex flex-col items-center gap-3 shrink-0 animate-in slide-in-from-top-2">
            {!seciliKategoriId ? (
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-900">
                Aşağıdan boyamak istediğiniz bir kategori seçin
              </span>
            ) : (
               <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                Şimdi paletten bir renk seçin
              </span>
            )}
            
            <div className="flex justify-center gap-3 w-full">
              {renkSecenekleri.map((renk, idx) => (
                <button 
                  key={idx}
                  onClick={() => renkUygula(renk)}
                  disabled={!seciliKategoriId}
                  className={`w-8 h-8 rounded-full shadow-lg transition-transform flex items-center justify-center ${renk.hex} ${!seciliKategoriId ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:scale-110 opacity-100 cursor-pointer'}`}
                ></button>
              ))}
            </div>
          </div>
        )}

        {/* SÜRÜKLENEBİLİR DİKDÖRTGEN KATEGORİ LİSTESİ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {kategoriler.map((kategori, index) => {
            const Ikon = kategori.ikon;
            const isSecili = seciliKategoriId === kategori.id;
            const duzenlemeModu = isPaletteOpen;

            return (
              <div 
                key={kategori.id}
                draggable={duzenlemeModu}
                onDragStart={() => (suruklenenRef.current = index)}
                onDragEnter={() => duzenlemeModu && handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => (suruklenenRef.current = null)}
                onClick={() => duzenlemeModu && setSeciliKategoriId(isSecili ? null : kategori.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 select-none
                  ${duzenlemeModu ? 'cursor-grab active:cursor-grabbing hover:bg-white/[0.02]' : 'cursor-pointer hover:bg-white/[0.05]'} 
                  ${kategori.renk.border} 
                  ${!duzenlemeModu ? kategori.renk.hoverBorder : ''} 
                  ${isSecili ? 'bg-slate-800 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02] z-10 relative' : 'bg-[#0f172a]'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-[#020617] border border-slate-800 shadow-inner transition-transform duration-300 ${!duzenlemeModu ? 'group-hover:scale-110' : ''}`}>
                    <Ikon className={`w-5 h-5 ${kategori.renk.ikon}`} />
                  </div>
                  
                  <span className={`font-bold transition-colors text-sm sm:text-base tracking-wide ${isSecili ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {kategori.isim}
                  </span>
                </div>
                
                {duzenlemeModu && isSecili ? (
                   <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                   <ChevronRight className="w-5 h-5 text-slate-600 transition-colors" />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-slate-800/80 shrink-0 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            Bİlgİn PC Market • 2026
          </p>
        </div>

      </div>
    </div>
  );
}