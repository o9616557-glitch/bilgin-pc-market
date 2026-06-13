"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { 
  Cpu, Monitor, HardDrive, Zap, Wind, LayoutGrid, ShoppingBag, ChevronRight, ChevronLeft, Loader2, Check, AlertTriangle, Trash2, RefreshCw, ExternalLink, Heart 
} from "lucide-react";

const STEPS = [
  { id: "islemci", name: "İşlemci (CPU)", icon: Cpu },
  { id: "anakart", name: "Anakart", icon: LayoutGrid },
  { id: "ram", name: "RAM Bellek", icon: LayoutGrid },
  { id: "ekran-karti", name: "Ekran Kartı", icon: Monitor },
  { id: "ssd", name: "SSD & M.2 Disk", icon: HardDrive },
  { id: "kasa", name: "Bilgisayar Kasası", icon: LayoutGrid },
  { id: "psu", name: "Güç Kaynağı (PSU)", icon: Zap },
  { id: "sogutma", name: "Soğutma Sistemi", icon: Wind },
];

export default function KendinToplaPage() {
  const { sepeteEkle } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hafızalı seçim state yapısı
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  
  const activeStepInfo = STEPS[currentStep];

  // 📦 Tarayıcı hafızasından eski seçimleri geri yükleme motoru
  useEffect(() => {
    const eskiSecimler = localStorage.getItem("bilgin_sihirbaz_selections");
    if (eskiSecimler) {
      try {
        setSelections(JSON.parse(eskiSecimler));
      } catch (e) {
        console.error("Hafıza okuma hatası:", e);
      }
    }
  }, []);

  // 💾 Seçimler değiştikçe hafızayı anında güncelleme motoru
  useEffect(() => {
    if (Object.keys(selections).length > 0) {
      localStorage.setItem("bilgin_sihirbaz_selections", JSON.stringify(selections));
    }
  }, [selections]);

  // Pop-up açılınca arka plan kaymasını engelleyen kilit
  useEffect(() => {
    if (previewProduct) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    };
  }, [previewProduct]);

  const dinamikFiltreleriHesapla = (stepToIgnore: string) => {
    let soket = "";
    let bellek = "";
    let yapi = "";
    let radyator = "";

    const sIslemci = stepToIgnore === "islemci" ? null : selections["islemci"];
    const sAnakart = stepToIgnore === "anakart" ? null : selections["anakart"];
    const sRam = stepToIgnore === "ram" ? null : selections["ram"];
    const sSogutma = stepToIgnore === "sogutma" ? null : selections["sogutma"];
    const sKasa = stepToIgnore === "kasa" ? null : selections["kasa"];

    if (sIslemci?.sihirbaz_ozellikleri) {
      const sz = sIslemci.sihirbaz_ozellikleri;
      soket = sz.soket || soket;
      bellek = sz.bellek_tipi || bellek;
    }

    if (sAnakart?.sihirbaz_ozellikleri) {
      const sz = sAnakart.sihirbaz_ozellikleri;
      if (!soket) soket = sz.soket;
      if (!bellek) bellek = sz.bellek_tipi;
      yapi = sz.anakart_yapisi || yapi;
    }

    if (sRam?.sihirbaz_ozellikleri && !bellek) {
      bellek = sRam.sihirbaz_ozellikleri.bellek_tipi;
    }

    if (sSogutma?.sihirbaz_ozellikleri) {
      radyator = sSogutma.sihirbaz_ozellikleri.radyator_boyutu || radyator;
    }

    if (sKasa?.sihirbaz_ozellikleri && !radyator) {
      radyator = sKasa.sihirbaz_ozellikleri.radyator_boyutu || radyator;
    }

    return { soket, bellek, yapi, radyator };
  };

  const { soket, bellek, yapi, radyator } = dinamikFiltreleriHesapla(activeStepInfo.id);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        let url = `/api/kendin-topla?kategori=${activeStepInfo.id}&soket=${encodeURIComponent(soket)}&bellek=${encodeURIComponent(bellek)}&yapi=${encodeURIComponent(yapi)}&radyator=${encodeURIComponent(radyator)}`;
        const res = await fetch(url);
        const resData = await res.json();
        if (resData.success) setProducts(resData.data);
        else setProducts([]);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, [currentStep, soket, bellek, yapi, radyator]);

  const handleSelectComponent = (product: any) => {
    setSelections((prev) => ({ ...prev, [activeStepInfo.id]: product }));
    toast.success(`${product.isim} başarıyla sisteme eklendi.`);
  };

  const handleRemoveComponent = (stepId: string) => {
    setSelections((prev) => {
      const yeni = { ...prev };
      delete yeni[stepId];
      if (Object.keys(yeni).length === 0) {
        localStorage.removeItem("bilgin_sihirbaz_selections");
      } else {
        localStorage.setItem("bilgin_sihirbaz_selections", JSON.stringify(yeni));
      }
      return yeni;
    });
  };

  const handleClearAll = () => {
    setSelections({});
    setCurrentStep(0);
    localStorage.removeItem("bilgin_sihirbaz_selections");
    toast.success("Sistem başarıyla sıfırlandı.");
  };

  // 🚀 SINIRSIZ FAVORİ KAYIT MOTORU (EN AZ 4 KURALI TAMAMEN KALKTI!)
  const handleAddSystemToFavorites = async () => {
    if (Object.keys(selections).length === 0) {
      return toast.error("Favorilere eklemek için en az bir parça seçmelisiniz.");
    }

    const loadToast = toast.loading("Sistem konfigürasyonu bütün olarak paketleniyor...");
    try {
      const ilkKategoriAnahtari = Object.keys(selections)[0];
      const ilkSecilenUrun = selections[ilkKategoriAnahtari];

      const sistemPaketi = {
        productId: ilkSecilenUrun._id,
        id: ilkSecilenUrun._id,
        isToplamaSystem: true, 
        genelToplamTutar: toplamFiyat,
        parcalar: STEPS.map(step => {
          const parca = selections[step.id];
          return parca ? {
            parcaBasligi: step.name,
            urunIsmi: parca.isim,
            fiyat: Number(parca.indirimliFiyat || parca.fiyat || 0)
          } : null;
        }).filter(Boolean)
      };

      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sistemPaketi)
      });

      const data = await res.json();
      toast.dismiss(loadToast);

      if (data.success) {
        toast.success("Sistem konfigürasyonunuz tek bir bütün kart olarak favorilere eklendi! ❤️");
      } else {
        toast.error(data.message || "Lütfen önce kullanıcı girişi yapınız.");
      }
    } catch (error) {
      toast.dismiss(loadToast);
      toast.error("Teknik bir sorun oluştu.");
    }
  };

  const toplamFiyat = Object.values(selections).reduce((acc, curr) => {
    return acc + Number(curr.indirimliFiyat || curr.fiyat || 0);
  }, 0);

  const toplamWatt = Object.values(selections).reduce((acc, curr) => {
    const sz = curr.sihirbaz_ozellikleri || {};
    return acc + (Number(sz.harcanan_guc) || 0);
  }, 0);

  const seciliPsuGucu = Number(selections["psu"]?.sihirbaz_ozellikleri?.psu_gucu) || 0;
  const psuYetersiz = seciliPsuGucu > 0 && (toplamWatt + 150) > seciliPsuGucu;

  const kasaGpuLimiti = Number(selections["kasa"]?.sihirbaz_ozellikleri?.gpu_boyutu) || 0;
  const ekranKartiBoyutu = Number(selections["ekran-karti"]?.sihirbaz_ozellikleri?.gpu_boyutu) || 0;
  const gpuKasaAşimi = kasaGpuLimiti > 0 && ekranKartiBoyutu > 0 && ekranKartiBoyutu > kasaGpuLimiti;

  const handleAddSystemToCart = () => {
    if (Object.keys(selections).length === 0) return toast.error("Lütfen sepete eklemek için en az bir parça seçiniz.");
    if (psuYetersiz) return toast.error("Güç kaynağı yetersiz. Lütfen daha yüksek kapasiteli bir güç kaynağı seçiniz.");
    if (gpuKasaAşimi) return toast.error("Seçilen ekran kartı mevcut kasaya sığmamaktadır. Lütfen uyumlu parçalar seçiniz.");

    Object.values(selections).forEach((urun) => {
      sepeteEkle({
        id: urun._id?.toString(),
        isim: `[Toplama PC] ${urun.isim}`,
        fiyat: Number(urun.indirimliFiyat || urun.fiyat || 0),
        resim: urun.resim || "https://via.placeholder.com/150",
        varyasyon: "Sihirbaz Parçası",
        havaleIndirimi: urun.havaleIndirimi || 5
      });
    });
    localStorage.removeItem("bilgin_sihirbaz_selections");
    setSelections({});
    setCurrentStep(0);
    toast.success("Sistem başarıyla sepete eklendi ve sihirbaz temizlendi.");
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans pb-32">
      <div className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl lg:sticky lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-[#00d2ff] font-black text-xl sm:text-2xl">🔧 PC SİHİRBAZI</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isSelected = !!selections[step.id];
              const isActive = currentStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                    isActive ? "bg-[#00d2ff]/10 border-[#00d2ff] text-[#00d2ff]" : isSelected ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-900/50 border-white/5 text-gray-500 hover:text-white"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>{step.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* SOL TARAF: ÜRÜN LİSTESİ */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <activeStepInfo.icon className="w-6 h-6 text-[#00d2ff]" />
              {activeStepInfo.name} Listesi
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#00d2ff]" />
              <span className="text-xs uppercase tracking-widest font-black">Uyum Matrisi Hesaplanıyor...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((urun) => {
                const isItemChosen = selections[activeStepInfo.id]?._id === urun._id;
                return (
                  <div key={urun._id} className={`bg-[#09090b] border rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group ${isItemChosen ? "border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.05)]" : "border-white/5"}`}>
                    
                    <button 
                      onClick={() => setPreviewProduct(urun)}
                      className="w-20 h-20 bg-black/40 rounded-xl p-2 flex items-center justify-center shrink-0 cursor-pointer relative block group/img pointer-events-auto"
                    >
                      <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                        <ExternalLink className="w-4 h-4 text-[#00d2ff]" />
                      </div>
                    </button>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <button 
                          onClick={() => setPreviewProduct(urun)}
                          className="text-sm font-bold text-white text-left truncate block hover:text-[#00d2ff] hover:underline transition-all cursor-pointer mb-1 pointer-events-auto w-full"
                        >
                          {urun.isim}
                        </button>
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 font-medium break-all break-words">
                          {urun.sihirbaz_ozellikleri && Object.entries(urun.sihirbaz_ozellikleri).filter(([_, v]) => v).slice(0, 3).map(([k, v]: any) => (
                            <span key={k} className="capitalize">{k.replace('_', ' ')}: <strong className="text-gray-400">{v}</strong></span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span className="text-base font-black text-white">{Number(urun.indirimliFiyat || urun.fiyat || 0).toLocaleString("tr-TR")} ₺</span>
                        <button 
                          onClick={() => handleSelectComponent(urun)} 
                          className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            isItemChosen ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-zinc-800 text-gray-300 hover:bg-[#00d2ff] hover:text-black"
                          }`}
                        >
                          {isItemChosen ? "Seçildi ✓" : "Sisteme Ekle"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#09090b] border border-white/5 rounded-2xl p-6 text-gray-500 text-sm">
              Bu kriterlere uygun parça bulunmamaktadır.
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
            <button disabled={currentStep === 0} onClick={() => setCurrentStep((p) => p - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Önceki Adım
            </button>
            <button disabled={currentStep === STEPS.length - 1} onClick={() => setCurrentStep((p) => p + 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
              Sonraki Adım <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SAĞ TARAF: SİSTEM ÖZETİ */}
        <div className="w-full lg:w-[35%] lg:sticky lg:top-40 flex flex-col gap-6">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col w-full">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">SİSTEM ÖZETİ</h3>
                <span className="text-[10px] bg-red-950/40 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-md mt-1 w-max font-black animate-pulse">
                  ⚡ {toplamWatt}W Tüketim
                </span>
              </div>
              {Object.keys(selections).length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-gray-500 hover:text-red-400 text-xs font-black flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20"
                >
                  <RefreshCw className="w-3 h-3" /> Tümünü Sıfırla
                </button>
              )}
            </div>

            {psuYetersiz && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Uyarı: Seçilen güç kaynağı ({seciliPsuGucu}W), gereken kapasiteyi ({(toplamWatt + 150)}W) karşılayamıyor. Lütfen daha güçlü bir PSU seçiniz.</span>
              </div>
            )}

            {gpuKasaAşimi && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Uyarı: Seçilen ekran kartı ({ekranKartiBoyutu}mm), kasanın desteklediği boyutu ({kasaGpuLimiti}mm) aşıyor.</span>
              </div>
            )}

            <div className="space-y-3 mb-5 max-h-[380px] overflow-y-auto pr-1">
              {STEPS.map((step) => {
                const comp = selections[step.id];
                return (
                  <div key={step.id} className="flex items-start justify-between text-sm p-3.5 rounded-xl bg-black/40 border border-white/5 gap-3 group transition-all hover:border-white/10 overflow-hidden">
                    <div className="min-w-0 flex-1 pr-1">
                      <span className="block text-[10px] text-[#00d2ff] font-black uppercase tracking-wider mb-0.5">{step.name}</span>
                      <span className={`block text-xs font-bold break-words whitespace-normal leading-relaxed ${comp ? "text-white" : "text-gray-600 italic"}`}>
                        {comp ? comp.isim : "Henüz Seçilmedi..."}
                      </span>
                      {comp && (
                        <span className="block text-[11px] text-emerald-400 font-extrabold mt-1">
                          {Number(comp.indirimliFiyat || comp.fiyat || 0).toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                    </div>
                    {comp && (
                      <button 
                        onClick={() => handleRemoveComponent(step.id)} 
                        className="text-gray-500 hover:text-red-500 p-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 transition-all shrink-0 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {toplamWatt > 0 && !psuYetersiz && (
              <div className="bg-zinc-900/50 border border-white/5 p-3 rounded-xl mb-4 text-[11px] text-gray-400 font-medium">
                📢 Önerilen Minimum Güç Kaynağı: <strong className="text-[#00d2ff] font-black">{(toplamWatt + 150)}W</strong>
              </div>
            )}

            <div className="hidden lg:flex border-t border-white/10 pt-4 flex-col gap-3">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">TOPLAM:</span>
                <span className="text-3xl font-black text-white tracking-tight">{toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">TL</span></span>
              </div>
              
              <button 
                onClick={handleAddSystemToFavorites}
                className="w-full h-11 rounded-xl font-bold uppercase tracking-wider text-xs border border-white/10 hover:border-red-500/40 bg-white/[0.02] hover:bg-red-500/5 text-gray-300 hover:text-red-400 flex items-center justify-center gap-2 transition-all"
              >
                <Heart className="w-3.5 h-3.5" /> Bu Sistemi Favorilerime Ekle
              </button>

              <button 
                onClick={handleAddSystemToCart} 
                disabled={psuYetersiz || gpuKasaAşimi}
                className={`w-full h-14 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                  (psuYetersiz || gpuKasaAşimi) ? "bg-zinc-800 text-gray-600 cursor-not-allowed border border-white/5" : "bg-[#00d2ff] text-black hover:bg-[#00c4db]"
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> { (psuYetersiz || gpuKasaAşimi) ? "Uyumsuzlukları Gideriniz" : "Sistemi Sepete Ekle" }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBİL ALT BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#09090b]/95 backdrop-blur-2xl border-t border-white/10 px-6 py-4 z-50 flex items-center justify-between shadow-[0_-15px_30px_rgba(0,0,0,0.8)] select-none">
         <div className="flex flex-col">
            <span className="text-gray-500 text-[10px] font-black tracking-wider uppercase mb-0.5">TOPLAM TUTAR</span>
            <span className="text-2xl font-black text-white leading-none">
              {toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">₺</span>
            </span>
         </div>
         <div className="flex items-center gap-2">
           <button 
             onClick={handleAddSystemToFavorites}
             className="h-12 w-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
             title="Sistemi Favorilere Ekle"
           >
             <Heart className="w-5 h-5" />
           </button>
           <button 
             onClick={handleAddSystemToCart}
             disabled={psuYetersiz || gpuKasaAşimi}
             className={`h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
               (psuYetersiz || gpuKasaAşimi) ? "bg-zinc-800 text-gray-600 cursor-not-allowed" : "bg-[#00d2ff] text-black"
             }`}
           >
              <ShoppingBag className="w-4 h-4" /> Sepete Ekle
           </button>
         </div>
      </div>

      {/* DETAY İNCELEME MODAL PANELİ */}
      {previewProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 overflow-y-auto flex items-start sm:items-center justify-center p-2 sm:p-6 md:p-10 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border border-white/10 w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] my-auto">
            
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/20 shrink-0">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#00d2ff]">Ürün Detay İnceleme</h3>
              <button 
                onClick={() => setPreviewProduct(null)}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors font-black text-xs uppercase tracking-widest"
              >
                Kapat ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-5 gap-6 max-h-[calc(100vh-160px)] sm:max-h-[70vh]">
              <div className="md:col-span-2 flex flex-col items-center gap-4 sm:gap-6 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6 md:sticky md:top-0 h-max">
                <div className="w-full aspect-square bg-black/40 rounded-2xl p-6 border border-white/5 flex items-center justify-center">
                  <img src={previewProduct.resim} alt={previewProduct.isim} className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                </div>
                <div className="w-full bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1">AVANTAJLI FİYAT</span>
                  <span className="text-3xl font-black text-emerald-400">{Number(previewProduct.indirimliFiyat || previewProduct.fiyat || 0).toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div>
                  <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase block mb-1">{previewProduct.marka || "BİLEŞEN"}</span>
                  <h2 className="text-lg md:text-xl font-black text-white leading-snug">{previewProduct.isim}</h2>
                </div>

                {previewProduct.teknik_ozellikler && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-white/5 pb-1">Teknik Özellikler</h4>
                    <div className="grid grid-cols-1 gap-1.5 text-xs">
                      {Object.entries(previewProduct.teknik_ozellikler).map(([key, value]: any) => (
                        <div key={key} className="flex justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-lg gap-4">
                          <span className="text-gray-500 font-bold capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-gray-300 font-extrabold text-right break-all">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewProduct.aciklama && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-white/5 pb-1">Ürün Açıklaması</h4>
                    <div 
                      className="text-xs text-gray-400 leading-relaxed font-medium break-words prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewProduct.aciklama }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-white/5 bg-black/20 flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={() => setPreviewProduct(null)}
                className="px-5 py-3 rounded-xl text-xs font-black uppercase bg-zinc-900 border border-white/5 text-gray-400 hover:text-white transition-colors"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  handleSelectComponent(previewProduct);
                  setPreviewProduct(null);
                }}
                className="px-6 py-3 rounded-xl text-xs font-black uppercase bg-[#00d2ff] text-black hover:bg-[#00c4db] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
              >
                <ShoppingBag className="w-4 h-4" /> Parçayı Sisteme Ekle
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}