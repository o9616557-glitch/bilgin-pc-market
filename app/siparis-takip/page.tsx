"use client";

import { useState } from "react";
import Link from "next/link";

export default function SiparisTakipPage() {
  const [kodu, setKodu] = useState("");
  const [siparis, setSiparis] = useState<any>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const adimlar = ["Sipariş Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

  // 🎯 KÖR DÖVÜŞÜ BİTTİ: Admin panelinden gelen BİREBİR isimlerle eşleşme motoru!
  const aktifAdimBul = (durum: string) => {
    if (!durum) return 0; // Varsayılan Sipariş Alındı
    if (durum === "Ödendi / Hazırlanıyor") return 1;
    if (durum === "Kargoya Verildi") return 2;
    if (durum === "Teslim Edildi" || durum.toLowerCase().includes("teslim")) return 3;
    return 0; 
  };

  const iptalEdildiMi = (durum: string) => {
    if (!durum) return false;
    return durum === "İptal Edildi";
  };

  const sorgula = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    setSiparis(null);

    if (!kodu) {
      setHata("Lütfen sipariş kodunuzu girin.");
      return;
    }

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
        setHata(data.error || "Bu koda ait bir sipariş bulunamadı. (Örn: SP-12345)");
      }
    } catch (err) {
      setHata("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  const koduKopyala = (siparisKodu: string) => {
    navigator.clipboard.writeText(siparisKodu);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  // MESAJ ALANI: Bütün ihtimalleri yakalıyoruz
  const magazaMesaji = siparis?.musteriMesaji || siparis?.mesaj || siparis?.not || siparis?.adminNotu || siparis?.aciklama;

  return (
    <div className="min-h-screen bg-[#050814] text-white flex flex-col items-center pt-24 px-4 pb-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[120px] opacity-20 rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-5 md:p-10 relative z-10">
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">
            Kargo <span className="text-[#00e5ff]">Takİp</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium px-2">
            Siparişinizin anlık durumunu öğrenmek için kodunuzu girin.
          </p>
        </div>

        <form onSubmit={sorgula} className="flex flex-col md:flex-row gap-3 mb-6 md:mb-8">
          <input
            type="text"
            value={kodu}
            onChange={(e) => setKodu(e.target.value)}
            placeholder="Sipariş Kodu (Örn: SP-12345)"
            className="flex-1 bg-[#121215] border border-white/10 rounded-xl px-4 py-3 md:py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={yukleniyor}
            className="bg-[#00e5ff] hover:bg-[#00c4db] text-black font-bold py-3 md:py-4 px-8 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap text-sm md:text-base"
          >
            {yukleniyor ? "Aranıyor..." : "Sorgula 🔍"}
          </button>
        </form>

        {hata && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center text-xs md:text-sm">
            {hata}
          </div>
        )}

        {siparis && (
          <div className="mt-6 pt-6 md:pt-8 border-t border-white/10 animate-fade-in-up">
            
            {/* PANELDE YAZILAN MESAJ BURADA GÖZÜKECEK 📢 */}
            {magazaMesaji && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs md:text-sm shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                <p className="font-black text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>📢</span> Mağaza Bildirimi:
                </p>
                <p className="font-medium leading-relaxed">{magazaMesaji}</p>
              </div>
            )}

            {/* DURUM İPTAL EDİLDİ İSE ÇIKACAK ÖZEL EKRAN */}
            {iptalEdildiMi(siparis.durum) ? (
              <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <span className="text-4xl block mb-2">🚫</span>
                <h3 className="text-lg font-black text-red-400 uppercase tracking-tight">Sipariş İptal Edildi</h3>
                <p className="text-slate-400 text-xs mt-1">Bu sipariş iptal edilmiş veya geri çevrilmiştir. Detaylar için destek hattıyla görüşebilirsiniz.</p>
              </div>
            ) : (
              /* NORMAL TREN ÇUBUĞU */
              <div className="mb-8 mt-4 relative px-0 md:px-2 pb-12 md:pb-16">
                <div className="absolute left-0 top-5 md:top-6 w-full h-1 bg-gray-800 rounded-full"></div>
                
                <div 
                  className="absolute left-0 top-5 md:top-6 h-1 bg-[#00e5ff] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#00e5ff]"
                  style={{ width: `${(aktifAdimBul(siparis.durum) / (adimlar.length - 1)) * 100}%` }}
                ></div>

                <div className="relative flex justify-between items-center z-10">
                  {adimlar.map((adim, index) => {
                    const aktifAdimNo = aktifAdimBul(siparis.durum);
                    const tamamlandiMi = index <= aktifAdimNo;
                    const suAnkiMi = index === aktifAdimNo;
                    
                    // 🛑 ŞEFİM İSTEDİ: Teslim edildiyse (index 3) yanıp sönmeyi durduruyoruz!
                    const yanipSonme = suAnkiMi && index !== 3 ? "ring-4 ring-[#00e5ff]/30 animate-pulse" : "";

                    return (
                      <div key={index} className="flex flex-col items-center relative group w-10 md:w-12">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl shadow-lg transition-all duration-500 z-10 ${
                          tamamlandiMi ? "bg-[#00e5ff] text-black scale-110" : "bg-gray-800 text-gray-500"
                        } ${yanipSonme}`}>
                          {index === 0 && "🛒"}
                          {index === 1 && "📦"}
                          {index === 2 && "🚚"}
                          {index === 3 && "✅"}
                        </div>
                        <span className={`absolute top-[120%] left-1/2 -translate-x-1/2 mt-2 w-20 text-[9px] md:text-xs font-bold text-center leading-tight ${
                          tamamlandiMi ? "text-[#00e5ff]" : "text-gray-500"
                        }`}>
                          {adim}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SİPARİŞ KODU VE DETAYLAR */}
            <div className="bg-[#121215] rounded-xl p-4 md:p-5 border border-white/5 mt-4 md:mt-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <div>
                  <p className="text-slate-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Sipariş Kodu</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg md:text-xl font-bold text-white tracking-wide">{siparis.siparisKodu}</p>
                    <button 
                      onClick={() => koduKopyala(siparis.siparisKodu)}
                      className="p-1.5 md:p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                      title="Kodu Kopyala"
                    >
                      {kopyalandi ? <span className="text-green-400 text-sm">✅</span> : <span className="text-slate-300 text-sm">📋</span>}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Durum</p>
                  <p className={`text-sm md:text-base font-black uppercase ${iptalEdildiMi(siparis.durum) ? 'text-red-400' : 'text-[#00e5ff]'}`}>
                    {siparis.durum || "Hazırlanıyor"}
                  </p>
                </div>
              </div>

              {/* ÜRÜN RESİMLERİ VE PAKET İÇERİĞİ */}
              {siparis.items && siparis.items.length > 0 && (
                <div className="mt-4">
                  <p className="text-slate-400 text-[10px] md:text-xs uppercase tracking-wider mb-3">Paket İçeriği</p>
                  <div className="space-y-2 md:space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {siparis.items.map((urun: any, i: number) => {
                      const gercekResim = urun.resim || urun.gorsel || urun.image || urun.urunResmi;
                      
                      return (
                        <div key={i} className="flex items-center gap-3 md:gap-4 bg-[#0a0a0c] p-2 md:p-3 rounded-lg border border-white/5">
                          {gercekResim ? (
                            <img src={gercekResim} alt={urun.isim} className="w-12 h-12 md:w-16 md:h-16 rounded-md object-cover border border-white/10 bg-black/50" />
                          ) : (
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-md bg-gray-800 flex items-center justify-center text-lg md:text-xl">🛍️</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-semibold text-white truncate" title={urun.isim}>{urun.isim || "Ürün"}</p>
                            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{urun.adet} Adet</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        )}

        <div className="mt-6 md:mt-8 text-center">
          <Link href="/" className="text-slate-400 hover:text-[#00e5ff] text-xs md:text-sm font-medium transition-colors">
            &larr; Mağazaya Geri Dön
          </Link>
        </div>

      </div>
    </div>
  );
}