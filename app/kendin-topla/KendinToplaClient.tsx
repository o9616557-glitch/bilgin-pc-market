"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";
import { Cpu, Monitor, HardDrive, Zap, Wind, LayoutGrid, ShoppingBag, Check, AlertTriangle, Trash2, RefreshCw, ExternalLink, Save } from "lucide-react";

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

export default function KendinToplaClient({ initialProducts }: { initialProducts: any[] }) {
  const { sepeteEkle } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  // 🚀 YENİ: SİSTEM KAYDETME STATELERİ
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [systemName, setSystemName] = useState("");
  const activeStepInfo = STEPS[currentStep];

  useEffect(() => {
    const eskiSecimler = localStorage.getItem("bilgin_sihirbaz_selections");
    if (eskiSecimler) {
      try { setSelections(JSON.parse(eskiSecimler)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (Object.keys(selections).length > 0) {
      localStorage.setItem("bilgin_sihirbaz_selections", JSON.stringify(selections));
    }
  }, [selections]);

  useEffect(() => {
    if (previewProduct) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    }
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
      soket = sIslemci.sihirbaz_ozellikleri.soket || soket;
      bellek = sIslemci.sihirbaz_ozellikleri.bellek_tipi || bellek;
    }
    if (sAnakart?.sihirbaz_ozellikleri) {
      if (!soket) soket = sAnakart.sihirbaz_ozellikleri.soket;
      if (!bellek) bellek = sAnakart.sihirbaz_ozellikleri.bellek_tipi;
      yapi = sAnakart.sihirbaz_ozellikleri.anakart_yapisi || yapi;
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

  // 🚀 AKILLI UYUM MOTORU: Boşlukları ve harf büyüklüklerini affeder, seni kısıtlamaz.
  // 🚀 AKILLI UYUM MOTORU: Birebir eşleşme aramaz, "içinde geçiyor mu?" diye bakar!
  // Sıvı soğutuculardaki çoklu soketleri (AM4, AM5, LGA1700) artık saniyesinde anlar.
  // 🚀 KUSURSUZ UYUM MOTORU: Virgüllü listeleri anlar, boşlukları affeder!
  const gosterilecekUrunler = initialProducts.filter((urun) => {
    if (urun.kategoriSlug !== activeStepInfo.id) return false;

    const sz = urun.sihirbaz_ozellikleri || {};
    
    // Eğer iki taraftan biri boşsa (yani kısıtlama yoksa) direkt geçir
    const uyumluMu = (secilenDeger: any, urundekiDeger: any) => {
      if (!secilenDeger || !urundekiDeger) return true; 

      // Örn: "AM4, AM5, LGA1700" -> virgülle böl, boşlukları sil, ufak harf yap
      // Sonuç: ["am4", "am5", "lga1700"]
      const sListesi = secilenDeger.toString().toLowerCase().split(",").map((s: string) => s.replace(/\s+/g, ''));
      const uListesi = urundekiDeger.toString().toLowerCase().split(",").map((s: string) => s.replace(/\s+/g, ''));

      // Listelerden herhangi biri, diğerinin içindeki bir parçayla eşleşiyor mu?
      return sListesi.some((s: string) => 
        uListesi.some((u: string) => u.includes(s) || s.includes(u))
      );
    };

    // UYUMLULUK KONTROLLERİ
    if (!uyumluMu(soket, sz.soket)) return false;
    if (!uyumluMu(bellek, sz.bellek_tipi)) return false;
    if (!uyumluMu(yapi, sz.anakart_yapisi)) return false;
    if (!uyumluMu(radyator, sz.radyator_boyutu)) return false;

    return true;
  });

const handleSelectComponent = (product: any) => {
  // 🚀 ÇÖKME KALKANI: Seçilen ürünü hafızaya yazarken destan uzunluğundaki HTML'i siliyoruz.
  const hafifUrun = {
    _id: product._id,
    isim: product.isim,
    fiyat: product.fiyat,
    indirimliFiyat: product.indirimliFiyat,
    resim: product.resim,
    havaleIndirimi: product.havaleIndirimi || 0,
    sihirbaz_ozellikleri: product.sihirbaz_ozellikleri || {},
    kategoriSlug: product.kategoriSlug,
    // 🚀 İŞTE EKSİK OLAN HAYAT KURTARICI PARÇALAR:
    slug: product.slug || product._id?.toString(),
    stok: product.stok || 10
  };

  setSelections((prev) => ({ ...prev, [activeStepInfo.id]: hafifUrun }));
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
   // toast.success("Sistem başarıyla sıfırlandı.");
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

  const isSystemComplete = STEPS.every(step => !!selections[step.id]);

const handleAddSystemToCart = async () => {
      if (Object.keys(selections).length === 0) return toast.error("Lütfen sepete eklemek için en az bir parça seçiniz.");
      if (psuYetersiz) return toast.error("Güç kaynağı yetersiz. Lütfen daha yüksek kapasiteli bir güç kaynağı seçiniz.");
      if (gpuKasaAşimi) return toast.error("Seçilen ekran kartı mevcut kasaya sığmamaktadır. Lütfen uyumlu parçalar seçiniz.");

      // 🚀 ZIRHLI KAPI
      const toastId = toast.loading("📦 Sistem parçaları sepete zırhlanarak yükleniyor... Lütfen sayfadan ayrılmayın!");

      // for...of ile sırayla işliyoruz
      for (const urun of Object.values(selections) as any[]) {
        sepeteEkle({
          id: urun._id?.toString() || Math.random().toString(),
          isim: `[Toplama PC] ${urun.isim}`,
          fiyat: Number(urun.indirimliFiyat || urun.fiyat || 0),
          resim: urun.resim || "https://via.placeholder.com/150",
          varyasyon: "Sihirbaz Parçası",
          havaleIndirimi: urun.havaleIndirimi || 5,
          slug: urun.slug || urun.kategoriSlug || urun._id?.toString() || Math.random().toString(),
          stok: urun.stok || 10
        }, true); // Bulutu geçici olarak kilitledik

        // Göz kırpma hızında tarayıcıya yazıyoruz
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // 🚀 İŞTE ALTIN VURUŞ BURASI: 
      // Döngü bitti, 8 parça lokal hafızaya sorunsuz dizildi. 
      // Sayfayı yenilediğinde silinmesin diye TEK BİR PAKET halinde buluta yolluyoruz!
      try {
        const sonSepet = JSON.parse(localStorage.getItem("bilgin-sepet") || "[]");
        await fetch("/api/sepet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: sonSepet })
        });
      } catch (error) {
        // Hata olursa en azından lokal çalışmaya devam eder
      }

      // Masayı temizliyoruz
      localStorage.removeItem("bilgin_sihirbaz_selections");
      setSelections({});
      setCurrentStep(0);
      
      // Zırhı açıyoruz
      toast.success("Sistem başarıyla sepete eklendi ve PC Atölyesi temizlendi! 🛒", { id: toastId });
    };
  // 🚀 BUTONA BASILINCA GİRİŞ KONTROLÜ YAPAN MOTOR
  const handleSaveButtonClick = async () => {
    if (Object.keys(selections).length === 0) {
      return toast.error("Lütfen kaydetmek için en az bir parça seçiniz.");
    }
    
    try {
      const res = await fetch("/api/sistemlerim");
      if (res.status === 401) {
        return toast.error("Lütfen sisteminizi kaydetmek için önce üye girişi yapın! 🔑");
      }
      setSaveModalOpen(true);
    } catch (e) {
      setSaveModalOpen(true); 
    }
  };
// 🚀 YENİ: SİSTEM KAYDETME FONKSİYONU (GERÇEK VERİTABANI BAĞLANTISI)
  const handleSaveSystem = async () => {
    if (!systemName.trim()) return toast.error("Lütfen sisteminize bir isim verin!");

    // Kullanıcıya hissettirmeden arkaplanda kayıt başlıyor
    const toastId = toast.loading("Sisteminiz buluta kaydediliyor...");

    try {
      const res = await fetch("/api/sistemlerim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: systemName, selections: selections })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`"${systemName}" başarıyla sisteminize eklendi!`, { id: toastId });
        setSaveModalOpen(false);
        setSystemName("");
      } else {
        toast.error(data.message || "Kaydedilirken bir hata oluştu.", { id: toastId });
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu, lütfen tekrar deneyin.", { id: toastId });
    }
  };
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans pb-32">
      {/* sticky top: mobil header ~7.25rem, masaüstü header+katalog ~7rem */}
      <div className="sticky top-[7.25rem] lg:top-28 z-40 border-b border-white/5 bg-[#09090b]/95 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-center space-x-3 shrink-0 pt-1">
            <span className="text-[#00d2ff] font-black text-xl tracking-tight">🔧 SİSTEM ATÖLYESİ </span>
          </div>
          
          <div className="w-full lg:flex-1 lg:pl-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-4 border-b border-white/10 pb-2">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isSelected = !!selections[step.id];
                const isActive = currentStep === idx;
                
                let tabColorClass = "";
                if (isActive) {
                  tabColorClass = isSystemComplete ? "text-emerald-400" : "text-[#00d2ff]";
                } else if (isSelected) {
                  tabColorClass = "text-emerald-400";
                } else {
                  tabColorClass = "text-gray-400 hover:text-white";
                }

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`flex items-center justify-start space-x-1.5 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all relative ${tabColorClass}`}
                  >
                    <StepIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">{step.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-1 shrink-0" />}
                    
                    {isActive && (
                      <div className={`absolute bottom-[-9px] left-0 w-full h-[3px] z-10 ${
                        isSystemComplete 
                          ? "bg-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
                          : "bg-[#00d2ff] drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]"
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <activeStepInfo.icon className="w-6 h-6 text-[#00d2ff]" />
              {activeStepInfo.name} Listesi
            </h2>
          </div>

          {gosterilecekUrunler.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gosterilecekUrunler.map((urun) => {
                const isItemChosen = selections[activeStepInfo.id]?._id === urun._id;
                return (
                  <div key={urun._id} className={`bg-[#18181b] border-2 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group shadow-md ${isItemChosen ? "border-emerald-500 bg-emerald-500/5" : "border-white/10"}`}>
                    
                    <button 
                      onClick={() => setPreviewProduct(urun)}
                      className="w-20 h-20 bg-black/60 rounded-xl p-2 flex items-center justify-center shrink-0 cursor-pointer relative block group/img pointer-events-auto border border-white/5"
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
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-300 font-medium break-all break-words">
                          {urun.sihirbaz_ozellikleri && Object.entries(urun.sihirbaz_ozellikleri).filter(([_, v]) => v).slice(0, 3).map(([k, v]: any) => (
                            <span key={k} className="capitalize">{k.replace(/_/g, ' ')}: <strong className="text-gray-100">{v}</strong></span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                        <span className="text-base font-black text-white">{Number(urun.indirimliFiyat || urun.fiyat || 0).toLocaleString("tr-TR")} ₺</span>
                        
                        <button 
                          onClick={() => handleSelectComponent(urun)} 
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                            isItemChosen ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-700/80 text-white border-white/10 hover:bg-[#00d2ff] hover:text-black hover:border-[#00d2ff]"
                          }`}
                        >
                          {isItemChosen ? "Seçildi ✓" : "Ekle"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#18181b] border-2 border-white/10 rounded-2xl p-6 text-gray-400 text-sm">
              Bu kriterlere uygun parça bulunmamaktadır.
            </div>
          )}

          {isSystemComplete && (
            <div className="w-full bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-5 md:p-6 text-center mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300 select-none">
              <h3 className="text-emerald-400 font-black text-base md:text-lg uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                🎉 Tebrikler! Sisteminiz Tamamlandı
              </h3>
              <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
                Bütün bileşenleri başarıyla seçtiniz. Konfigürasyonunuz sepete eklenmeye hazır durumda.
              </p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[35%] lg:sticky lg:top-40 flex flex-col gap-6">
          <div className="bg-[#18181b] border-2 border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col w-full">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-300">SİSTEM ÖZETİ</h3>
                <span className="text-[10px] bg-red-950/60 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-md mt-1 w-max font-black animate-pulse">
                  ⚡ {toplamWatt}W Tüketim
                </span>
              </div>
              {Object.keys(selections).length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-gray-400 hover:text-red-400 text-xs font-black flex items-center gap-1.5 transition-colors px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10"
                >
                  <RefreshCw className="w-3 h-3" /> Tümünü Sıfırla
                </button>
              )}
            </div>

            {psuYetersiz && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Uyarı: Seçilen güç kaynağı ({seciliPsuGucu}W), gereken kapasiteyi ({(toplamWatt + 150)}W) karşılayamıyor. Lütfen daha güçlü bir PSU seçiniz.</span>
              </div>
            )}

            {gpuKasaAşimi && (
              <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Uyarı: Seçilen ekran kartı ({ekranKartiBoyutu}mm), kasanın desteklediği boyutu ({kasaGpuLimiti}mm) aşıyor.</span>
              </div>
            )}

            <div className="space-y-3 mb-5 max-h-[380px] overflow-y-auto pr-1">
              {STEPS.map((step) => {
                const comp = selections[step.id];
                return (
                  <div key={step.id} className="flex items-start justify-between text-sm p-3.5 rounded-xl bg-black/40 border border-white/10 gap-3 group transition-all hover:border-white/20 overflow-hidden">
                    <div className="min-w-0 flex-1 pr-1">
                      <span className="block text-[10px] text-[#00d2ff] font-black uppercase tracking-wider mb-0.5">{step.name}</span>
                      <span className={`block text-xs font-bold break-words whitespace-normal leading-relaxed ${comp ? "text-white" : "text-gray-500 italic"}`}>
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
                        className="text-gray-400 hover:text-red-500 p-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 transition-all shrink-0 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {toplamWatt > 0 && !psuYetersiz && (
              <div className="bg-zinc-800/80 border border-white/10 p-3 rounded-xl mb-4 text-[11px] text-gray-300 font-medium">
                📢 Önerilen Minimum Güç Kaynağı: <strong className="text-[#00d2ff] font-black">{(toplamWatt + 150)}W</strong>
              </div>
            )}

            <div className="hidden lg:flex border-t border-white/10 pt-4 flex-col gap-3">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">TOPLAM:</span>
                <span className="text-3xl font-black text-white tracking-tight">{toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">TL</span></span>
              </div>
              
              <button 
                onClick={handleAddSystemToCart} 
                disabled={psuYetersiz || gpuKasaAşimi}
                className={`w-full h-14 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                  (psuYetersiz || gpuKasaAşimi) ? "bg-zinc-800 text-gray-500 cursor-not-allowed border border-white/10" : "bg-[#00d2ff] text-black hover:bg-[#00c4db]"
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> { (psuYetersiz || gpuKasaAşimi) ? "Uyumsuzlukları Gideriniz" : "Sistemi Sepete Ekle" }
              </button>
            </div>
            {/* 🚀 YENİ: SİSTEMİ KAYDET BUTONU (MASAÜSTÜ) */}
              <button 
               onClick={handleSaveButtonClick}
                disabled={Object.keys(selections).length === 0}
                className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all border mt-3 ${
                  Object.keys(selections).length === 0 ? "bg-zinc-800/50 text-gray-600 cursor-not-allowed border-white/5" : "bg-transparent text-[#00d2ff] border-[#00d2ff]/30 hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]"
                }`}
              >
                <Save className="w-4 h-4" /> Sistemi Kaydet
              </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#18181b]/95 backdrop-blur-2xl border-t-2 border-white/10 px-4 sm:px-6 py-4 z-50 flex items-center justify-between shadow-[0_-15px_30px_rgba(0,0,0,0.8)] select-none">
         <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] font-black tracking-wider uppercase mb-0.5">TOPLAM TUTAR</span>
            <span className="text-2xl font-black text-white leading-none">
              {toplamFiyat.toLocaleString("tr-TR")} <span className="text-sm text-[#00d2ff]">₺</span>
            </span>
         </div>
        <div className="flex items-center gap-2">
           {/* 🚀 YENİ: SİSTEMİ KAYDET BUTONU (MOBİL) */}
           <button 
          onClick={handleSaveButtonClick}
             disabled={Object.keys(selections).length === 0}
             className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center transition-all shadow-lg border ${
               Object.keys(selections).length === 0 ? "bg-zinc-800/50 text-gray-600 cursor-not-allowed border-white/5" : "bg-[#18181b] text-[#00d2ff] border-[#00d2ff]/30 hover:bg-[#00d2ff]/10"
             }`}
           >
             <Save className="w-5 h-5" />
           </button>

           <button 
             onClick={handleAddSystemToCart}
             disabled={psuYetersiz || gpuKasaAşimi}
             className={`h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
               (psuYetersiz || gpuKasaAşimi) ? "bg-zinc-800 text-gray-500 cursor-not-allowed border border-white/10" : "bg-[#00d2ff] text-black"
             }`}
           >
              <ShoppingBag className="w-4 h-4" /> Sepete Ekle
           </button>
         </div>
      </div>

      {previewProduct && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-[#121214] border-2 border-white/10 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#18181b] shrink-0">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#00d2ff]">Ürün Detay İnceleme</h3>
              <button 
                onClick={() => setPreviewProduct(null)}
                className="text-gray-300 hover:text-white px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors font-black text-xs uppercase tracking-widest"
              >
                Kapat ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-5 gap-6 content-start">
              <div className="md:col-span-2 flex flex-col items-center gap-4 sm:gap-6 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6 md:sticky md:top-0 h-max">
                <div className="w-full aspect-square bg-black/60 rounded-2xl p-6 border border-white/10 flex items-center justify-center">
                  <img src={previewProduct.resim} alt={previewProduct.isim} className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                </div>
                <div className="w-full bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">AVANTAJLI FİYAT</span>
                  <span className="text-3xl font-black text-emerald-400">{Number(previewProduct.indirimliFiyat || previewProduct.fiyat || 0).toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div>
                  <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase block mb-1">{previewProduct.marka || "BİLEŞEN"}</span>
                  <h2 className="text-lg md:text-xl font-black text-white leading-snug">{previewProduct.isim}</h2>
                </div>

                {previewProduct.teknik_ozellikler && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 border-b border-white/10 pb-2">Teknik Özellikler</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs mt-2">
                      {Object.entries(previewProduct.teknik_ozellikler).map(([key, value]: any) => (
                        <div key={key} className="flex justify-between py-2.5 px-4 bg-white/[0.03] border border-white/10 rounded-lg gap-4">
                          <span className="text-gray-400 font-bold capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-gray-200 font-extrabold text-right break-all">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewProduct.aciklama && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 border-b border-white/10 pb-2 mt-4">Ürün Açıklaması</h4>
                    <div 
                      className="text-xs text-gray-300 leading-relaxed font-medium break-words prose prose-invert max-w-none mt-2"
                      dangerouslySetInnerHTML={{ __html: previewProduct.aciklama }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-[#18181b] flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={() => setPreviewProduct(null)}
                className="px-5 py-3 rounded-xl text-xs font-black uppercase bg-zinc-800 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                Kapat
              </button>
              
           <button 
                onClick={() => {
                  handleSelectComponent(previewProduct);
                  setPreviewProduct(null);
                }}
                className="px-6 py-3 rounded-xl text-xs font-black uppercase bg-[#00d2ff] text-black hover:bg-[#00c4db] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              >
                <ShoppingBag className="w-4 h-4" /> Ekle
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* 🚀 SİSTEMİ KAYDET MODALI (GARANTİLİ GÖRÜNÜR VERSİYON) */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#121214] border border-white/10 w-full max-w-sm rounded-3xl p-6 md:p-8 flex flex-col relative shadow-2xl">
            
            <div className="w-14 h-14 rounded-full border border-[#00d2ff]/30 flex items-center justify-center mb-6 bg-[#00d2ff]/10 mx-auto">
              <Save className="w-6 h-6 text-[#00d2ff]" />
            </div>
            
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 text-center">Sistemi Kaydet</h3>
            <p className="text-gray-400 text-xs text-center mb-6 leading-relaxed">
              Topladığınız bu sisteme bir isim verin. Profilinizdeki "Sistemlerim" sekmesinden istediğiniz zaman ulaşabilirsiniz.
            </p>
            
            <input 
              type="text" 
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="Örn: Hayalimdeki Canavar Sistem"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-[#00d2ff]/50 transition-colors font-bold mb-6"
              autoFocus
            />

            <div className="flex gap-3">
              <button 
                onClick={() => { setSaveModalOpen(false); setSystemName(""); }}
                className="flex-1 px-4 py-3.5 rounded-xl text-xs font-black uppercase bg-zinc-800 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={handleSaveSystem}
                className="flex-1 px-4 py-3.5 rounded-xl text-xs font-black uppercase bg-[#00d2ff] text-black hover:bg-[#00c4db] transition-colors shadow-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}