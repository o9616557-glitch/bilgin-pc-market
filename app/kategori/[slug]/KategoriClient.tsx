"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, PackageX, Star, Filter, X, ShoppingCart, GitCompare } from "lucide-react";
import { useCart } from "@/app/CartContext";
import { useCompare } from "@/app/CompareContext";
import toast from "react-hot-toast";

function BanknoteIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="0"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );
}

// 🔥 MARKALARI OTOMATİK AVLAYAN MOTOR 🔥
const bilinenMarkalar = ["ASUS", "MSI", "GIGABYTE", "SAPPHIRE", "PALIT", "ZOTAC", "GALAX", "PNY", "INNO3D", "EVGA", "XFX", "POWERCOLOR", "ASROCK", "INTEL", "AMD", "CORSAIR", "LOGITECH", "RAZER", "STEELSERIES", "KINGSTON", "GSKILL", "CRUCIAL", "SAMSUNG", "WD", "LIAN LI", "WESTERN DIGITAL"];

const getMarka = (urun: any) => {
  if (urun.marka && urun.marka !== "Diğer") return urun.marka.toUpperCase();
  const isim = (urun.isim || urun.name || "").toUpperCase();
  for (const m of bilinenMarkalar) {
    if (isim.includes(m)) return m;
  }
  return "Diğer";
};

const getAramaMetni = (urun: any) => ((urun.isim || "") + " " + (urun.name || "")).toUpperCase().replace(/\s+/g, "");

