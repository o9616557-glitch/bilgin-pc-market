"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Clock, Loader2 } from "lucide-react";

type Urun = {
  _id: string;
  isim: string;
  slug: string;
  fiyat: number;
  resim: string;
};

export default function AramaSayfasiClient({ initialQ = "" }: { initialQ?: string }) {
  const router = useRouter();
  const [sonuclar, setSonuclar] = useState<Urun[]>([]);
  const [populerUrunler, setPopulerUrunler] = useState<Urun[]>([]);
  const [sonAramalar, setSonAramalar] = useState<string[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const temizKelime = initialQ.trim();
  const aramaYapildi = temizKelime.length >= 2;

  useEffect(() => {
    const kayitli = localStorage.getItem("sonAramalar");
    if (kayitli) setSonAramalar(JSON.parse(kayitli));
  }, []);

  useEffect(() => {
    fetch("/api/arama?init=true")
      .then((res) => res.json())
      .then((data) => setPopulerUrunler(data))
      .catch(() => setPopulerUrunler([]));
  }, []);

  useEffect(() => {
    if (temizKelime.length < 2) {
      setSonuclar([]);
      setYukleniyor(false);
      return;
    }

    setYukleniyor(true);
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/arama?q=" + encodeURIComponent(temizKelime));
        const data = await res.json();
        setSonuclar(data);
      } catch {
        setSonuclar([]);
      }
      setYukleniyor(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [temizKelime]);

  const aramayiKaydet = (kelime: string) => {
    const temiz = kelime.trim();
    if (!temiz) return;
    const yeni = [temiz, ...sonAramalar.filter((k) => k !== temiz)].slice(0, 5);
    setSonAramalar(yeni);
    localStorage.setItem("sonAramalar", JSON.stringify(yeni));
  };

  const gecmisAramayiSil = (kelime: string) => {
    const yeni = sonAramalar.filter((k) => k !== kelime);
    setSonAramalar(yeni);
    localStorage.setItem("sonAramalar", JSON.stringify(yeni));
  };

  return (
    <div className="bg-[#050814] min-h-screen pb-20 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {aramaYapildi ? (
          <>
            <div className="mb-6 border-b border-white/10 pb-4">
              <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                {yukleniyor && <Loader2 className="w-5 h-5 animate-spin text-[#3b82f6] shrink-0" />}
                &ldquo;{temizKelime}&rdquo; için sonuçlar
              </h1>
              {!yukleniyor && (
                <p className="text-gray-400 mt-2 font-medium">{sonuclar.length} ürün bulundu</p>
              )}
            </div>

            {!yukleniyor && sonuclar.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sonuclar.map((urun) => (
                  <UrunKarti key={urun._id} urun={urun} onNavigate={() => aramayiKaydet(temizKelime)} />
                ))}
              </div>
            )}

            {!yukleniyor && sonuclar.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xl font-bold text-gray-300 mb-2">Üzgünüz, ürün bulunamadı.</p>
                <p className="text-gray-500">Lütfen farklı bir kelimeyle aramayı deneyin.</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            {sonAramalar.length > 0 && (
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" /> Son aramalar
                </h2>
                <div className="flex flex-wrap gap-2">
                  {sonAramalar.map((kelime) => (
                    <div
                      key={kelime}
                      className="flex items-center gap-1 pl-3 pr-1 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-slate-300"
                    >
                      <button
                        type="button"
                        onClick={() => router.replace("/arama?q=" + encodeURIComponent(kelime), { scroll: false })}
                        className="hover:text-[#3b82f6] transition-colors"
                      >
                        {kelime}
                      </button>
                      <button
                        type="button"
                        onClick={() => gecmisAramayiSil(kelime)}
                        className="p-1 text-slate-500 hover:text-red-400"
                        aria-label="Kaldır"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {populerUrunler.length > 0 && (
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-4">
                  En çok satanlar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {populerUrunler.map((urun) => (
                    <UrunKarti key={urun._id} urun={urun} />
                  ))}
                </div>
              </div>
            )}

            {!aramaYapildi && sonAramalar.length === 0 && populerUrunler.length === 0 && (
              <p className="text-center text-slate-500 py-16 text-sm">
                Üstteki arama kutusuna yazmaya başlayın; sonuçlar burada listelenir.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UrunKarti({ urun, onNavigate }: { urun: Urun; onNavigate?: () => void }) {
  return (
    <Link
      href={"/product/" + urun.slug}
      onClick={onNavigate}
      className="bg-[#121212] border border-white/5 hover:border-[#00d2ff]/50 rounded-2xl p-4 flex flex-col group transition-all"
    >
      <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center p-3">
        <img
          src={urun.resim}
          alt={urun.isim}
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm text-gray-300 font-medium line-clamp-2 flex-1 mb-3 group-hover:text-[#00d2ff] transition-colors">
        {urun.isim}
      </h3>
      <div className="text-lg font-black text-[#00d2ff]">
        {Number(urun.fiyat).toLocaleString("tr-TR")} ₺
      </div>
    </Link>
  );
}
