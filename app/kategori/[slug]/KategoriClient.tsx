"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, PackageX, Star, Filter, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/CartContext";

function BanknoteIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="0"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}

const bilinenMarkalar = ["ASUS", "MSI", "GIGABYTE", "SAPPHIRE", "PALIT", "ZOTAC", "GALAX", "PNY", "INNO3D", "EVGA", "XFX", "POWERCOLOR", "ASROCK", "INTEL", "AMD", "CORSAIR", "LOGITECH", "RAZER", "STEELSERIES", "KINGSTON", "GSKILL", "CRUCIAL", "SAMSUNG", "WD"];

const getMarka = (urun: any) => {
  if (urun.marka && urun.marka !== "Diğer") return urun.marka.toUpperCase();
  const isim = (urun.isim || urun.name || "").toUpperCase();
  for (const m of bilinenMarkalar) {
    if (isim.includes(m)) return m;
  }
  return "Diğer";
};

// 🚀 SADECE İSİMDEN KELİME AVLAYAN YARDIMCI MOTORLAR 🚀
const getAramaMetni = (urun: any) => ((urun.isim || "") + " " + (urun.name || "")).toUpperCase().replace(/\s+/g, "");

const getGpu = (urun: any) => {
  const t = getAramaMetni(urun);
  if (t.includes("NVIDIA") || t.includes("RTX") || t.includes("GTX") || t.includes("GEFORCE")) return "NVIDIA";
  if (t.includes("AMD") || t.includes("RADEON") || t.includes("RX")) return "AMD";
  if (t.includes("INTEL") || t.includes("ARC")) return "Intel";
  return null;
};

const getSeri = (urun: any) => {
  const t = getAramaMetni(urun);
  if (t.includes("RTX50")) return "RTX 5000 Serisi";
  if (t.includes("RTX40")) return "RTX 4000 Serisi";
  if (t.includes("RTX30")) return "RTX 3000 Serisi";
  if (t.includes("RTX20") || t.includes("GTX16") || t.includes("GTX10")) return "Eski Nesil (RTX 20 / GTX 16)";
  if (t.includes("RX7")) return "RX 7000 Serisi";
  if (t.includes("RX6")) return "RX 6000 Serisi";
  if (t.includes("RX5")) return "RX 5000 Serisi";
  return null;
};

const getVram = (urun: any) => {
  const t = getAramaMetni(urun);
  const vramKapasiteleri = ["24GB", "20GB", "16GB", "12GB", "10GB", "8GB", "6GB", "4GB", "2GB"];
  for (const vram of vramKapasiteleri) {
    if (t.includes(vram)) return vram.replace("GB", " GB"); 
  }
  return null;
};

const getIslemciSeri = (urun: any) => {
  const t = getAramaMetni(urun);
  if (t.includes("RYZEN9")) return "Ryzen 9";
  if (t.includes("RYZEN7")) return "Ryzen 7";
  if (t.includes("RYZEN5")) return "Ryzen 5";
  if (t.includes("RYZEN3")) return "Ryzen 3";
  if (t.includes("COREI9") || t.includes("I9-")) return "Core i9";
  if (t.includes("COREI7") || t.includes("I7-")) return "Core i7";
  if (t.includes("COREI5") || t.includes("I5-")) return "Core i5";
  if (t.includes("COREI3") || t.includes("I3-")) return "Core i3";
  return null;
};

const getSoket = (urun: any) => {
  const t = getAramaMetni(urun);
  if (t.includes("AM5")) return "AM5";
  if (t.includes("AM4")) return "AM4";
  if (t.includes("1700") || t.includes("LGA1700")) return "LGA 1700";
  if (t.includes("1200") || t.includes("LGA1200")) return "LGA 1200";
  if (t.includes("1151") || t.includes("LGA1151")) return "LGA 1151";
  return null;
};

const getCipset = (urun: any) => {
  const t = (urun.isim || urun.name || "").toUpperCase(); 
  const match = t.match(/(A520|B550|X570|A620|B650E|B650|X670E|X670|X870E|X870|H410|H510|H610|B460|B560|B660|B760|Z490|Z590|Z690|Z790|Z890)/);
  if (match) return match[1];
  return null;
};

