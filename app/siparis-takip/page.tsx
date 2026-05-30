"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Copy, Check, Package, Truck, ShoppingCart, CheckCircle, Info } from "lucide-react";

export default function SiparisTakipPage() {
  const [kodu, setKodu] = useState("");
  const [siparis, setSiparis] = useState<any>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const adimlar = ["Sipariş Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

  const aktifAdimBul = (durum: string) => {
    if (!durum) return 0; 
    const d = durum.toLowerCase();
    if (durum === "Teslim Edildi" || d.includes("teslim") || d.includes("tamam") || d.includes("tamal") || d.includes("bit") || d.includes("son")) return 3;
    if (durum === "Kargoya Verildi" || d.includes("kargo")) return 2;
    if (durum === "Ödendi / Hazırlanıyor" || d.includes("hazır") || d.includes("odendi")) return 1;
    return 0;
  };

  const iptalEdildiMi = (durum: string) => {
    if (!durum) return false;
    return durum === "İptal Edildi" || durum.toLowerCase().includes("iptal");
  };

  const sorgula = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    setSiparis(null);
    if (!kodu) { setHata("Lütfen sipariş kodunuzu girin."); return; }
    setYukleniyor(true);
    try {
      const res = await fetch("/api/siparis-takip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siparisKodu: kodu }),
      });
      const data = await res.json();
      if (data.success || data.siparis) {
        setSiparis(data.siparis || data);
      } else {
        setHata(data.error || "Bu koda ait bir sipariş bulunamadı.");
      }
    } catch (err) {
      setHata("Bağlantı hatası oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  const koduKopyala = (siparisKodu: string) => {
    navigator.clipboard.writeText(siparisKodu);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  const magazaMesaji = siparis?.musteriMesaji || siparis?.mesaj || siparis?.not || siparis?.adminNotu || siparis?.aciklama;

 return (
    
    <div className="min-h-screen bg-[#050814] text-white pt-8 md:pt-12 pb-12 px-4 relative overflow-hidden flex flex-col items-center">
      
      {/* 🔥 Arka Plan Uzay Mavisi Parlaması */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-15 rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
        {/* 🚀 ÜST BAŞLIK VE GERİ DÖNÜŞ (Çizgi artık belirgin: border-white/20) */}
        <div className="flex flex-col gap-3 border-b border-white/20 pb-6 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-3">
              SİPARİŞ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">TAKİBİ</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
              Siparişinizin güncel durumunu, e-posta adresinize gönderilen <span className="text-white font-bold">sipariş kodu</span> ile anlık olarak takip edebilirsiniz.
            </p>
          </div>
        </div>

        {/* 🔍 ARAMA FORMU */}
        <div className="bg-[#09090b] border border-white/10 rounded-2xl p-2 mb-10 shadow-2xl">
          <form onSubmit={sorgula} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                value={kodu}
                onChange={(e) => setKodu(e.target.value)}
                placeholder="Sipariş Kodu (Örn: BPC-118312)"
                className="w-full bg-[#050B14] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/40 transition-all font-bold tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={yukleniyor}
              className="bg-[#00e5ff] hover:bg-[#00c4db] text-black font-black uppercase tracking-widest text-xs px-10 py-4 sm:py-0 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              {yukleniyor ? "ARANIYOR..." : "SORGULA"}
            </button>
          </form>
        </div>

        {hata && (
          <div className="mb-10 p-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Info className="w-5 h-5" /> {hata}
          </div>
        )}

        {/* 📦 SONUÇ ALANI */}
        {siparis && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Müşteri Bildirimi */}
            {magazaMesaji && (
              <div className="mb-8 p-5 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <p className="font-black text-amber-500 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  <Info size={14} /> MAĞAZA BİLDİRİMİ
                </p>
                <p className="font-bold text-sm leading-relaxed">{magazaMesaji}</p>
              </div>
            )}

            {/* İPTAL DURUMU */}
            {iptalEdildiMi(siparis.durum) ? (
              <div className="mb-10 p-10 bg-[#121215] border border-slate-800 rounded-3xl text-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-rose-500 font-black">×</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Sipariş İptal Edildi</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  Bu sipariş iptal edilmiş görünüyor. Sorularınız için <span className="text-[#00e5ff] font-bold">0850 305 59 68</span> numaralı hattan bize ulaşabilirsiniz.
                </p>
              </div>
            ) : (
              /* 🛤️ SİPARİŞ YOLU */
              <div className="mb-12 bg-[#09090b] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="relative flex justify-between items-start">
                  
                  {/* Arka Plan Çizgisi */}
                  <div className="absolute left-0 top-[21px] md:top-[29px] w-full h-[6px] bg-slate-800 rounded-full"></div>
                  
                  {/* İlerleme Çizgisi */}
                  <div 
                    className="absolute left-0 top-[21px] md:top-[29px] h-[6px] bg-gradient-to-r from-[#00e5ff] to-[#0088ff] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_#00e5ff]"
                    style={{ width: `${(aktifAdimBul(siparis.durum) / (adimlar.length - 1)) * 100}%` }}
                  ></div>

                  {adimlar.map((adim, index) => {
                    const aktifAdimNo = aktifAdimBul(siparis.durum);
                    const tamamlandiMi = index <= aktifAdimNo;
                    const suAnkiMi = index === aktifAdimNo;
                    
                    return (
                      <div key={index} className="flex flex-col items-center relative z-10 w-1/4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          tamamlandiMi ? "bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] rotate-0" : "bg-slate-900 text-slate-600 border border-slate-700"
                        } ${suAnkiMi && index !== 3 ? "animate-pulse" : ""}`}>
                          {index === 0 && <ShoppingCart size={24} />}
                          {index === 1 && <Package size={24} />}
                          {index === 2 && <Truck size={24} />}
                          {index === 3 && <CheckCircle size={24} />}
                        </div>
                        <span className={`mt-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-center px-2 ${
                          tamamlandiMi ? "text-white" : "text-slate-600"
                        }`}>
                          {adim}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 📄 SİPARİŞ DETAY KARTI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              <div className="md:col-span-2 bg-[#09090b] border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
                 <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Takip No</p>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{siparis.siparisKodu}</h2>
                        <button onClick={() => koduKopyala(siparis.siparisKodu)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                          {kopyalandi ? <Check className="text-green-400 w-4 h-4" /> : <Copy className="text-slate-400 w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Güncel Durum</p>
                      <p className={`text-sm md:text-lg font-black uppercase tracking-widest ${iptalEdildiMi(siparis.durum) ? 'text-slate-400' : 'text-[#00e5ff]'}`}>
                        {siparis.durum || "HAZIRLANIYOR"}
                      </p>
                    </div>
                 </div>

                 {siparis.items && siparis.items.length > 0 && (
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-4">PAKET İÇERİĞİ</p>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                      {siparis.items.map((urun: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 bg-[#050B14] p-3 rounded-2xl border border-white/5 group hover:border-[#00e5ff]/20 transition-all">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/5">
                            {urun.resim || urun.gorsel || urun.image ? (
                              <img src={urun.resim || urun.gorsel || urun.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-black text-white leading-tight mb-1">{urun.isim || "Ürün"}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{urun.adet} ADET</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                 )}
              </div>

              {/* 🟢 WHATSAPP DESTEK KARTI (Kusursuzlaştırıldı) */}
              <div className="bg-gradient-to-br from-[#09090b] to-[#050814] border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-[#25D366]"></div>
                 
                 <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-5 border border-[#25D366]/20 group-hover:scale-110 transition-transform duration-500">
                   {/* 🔥 Garantili Orijinal WhatsApp İkonu (Asla kaybolmaz) */}
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-[#25D366]">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                   </svg>
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">WhatsApp Destek</h3>
                 {/* 🔥 Numara silindi, sadece açıklama kaldı */}
                 <p className="text-slate-500 text-[10px] md:text-xs font-medium leading-relaxed mb-6 px-2 uppercase tracking-wide">
                   Siparişinizle ilgili her türlü sorunuz için bize ulaşın.
                 </p>
                 <a href="https://wa.me/905327345023" target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-[#25D366] hover:bg-[#20b858] text-black text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 flex justify-center items-center gap-2">
                   DESTEK MERKEZİ
                 </a>
              </div>

            </div>
          </div>
        )}
        
        {/* 🔹 Alt Stil Eklemeleri */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 229, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 229, 255, 0.3);
          }
      `}</style>
      </div>
    </div>
  );
}