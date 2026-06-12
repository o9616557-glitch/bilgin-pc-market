"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { 
  Cpu, Monitor, HardDrive, Zap, Wind, LayoutGrid, ShoppingBag, ChevronRight, ChevronLeft, Loader2, Check 
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

  // Müşterinin anlık sepeti
  const [selections, setSelections] = useState<Record<string, any>>({});

  const activeStepInfo = STEPS[currentStep];

  // 🚀 SENİN DEDİĞİN BÜYÜK ZEKÂ BURADA: ANLIK OLARAK TÜM SEÇİLENLERDEN UYUM AYARLARINI AYIKLAMA
  const dinamikFiltreleriHesapla = () => {
    let soket = "";
    let bellek = "";
    let yapi = "";

    // 1. Herhangi bir adımda işlemci seçildiyse ayarları kap
    if (selections["islemci"]) {
      const t = selections["islemci"].teknik_ozellikler || {};
      soket = t["Soket Tipi"] || t["Soket"] || soket;
      const bDesteği = t["Bellek Desteği"] || t["Bellek Türü"] || "";
      if (bDesteği.toLowerCase().includes("ddr5")) bellek = "DDR5";
      else if (bDesteği.toLowerCase().includes("ddr4")) bellek = "DDR4";
    }

    // 2. Herhangi bir adımda anakart seçildiyse ayarları kap
    if (selections["anakart"]) {
      const t = selections["anakart"].teknik_ozellikler || {};
      soket = t["Soket Tipi"] || t["Soket"] || soket;
      yapi = t["Anakart Yapısı"] || t["Anakart Desteği"] || yapi;
      const bTürü = t["Bellek Türü"] || t["Bellek Desteği"] || "";
      if (bTürü.toLowerCase().includes("ddr5")) bellek = "DDR5";
      else if (bTürü.toLowerCase().includes("ddr4")) bellek = "DDR4";
    }

    // 3. Herhangi bir adımda RAM seçildiyse ayarları kap
    if (selections["ram"]) {
      const t = selections["ram"].teknik_ozellikler || {};
      const bTürü = t["Bellek Türü"] || t["Tip"] || t["Bellek Desteği"] || "";
      if (bTürü.toLowerCase().includes("ddr5")) bellek = "DDR5";
      else if (bTürü.toLowerCase().includes("ddr4")) bellek = "DDR4";
    }

    // 4. Herhangi bir adımda sıvı soğutma seçildiyse ayarları kap
    if (selections["sogutma"]) {
      const t = selections["sogutma"].teknik_ozellikler || {};
      const uSoketler = t["Uyumlu Soketler"] || t["Soket Desteği"] || "";
      // Eğer halihazırda soket seçilmediyse ve soğutucu AM5 ise soketi AM5 kabul et şefim
      if (!soket) {
        if (uSoketler.toLowerCase().includes("am5")) soket = "AM5";
        else if (uSoketler.toLowerCase().includes("1700")) soket = "LGA1700";
      }
    }

    // 5. Herhangi bir adımda kasa seçildiyse ayarları kap
    if (selections["kasa"]) {
      const t = selections["kasa"].teknik_ozellikler || {};
      const kYapi = t["Anakart Yapısı"] || t["Anakart Desteği"] || "";
      if (kYapi.toLowerCase().includes("atx")) yapi = "ATX";
    }

    return { soket, bellek, yapi };
  };

  const { soket, bellek, yapi } = dinamikFiltreleriHesapla();

  // Verileri API'den çekme tetiği
  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        let url = `/api/kendin-topla?kategori=${activeStepInfo.id}&soket=${encodeURIComponent(soket)}&bellek=${encodeURIComponent(bellek)}&yapi=${encodeURIComponent(yapi)}`;
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
  }, [currentStep, selections, soket, bellek, yapi]);

  const handleSelectComponent = (product: any) => {
    setSelections((prev) => ({ ...prev, [activeStepInfo.id]: product }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleRemoveComponent = (stepId: string) => {
    setSelections((prev) => {
      const yeni = { ...prev };
      delete yeni[stepId];
      return yeni;
    });
  };

  const toplamFiyat = Object.values(selections).reduce((acc, curr) => {
    return acc + Number(curr.indirimliFiyat || curr.fiyat || 0);
  }, 0);

  const toplamWatt = Object.values(selections).reduce((acc, curr) => {
    const t = curr.teknik_ozellikler || {};
    const tdp = t["Güç Tüketimi (TDP)"] || t["TDP Değeri"] || "0";
    return acc + (parseInt(tdp.replace(/[^0-9]/g, "")) || 0);
  }, 0);

  const handleAddSystemToCart = () => {
    if (Object.keys(selections).length === 0) return toast.error("En az bir parça seçmelisin şefim!");
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
    toast.success("Mükemmel! Sistem ana sepete fırlatıldı. 🚀");
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans pb-24">
      <div className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-20 z-40">
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
        <div className="w-full lg:w-[70%] flex flex-col gap-6">
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
                    <div className="w-20 h-20 bg-black/40 rounded-xl p-2 flex items-center justify-center shrink-0">
                      <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00d2ff] transition-colors mb-1">{urun.isim}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 font-medium">
                          {urun.teknik_ozellikler && Object.entries(urun.teknik_ozellikler).slice(0, 2).map(([k, v]: any) => (
                            <span key={k}>{k}: <strong className="text-gray-400">{v}</strong></span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span className="text-base font-black text-white">{Number(urun.indirimliFiyat || urun.fiyat || 0).toLocaleString("tr-TR")} ₺</span>
                        <button onClick={() => handleSelectComponent(urun)} className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isItemChosen ? "bg-emerald-500 text-black" : "bg-zinc-800 text-gray-300 hover:bg-[#00d2ff] hover:text-black"}`}>
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
              Bu adıma uygun parça bulunamadı şefim.
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

        <div className="w-full lg:w-[30%] lg:sticky lg:top-40 flex flex-col gap-6">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col w-full">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>SİSTEM ÖZETİ</span>
              <span className="text-[10px] bg-zinc-800 px-2.5 py-0.5 rounded-md border border-white/5 text-[#00d2ff]">⚡ {toplamWatt}W TDP</span>
            </h3>

            <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto pr-1">
              {STEPS.map((step) => {
                const comp = selections[step.id];
                return (
                  <div key={step.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/40 border border-white/5 gap-2 group">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] text-[#00d2ff] font-black uppercase tracking-wide leading-none mb-0.5">{step.name}</span>
                      <span className="block text-gray-300 font-bold truncate">{comp ? comp.isim : "Henüz Seçilmedi..."}</span>
                    </div>
                    {comp && (
                      <button onClick={() => handleRemoveComponent(step.id)} className="text-gray-600 hover:text-red-500 font-black px-1 text-sm transition-colors opacity-0 group-hover:opacity-100">✕</button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col">
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">TOPLAM:</span>
                <span className="text-3xl font-black text-white tracking-tight">{toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">TL</span></span>
              </div>
              <button onClick={handleAddSystemToCart} className="w-full h-14 rounded-xl bg-[#00d2ff] text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#00c4db] transition-all">
                <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}