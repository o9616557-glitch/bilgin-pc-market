"use client";
import React, { useState, useEffect, useRef } from "react";
import { Star, Server, Truck, Headset, Search, MapPin, LucideProps } from "lucide-react";
import Link from "next/link";

export default function SuruklenebilirHesapYonetimi() {
  const kullaniciId = "test_kullanici_123"; // Test için uydurma bir ID
  
  // 1. ADIM: MENÜ VERİ YAPISI
  // ... kodun kalanı aynı şekilde devam ediyor ...
  const varsayilanMenu = [
    { id: "favoriler", isim: "Favoriler", ikon: Star, renk: "text-purple-400", link: "https://www.bilginpcmarket.com/favorilerim" },
    { id: "sistemler", isim: "Sistemler", ikon: Server, renk: "text-emerald-400", link: "/sistemlerim" },
    { id: "kargolar", isim: "Kargolar", ikon: Truck, renk: "text-rose-400", link: "/kargolarim", bildirim: true },
    { id: "destek", isim: "Destek", ikon: Headset, renk: "text-orange-400", link: "/destek-taleplerim", bildirim: false },
    { id: "sorgula", isim: "Sorgula", ikon: Search, renk: "text-blue-400", link: "/siparis-takip" },
  ];

  const [menuListesi, setMenuListesi] = useState(varsayilanMenu);
  
  // Sürüklenen öğenin hafızada tutulması
  const suruklenenOgeRef = useRef<number | null>(null);
  const uzerineGelenOgeRef = useRef<number | null>(null);

  // 2. ADIM: VERİTABANINDAN SIRA ÇEKME (Simülasyon)
  useEffect(() => {
    if (kullaniciId) {
      // ÖRNEK: Kendi API'ne istek atacağın yer
      /*
      fetch(`/api/menu-sirasi?kullaniciId=${kullaniciId}`)
        .then(res => res.json())
        .then(data => {
          if(data && data.yeniSira) {
            setMenuListesi(data.yeniSira);
          }
        });
      */
    }
  }, [kullaniciId]);

  // 3. ADIM: VERİTABANINA KAYDETME FONKSİYONU
  const veritabaninaKaydet = (yeniSira: ({ id: string; isim: string; ikon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; renk: string; link: string; bildirim?: undefined; } | { id: string; isim: string; ikon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; renk: string; link: string; bildirim: boolean; })[]) => {
    console.log("Veritabanına kaydedilen yeni sıra:", yeniSira);
    // ÖRNEK POST İSTEĞİ:
    /*
    fetch('/api/menu-sirasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kullaniciId: kullaniciId, menuSirasi: yeniSira })
    });
    */
  };

  // 4. ADIM: SÜRÜKLE BIRAK MOTORU
  const handleSort = () => {
    // Sürüklenen ve bırakılan yerin indekslerini al
    const suruklenenIndex = suruklenenOgeRef.current;
    const birakilanIndex = uzerineGelenOgeRef.current;
    
    if (suruklenenIndex !== null && birakilanIndex !== null) {
      // Listeyi kopyala ve sırayı değiştir
      let yeniListe = [...menuListesi];
      const suruklenenEleman = yeniListe.splice(suruklenenIndex, 1)[0];
      yeniListe.splice(birakilanIndex, 0, suruklenenEleman);
      
      // Ekranı güncelle
      setMenuListesi(yeniListe);
      
      // Veritabanına yeni sırayı gönder
      veritabaninaKaydet(yeniListe);
    }
    
    // Referansları temizle
    suruklenenOgeRef.current = null;
    uzerineGelenOgeRef.current = null;
  };

  // 5. ADIM: EKRANA ÇİZDİRME (Dinamik Render)
  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mt-1 sm:mt-2 ml-1 sm:ml-2">
        HESAP YÖNETİMİ
      </h2>

      <div className="flex lg:hidden w-full mb-6 mt-2">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full px-1">
          
          {menuListesi.map((item, index) => {
            const IkonBileseni = item.ikon;
            
            return (
              <div
                key={item.id}
                draggable // Öğeyi sürüklenebilir yapar
                onDragStart={() => (suruklenenOgeRef.current = index)}
                onDragEnter={() => (uzerineGelenOgeRef.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()} // Bırakmaya izin ver
                className="flex flex-col items-center gap-1.5 group cursor-move"
                title="Yerini değiştirmek için sürükleyin"
              >
                <div className="relative w-full aspect-square max-w-[64px] rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-center shadow-lg group-hover:bg-white/[0.05] transition-all hover:scale-105 active:scale-95">
                  
                  {/* Bildirim Noktası Mantığı */}
                  {item.bildirim && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5 z-10">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-rose-500 border-2 border-[#0f172a]"></span>
                    </span>
                  )}
                  
                  <IkonBileseni className={`w-6 h-6 sm:w-7 sm:h-7 ${item.renk}`} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-300">
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