"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Package, Truck, CheckCircle2, Clock, 
  RefreshCw, MessageSquare, ShoppingCart, Star, 
  AlertCircle, Copy, Check, Info, Calendar,
  PackageOpen,
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

  // Sayfa açıldığında sadece bu siparişin bilgilerini çeker
  useEffect(() => {
    const siparisGetir = async () => {
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.orders) {
          // ID'si eşleşen siparişi bul
          const bulunan = data.orders.find((o: any) => o._id === id);
          setOrder(bulunan);
        }
      } catch (error) {
        toast.error("Sipariş detayları alınamadı.");
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

  const sepeteTekrarEkle = (itemTitle: string) => {
    // Burada ileride kendi sepet Context'ini bağlayabilirsin
    toast.success(`${itemTitle} tekrar sepete eklendi!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#0f172a', color: '#fff' },
    });
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
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Sipariş Bulunamadı</h2>
        <p className="text-slate-400 mb-6">Aradığınız sipariş sistemde mevcut değil veya silinmiş olabilir.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all">
          Geri Dön
        </button>
      </div>
    );
  }

  const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
  const durumMetni = (order.durum || order.status || "").toLocaleLowerCase("tr-TR");
  const siparisTarihi = new Date(order.createdAt || order.tarih);
  
  // 🚀 İADE SÜRESİ HESAPLAMA MOTORU (Teslim edildikten sonra 14 gün)
  const isTeslimEdildi = durumMetni.includes("teslim") || durumMetni.includes("tamam");
  const isIptal = durumMetni.includes("iptal") || durumMetni.includes("i̇ptal");
  
  // Teslim edilme tarihini bilemediğimiz için sipariş tarihine 3 gün kargo süresi + 14 gün ekleyerek varsayılan hesaplıyoruz
  const iadeBitisTarihi = new Date(siparisTarihi.getTime() + (17 * 24 * 60 * 60 * 1000));
  const bugun = new Date();
  const iadeSuresiGectiMi = bugun > iadeBitisTarihi;
  const iadeyeKalanGun = Math.ceil((iadeBitisTarihi.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));

  const Durumİkonu = () => {
    if (isIptal) return <AlertCircle className="w-8 h-8 text-red-500" />;
    if (isTeslimEdildi) return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
    if (durumMetni.includes("kargo")) return <Truck className="w-8 h-8 text-blue-500 animate-bounce" />;
    if (durumMetni.includes("hazır") || durumMetni.includes("ödendi")) return <Package className="w-8 h-8 text-amber-500" />;
    return <Clock className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-cyan-600 blur-[250px] opacity-[0.03] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Üst Yönlendirme (Breadcrumb) */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6 font-bold text-sm uppercase tracking-widest w-max">
          <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
        </button>

        {/* 🚀 ANA BAŞLIK VE ÖZET KARTI */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Sipariş Detayı</h1>
              <span className="bg-[#020617] border border-slate-700 px-3 py-1 rounded-lg text-cyan-400 font-black text-sm tracking-widest flex items-center gap-2">
                #{currentSiparisKodu}
                <button onClick={() => handleCopy(currentSiparisKodu)} className="text-slate-500 hover:text-white transition-colors">
                  {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {siparisTarihi.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#020617] p-4 rounded-2xl border border-slate-800 w-full md:w-auto">
            <Durumİkonu />
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">SİPARİŞ DURUMU</p>
              <p className="text-white font-bold capitalize text-lg">
                {order.durum || order.status || "Alındı"}
              </p>
            </div>
          </div>
        </div>

        {/* 🚀 ÜRÜNLER LİSTESİ (AMAZON STİLİ KARTLAR) */}
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <PackageOpen className="w-5 h-5 text-cyan-500" /> Siparişteki Ürünler ({order.items?.length || 0})
        </h2>

        <div className="space-y-6 mb-8">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col md:flex-row gap-6 sm:gap-8">
              
              {/* Resim */}
              <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="w-full md:w-40 h-40 bg-[#020617] rounded-2xl border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center p-4 transition-colors shrink-0">
                {item.image || item.resim ? (
                  <img src={item.image || item.resim} alt="ürün" className="w-full h-full object-contain drop-shadow-md" />
                ) : (
                  <PackageOpen className="w-10 h-10 text-slate-600" />
                )}
              </Link>

              {/* Detay ve Butonlar */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Link href={`/product/${item.slug || item.productId || item._id || ''}`} className="text-lg sm:text-xl font-bold text-white hover:text-cyan-400 transition-colors leading-snug">
                      {item.title || item.isim}
                    </Link>
                    <p className="text-xl font-black text-cyan-400 whitespace-nowrap">
                      {Number((item.price || item.fiyat || 0) * (item.quantity || item.adet || 1)).toLocaleString("tr-TR")} TL
                    </p>
                  </div>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-4">Miktar: {item.quantity || item.adet} Adet</p>
                </div>

                {/* Buton Aksiyonları Paneli */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
                  <button 
                    onClick={() => sepeteTekrarEkle(item.title || item.isim)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                  >
                    <ShoppingCart className="w-4 h-4" /> Tekrar Satın Al
                  </button>

                  {isTeslimEdildi && (
                    <Link 
                      href={`/product/${item.slug || item.productId || item._id || ''}#yorumlar`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#020617] hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                    >
                      <Star className="w-4 h-4" /> Ürünü Değerlendir
                    </Link>
                  )}

                  {/* İADE MOTORU GÖRSELİ */}
                  {isTeslimEdildi && !isIptal && !iadeSuresiGectiMi && (
                    <Link 
                      href={`/destek-taleplerim?siparisNo=${currentSiparisKodu} - ${item.title || item.isim}&konu=iade`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                    >
                      <RefreshCw className="w-4 h-4" /> İade Et
                    </Link>
                  )}
                </div>

                {/* İade Sayacı Bilgisi */}
                {isTeslimEdildi && !isIptal && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                    {iadeSuresiGectiMi ? (
                      <span className="text-slate-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> 14 Günlük İade Süresi Dolmuştur</span>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> İade için son {iadeyeKalanGun} gün ({iadeBitisTarihi.toLocaleDateString("tr-TR")})</span>
                    )}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* 🚀 SİPARİŞ ÖZETİ VE NOTLAR BÖLÜMÜ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Ödeme Özeti
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Ara Toplam</span>
                  <span>{Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} TL</span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Kargo Ücreti</span>
                  <span className="text-emerald-400 font-bold">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Ödeme Yöntemi</span>
                  <span className="capitalize">{order.odemeYontemi || order.paymentMethod || "Havale / EFT"}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-6 pt-6 flex justify-between items-center">
              <span className="text-lg font-black text-white uppercase tracking-widest">Genel Toplam</span>
              <span className="text-2xl font-black text-cyan-400">{Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} TL</span>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Sipariş & Kargo Notları
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">SİZİN NOTUNUZ</p>
                <div className="bg-[#020617] border border-slate-800 p-4 rounded-xl text-sm text-slate-300 font-medium leading-relaxed">
                  {(order.siparisNotu && order.siparisNotu.trim() !== "" && order.siparisNotu !== "Not eklenmemiş") ? order.siparisNotu : "Siparişe özel not eklenmemiş."}
                </div>
              </div>

              {order.kargoTakipNo && (
                <div>
                  <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-2">KARGO TAKİP NUMARASI</p>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-sm text-cyan-400 font-bold flex justify-between items-center">
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