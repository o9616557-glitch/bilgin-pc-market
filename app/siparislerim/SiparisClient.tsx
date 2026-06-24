"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Trash2, Copy, Check, RefreshCw, ArrowLeft, MessageSquare, 
  PackageOpen, Package, Truck, CheckCircle2, Clock, 
  User, ShieldCheck, CreditCard, PackageX 
} from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  initialOrders: any[];
}

export default function SiparisClient({ initialOrders }: Props) {
  const router = useRouter();
  
  // 🔥 İLK AÇILIŞ: Sıralamayı sabitledik
  const siraliBaslangic = [...initialOrders]
    .filter(o => o.gizlendi !== true)
    .sort((a, b) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());
  const [orders, setOrders] = useState<any[]>(siraliBaslangic);
  const ordersRef = useRef<any[]>(siraliBaslangic);
  const [refreshing, setRefreshing] = useState(false); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // 🔥 Sunucudan yeni veri akarsa yine gizlenenleri temizler
  useEffect(() => {
    if (initialOrders.length > 0) {
      const siraliGelen = [...initialOrders]
        .filter(o => o.gizlendi !== true)
        .sort((a, b) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());
      setOrders(siraliGelen);
      ordersRef.current = siraliGelen;
    }
  }, [initialOrders]);

  // 🚀 SESSİZ CANLI TAKİP MOTORU
  useEffect(() => {
    const gercegiKontrolEt = async () => {
      if (refreshing) return; 
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        });
        const data = await res.json();
        
        if (res.ok && data.orders) {
           const siraliYeni = [...data.orders].sort((a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());
           setOrders(siraliYeni);
           ordersRef.current = siraliYeni;
        }
      } catch (error) {
      }
    };

    gercegiKontrolEt();
    const radar = setInterval(gercegiKontrolEt, 10000); 
    return () => clearInterval(radar); 
  }, [refreshing]);

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      const res = await fetch("/api/orders?id=" + orderToDelete, { method: "DELETE" });
      if (!res.ok) setErrorMsg("Sipariş silinirken bir hata oluştu.");
      setOrderToDelete(null);
      router.refresh();
    } catch (error) {
      setErrorMsg("Bağlantı hatası sebebiyle silinemedi.");
      setOrderToDelete(null);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const DurumRozetiGoster = ({ durum, isRefreshing }: { durum: string, isRefreshing: boolean }) => {
    if (isRefreshing) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <RefreshCw className="w-4 h-4 animate-spin" /> GÜNCELLENİYOR...
        </div>
      );
    }
    const d = (durum || "").toLocaleLowerCase("tr-TR");
    if (d.includes("iptal") || d.includes("i̇ptal")) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> SİPARİŞ İPTAL EDİLDİ
        </div>
      );
    }
    if (d.includes("teslim") || d.includes("tamam") || d.includes("bit") || d.includes("son")) {
       return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <CheckCircle2 className="w-4 h-4" /> TESLİM EDİLDİ
        </div>
      );
    }
    if (d.includes("kargo")) {
       return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.15)]">
           <Truck className="w-4 h-4 animate-bounce" /> KARGODA
        </div>
      );
    }
    if (d.includes("hazır") || d.includes("ödendi") || d.includes("odendi")) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <Package className="w-4 h-4" /> SİPARİŞ HAZIRLANIYOR
        </div>
      );
    }
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-300 text-xs font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-4 h-4" /> SİPARİŞ ALINDI
        </div>
      );
  };

  const getGuzelOdemeYontemi = (metin: string) => {
    if (!metin) return "Havale / EFT";
    const m = metin.toLowerCase();
    if (m === "kart" || m.includes("kredi") || m.includes("iyzico")) return "Kredi Kartı";
    if (m === "havale" || m.includes("eft")) return "Havale / EFT";
    return metin; 
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
      
      {/* 🚀 ARKA PLAN PARLAMASI (STANDART TURKUAZ/MAVİ) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.05] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* ⬅️ SOL MENÜ (Standart ve Sabit) */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <User className="w-4 h-4 sm:w-5 sm:h-5" /> Profil
              </Link>
              <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ İÇERİK (Kargolarım / Sipariş Geçmişi) */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
          
          {/* 🚀 HERO ALANI */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Sipariş Geçmişim</h1>
                <p className="text-cyan-400/80 text-xs sm:text-sm font-medium tracking-wide">
                  Toplam: <span className="font-black text-cyan-400">{orders.length}</span> Sipariş
                </p>
              </div>
            </div>

            <Link 
              href="/" 
              prefetch={true}
              className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl border border-slate-700 bg-[#020617] hover:bg-slate-800 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all shrink-0"
            >
              MAĞAZAYA DÖN
            </Link>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm flex justify-between items-center shadow-lg">
                <span className="font-medium">{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300 transition-colors">✕</button>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <PackageX className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Siparişiniz Yok</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                Sipariş geçmişiniz şu an boş görünüyor. Size en uygun teknolojileri keşfetmek için mağazamızı inceleyebilirsiniz.
              </p>
              <Link 
                href="/" 
                prefetch={true} 
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order: any) => {
                const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
                const adminMesaji = order.musteriMesaji || order.mesaj || order.adminMesaj || order.kargoNotu || order.kargoTakipNo || "";
                const durumMetni = order.durum || order.status || "";
                const gosterilecekYontem = getGuzelOdemeYontemi(order.odemeYontemi || order.paymentMethod);

                return (
                  <div key={order._id} className={`group border bg-[#0f172a] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${refreshing ? 'border-slate-800/50 opacity-80 scale-[0.99]' : 'border-slate-800 hover:border-cyan-500/40 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] scale-100'}`}>
                    
                    <button
                      onClick={() => handleDeleteClick(order._id)}
                      className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-[#020617] border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all shadow-md z-20"
                      title="Siparişi Geçmişten Sil"
                      disabled={refreshing}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 pr-12">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
                          SİPARİŞ NO: <span className="text-cyan-400 font-black">{currentSiparisKodu}</span>
                          <button 
                            onClick={() => handleCopy(currentSiparisKodu)}
                            className="text-slate-400 hover:text-cyan-400 transition-colors bg-[#020617] border border-slate-800 p-1.5 rounded-lg"
                          >
                            {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </p>
                        <p className="text-xs text-slate-500 font-medium mb-3">
                          Tarih: <span className="text-slate-300">{new Date(order.createdAt || order.tarih).toLocaleDateString("tr-TR")}</span>
                        </p>
                        <DurumRozetiGoster durum={durumMetni} isRefreshing={refreshing} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#020617] text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800 font-black uppercase tracking-wider">
                          {gosterilecekYontem}
                        </span>
                      </div>
                    </div>

                    {order.siparisNotu && order.siparisNotu.trim() !== "" && order.siparisNotu !== "Not eklenmemiş" && (
                      <div className={`mt-6 bg-[#020617] border border-slate-800 p-4 rounded-xl flex items-start gap-3 transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                        <MessageSquare className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">SİPARİŞ NOTUNUZ</p>
                          <p className="text-sm text-slate-200 font-medium leading-relaxed">{order.siparisNotu}</p>
                        </div>
                      </div>
                    )}

                    {adminMesaji && adminMesaji.trim() !== "" && adminMesaji !== "Not eklenmemiş" && adminMesaji !== order.siparisNotu && (
                      <div className={`mt-4 bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl flex items-start gap-3 transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                        <MessageSquare className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-1">MAĞAZA MESAJI / KARGO NOTU</p>
                          <p className="text-sm text-slate-200 font-medium leading-relaxed">{adminMesaji}</p>
                        </div>
                      </div>
                    )}

                  {/* 🚀 ÜRÜNLER LİSTESİ (SABİT YÜKSEKLİK VE KAYDIRMA ÇUBUĞU) */}
                    <div className={`border-t border-slate-800/80 pt-6 mt-6 transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="max-h-[340px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#020617] p-4 sm:p-5 rounded-2xl border border-slate-800 transition-colors hover:border-cyan-500/30 shrink-0">
                            
                            <div className="w-full sm:w-28 sm:h-28 flex-shrink-0 flex justify-center items-center bg-[#0f172a] py-6 sm:py-0 rounded-xl border border-slate-800 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              {item.image || item.resim ? (
                                <img 
                                  src={item.image || item.resim} 
                                  alt={item.title || item.isim} 
                                  className="w-24 h-24 sm:w-20 sm:h-20 object-contain drop-shadow-md z-10"
                                  onError={(e) => { 
                                    e.currentTarget.src = "https://placehold.co/200x200/0f172a/06b6d4?text=Gorsel+Yok" 
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-[#0f172a] border border-slate-700 flex items-center justify-center z-10">
                                  <PackageOpen className="w-6 h-6 text-slate-500" />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row flex-grow w-full justify-between sm:items-center gap-4">
                              <div className="w-full sm:w-auto flex-grow text-center sm:text-left">
                                <p className="font-bold text-slate-200 break-words whitespace-normal leading-relaxed text-sm">
                                  {item.title || item.isim}
                                </p>
                              </div>

                              <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0 flex-shrink-0 gap-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase bg-[#0f172a] px-3 py-1.5 rounded-lg border border-slate-800">
                                  {item.quantity || item.adet} ADET
                                </p>
                                <p className="font-black text-cyan-400 text-lg whitespace-nowrap">
                                  {Number((item.price || item.fiyat || 0) * (item.quantity || item.adet || 1)).toLocaleString("tr-TR")} TL
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`mt-6 flex justify-between items-center bg-[#020617] border border-slate-800 p-5 rounded-xl transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Genel Toplam</span>
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} <span className="text-sm text-slate-500">TL</span>
                      </span>
                    </div>
                    {/* 🚀 GİZLİ KABLO: İptal / İade Talebi Başlatma Butonu */}
                    <div className="mt-3 flex justify-end">
                      <Link 
                        href={`/destek-taleplerim?siparisNo=${currentSiparisKodu}&konu=${durumMetni.toLowerCase().includes('teslim') ? 'iade' : 'iade'}`}
                        className="w-full sm:w-auto text-center px-5 py-3 rounded-xl bg-[#020617] border border-slate-800 hover:bg-slate-800/80 text-cyan-400 hover:text-cyan-300 font-black text-xs uppercase tracking-widest transition-all duration-300"
                      >
                        İptal / İade Talebi Aç
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* SİLME MODALI */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            
            <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-5 bg-red-500/10 relative z-10">
              <Trash2 className="w-7 h-7 text-red-400 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10">Siparişi Geçmişten Sil</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed relative z-10">
              Bu siparişi geçmişinizden kalıcı olarak silmek istediğinize emin misiniz?
              <span className="block text-red-400 font-bold mt-2">Bu işlem geri alınamaz!</span>
            </p>
            
            <div className="flex w-full gap-3 relative z-10">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                İptal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}