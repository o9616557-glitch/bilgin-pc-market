"use client";

import { useState } from "react";
import Link from "next/link";

export default function SiparisTakipPage() {
  const [kodu, setKodu] = useState("");
  const [siparis, setSiparis] = useState<any>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

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
      // Arka plandaki motorla (API) iletişime geçiyoruz
      const res = await fetch("/api/siparis-takip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siparisKodu: kodu }),
      });

      const data = await res.json();

      if (data.success || data.siparis) {
        // Sipariş bulunduysa ekrana bas
        setSiparis(data.siparis || data);
      } else {
        setHata(data.error || "Bu koda ait bir sipariş bulunamadı. (Örn: SP-12345)");
      }
    } catch (err) {
      setHata("Sistemsel bir bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* Üst Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sipariş Takibi 📦</h1>
          <p className="text-gray-500 text-sm">
            Sipariş durumunu öğrenmek için kodunuzu girin.
          </p>
        </div>

        {/* Sorgulama Formu */}
        <form onSubmit={sorgula} className="space-y-4">
          <div>
            <input
              type="text"
              value={kodu}
              onChange={(e) => setKodu(e.target.value)}
              placeholder="Sipariş Kodu (Örn: SP-12345)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-70"
          >
            {yukleniyor ? "Sorgulanıyor..." : "Siparişi Sorgula"}
          </button>
        </form>

        {/* Hata Mesajı */}
        {hata && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm text-center rounded-lg font-medium">
            {hata}
          </div>
        )}

        {/* Sonuç Ekranı */}
        {siparis && (
          <div className="mt-8 border-t pt-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Sipariş Detayı</h3>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sipariş Kodu:</span>
              <span className="font-semibold text-gray-800">{siparis.siparisKodu}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Durum:</span>
              <span className="font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                {siparis.durum || "Hazırlanıyor"}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tutar:</span>
              <span className="font-bold text-green-600">
                {siparis.toplamTutar ? `${siparis.toplamTutar} TL` : "Ödendi"}
              </span>
            </div>
          </div>
        )}

        {/* Mağazaya Dön Linki */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
            &larr; Mağazaya Geri Dön
          </Link>
        </div>

      </div>
    </div>
  );
}