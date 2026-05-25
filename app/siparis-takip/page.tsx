"use client";

import { useState } from "react";
import Link from "next/link";

export default function SiparisTakipPage() {
  const [kodu, setKodu] = useState("");
  const [siparis, setSiparis] = useState<any>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  // Kargo Treninin İstasyonları
  const adimlar = ["Sipariş Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

  // Mevcut duruma göre trenin nerede olduğunu buluyoruz
  const aktifAdimBul = (durum: string) => {
    if (!durum) return 0;
    const index = adimlar.findIndex(a => a.toLowerCase() === durum.toLowerCase());
    return index !== -1 ? index : 0; // Bulamazsa ilk istasyonda varsay
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

  return (
    <div className="min-h-screen bg-[#050814] text-white flex flex-col items-center pt-24 px-4 pb-12 relative overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[120px] opacity-20 rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Kargo <span className="text-[#00e5ff]">Takİp</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Siparişinizin anlık durumunu öğrenmek için kodunuzu girin.
          </p>
        </div>

        {/* Sorgulama Formu */}
        <form onSubmit={sorgula} className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            value={kodu}
            onChange={(e) => setKodu(e.target.value)}
            placeholder="Sipariş Kodu (Örn: SP-12345)"
            className="flex-1 bg-[#121215] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors"
          />
          <button
            type="submit"
            disabled={yukleniyor}
            className="bg-[#00e5ff] hover:bg-[#00c4db] text-black font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {yukleniyor ? "Aranıyor..." : "Sorgula 🔍"}
          </button>
        </form>

        {hata && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center text-sm">
            {hata}
          </div>
        )}

        {/* EFSANE SONUÇ EKRANI (TREN VE RESİMLER) */}
        {siparis && (
          <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in-up">
            
            {/* TREN / İLERLEME ÇUBUĞU (TIMELINE) */}
            <div className="mb-12 mt-4 relative px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 rounded-full"></div>
              
              {/* Dolu Çizgi */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#00e5ff] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#00e5ff]"
                style={{ width: `${(aktifAdimBul(siparis.durum) / (adimlar.length - 1)) * 100}%` }}
              ></div>

              <div className="relative flex justify-between items-center z-10">
                {adimlar.map((adim, index) => {
                  const aktifAdimNo = aktifAdimBul(siparis.durum);
                  const tamamlandiMi = index <= aktifAdimNo;
                  const suAnkiMi = index === aktifAdimNo;

                  return (
                    <div key={index} className="flex flex-col items-center group">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all duration-500 ${
                        tamamlandiMi ? "bg-[#00e5ff] text-black scale-110" : "bg-gray-800 text-gray-500"
                      } ${suAnkiMi ? "ring-4 ring-[#00e5ff]/30 animate-pulse" : ""}`}>
                        {index === 0 && "🛒"}
                        {index === 1 && "📦"}
                        {index === 2 && "🚚"} {/* İşte senin TREN/KAMYON :) */}
                        {index === 3 && "✅"}
                      </div>
                      <span className={`mt-3 text-[10px] md:text-xs font-bold text-center absolute top-12 w-20 md:w-24 -ml-10 md:-ml-12 ${
                        tamamlandiMi ? "text-[#00e5ff]" : "text-gray-500"
                      }`}>
                        {adim}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SİPARİŞ DETAYLARI VE ÜRÜN RESMİ */}
            <div className="bg-[#121215] rounded-xl p-5 border border-white/5 mt-16">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Sipariş Kodu</p>
                  <p className="text-xl font-bold text-white">{siparis.siparisKodu}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Tutar</p>
                  <p className="text-xl font-bold text-[#00e5ff]">
                    {siparis.toplamTutar ? `${siparis.toplamTutar} ₺` : "Ödendi"}
                  </p>
                </div>
              </div>

              {/* İçindeki Ürünler (Eğer veri tabanında ürün varsa resmiyle gösterir) */}
              {siparis.items && siparis.items.length > 0 && (
                <div className="mt-4">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Paket İçeriği</p>
                  <div className="space-y-3">
                    {siparis.items.map((urun: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-[#0a0a0c] p-3 rounded-lg border border-white/5">
                        {urun.resim ? (
                          <img src={urun.resim} alt={urun.isim} className="w-12 h-12 rounded-md object-cover border border-white/10" />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center text-xl">💻</div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white truncate">{urun.isim || "Ürün"}</p>
                          <p className="text-xs text-slate-500">{urun.adet} Adet</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-slate-400 hover:text-[#00e5ff] text-sm font-medium transition-colors">
            &larr; Mağazaya Geri Dön
          </Link>
        </div>

      </div>
    </div>
  );
}