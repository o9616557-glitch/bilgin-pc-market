"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, Copy, Check, RefreshCw, Filter, 
  PackageOpen, Package, Truck, CheckCircle2, Clock, 
  User, ShieldCheck, CreditCard, PackageX, ChevronRight, Calendar,
  ArrowLeft, MessageSquare, ShoppingCart, Star, AlertCircle, Info
} from "lucide-react"; 
import Link from "next/link";
import { useOrders } from "@/app/OrderContext"; 

export default function SiparisClient() {
  const { orders: contextOrders, loading: contextLoading, refreshOrders } = useOrders();
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    setLocalOrders(contextOrders);
  }, [contextOrders]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const [zamanFiltresi, setZamanFiltresi] = useState<string>("tumu");
  const [durumFiltresi, setDurumFiltresi] = useState<string>("tumu");

  const handleDeleteClick = (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setLocalOrders(prev => prev.filter((order) => order._id !== orderToDelete));
      const res = await fetch("/api/orders?id=" + orderToDelete, { method: "DELETE" });
      if (!res.ok) setErrorMsg("Sipariş silinirken bir hata oluştu.");
      setOrderToDelete(null);
      refreshOrders(); 
    } catch (error) {
      setErrorMsg("Bağlantı hatası sebebiyle silinemedi.");
      setOrderToDelete(null);
    }
  };

  const handleCopy = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const DurumRozetiGoster = ({ durum }: { durum: string }) => {
    const d = (durum || "").toLocaleLowerCase("tr-TR");
    if (d.includes("iptal") || d.includes("i̇ptal")) return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest shadow-inner">
           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> İPTAL EDİLDİ
        </div>
    );
    if (d.includes("teslim") || d.includes("tamam") || d.includes("bit") || d.includes("son")) return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest shadow-inner">
           <CheckCircle2 className="w-3 h-3" /> TESLİM EDİLDİ
        </div>
    );
    if (d.includes("kargo")) return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.15)]">
           <Truck className="w-3 h-3 animate-bounce" /> KARGODA
        </div>
    );
    if (d.includes("hazır") || d.includes("ödendi") || d.includes("odendi")) return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest shadow-inner">
           <Package className="w-3 h-3" /> HAZIRLANIYOR
        </div>
    );
    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20 text-slate-300 text-[9px] font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-3 h-3" /> ALINDI
        </div>
    );
  };

  const filtrelenmisSiparisler = localOrders.filter(order => {
    let zamanUygun = true;
    let durumUygun = true;
    const orderDate = new Date(order.createdAt || order.tarih);
    const now = new Date();
    if (zamanFiltresi === "son30") {
      const otuzGunOnce = new Date();
      otuzGunOnce.setDate(now.getDate() - 30);
      zamanUygun = orderDate >= otuzGunOnce;
    } else if (zamanFiltresi === "2026") zamanUygun = orderDate.getFullYear() === 2026;
    else if (zamanFiltresi === "2025") zamanUygun = orderDate.getFullYear() === 2025;

    const d = (order.durum || order.status || "").toLocaleLowerCase("tr-TR");
    if (durumFiltresi === "teslim") durumUygun = d.includes("teslim") || d.includes("tamam");
    else if (durumFiltresi === "kargo") durumUygun = d.includes("kargo");
    else if (durumFiltresi === "iptal") durumUygun = d.includes("iptal") || d.includes("i̇ptal");
    else if (durumFiltresi === "devam") durumUygun = !d.includes("teslim") && !d.includes("iptal") && !d.includes("i̇ptal");
    return zamanUygun && durumUygun;
  });

  if (contextLoading && localOrders.length === 0) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip animate-in fade-in duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.03] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* 🚀 SOL MENÜ ARTIK HEP SABİT */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-3 sm:p-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-lg transition-all font-medium">
                <User className="w-4 h-4" /> Profil
              </Link>
              <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-lg transition-all font-medium">
                <CreditCard className="w-4 h-4" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-lg transition-all font-medium">
                <ShieldCheck className="w-4 h-4" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* SAĞ İÇERİK (Liste veya Detay) */}
        <div className="flex-1 flex flex-col min-w-0 w-full relative">
          
          {selectedOrder ? (
            /* =================================================================================== */
            /* 🚀 BÖLÜM 1: DETAY EKRANI (Daha kibar, yapışkan butonlu ve düzgün buton hizalı) */
            /* =================================================================================== */
            <div className="flex flex-col gap-5 animate-in slide-in-from-right-8 fade-in duration-300">
              
              {/* 🚀 YAPIŞKAN GERİ BUTONU (Telefonda aşağı kayınca üstte asılı kalır) */}
              <div className="sticky top-[80px] lg:top-28 z-40 bg-[#050814]/90 backdrop-blur-md py-3 border-b border-slate-800/50 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:border-none sm:bg-transparent sm:py-0">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all rounded-lg font-bold text-xs uppercase tracking-widest w-max shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
                </button>
              </div>

              {/* Sipariş Özet Kartı (Küçültüldü) */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h1 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">Sipariş Detayı</h1>
                    <span className="bg-[#020617] border border-slate-700 px-2.5 py-1 rounded-md text-cyan-400 font-black text-[10px] sm:text-xs tracking-widest flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                      #{selectedOrder.siparisKodu || selectedOrder.orderNumber || selectedOrder._id.slice(-8).toUpperCase()}
                      <button onClick={(e) => handleCopy(selectedOrder.siparisKodu || selectedOrder._id.slice(-8).toUpperCase(), e)} className="text-slate-500 hover:text-white transition-colors">
                        {copiedCode === (selectedOrder.siparisKodu || selectedOrder._id.slice(-8).toUpperCase()) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                  </div>
                  <p className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(selectedOrder.createdAt || selectedOrder.tarih).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[#020617] p-3 rounded-lg border border-slate-800 w-full md:w-auto">
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">SİPARİŞ DURUMU</p>
                    <p className="text-white font-bold capitalize text-sm">
                      {selectedOrder.durum || selectedOrder.status || "Alındı"}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-cyan-500" /> Ürünler ({selectedOrder.items?.length || 0})
              </h2>

              {/* Ürün Listesi (Küçültüldü ve Kartlar Sabitlendi) */}
              <div className="space-y-4">
                {selectedOrder.items?.map((item: any, idx: number) => {
                  const isTeslimEdildi = (selectedOrder.durum || selectedOrder.status || "").toLowerCase().includes("teslim") || (selectedOrder.durum || selectedOrder.status || "").toLowerCase().includes("tamam");
                  const isIptal = (selectedOrder.durum || selectedOrder.status || "").toLowerCase().includes("iptal");
                  const siparisTarihi = new Date(selectedOrder.createdAt || selectedOrder.tarih);
                  const iadeBitisTarihi = new Date(siparisTarihi.getTime() + (17 * 24 * 60 * 60 * 1000));
                  const bugun = new Date();
                  const iadeSuresiGectiMi = bugun > iadeBitisTarihi;

                  return (
                    // Kart esnemesin diye items-start verildi
                    <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                      
                      {/* Resim küçültüldü */}
                      <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="w-full sm:w-24 h-24 bg-[#020617] rounded-lg border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center p-2 transition-colors shrink-0">
                        {item.image || item.resim ? (
                          <img src={item.image || item.resim} alt="ürün" className="w-full h-full object-contain drop-shadow-md" />
                        ) : (
                          <PackageOpen className="w-8 h-8 text-slate-600" />
                        )}
                      </Link>

                      <div className="flex-1 w-full flex flex-col justify-between h-full">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                            <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="text-sm font-bold text-white hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                              {item.title || item.isim}
                            </Link>
                            <p className="text-sm sm:text-base font-black text-cyan-400 whitespace-nowrap">
                              {Number((item.price || item.fiyat || 0) * (item.quantity || item.adet || 1)).toLocaleString("tr-TR")} TL
                            </p>
                          </div>
                          <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3">Miktar: {item.quantity || item.adet} Adet</p>
                        </div>

                        {/* 🚀 BİNGO: Mobil İçin Eşit Buton Izgarası (Grid) */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 mt-auto">
                          <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="flex items-center justify-center gap-1.5 h-9 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-md transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest col-span-1">
                            <ShoppingCart className="w-3 h-3" /> Tekrar Al
                          </Link>

                          {isTeslimEdildi && (
                            <Link href={`/product/${item.slug || item.productId || item._id || ''}#yorumlar`} className="flex items-center justify-center gap-1.5 h-9 bg-[#020617] hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 rounded-md transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest col-span-1">
                              <Star className="w-3 h-3" /> Yorumla
                            </Link>
                          )}

                          {isTeslimEdildi && !isIptal && !iadeSuresiGectiMi && (
                            <Link href={`/destek-taleplerim?siparisNo=${selectedOrder.siparisKodu || selectedOrder.orderNumber}&konu=iade`} className="flex items-center justify-center gap-1.5 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest col-span-2 sm:col-span-1">
                              <RefreshCw className="w-3 h-3" /> İade Et
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Alt Notlar ve Fiyat Özeti */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Ödeme Özeti
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-slate-300 font-medium text-xs">
                        <span>Ara Toplam</span>
                        <span>{Number(selectedOrder.totalPrice || selectedOrder.toplamTutar).toLocaleString("tr-TR")} TL</span>
                      </div>
                      <div className="flex justify-between text-slate-300 font-medium text-xs">
                        <span>Kargo Ücreti</span>
                        <span className="text-emerald-400 font-bold">Ücretsiz</span>
                      </div>
                      <div className="flex justify-between text-slate-300 font-medium text-xs">
                        <span>Ödeme Yöntemi</span>
                        <span className="capitalize">{selectedOrder.odemeYontemi || selectedOrder.paymentMethod || "Havale / EFT"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-sm font-black text-white uppercase tracking-widest">Genel Toplam</span>
                    <span className="text-lg font-black text-cyan-400">{Number(selectedOrder.totalPrice || selectedOrder.toplamTutar).toLocaleString("tr-TR")} TL</span>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Sipariş & Kargo Notları
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">SİZİN NOTUNUZ</p>
                      <div className="bg-[#020617] border border-slate-800 p-3 rounded-lg text-xs text-slate-300 font-medium leading-relaxed">
                        {(selectedOrder.siparisNotu && selectedOrder.siparisNotu.trim() !== "" && selectedOrder.siparisNotu !== "Not eklenmemiş") ? selectedOrder.siparisNotu : "Siparişe özel not eklenmemiş."}
                      </div>
                    </div>
                    {selectedOrder.kargoTakipNo && (
                      <div>
                        <p className="text-[9px] text-cyan-500 font-black uppercase tracking-widest mb-1.5">KARGO TAKİP NUMARASI</p>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg text-xs text-cyan-400 font-bold flex justify-between items-center">
                          {selectedOrder.kargoTakipNo}
                          <button onClick={(e) => handleCopy(selectedOrder.kargoTakipNo, e)} className="text-cyan-400 hover:text-white transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          ) : (
            /* =================================================================================== */
            /* 🚀 BÖLÜM 2: ANA LİSTE EKRANI */
            /* =================================================================================== */
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              {/* HERO & FİLTRE ALANI */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col gap-5">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                      <Package className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Siparişlerim</h1>
                      <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                        Listelenen: <span className="font-black text-cyan-400">{filtrelenmisSiparisler.length}</span> Sipariş
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
                    <div className="flex items-center gap-2 bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 flex-1 xl:flex-none">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <select value={zamanFiltresi} onChange={(e) => setZamanFiltresi(e.target.value)} className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer appearance-none w-full">
                        <option value="tumu" className="bg-[#0f172a]">Tüm Zamanlar</option>
                        <option value="son30" className="bg-[#0f172a]">Son 30 Gün</option>
                        <option value="2026" className="bg-[#0f172a]">2026 Yılı</option>
                        <option value="2025" className="bg-[#0f172a]">2025 Yılı</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 flex-1 xl:flex-none">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <select value={durumFiltresi} onChange={(e) => setDurumFiltresi(e.target.value)} className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer appearance-none w-full">
                        <option value="tumu" className="bg-[#0f172a]">Tüm Siparişler</option>
                        <option value="devam" className="bg-[#0f172a]">Devam Edenler</option>
                        <option value="kargo" className="bg-[#0f172a]">Kargodakiler</option>
                        <option value="teslim" className="bg-[#0f172a]">Teslim Edilenler</option>
                        <option value="iptal" className="bg-[#0f172a]">İptal/İadeler</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-xs flex justify-between items-center shadow-lg">
                    <span className="font-medium">{errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300 transition-colors">✕</button>
                </div>
              )}

              {filtrelenmisSiparisler.length === 0 ? (
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-16 h-16 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-4">
                    <PackageX className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h2 className="text-base font-black uppercase tracking-wide mb-2 text-white">Sipariş Bulunamadı</h2>
                  <p className="text-slate-400 text-xs mb-6">Seçtiğiniz filtrelere uygun sipariş geçmişi görünmüyor.</p>
                  <button onClick={() => { setZamanFiltresi("tumu"); setDurumFiltresi("tumu"); }} className="text-cyan-400 hover:text-cyan-300 font-bold text-xs underline underline-offset-4">Filtreleri Temizle</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filtrelenmisSiparisler.map((order: any) => {
                    const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
                    const durumMetni = order.durum || order.status || "";
                    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

                    return (
                      <div key={order._id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#0f172a] border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 shrink-0 bg-[#020617] border border-slate-800 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                            {firstItem && (firstItem.image || firstItem.resim) ? (
                              <img src={firstItem.image || firstItem.resim} alt="Ürün" className="w-full h-full object-contain drop-shadow-md z-10" />
                            ) : (
                              <PackageOpen className="w-6 h-6 text-slate-500" />
                            )}
                            {order.items?.length > 1 && (
                              <div className="absolute bottom-0 inset-x-0 bg-[#0f172a]/95 text-cyan-400 text-[9px] font-black py-0.5 text-center z-20 border-t border-slate-800">
                                {order.items.length} Ürün
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col sm:hidden">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-black text-cyan-400">{currentSiparisKodu}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">{new Date(order.createdAt || order.tarih).toLocaleDateString("tr-TR")}</p>
                          </div>
                        </div>

                        <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">{currentSiparisKodu}</span>
                              <button onClick={(e) => handleCopy(currentSiparisKodu, e)} className="text-slate-500 hover:text-cyan-400 transition-colors">
                                 {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">{new Date(order.createdAt || order.tarih).toLocaleDateString("tr-TR")}</p>
                          </div>

                          <div className="flex flex-col sm:items-center gap-2">
                            <DurumRozetiGoster durum={durumMetni} />
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-800 sm:border-0 pt-3 sm:pt-0">
                            <div className="flex flex-col items-start sm:items-end">
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">TOPLAM</span>
                              <p className="text-sm font-black text-white whitespace-nowrap">
                                {Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} <span className="text-[10px] text-slate-500">TL</span>
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedOrder(order)} 
                              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest shrink-0"
                            >
                              Sipariş Detayı <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}