const getDdr = (urun: any) => {
  const t = getAramaMetni(urun);
  if (t.includes("DDR5")) return "DDR5";
  if (t.includes("DDR4")) return "DDR4";
  return null;
};

export default function KategoriClient({ urunler, sayfaBasligi }: { urunler: any[], sayfaBasligi: string }) {
  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  // 🚀 KATEGORİ TESPİTİ
  const b = sayfaBasligi.toUpperCase();
  const isEkranKarti = b.includes("EKRAN") || b.includes("VGA") || b.includes("GPU");
  const isIslemci = b.includes("İŞLEMCİ") || b.includes("ISLEMCI") || b.includes("CPU");
  const isAnakart = b.includes("ANAKART") || b.includes("MOTHERBOARD");

  // 🔥 BULDOZER PARSER (Veritabanındaki teknik özellikleri söküp alır!)
  const getUrunOzellikleri = (urun: any) => {
    let dbObj: Record<string, string> = {};
    const rawDb = urun.teknik_ozellikler || urun.teknik_ozeller || urun.ozellikler || urun.attributes;
    
    // Veritabanındaki veri Array(Liste) mi, String mi, Normal Obje mi tespit edip çeviriyoruz
    if (rawDb) {
      try {
        let parsed = rawDb;
        if (typeof rawDb === 'string') {
          parsed = JSON.parse(rawDb);
        }
        
        if (Array.isArray(parsed)) {
          // Admin paneli [{baslik: "VRAM", deger: "12GB"}] gibi liste kaydediyorsa
          parsed.forEach((item: any) => {
            const key = item.name || item.key || item.baslik || item.ozellik || item.title;
            const val = item.value || item.val || item.deger || item.text;
            if (key && val) dbObj[key] = String(val).trim();
          });
        } else if (typeof parsed === 'object' && parsed !== null) {
          // Admin paneli {"VRAM": "12GB"} gibi standart obje kaydediyorsa
          Object.entries(parsed).forEach(([k, v]) => {
            if (v && typeof v !== 'object') dbObj[k] = String(v).trim();
          });
        }
      } catch (e) {
        // String JSON hatası olursa sessizce geç
      }
    }

    let sanalOzellikler: Record<string, string> = {};

    // İsimden avlanan özellikler (Eğer veritabanında yoksa devreye girer)
    if (isEkranKarti) {
      const gpu = getGpu(urun); if (gpu) sanalOzellikler["Grafik İşlemci"] = gpu;
      const seri = getSeri(urun); if (seri) sanalOzellikler["GPU Serisi"] = seri;
      const vram = getVram(urun); if (vram) sanalOzellikler["Bellek (VRAM)"] = vram;
    }
    if (isIslemci) {
      const iseri = getIslemciSeri(urun); if (iseri) sanalOzellikler["İşlemci Serisi"] = iseri;
      const soket = getSoket(urun); if (soket) sanalOzellikler["Soket Tipi"] = soket;
    }
    if (isAnakart) {
      const cipset = getCipset(urun); if (cipset) sanalOzellikler["Çipset"] = cipset;
      const soket = getSoket(urun); if (soket) sanalOzellikler["Soket Tipi"] = soket;
      const ddr = getDdr(urun); if (ddr) sanalOzellikler["Bellek Desteği"] = ddr;
    }

    // 🔥 VERİTABANI ÖNCELİKLİDİR: Önce sanal olanları, sonra db'dekileri birleştiriyoruz.
    // (Aynı başlık gelirse db'deki ezsin geçer!)
    return { ...sanalOzellikler, ...dbObj };
  };

  // 🚀 SABİT FİLTRE HAFIZALARI
  const [seciliMarkalar, setSeciliMarkalar] = useState<string[]>([]);
  const [sadeceStokta, setSadeceStokta] = useState(false);
  const [minFiyat, setMinFiyat] = useState<string>("");
  const [maxFiyat, setMaxFiyat] = useState<string>("");
  
  // 🚀 DİNAMİK FİLTRE HAFIZASI
  const [seciliDinamik, setSeciliDinamik] = useState<Record<string, string[]>>({});

  const [mobilFiltreAcik, setMobilFiltreAcik] = useState(false);

  const markalar = useMemo(() => Array.from(new Set(urunler.map(u => getMarka(u)))).filter(Boolean).sort(), [urunler]);

  // 🔥 FİLTRE BAŞLIKLARINI OLUŞTURAN MOTOR
  const dinamikFiltreListesi = useMemo(() => {
    const filtreHaritasi: Record<string, Set<string>> = {};

    urunler.forEach(urun => {
      const birlesikOzellikler = getUrunOzellikleri(urun);
      
      Object.entries(birlesikOzellikler).forEach(([baslik, deger]) => {
        if (!deger) return;
        const metinDeger = String(deger).trim();
        // Uzun metinleri ve açıklamaları filtre menüsünde göstermeyelim (Max 35 Karakter)
        if (metinDeger === "" || metinDeger.length > 35) return; 

        if (!filtreHaritasi[baslik]) filtreHaritasi[baslik] = new Set();
        filtreHaritasi[baslik].add(metinDeger);
      });
    });

    const sonuc: Record<string, string[]> = {};
    Object.keys(filtreHaritasi).forEach(baslik => {
      if (filtreHaritasi[baslik].size > 1) { 
        sonuc[baslik] = Array.from(filtreHaritasi[baslik]).sort();
      }
    });

    return sonuc;
  }, [urunler]);

  // 🧠 ÇAPRAZ BAĞLANTI (DEPENDENT FACET) MOTORU 
  const urunGecerliMi = (urun: any, haricTutulacakBaslik: string | null = null) => {
    if (haricTutulacakBaslik !== "Marka" && seciliMarkalar.length > 0 && !seciliMarkalar.includes(getMarka(urun))) return false;
    
    const tukendiMi = urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0";
    if (sadeceStokta && tukendiMi) return false;
    const fiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
    if (minFiyat && fiyat < Number(minFiyat)) return false;
    if (maxFiyat && fiyat > Number(maxFiyat)) return false;

    const birlesikOzellikler = getUrunOzellikleri(urun);
    for (const [baslik, secilenler] of Object.entries(seciliDinamik)) {
      if (baslik === haricTutulacakBaslik || secilenler.length === 0) continue; 
      const urununBuOzelligi = String(birlesikOzellikler[baslik] || "").trim();
      if (!secilenler.includes(urununBuOzelligi)) return false;
    }
    return true;
  };

  const filtrelenmisUrunler = useMemo(() => {
    return urunler.filter(u => urunGecerliMi(u, null));
  }, [urunler, seciliMarkalar, sadeceStokta, minFiyat, maxFiyat, seciliDinamik]);

  const dinamikSecenekGecerliMi = (baslik: string, deger: string) => {
    if ((seciliDinamik[baslik] || []).includes(deger)) return true;
    return urunler.some(u => {
      if (!urunGecerliMi(u, baslik)) return false;
      const birlesikOzellikler = getUrunOzellikleri(u);
      return String(birlesikOzellikler[baslik] || "").trim() === deger;
    });
  };

  const markaGecerliMi = (marka: string) => {
    if (seciliMarkalar.includes(marka)) return true;
    return urunler.some(u => {
      if (!urunGecerliMi(u, "Marka")) return false;
      return getMarka(u) === marka;
    });
  };

  const toggleDinamik = (baslik: string, deger: string) => {
    setSeciliDinamik(onceki => {
      const mevcutlar = onceki[baslik] || [];
      if (mevcutlar.includes(deger)) {
        return { ...onceki, [baslik]: mevcutlar.filter(v => v !== deger) };
      } else {
        return { ...onceki, [baslik]: [...mevcutlar, deger] };
      }
    });
  };

  const filtreleriTemizle = () => {
    setSeciliMarkalar([]); setSadeceStokta(false); setMinFiyat(""); setMaxFiyat("");
    setSeciliDinamik({}); 
  };

  const handleSepeteEkle = (urun: any) => {
    const targetId = urun._id || urun.id;
    sepeteEkle({
      id: targetId, isim: urun.isim || urun.title || urun.name, fiyat: urun.indirimliFiyat || urun.price || urun.fiyat,
      resim: (urun.resimler && urun.resimler[0]) || urun.resim || urun.image || "/placeholder.jpg", adet: 1, varyasyon: "Standart" 
    });
    setSepeteEklenenler(prev => [...prev, targetId]);
    setTimeout(() => { setSepeteEklenenler(prev => prev.filter(id => id !== targetId)); }, 2000);
  };

  const gecerliMarkalar = markalar.filter(m => markaGecerliMi(m));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8 px-4 sm:px-0">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#00d2ff] transition-all mb-3">
            <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
          </Link>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.2)]">
              {sayfaBasligi}
            </span> MODELLERİ
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setMobilFiltreAcik(true)}
            className="lg:hidden flex items-center justify-center gap-2 bg-[#00d2ff]/10 text-[#00d2ff] px-4 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider border border-[#00d2ff]/30"
          >
            <Filter className="w-4 h-4" /> Filtrele
          </button>
          <div className="flex items-center justify-start gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-none text-xs font-bold tracking-widest text-gray-400 uppercase">
            <div className="w-2 h-2 rounded-none bg-[#10b981] animate-ping"></div>
            Sonuç: {filtrelenmisUrunler.length}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-0 relative items-start">
        
    {/* 🛠️ SOL FİLTRE MENÜSÜ (Header'ın altına giren Buzlu Cam Versiyon) */}
        <aside className={`fixed top-[81px] bottom-0 left-0 right-0 z-[40] lg:sticky lg:top-24 lg:w-[260px] xl:w-[280px] lg:max-h-[calc(100vh-100px)] lg:shrink-0 transition-transform duration-300 flex flex-col ${mobilFiltreAcik ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="absolute inset-0 bg-[#050814]/70 backdrop-blur-md lg:hidden" onClick={() => setMobilFiltreAcik(false)}></div>
          
          <div className="relative w-4/5 max-w-sm h-full bg-[#09090b] border-r border-white/10 lg:w-full lg:bg-[#09090b] lg:border lg:border-white/5 lg:rounded-2xl lg:shadow-xl flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 bg-[#09090b] z-10">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2 text-sm"><Filter className="w-4 h-4 text-[#00d2ff]" /> Filtreler</h3>
              <div className="flex items-center gap-3">
                <button onClick={filtreleriTemizle} className="text-[#00d2ff] text-xs font-bold hover:underline">Temizle</button>
                <button onClick={() => setMobilFiltreAcik(false)} className="lg:hidden text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              
              <div className="mb-5 pb-5 border-b border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group mb-5">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={sadeceStokta} onChange={(e) => setSadeceStokta(e.target.checked)} />
                    <div className={`block w-9 h-5 rounded-full transition-colors ${sadeceStokta ? 'bg-[#10b981]' : 'bg-white/10'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${sadeceStokta ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Sadece Stoktakiler</span>
                </label>

                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Fiyat Aralığı (TL)</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={minFiyat} onChange={(e) => setMinFiyat(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#00d2ff] outline-none" />
                  <span className="text-gray-500">-</span>
                  <input type="number" placeholder="Max" value={maxFiyat} onChange={(e) => setMaxFiyat(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#00d2ff] outline-none" />
                </div>
              </div>

              {gecerliMarkalar.length > 0 && (
                <div className="mb-5 pb-5 border-b border-white/5">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Markalar</h4>
                  <div className="space-y-2.5 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                    {gecerliMarkalar.map((marka: any) => (
                      <label key={marka} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSeciliMarkalar(prev => prev.includes(marka) ? prev.filter(m => m !== marka) : [...prev, marka])}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${seciliMarkalar.includes(marka) ? 'bg-[#00d2ff] border-[#00d2ff]' : 'bg-[#121212] border-white/20 group-hover:border-[#00d2ff]/50'}`}>
                          {seciliMarkalar.includes(marka) && <CheckIcon />}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${seciliMarkalar.includes(marka) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{marka}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 🎯 TAMAMEN ALAKALI ÖZELLİKLERİ GÖSTEREN MOTOR */}
              {Object.entries(dinamikFiltreListesi).map(([baslik, degerler]) => {
                const gecerliDegerler = degerler.filter(d => dinamikSecenekGecerliMi(baslik, d));
                
                if (gecerliDegerler.length === 0) return null;

                return (
                  <div key={baslik} className="mb-5 pb-5 border-b border-white/5 last:border-0 last:pb-0 last:mb-0 animate-in fade-in duration-300">
                    <h4 className="text-[10px] font-black text-[#00d2ff] uppercase tracking-widest mb-3">{baslik}</h4>
                    
                    {gecerliDegerler.every(d => d.length <= 12) ? (
                      <div className="flex flex-wrap gap-1.5">
                        {gecerliDegerler.map(deger => {
                          const seciliMi = (seciliDinamik[baslik] || []).includes(deger);
                          return (
                            <button 
                              key={deger}
                              onClick={() => toggleDinamik(baslik, deger)}
                              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${seciliMi ? 'bg-[#00d2ff]/20 border-[#00d2ff] text-[#00d2ff]' : 'bg-[#121212] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
                            >
                              {deger}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-36 overflow-y-auto custom-scrollbar pr-2">
                        {gecerliDegerler.map(deger => {
                          const seciliMi = (seciliDinamik[baslik] || []).includes(deger);
                          return (
                            <label key={deger} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleDinamik(baslik, deger)}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${seciliMi ? 'bg-[#00d2ff] border-[#00d2ff]' : 'bg-[#121212] border-white/20 group-hover:border-[#00d2ff]/50'}`}>
                                {seciliMi && <CheckIcon />}
                              </div>
                              <span className={`text-xs font-bold transition-colors ${seciliMi ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'} break-words`}>{deger}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
             );
              })}

            {/* 🔥 FİLTRE SONU İŞARETİ 🔥 */}
              <div className="mt-8 mb-6 flex justify-center opacity-50 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-gray-600"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-gray-500"></div>
                  <div className="w-8 h-[1px] bg-gray-600"></div>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* 🛠️ SAĞ ÜRÜN IZGARASI */}
        <main className="flex-1 w-full min-w-0">
          {filtrelenmisUrunler.length === 0 ? (
            <div className="w-full py-24 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <PackageX className="w-12 h-12 text-white/30 mb-4" />
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 text-center px-4">Aradığınız Kriterlerde Ürün Bulunamadı</h3>
              <button onClick={filtreleriTemizle} className="mt-4 text-[#00d2ff] text-sm font-bold underline">Filtreleri Temizle</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtrelenmisUrunler.map((urun: any) => {
                  const vitrinResmi = urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : urun.resim;
                  const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
                  const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
                  const indirimVarMi = normalFiyat > gecerliFiyat;
                  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
                  const tukendiMi = urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0";
                  const havaleOrani = urun.havaleIndirimi !== undefined ? urun.havaleIndirimi : 5;
                  const havaleFiyati = gecerliFiyat - (gecerliFiyat * (havaleOrani / 100));
                  const isAdded = sepeteEklenenler.includes(urun._id || urun.id);

                  let yildizSayisi = urun.rating ? Number(urun.rating) : 0;
                  let yorumSayisi = urun.yorumSayisi ? Number(urun.yorumSayisi) : 0;

                  if (urun.fetchedReviews && urun.fetchedReviews.length > 0) {
                      yorumSayisi = urun.fetchedReviews.length;
                      const totalRating = urun.fetchedReviews.reduce((acc: any, curr: any) => acc + Number(curr.rating || 0), 0);
                      yildizSayisi = totalRating / yorumSayisi;
                  }

                  return (
                    <div key={urun._id.toString()} className="group relative flex flex-col w-full flex-shrink-0 bg-[#09090b] rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 ease-out hover:border-[#00d2ff]/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]">
                      <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6 overflow-hidden pointer-events-none">
                        
                        {indirimVarMi && !tukendiMi && (
                          <div className="discount-badge-home pointer-events-none">
                              <div className="badge-ribbon-home-left"></div>
                              <div className="badge-ribbon-home-right"></div>
                              <div className="badge-rosette-home">
                                  <span>%{indirimOrani}</span>
                                  <span>İNDİRİM</span>
                              </div>
                          </div>
                        )}

                        {tukendiMi ? (
                           <div className="absolute top-4 left-4 z-20 pointer-events-none">
                             <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 shadow-[0_0_10px_rgba(82,82,91,0.8)]" title="Tükendi"></div>
                           </div>
                        ) : (
                           <div className="absolute top-4 left-4 z-20 pointer-events-none">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="Stokta Var"></div>
                           </div>
                        )}

                        <div className="w-full h-full flex items-center justify-center relative z-10">
                          {vitrinResmi ? (
                            <img src={vitrinResmi} alt={urun.isim || urun.name} className={`w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-out group-hover:scale-110 ${tukendiMi ? "grayscale opacity-30" : ""}`} />
                          ) : (
                            <Cpu className="w-16 h-16 text-white/10" />
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow relative z-20 bg-transparent pointer-events-none">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#00d2ff] text-[10px] font-black tracking-[0.2em] uppercase">{getMarka(urun)}</span>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                            <Star className={`w-3 h-3 ${yorumSayisi > 0 ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}`} />
                            <span>{yorumSayisi > 0 ? `${yildizSayisi.toFixed(1)} (${yorumSayisi})` : 'Değerlendirme Yok'}</span>
                          </div>
                        </div>

                        <div className="block mt-1">
                          <h3 className="text-white text-sm font-bold leading-relaxed line-clamp-2 mb-4 group-hover:text-[#00d2ff] transition-colors duration-700">
                            {urun.isim || urun.name}
                          </h3>
                        </div>

                        <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5 pointer-events-auto">
                          <div className="flex flex-col relative z-20 pointer-events-none">
                            {indirimVarMi && !tukendiMi && (
                              <span className="text-gray-600 text-[11px] line-through font-medium mb-0.5">{normalFiyat.toLocaleString("tr-TR")} ₺</span>
                            )}
                            <span className="text-xl sm:text-2xl font-black text-white leading-none">
                              {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">₺</span>
                            </span>
                            {havaleOrani > 0 && !tukendiMi && (
                              <span className="text-[#10b981] text-[10px] font-bold mt-1.5 flex items-center gap-1">
                                <BanknoteIcon className="w-3 h-3" /> Havale: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 0})} ₺
                              </span>
                            )}
                          </div>

                          <div className="relative z-20 flex gap-2">
                             <Link href={"/product/" + (urun.slug || urun._id)} prefetch={true} className="h-10 px-4 bg-white/5 border border-white/10 hover:bg-[#00d2ff] hover:border-[#00d2ff] rounded-xl flex items-center justify-center group/btn transition-all duration-700 shadow-md hover:shadow-[0_0_15px_rgba(0,210,255,0.4)] pointer-events-auto">
                               <span className="text-xs sm:text-sm font-black text-gray-300 group-hover/btn:text-black transition-colors uppercase tracking-widest flex items-center gap-2 duration-700">
                                 İncele
                               </span>
                             </Link>
                             {!tukendiMi && (
                               <button 
                                 onClick={() => handleSepeteEkle(urun)} 
                                 disabled={isAdded}
                                 className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-md pointer-events-auto border ${isAdded ? "bg-[#10b981] text-white border-transparent" : "bg-white/5 border-white/10 hover:bg-[#00d2ff] hover:text-black hover:border-[#00d2ff]"}`}
                               >
                                 {isAdded ? "✓" : <ShoppingCart className="w-4 h-4" />}
                               </button>
                             )}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function CheckIcon() {
  return (
    <svg className="w-2.5 h-2.5 text-black font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}