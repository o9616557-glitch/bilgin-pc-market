"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Package, Truck, CheckCircle2, Clock, 
  RefreshCw, MessageSquare, ShoppingCart, Star, 
  AlertCircle, Copy, Check, Info, Calendar, PackageOpen,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";

export default function SiparisDetayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 🚀 BİNGO: ŞİMŞEK HIZINDA YÜKLEME MOTORU (Önce Hafızaya Bakar)
  useEffect(() => {
    const siparisGetir = async () => {
      // 1. Önce tarayıcı hafızasına bak, varsa anında ekranı aç! (Gecikmeyi önler)
      const yerelHafiza = sessionStorage.getItem("bilgin_siparisler_cache");
      if (yerelHafiza) {
        const parsed = JSON.parse(yerelHafiza);
        const bulunan = parsed.find((o: any) => o._id === id);
        if (bulunan) {
          setOrder(bulunan);
          setLoading(false); // Saniyelerce beklemeden anında gösterir
        }
      }

      // 2. Arka planda her ihtimale karşı güncel veriyi yine de çeker
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.orders) {
          sessionStorage.setItem("bilgin_siparisler_cache", JSON.stringify(data.orders));
          const bulunan = data.orders.find((o: any) => o._id === id);
          if (bulunan) setOrder(bulunan);
        }
      } catch (error) {
        if (!yerelHafiza) toast.error("Sipariş detayları alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    if (id) siparisGetir();
  }, [id]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-400 font-bold uppercase tracking-widest text-sm animate-pulse">Sipariş Bilgileri Toplanıyor...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest mb-2 text-center">Sipariş Bulunamadı</h2>
        <p className="text-slate-400 mb-6 text-center text-sm">Aradığınız sipariş sistemde mevcut değil veya silinmiş olabilir.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all text-sm uppercase tracking-widest">
          Geri Dön
        </button>
      </div>
    );
  }

  const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
  const durumMetni = (order.durum || order.status || "").toLocaleLowerCase("tr-TR");
  const siparisTarihi = new Date(order.createdAt || order.tarih);
  
  const isTeslimEdildi = durumMetni.includes("teslim") || durumMetni.includes("tamam");
  const isIptal = durumMetni.includes("iptal") || durumMetni.includes("i̇ptal");
  
  const iadeBitisTarihi = new Date(siparisTarihi.getTime() + (17 * 24 * 60 * 60 * 1000));
  const bugun = new Date();
  const iadeSuresiGectiMi = bugun > iadeBitisTarihi;
  const iadeyeKalanGun = Math.ceil((iadeBitisTarihi.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));

  const Durumİkonu = () => {
    if (isIptal) return <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />;
    if (isTeslimEdildi) return <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />;
    if (durumMetni.includes("kargo")) return <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-bounce" />;
    if (durumMetni.includes("hazır") || durumMetni.includes("ödendi")) return <Package className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />;
    return <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />;
  };

  return (
    // 🚀 BİNGO: overflow-x-hidden İLE TELEFONDA SAĞA SOLA KAYMA ENGELLENDİ
    <div className="min-h-screen bg-[#020617] text-white font-sans p-3 sm:p-6 lg:p-8 relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] sm:h-[400px] bg-cyan-600 blur-[150px] sm:blur-[250px] opacity-[0.04] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-4 sm:mb-6 font-bold text-xs sm:text-sm uppercase tracking-widest w-max">
          <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
        </button>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">Sipariş Detayı</h1>
              <span className="bg-[#020617] border border-slate-700 px-3 py-1.5 rounded-lg text-cyan-400 font-black text-xs sm:text-sm tracking-widest flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                #{currentSiparisKodu}
                <button onClick={() => handleCopy(currentSiparisKodu)} className="text-slate-500 hover:text-white transition-colors">
                  {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>
            <p className="text-slate-400 font-medium flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {siparisTarihi.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 bg-[#020617] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 w-full md:w-auto">
            <Durumİkonu />
            <div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">SİPARİŞ DURUMU</p>
              <p className="text-white font-bold capitalize text-sm sm:text-lg">
                {order.durum || order.status || "Alındı"}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <PackageOpen className="w-5 h-5 text-cyan-500" /> Ürünler ({order.items?.length || 0})
        </h2>

        <div className="space-y-4 sm:space-y-6 mb-8">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl flex flex-col sm:flex-row gap-4 sm:gap-8">
              
              {/* MOBİLDE KÜÇÜLTÜLMÜŞ, KUTUYA SIĞAN RESİM */}
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
                  {/* 🚀 BİNGO: SEPETE EKLEMEK YERİNE ÜRÜNE GİDEN LİNK (Sorunu Çözer) */}
                  <Link 
                    href={`/product/${item.slug || item.productId || item._id || ''}`}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-lg sm:rounded-xl transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest flex-1 sm:flex-none justify-center text-center"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Tekrar Al
                  </Link>

                  {isTeslimEdildi && (
                    <Link 
                      href={`/product/${item.slug || item.productId || item._id || ''}#yorumlar`}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#020617] hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 rounded-lg sm:rounded-xl transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest flex-1 sm:flex-none justify-center text-center"
                    >
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Yorumla
                    </Link>
                  )}

                  {isTeslimEdildi && !isIptal && !iadeSuresiGectiMi && (
                    <Link 
                      href={`/destek-taleplerim?siparisNo=${currentSiparisKodu} - ${item.title || item.isim}&konu=iade`}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg sm:rounded-xl transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest flex-1 sm:flex-none justify-center text-center mt-2 sm:mt-0 w-full sm:w-auto"
                    >
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
                  <span>{Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} TL</span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium text-xs sm:text-sm">
                  <span>Kargo Ücreti</span>
                  <span className="text-emerald-400 font-bold">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium text-xs sm:text-sm">
                  <span>Ödeme Yöntemi</span>
                  <span className="capitalize">{order.odemeYontemi || order.paymentMethod || "Havale / EFT"}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-4 sm:mt-6 pt-4 sm:pt-6 flex justify-between items-center">
              <span className="text-sm sm:text-lg font-black text-white uppercase tracking-widest">Genel Toplam</span>
              <span className="text-lg sm:text-2xl font-black text-cyan-400">{Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} TL</span>
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
                  {(order.siparisNotu && order.siparisNotu.trim() !== "" && order.siparisNotu !== "Not eklenmemiş") ? order.siparisNotu : "Siparişe özel not eklenmemiş."}
                </div>
              </div>
              {order.kargoTakipNo && (
                <div>
                  <p className="text-[9px] sm:text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-2">KARGO TAKİP NUMARASI</p>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-cyan-400 font-bold flex justify-between items-center">
                    {order.kargoTakipNo}
                    <button onClick={() => handleCopy(order.kargoTakipNo)} className="text-cyan-400 hover:text-white transition-colors">
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