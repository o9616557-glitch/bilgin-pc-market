"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { 
  Cpu, 
  Monitor, 
  HardDrive, 
  Zap, 
  Wind, 
  LayoutGrid, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Check, 
  ArrowRight 
} from "lucide-react";

// 🚀 SİHİRBAZIN ADIM ADIM AKIŞ SIRALAMASI
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

  // Müşterinin seçtiği parçaların hafızası
  const [selections, setSelections] = useState<Record<string, any>>({});

  // Uyum Kilitleri (Hafızada tutulan teknik detaylar)
  const [uSoket, setUSoket] = useState<string>("");
  const [uBellek, setUBellek] = useState<string>("");
  const [uAnakartYapisi, setUAnakartYapisi] = useState<string>("");

  const activeStepInfo = STEPS[currentStep];

  // 🔄 HER ADIM DEĞİŞTİĞİNDE UYUMLU PARÇALARI API'DEN ÇEKEN MOTOR
  useEffect(() => {
    const fetchUyumluParcalar = async () => {
      setLoading(true);
      try {
        // API'ye parametreleri mermi gibi fırlatıyoruz şefim
        let url = `/api/kendin-topla?kategori=${activeStepInfo.id}`;
        if (uSoket) url += `&soket=${encodeURIComponent(uSoket)}`;
        if (uBellek) url += `&bellek=${encodeURIComponent(uBellek)}`;
        if (uAnakartYapisi) url += `&anakartYapisi=${encodeURIComponent(uAnakartYapisi)}`;

        const res = await fetch(url);
        const resData = await res.json();
        if (resData.success) {
          setProducts(resData.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUyumluParcalar();
  }, [currentStep, uSoket, uBellek, uAnakartYapisi]);

  // 🖱️ BİR PARÇA SEÇİLDİĞİNDE ÇALIŞAN ZEKÂ MEKANİZMASI
  const handleSelectComponent = (product: any) => {
    const stepId = activeStepInfo.id;
    
    // Parçayı hafızaya kaydet
    setSelections((prev) => ({ ...prev, [stepId]: product }));

    // 🚀 ZİNCİRLEME UYUM KİLİTLERİNİ AYARLAMA 🚀
    
    // 1. İşlemci seçildiyse: Soketini ve Bellek Tipini cımbızla çek
    if (stepId === "islemci") {
      const soket = product.teknik_ozellikler?.["Soket Tipi"] || "";
      const bellekDesteği = product.teknik_ozellikler?.["Bellek Desteği"] || "";
      
      setUSoket(soket);
      // Detaylı yazıdan (DDR5 5600 vs.) sadece "DDR5" veya "DDR4" kısmını ayıkla şefim
      if (bellekDesteği.toLowerCase().includes("ddr5")) setUBellek("DDR5");
      else if (bellekDesteği.toLowerCase().includes("ddr4")) setUBellek("DDR4");
    }

    // 2. Anakart seçildiyse: Kasaya sığması için yapısını (ATX/M-ATX) hafızaya al
    if (stepId === "anakart") {
      const yapi = product.teknik_ozellikler?.["Anakart Yapısı"] || "ATX";
      setUAnakartYapisi(yapi);
    }

    // Seçim yapınca otomatik bir sonraki adıma fırlat (Son adım değilse)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // ❌ SEÇİLEN BİR PARÇAYI İPTAL ETME (SİLME)
  const handleRemoveComponent = (stepId: string) => {
    setSelections((prev) => {
      const yeni = { ...prev };
      delete yeni[stepId];
      return yeni;
    });

    // Kilitleri de sıfırla ki filtreler gevşesin şefim
    if (stepId === "islemci") {
      setUSoket("");
      setUBellek("");
    }
    if (stepId === "anakart") {
      setUAnakartYapisi("");
    }
  };

  // 💰 ANLIK TOPLAM FİYAT HESAPLAMA
  const toplamFiyat = Object.values(selections).reduce((acc, curr) => {
    const fiyat = curr.indirimliFiyat ? Number(curr.indirimliFiyat) : Number(curr.fiyat || 0);
    return acc + fiyat;
  }, 0);

  // ⚡ ANLIK TOPLAM GÜÇ TÜKETİMİ (WATT) HESAPLAMA
  const toplamWatt = Object.values(selections).reduce((acc, curr) => {
    const tdpYazisi = curr.teknik_ozellikler?.["Güç Tüketimi (TDP)"] || curr.teknik_ozellikler?.["TDP Değeri"] || "0";
    const wattSayisi = parseInt(tdpYazisi.replace(/[^0-9]/g, "")) || 0;
    return acc + wattSayisi;
  }, 0);

  // 🛒 TOPLANAN SİSTEMİ BÜTÜNSEL OLARAK SEPETE FIRLATMA
  const handleAddSystemToCart = () => {
    const secilenAdet = Object.keys(selections).length;
    if (secilenAdet === 0) return toast.error("En az bir parça seçmelisin şefim!");

    // Seçilen bütün parçaları döngüyle ana sepete ekliyoruz patron
    Object.values(selections).forEach((urun) => {
      const gecerliFiyat = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : Number(urun.fiyat || 0);
      sepeteEkle({
        id: urun._id?.toString() || urun.id?.toString(),
        isim: `[Toplama PC Component] ${urun.isim}`,
        fiyat: gecerliFiyat,
        resim: urun.resim || "https://via.placeholder.com/150",
        varyasyon: "Kendin Topla Parçası",
        havaleIndirimi: urun.havaleIndirimi || 5
      });
    });

    toast.success("Mükemmel! Topladığın sistem sepete eklendi. 🚀");
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans pb-24">
      {/* ÜST BAŞLIK ALANI */}
      <div className="border-b border-white/5 bg-[#09090b]/50 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center space-x-3 shrink-0 mr-6">
            <span className="text-[#00d2ff] font-black text-xl sm:text-2xl">🔧 PC SİHİRBAZI</span>
            <span className="text-gray-600 font-bold">|</span>
            <span className="text-gray-400 text-xs sm:text-sm font-medium">Kendi Canavarını İnşa Et</span>
          </div>
          
          {/* ÜST ADIM ÇUBUĞU (ADIMLAR BURADA AKAR) */}
          <div className="flex items-center space-x-2 shrink-0">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isSelected = !!selections[step.id];
              const isActive = currentStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                    isActive 
                      ? "bg-[#00d2ff]/10 border-[#00d2ff] text-[#00d2ff]" 
                      : isSelected
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-zinc-900/50 border-white/5 text-gray-500 hover:text-white"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{step.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ANA İÇERİK ALANI (İKİ KOLONLU PREMIUM DÜZEN) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* SOL KOLON: AKTİF ADIMA AİT PARÇA LİSTESİ */}
        <div className="w-full lg:w-[70%] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <activeStepInfo.icon className="w-6 h-6 text-[#00d2ff]" />
              {activeStepInfo.name} Listesi
            </h2>
            <span className="bg-zinc-900 border border-white/5 text-gray-400 text-xs px-3 py-1 rounded-full font-bold">
              {products.length} Ürün Bulundu
            </span>
          </div>

          {/* YÜKLENİYOR SİMGE PANELİ */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#00d2ff]" />
              <span className="text-xs uppercase tracking-widest font-black">Uyumlu Parçalar Hesaplanıyor...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((urun) => {
                const isItemChosen = selections[activeStepInfo.id]?._id === urun._id;
                const urunFiyati = urun.indirimliFiyat ? Number(urun.indirimliFiyat) : Number(urun.fiyat || 0);
                return (
                  <div 
                    key={urun._id} 
                    className={`bg-[#09090b] border rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group ${
                      isItemChosen ? "border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.05)]" : "border-white/5"
                    }`}
                  >
                    <div className="w-20 h-20 bg-black/40 rounded-xl p-2 flex items-center justify-center shrink-0">
                      <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00d2ff] transition-colors mb-1">{urun.isim}</h4>
                        {/* Teknik özellikleri listeleme */}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 font-medium">
                          {urun.teknik_ozellikler && Object.entries(urun.teknik_ozellikler).slice(0, 2).map(([k, v]: any) => (
                            <span key={k}>{k}: <strong className="text-gray-400">{v}</strong></span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span className="text-base font-black text-white">{urunFiyati.toLocaleString("tr-TR")} ₺</span>
                        <button 
                          onClick={() => handleSelectComponent(urun)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            isItemChosen 
                              ? "bg-emerald-500 text-black font-black" 
                              : "bg-zinc-800 text-gray-300 hover:bg-[#00d2ff] hover:text-black"
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
              Bu adıma uygun parça bulunamadı şefim. <br />
              <span className="text-xs text-gray-600 mt-2 block">(Önceki adımlarda seçtiğin soket/bellek kriterlerine uygun malzeme panelde kalmamış olabilir.)</span>
            </div>
          )}

          {/* ALT GEÇİŞ BUTONLARI */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => p - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Önceki Adım
            </button>
            <button 
              disabled={currentStep === STEPS.length - 1}
              onClick={() => setCurrentStep((p) => p + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Sonraki Adım <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SAĞ KOLON: ANLIK SEPET HESAP MAKİNESİ PANELİ (PC SÜRÜMÜ) */}
        <div className="w-full lg:w-[30%] lg:sticky lg:top-40 flex flex-col gap-6">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col w-full">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>SİSTEM ÖZETİ</span>
              <span className="text-[10px] bg-zinc-800 px-2.5 py-0.5 rounded-md border border-white/5 text-[#00d2ff]">
                ⚡ {toplamWatt}W TDP
              </span>
            </h3>

            {/* SEÇİLEN PARÇALARIN KÜÇÜK LİSTESİ */}
            <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto pr-1">
              {STEPS.map((step) => {
                const comp = selections[step.id];
                return (
                  <div key={step.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/40 border border-white/5 gap-2 group">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] text-[#00d2ff] font-black uppercase tracking-wide leading-none mb-0.5">{step.name}</span>
                      <span className="block text-gray-300 font-bold truncate">
                        {comp ? comp.isim : "Henüz Seçilmedi..."}
                      </span>
                    </div>
                    {comp ? (
                      <button 
                        onClick={() => handleRemoveComponent(step.id)} 
                        className="text-gray-600 hover:text-red-500 font-black px-1 text-sm transition-colors opacity-0 group-hover:opacity-100"
                        title="Parçayı Çıkar"
                      >
                        ✕
                      </button>
                    ) : (
                      <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full shrink-0"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FİYAT TABLOSU VE SATIN ALMA */}
            <div className="border-t border-white/10 pt-4 flex flex-col">
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">TOPLAM BÜTÇE:</span>
                <span className="text-3xl font-black text-white tracking-tight">
                  {toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">TL</span>
                </span>
              </div>

              <button 
                onClick={handleAddSystemToCart}
                className="w-full h-14 rounded-xl bg-[#00d2ff] text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,210,255,0.15)]"
              >
                <ShoppingBag className="w-4 h-4" /> Sistemi Sepete Ekle
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 📱 MOBİL İÇIN ALT SABİT PANEL (TELEFONDA GEZEN MÜŞTERİLER İÇİN) 📱 */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#09090b]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3.5 z-50 flex items-center justify-between shadow-[0_-15px_30px_rgba(0,0,0,0.8)] select-none">
         <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] font-black tracking-wider uppercase mb-0.5">SİSTEM TUTARI ({Object.keys(selections).length} Parça)</span>
            <span className="text-2xl font-black text-white leading-none">
              {toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">₺</span>
            </span>
         </div>
         <button 
           onClick={handleAddSystemToCart}
           className="h-12 px-5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-[#00d2ff] text-black shadow-[0_0_15px_rgba(0,210,255,0.2)] hover:bg-[#00c4db]"
         >
            <ShoppingBag className="w-4 h-4" /> Sistemi Ekle
         </button>
      </div>

    </div>
  );
}