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
  // 🚀 MERKEZİ HAFIZADAN ANINDA ÇEKİŞ
  const { orders: contextOrders, loading: contextLoading, refreshOrders } = useOrders();
  const [localOrders, setLocalOrders] = useState<any[]>([]);

  // 🚀 BİNGO: İŞTE O SİHİRLİ PERDE! (Bu doluysa detay ekranı sağdan kayarak gelir)
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> İPTAL EDİLDİ
        </div>
    );
    if (d.includes("teslim") || d.includes("tamam") || d.includes("bit") || d.includes("son")) return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <CheckCircle2 className="w-3.5 h-3.5" /> TESLİM EDİLDİ
        </div>
    );
    if (d.includes("kargo")) return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.15)]">
           <Truck className="w-3.5 h-3.5 animate-bounce" /> KARGODA
        </div>
    );
    if (d.includes("hazır") || d.includes("ödendi") || d.includes("odendi")) return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <Package className="w-3.5 h-3.5" /> HAZIRLANIYOR
        </div>
    );
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-3.5 h-3.5" /> ALINDI
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
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 🚀 BÖLÜM 1: DETAY EKRANI (Eğer bir siparişe tıklandıysa SAĞDAN KAYARAK gelir)
  // ---------------------------------------------------------------------------
  if (selectedOrder) {
    const currentSiparisKodu = selectedOrder.siparisKodu || selectedOrder.orderNumber || selectedOrder._id.slice(-8).toUpperCase();
    const durumMetni = (selectedOrder.durum || selectedOrder.status || "").toLocaleLowerCase("tr-TR");
    const siparisTarihi = new Date(selectedOrder.createdAt || selectedOrder.tarih);
    
    const isTeslimEdildi = durumMetni.includes("teslim") || durumMetni.includes("tamam");
    const isIptal = durumMetni.includes("iptal") || durumMetni.includes("i̇ptal");
    
    const iadeBitisTarihi = new Date(siparisTarihi.getTime() + (17 * 24 * 60 * 60 * 1000));
    const bugun = new Date();
    const iadeSuresiGectiMi = bugun > iadeBitisTarihi;
    const iadeyeKalanGun = Math.ceil((iadeBitisTarihi.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));

    const DetayDurumİkonu = () => {
      if (isIptal) return <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />;
      if (isTeslimEdildi) return <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />;
      if (durumMetni.includes("kargo")) return <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-bounce" />;
      if (durumMetni.includes("hazır") || durumMetni.includes("ödendi")) return <Package className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />;
      return <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />;
    };

    return (
      // 🚀 CSS ANİMASYONU: "animate-in slide-in-from-right-16 fade-in duration-500" ile sağdan kayarak girer
      <div className="min-h-screen bg-[#020617] text-white font-sans p-3 sm:p-6 lg:p-8 relative overflow-x-hidden animate-in slide-in-from-right-16 fade-in duration-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] sm:h-[400px] bg-cyan-600 blur-[150px] sm:blur-[250px] opacity-[0.04] pointer-events-none rounded-full z-0"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* GERİ DÖN BUTONU (X DEĞİL!) */}
          <button 
            onClick={() => setSelectedOrder(null)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all rounded-xl mb-4 sm:mb-6 font-black text-xs sm:text-sm uppercase tracking-widest w-max shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
          </button>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">Sipariş Detayı</h1>
                <span className="bg-[#020617] border border-slate-700 px-3 py-1.5 rounded-lg text-cyan-400 font-black text-xs sm:text-sm tracking-widest flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  #{currentSiparisKodu}
                  <button onClick={(e) => handleCopy(currentSiparisKodu, e)} className="text-slate-500 hover:text-white transition-colors">
                    {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </span>
              </div>
              <p className="text-slate-400 font-medium flex items-center gap-2 text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {siparisTarihi.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 bg-[#020617] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 w-full md:w-auto">
              <DetayDurumİkonu />
              <div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">SİPARİŞ DURUMU</p>
                <p className="text-white font-bold capitalize text-sm sm:text-lg">
                  {selectedOrder.durum || selectedOrder.status || "Alındı"}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-cyan-500" /> Ürünler ({selectedOrder.items?.length || 0})
          </h2>

          <div className="space-y-4 sm:space-y-6 mb-8">
            {selectedOrder.items?.map((item: any, idx: number) => (
              <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl flex flex-col sm:flex-row gap-4 sm:gap-8">
                <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="w-full sm:w-32 md:w-40 h-32 sm:h-32 md:h-40 bg-[#020617] rounded-xl sm:rounded-2xl border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center p-3 sm:p-4 transition-colors shrink-0">
                  {item.image || item.resim ? (
                    <img src={item.image || item.resim} alt="ürün" className="w-full h-full object-contain drop-shadow-md" />
                  ) : (
                    <PackageOpen className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
                  )}
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
                      <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="text-sm sm:text-lg font-bold text-white hover:text-cyan-400 transition-colors leading-snug break-words">
                        {item.title || item.isim}
                      </Link>
                      <p className="text-lg sm:text-xl font-black text-cyan-400 whitespace-nowrap">
                        {Number((item.price || item.fiyat || 0) * (item.quantity || item.adet || 1)).toLocaleString("tr-TR")} TL
                      </p>
                    </div>
                    <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4">Miktar: {item.quantity || item.adet} Adet</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-slate-800/80">
                    <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-lg sm:rounded-xl transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest flex-1 sm:flex-none justify-center text-center">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Tekrar Al
                    </Link>

                    {isTeslimEdildi && (
                      <Link href={`/product/${item.slug || item.productId || item._id || ''}#yorumlar`} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#020617] hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 rounded-lg sm:rounded-xl transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest flex-1 sm:flex-none justify-center text-center">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Yorumla
                      </Link>
                    )}

                    {isTeslimEdildi && !isIptal && !iadeSuresiGectiMi && (
                      <Link href={`/destek-taleplerim?siparisNo=${currentSiparisKodu} - ${item.title || item.isim}&konu=iade`} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg sm:rounded-xl transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest flex-1 sm:flex-none justify-center text-center mt-2 sm:mt-0 w-full sm:w-auto">
                        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> İade Et
                      </Link>
                    )}
                  </div>

                  {isTeslimEdildi && !isIptal && (
                    <div className="mt-3 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {iadeSuresiGectiMi ? (
                        <span className="text-slate-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 14 Günlük İade Süresi Dolmuştur</span>
                      ) : (
                        <span className="text-emerald-500 flex items-center gap-1"><Info className="w-3 h-3" /> İade için son {iadeyeKalanGun} gün ({iadeBitisTarihi.toLocaleDateString("tr-TR")})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Ödeme Özeti
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-slate-300 font-medium text-xs sm:text-sm">
                    <span>Ara Toplam</span>
                    <span>{Number(selectedOrder.totalPrice || selectedOrder.toplamTutar).toLocaleString("tr-TR")} TL</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-medium text-xs sm:text-sm">
                    <span>Kargo Ücreti</span>
                    <span className="text-emerald-400 font-bold">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-medium text-xs sm:text-sm">
                    <span>Ödeme Yöntemi</span>
                    <span className="capitalize">{selectedOrder.odemeYontemi || selectedOrder.paymentMethod || "Havale / EFT"}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-4 sm:mt-6 pt-4 sm:pt-6 flex justify-between items-center">
                <span className="text-sm sm:text-lg font-black text-white uppercase tracking-widest">Genel Toplam</span>
                <span className="text-lg sm:text-2xl font-black text-cyan-400">{Number(selectedOrder.totalPrice || selectedOrder.toplamTutar).toLocaleString("tr-TR")} TL</span>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl">
              <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Sipariş & Kargo Notları
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">SİZİN NOTUNUZ</p>
                  <div className="bg-[#020617] border border-slate-800 p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    {(selectedOrder.siparisNotu && selectedOrder.siparisNotu.trim() !== "" && selectedOrder.siparisNotu !== "Not eklenmemiş") ? selectedOrder.siparisNotu : "Siparişe özel not eklenmemiş."}
                  </div>
                </div>
                {selectedOrder.kargoTakipNo && (
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-2">KARGO TAKİP NUMARASI</p>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-cyan-400 font-bold flex justify-between items-center">
                      {selectedOrder.kargoTakipNo}
                      <button onClick={(e) => handleCopy(selectedOrder.kargoTakipNo, e)} className="text-cyan-400 hover:text-white transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 🚀 BÖLÜM 2: ANA LİSTE EKRANI (Başlangıçta görünen kısım)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip animate-in fade-in duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.05] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* SOL MENÜ */}
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

        {/* SAĞ İÇERİK - SİPARİŞ LİSTESİ */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden flex flex-col gap-6">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Siparişlerim</h1>
                  <p className="text-cyan-400/80 text-xs sm:text-sm font-medium tracking-wide">
                    Listelenen: <span className="font-black text-cyan-400">{filtrelenmisSiparisler.length}</span> Sipariş
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-[#020617] border border-slate-800 rounded-xl px-3 py-2 flex-1 sm:flex-none">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <select value={zamanFiltresi} onChange={(e) => setZamanFiltresi(e.target.value)} className="bg-transparent text-xs sm:text-sm text-slate-300 font-bold outline-none cursor-pointer appearance-none w-full">
                    <option value="tumu" className="bg-[#0f172a]">Tüm Zamanlar</option>
                    <option value="son30" className="bg-[#0f172a]">Son 30 Gün</option>
                    <option value="2026" className="bg-[#0f172a]">2026 Yılı</option>
                    <option value="2025" className="bg-[#0f172a]">2025 Yılı</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-[#020617] border border-slate-800 rounded-xl px-3 py-2 flex-1 sm:flex-none">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select value={durumFiltresi} onChange={(e) => setDurumFiltresi(e.target.value)} className="bg-transparent text-xs sm:text-sm text-slate-300 font-bold outline-none cursor-pointer appearance-none w-full">
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
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm flex justify-between items-center shadow-lg">
                <span className="font-medium">{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300 transition-colors">✕</button>
            </div>
          )}

          {filtrelenmisSiparisler.length === 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <PackageX className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Sipariş Bulunamadı</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">Seçtiğiniz filtrelere uygun sipariş geçmişi görünmüyor.</p>
              <button onClick={() => { setZamanFiltresi("tumu"); setDurumFiltresi("tumu"); }} className="text-cyan-400 hover:text-cyan-300 font-bold text-sm underline underline-offset-4">Filtreleri Temizle</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtrelenmisSiparisler.map((order: any) => {
                const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
                const durumMetni = order.durum || order.status || "";
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

                return (
                  <div key={order._id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#0f172a] border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.05)] p-4 sm:p-5 rounded-2xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#020617] border border-slate-800 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                        {firstItem && (firstItem.image || firstItem.resim) ? (
                          <img src={firstItem.image || firstItem.resim} alt="Ürün" className="w-full h-full object-contain drop-shadow-md z-10" />
                        ) : (
                          <PackageOpen className="w-6 h-6 text-slate-500" />
                        )}
                        {order.items?.length > 1 && (
                          <div className="absolute bottom-0 inset-x-0 bg-[#0f172a]/95 text-cyan-400 text-[10px] font-black py-0.5 text-center z-20 border-t border-slate-800">
                            {order.items.length} Ürün
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-cyan-400">{currentSiparisKodu}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{new Date(order.createdAt || order.tarih).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="hidden sm:flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-cyan-400 uppercase tracking-widest">{currentSiparisKodu}</span>
                          <button onClick={(e) => handleCopy(currentSiparisKodu, e)} className="text-slate-500 hover:text-cyan-400 transition-colors p-1">
                             {copiedCode === currentSiparisKodu ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{new Date(order.createdAt || order.tarih).toLocaleDateString("tr-TR")}</p>
                      </div>

                      <div className="flex flex-col sm:items-center gap-2">
                        <DurumRozetiGoster durum={durumMetni} />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-800 sm:border-0 pt-4 sm:pt-0">
                        <div className="flex flex-col items-start sm:items-end mr-2">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">TOPLAM</span>
                          <p className="text-lg font-black text-white whitespace-nowrap">
                            {Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} <span className="text-xs text-slate-500">TL</span>
                          </p>
                        </div>
                        
                        {/* 🚀 BİNGO: ARTIK BAŞKA LİNKE GİTMEK YOK! Sadece state değiştiriyor ve perdeyi indiriyor */}
                        <button
                          onClick={() => setSelectedOrder(order)} 
                          className="flex items-center gap-2 px-5 py-3 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                        >
                          Sipariş Detayı <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
            </p>
            <div className="flex w-full gap-3 relative z-10">
              <button onClick={() => setOrderToDelete(null)} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
              <button onClick={confirmDelete} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}