const getGpuMarka = (urun: any) => {
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
  if (t.includes("1851")) return "LGA 1851";
  if (t.includes("1700")) return "LGA 1700";
  if (t.includes("1200")) return "LGA 1200";
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

const getPsuKapasite = (urun: any) => {
  const t = getAramaMetni(urun);
  const match = t.match(/(\d{3,4})W/);
  if (match) return match[1] + "W";
  return null;
};

const getPsuSertifika = (urun: any) => {
  const t = (urun.isim || urun.name || "").toUpperCase();
  if (t.includes("PLATINUM")) return "80+ Platinum";
  if (t.includes("GOLD")) return "80+ Gold";
  if (t.includes("SILVER")) return "80+ Silver";
  if (t.includes("BRONZE")) return "80+ Bronze";
  if (t.includes("WHITE")) return "80+ White";
  return null;
};

export default function KategoriClient({ urunler, sayfaBasligi }: { urunler: any[], sayfaBasligi: string }) {
  const { sepeteEkle } = useCart();
  const { karsilastirmayaEkle, karsilastirilanlar, setPopupAcik, karsilastirmayiTemizle } = useCompare();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  const b = sayfaBasligi.toUpperCase();
  const isEkranKarti = b.includes("EKRAN") || b.includes("VGA") || b.includes("GPU");
  const isIslemci = b.includes("İŞLEMCİ") || b.includes("ISLEMCI") || b.includes("CPU");
  const isAnakart = b.includes("ANAKART") || b.includes("MOTHERBOARD");
  const isPsu = b.includes("PSU") || b.includes("GÜÇ");

  // 🧠 HAFIZA OPTİMİZASYONU
  const urunOzellikleriHaritasi = useMemo(() => {
    const harita = new Map<string, Record<string, string>>();
    urunler.forEach(urun => {
      const targetId = String(urun._id || urun.id);
      let dbObj: Record<string, string> = {};
      
      // 🎯 KABLOYU BAĞLADIK PATRON! Önce Compass'taki filtre_ozellikleri kutusuna bakar, bulamazsa eski teknik_ozellikler'e geçer!
      const rawDb = urun.filtre_ozellikleri || urun.teknik_ozellikler || urun.teknik_ozeller || urun.ozellikler || urun.attributes;
      
      if (rawDb) {
        try {
          let parsed = typeof rawDb === 'string' ? JSON.parse(rawDb) : rawDb;
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              const key = item.name || item.key || item.baslik || item.ozellik || item.title;
              const val = item.value || item.val || item.deger || item.text;
              if (key && val) dbObj[key] = String(val).trim();
            });
          } else if (typeof parsed === 'object' && parsed !== null) {
            Object.entries(parsed).forEach(([k, v]) => {
              if (v && typeof v !== 'object') dbObj[k] = String(v).trim();
            });
          }
        } catch (e) {}
      }

      let sanalOzellikler: Record<string, string> = {};
      if (isEkranKarti) {
        const gpu = getGpuMarka(urun); if (gpu) sanalOzellikler["Grafik İşlemci"] = gpu;
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
      if (isPsu) {
        const güc = getPsuKapasite(urun); if (güc) sanalOzellikler["Güç Değeri"] = güc;
        const sertifika = getPsuSertifika(urun); if (sertifika) sanalOzellikler["Sertifika"] = sertifika;
      }

      harita.set(targetId, { ...sanalOzellikler, ...dbObj });
    });
    return harita;
  }, [urunler, isEkranKarti, isIslemci, isAnakart, isPsu]);

  const getUrunOzellikleri = (urun: any) => {
    return urunOzellikleriHaritasi.get(String(urun._id || urun.id)) || {};
  };

  const [seciliMarkalar, setSeciliMarkalar] = useState<string[]>([]);
  const [sadeceStokta, setSadeceStokta] = useState(false);
  const [minFiyat, setMinFiyat] = useState<string>("");
  const [maxFiyat, setMaxFiyat] = useState<string>("");
  
  const [seciliDinamik, setSeciliDinamik] = useState<Record<string, string[]>>({});
  const [mobilFiltreAcik, setMobilFiltreAcik] = useState(false);
  const [barGizli, setBarGizli] = useState(false);
  const markalar = useMemo(() => Array.from(new Set(urunler.map(u => getMarka(u)))).filter(Boolean).sort(), [urunler]);

  // 👑 ŞEFİMİN İSTEDİĞİ ANTI-BLOAT (ŞİŞME ÖNLEYİCİ) DİNAMİK MOTOR 👑
  const dinamikFiltreListesi = useMemo(() => {
    const filtreHaritasi: Record<string, Set<string>> = {};

    urunler.forEach(urun => {
      const birlesikOzellikler = getUrunOzellikleri(urun);
      Object.entries(birlesikOzellikler).forEach(([baslik, deger]) => {
        if (!deger) return;
        const metinDeger = String(deger).trim();
        if (metinDeger === "") return;

        if (!filtreHaritasi[baslik]) filtreHaritasi[baslik] = new Set();
        filtreHaritasi[baslik].add(metinDeger);
      });
    });

    const sonuc: Record<string, string[]> = {};
    Object.keys(filtreHaritasi).forEach(baslik => {
      const secenekSayisi = filtreHaritasi[baslik].size;
      
      // 🎯 Şefim test ederken tek ürün olsa bile gözüksün diye alt sınırı >= 1 yaptık! Üst sınırı koruduk ki şişmesin!
      if (secenekSayisi >= 1 && secenekSayisi <= 15) { 
        sonuc[baslik] = Array.from(filtreHaritasi[baslik]).sort();
      }
    });

    return sonuc;
  }, [urunler, urunOzellikleriHaritasi]);

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
  const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
  const gecerliFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : normalFiyat;

  // 🧠 Sepetin ihtiyaç duyduğu havale oranını yakalıyoruz
  const havaleOrani = urun.havaleIndirimi !== undefined ? Number(urun.havaleIndirimi) : 5;

  sepeteEkle({
    id: targetId,
    isim: urun.isim || urun.title || urun.name,
    fiyat: gecerliFiyat,
    resim: (urun.resimler && urun.resimler[0]) || urun.resim || urun.image || "/placeholder.jpg",
    adet: 1,
    varyasyon: "Standart",
    // 🔥 EKSİK OLAN KABLOLARI BURAYA BAĞLADIK 🔥
    havaleIndirimi: havaleOrani,
    stokKodu: urun.stokKodu || "",
    kategori: urun.kategori || "",
    slug: urun.slug // 🚀 BİNGO: Saklanan son butona da adresi (slug) ekledik!
  });

  setSepeteEklenenler(prev => [...prev, targetId]);
  setTimeout(() => { setSepeteEklenenler(prev => prev.filter(id => id !== targetId)); }, 2000);
};
  const handleKarsilastir = (urun: any) => { 
    karsilastirmayaEkle(urun); 
    setBarGizli(false);
  };
  
  const gecerliMarkalar = markalar.filter(m => markaGecerliMi(m));

  return (
      <>
        {/* 🚀 Üst başlık altındaki ayırıcı çizgi belirginleştirildi (border-white/20) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/20 pb-6 mb-8 px-4 sm:px-0 select-none">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {sayfaBasligi}
              </span> MODELLERİ
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setMobilFiltreAcik(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider border border-white/20"
            >
              <Filter className="w-4 h-4" /> Filtrele
            </button>
            <div className="flex items-center justify-start gap-2 bg-[#121215] border border-white/20 px-4 py-2.5 rounded-none text-xs font-black tracking-widest text-gray-300 uppercase">
              <div className="w-2 h-2 rounded-none bg-[#10b981] animate-ping"></div>
              Sonuç: {filtrelenmisUrunler.length}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-0 relative items-start">
          
          {/* 🛠 SOL FİLTRE PANELİ */}
          <aside className={`fixed top-[81px] bottom-0 left-0 right-0 z-[40] lg:sticky lg:top-24 lg:w-[260px] xl:w-[280px] lg:max-h-[calc(100vh-100px)] lg:shrink-0 transition-transform duration-300 flex flex-col ${mobilFiltreAcik ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setMobilFiltreAcik(false)}></div>
            
            {/* 🚀 Panel sağ çizgisi belirginleştirildi */}
            <div className="relative w-4/5 max-w-sm h-full bg-[#050505]/95 border-r border-white/20 lg:w-full lg:bg-transparent lg:border-none lg:shadow-none flex flex-col overflow-hidden">
              
              {/* 🚀 Filtre başlığı altı çizgisi belirginleştirildi */}
              <div className="p-4 border-b border-white/20 flex justify-between items-center shrink-0 bg-[#050505] lg:bg-transparent lg:px-0 z-10">
                <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2 text-sm"><Filter className="w-4 h-4 text-gray-300" /> Filtreler</h3>
                <div className="flex items-center gap-3">
                  <button onClick={filtreleriTemizle} className="text-gray-300 text-xs font-bold hover:text-white transition-all">Temizle</button>
                  <button onClick={() => setMobilFiltreAcik(false)} className="lg:hidden text-gray-300 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-4 lg:p-0 overflow-y-auto [&::-webkit-scrollbar]:hidden flex-1 select-none">
                
                {/* 🚀 Fiyat alanı altı çizgisi belirginleştirildi */}
                <div className="mb-6 pb-6 border-b border-white/20">
                  
                  {/* STOK BUTONU */}
                  <label className="flex items-center gap-3 cursor-pointer group mb-5">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={sadeceStokta} onChange={(e) => setSadeceStokta(e.target.checked)} />
                      {/* 🚀 Buton kapalıykenki sönük hali düzeltildi, ekstra ince çerçeve eklendi */}
                      <div className={`block w-9 h-5 rounded-full transition-colors border border-white/20 ${sadeceStokta ? 'bg-[#10b981]' : 'bg-white/20'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${sadeceStokta ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Sadece Stoktakiler</span>
                  </label>

                  <h4 className="text-[10px] font-black text-gray-200 uppercase tracking-widest mb-3">Fiyat Aralığı (TL)</h4>
                  <div className="flex items-center gap-2">
                    {/* 🚀 Fiyat kutuları zifiri siyahlıktan çıkarıldı, çerçeveleri kalınlaştı, tıklayınca MAVİ PARLAMA eklendi */}
                    <input type="number" placeholder="Min" value={minFiyat} onChange={(e) => setMinFiyat(e.target.value)} className="w-full bg-[#121215] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff]/50 outline-none transition-all placeholder:text-gray-600" />
                    <span className="text-gray-400 font-bold">-</span>
                    <input type="number" placeholder="Max" value={maxFiyat} onChange={(e) => setMaxFiyat(e.target.value)} className="w-full bg-[#121215] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff]/50 outline-none transition-all placeholder:text-gray-600" />
                  </div>
                </div>

              {gecerliMarkalar.length > 0 && (
                <div className="mb-6 pb-6 border-b border-white/5">
                  <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Markalar</h4>
                  <div className="space-y-2.5">
                    {gecerliMarkalar.map((marka: any) => (
                      <label key={marka} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSeciliMarkalar(prev => prev.includes(marka) ? prev.filter(m => m !== marka) : [...prev, marka])}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${seciliMarkalar.includes(marka) ? 'bg-[#00d2ff] border-[#00d2ff]' : 'bg-black border-white/10 group-hover:border-white/30'}`}>
                          {seciliMarkalar.includes(marka) && <CheckIcon />}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${seciliMarkalar.includes(marka) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{marka}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(dinamikFiltreListesi).map(([baslik, degerler]) => {
                const gecerliDegerler = degerler.filter(d => dinamikSecenekGecerliMi(baslik, d));
                if (gecerliDegerler.length === 0) return null;

                return (
                  <div key={baslik} className="mb-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                    <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">{baslik}</h4>
                    
                    {gecerliDegerler.every(d => d.length <= 12) ? (
                      <div className="flex flex-wrap gap-1.5">
                        {gecerliDegerler.map(deger => {
                          const seciliMi = (seciliDinamik[baslik] || []).includes(deger);
                          return (
                            <button key={deger} onClick={() => toggleDinamik(baslik, deger)} className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${seciliMi ? 'bg-white/10 border-white/30 text-white' : 'bg-black border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300'}`} >
                              {deger}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {gecerliDegerler.map(deger => {
                          const seciliMi = (seciliDinamik[baslik] || []).includes(deger);
                          return (
                            <label key={deger} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleDinamik(baslik, deger)}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${seciliMi ? 'bg-[#00d2ff] border-[#00d2ff]' : 'bg-black border-white/10 group-hover:border-white/30'}`}>
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

              <div className="mt-8 mb-12 flex justify-center items-center gap-3 opacity-30 select-none">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/50"></div>
                <div className="w-2 h-2 rotate-45 border border-white/50 bg-transparent"></div>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/50"></div>
              </div>

              <div className="mb-6 lg:hidden">
                <button onClick={filtreleriTemizle} className="w-full text-center bg-black border border-white/10 text-gray-400 text-xs font-black uppercase tracking-widest py-3 rounded-none hover:text-white transition-colors">Filtreleri Temizle</button>
              </div>

            </div>
          </div>
        </aside>

    {/* 🛠 Sağ ÜRÜN IZGARASI */}
<main className="flex-1 w-full min-w-0 pb-12">
  {filtrelenmisUrunler.length === 0 ? (
    <div className="w-full flex flex-col items-center justify-center text-center gap-4 py-24 select-none border border-white/5 bg-black/20 rounded-2xl px-4">
      <span className="text-[#00d2ff] font-black text-xs uppercase tracking-widest animate-pulse">
        Sistem Güncelleniyor
      </span>
      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase max-w-md">
        Seçilen Kombinasyon Şu An Hazırlık Aşamasında
      </h3>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent my-1"></div>
      <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-400 max-w-lg">
        Aradığınız kriterlere uygun donanım yapılandırmaları ve güncel stok listeleri optimize ediliyor olabilir. Sol paneldeki aktif filtreleri kaldırarak veya diğer ana kategorilere geçiş yaparak dükkandaki canavar bileşenleri hemen inceleyebilirsiniz.
      </p>
    </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtrelenmisUrunler.map((urun: any) => {
                  const targetId = urun._id || urun.id;
                  const vitrinResmi = urun.resim || (urun.images && urun.images[0]?.src) || "/placeholder.jpg";
                  
                  const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
                  const indirimliFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : null;
                  const gecerliFiyat = indirimliFiyat ? indirimliFiyat : normalFiyat;
                  const indirimVarMi = indirimliFiyat !== null && normalFiyat > gecerliFiyat;

                  const indirimOrani = indirimVarMi ? Math.round(((normalFiyat - gecerliFiyat) / normalFiyat) * 100) : 0;
                  const tukendiMi = urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0";
                  const havaleOrani = urun.havaleIndirimi !== undefined ? Number(urun.havaleIndirimi) : 5;
                  const havaleFiyati = gecerliFiyat - (gecerliFiyat * (havaleOrani / 100));
                  const isAdded = sepeteEklenenler.includes(String(targetId));

                  let yildizSayisi = urun.rating ? Number(urun.rating) : 0;
                  let yorumSayisi = urun.yorumSayisi ? Number(urun.yorumSayisi) : 0;
// 🌟 ŞEFİN VİTRİN YILDIZ MOTORU 🌟
if (urun.fetchedReviews && urun.fetchedReviews.length > 0) {
    yorumSayisi = urun.fetchedReviews.length;
    const totalRating = urun.fetchedReviews.reduce((acc: any, curr: any) => acc + Number(curr.rating || 0), 0);
    yildizSayisi = totalRating / yorumSayisi;
}
                  return (
                  <div key={String(targetId)} className="group relative isolate z-0 flex flex-col w-full flex-shrink-0 bg-[#18181b]/90 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out hover:border-white/40 hover:shadow-[0_15px_60px_rgba(255,255,255,0.05)]">
                      <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-white/[0.01] to-transparent flex items-center justify-center p-6 overflow-hidden pointer-events-none">
                        
                        {indirimVarMi && !tukendiMi && (
                         <div className="absolute top-4 right-7 discount-badge-container pointer-events-none !z-20">
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
                             <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 shadow-[0_0_15px_rgba(82,82,91,0.5)]"></div>
                           </div>
                        ) : (
                           <div className="absolute top-4 left-4 z-20 pointer-events-none">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                           </div>
                        )}

                        <div className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-700 ease-out group-hover:scale-105">
                           <img src={vitrinResmi} alt={urun.isim || urun.name} className={`w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] ${tukendiMi ? "grayscale opacity-30" : ""}`} />
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow relative z-20 bg-black/30 backdrop-blur-xl border-t border-white/5">
                        <div className="flex justify-between items-center mb-2 select-none">
                          <span className="text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase">{getMarka(urun)}</span>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-black">
                            <Star className={`w-3.5 h-3.5 ${yorumSayisi > 0 ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-800'}`} />
                            <span>{yorumSayisi > 0 ? `${yildizSayisi.toFixed(1)} (${yorumSayisi})` : 'Henüz Değerlendirilmedi'}</span>
                          </div>
                        </div>

                        <div className="block mt-1">
                          <h3 className="text-white text-sm font-bold leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-300 transition-colors duration-700">
                            {urun.isim || urun.name}
                          </h3>
                        </div>

                        <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5 pointer-events-auto">
                          <div className="flex flex-col select-none">
                            {indirimVarMi && !tukendiMi && (
                              <span className="text-gray-600 text-[11px] line-through font-medium mb-0.5">{normalFiyat.toLocaleString("tr-TR")} ₺</span>
                            )}
                            <span className="text-2xl font-black text-white leading-none">
                              {gecerliFiyat.toLocaleString("tr-TR")} <span className="text-sm text-gray-500">₺</span>
                            </span>
                            {havaleOrani > 0 && !tukendiMi && (
                              <span className="text-[#10b981] text-[10px] font-black mt-1.5 flex items-center gap-1">
                                <BanknoteIcon className="w-3.5 h-3.5" /> Havale: {havaleFiyati.toLocaleString("tr-TR", {maximumFractionDigits: 0})} ₺
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2.5">
                             <button onClick={() => handleKarsilastir(urun)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black border border-white/5 text-gray-500 hover:border-white/30 hover:text-white transition-all">
                               <GitCompare className="w-4 h-4" />
                             </button>
                             {!tukendiMi && (
                               <button 
                                 onClick={() => handleSepeteEkle(urun)} 
                                 disabled={isAdded}
                                 className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all border ${isAdded ? "bg-[#10b981] border-transparent text-black" : "bg-white/10 border-transparent text-white hover:bg-white hover:text-black"}`}
                               >
                                 {isAdded ? "✓" : <ShoppingCart className="w-4 h-4" />}
                               </button>
                             )}
                          </div>
                        </div>
                      </div>
                      
                      <Link href={"/product/" + (urun.slug || targetId)} prefetch={true} onMouseEnter={(e) => { const router = require('next/navigation').useRouter; router().prefetch("/product/" + (urun.slug || targetId)); }} className="absolute inset-0 z-10" />

                    </div>
                  );
              })}
            </div>
          )}
        </main>
      </div>

      {/* 🚀 KARŞILAŞTIRMA YÜZEN BAR */}
      {!barGizli && karsilastirilanlar && karsilastirilanlar.length > 0 && (
        <div className="sticky bottom-6 lg:bottom-10 z-[9999] w-full flex justify-center pointer-events-none mt-10">
          <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-[#00d2ff]/30 p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.3)] flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-500 select-none">
            
            <div className="pl-3 flex flex-col justify-center items-center">
              <span className="text-white font-black text-xs uppercase tracking-widest leading-none mb-1">{karsilastirilanlar.length} Ürün</span>
              <span className="text-gray-400 text-[9px] uppercase tracking-wider leading-none">Seçildi</span>
            </div>

            <div className="flex gap-1.5">
              <button 
                onClick={() => { if (typeof setPopupAcik === "function") setPopupAcik(true); }}
                className="bg-[#00d2ff] text-black px-10 py-2.5 rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-white transition-colors"
              >
                Karşılaştır
              </button>
              <button 
                onClick={() => { 
                  setBarGizli(true); 
                  if (typeof karsilastirmayiTemizle === "function") karsilastirmayiTemizle(); 
                }}
                className="bg-white/10 text-gray-300 px-4 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                title="İptal Et ve Sil"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
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