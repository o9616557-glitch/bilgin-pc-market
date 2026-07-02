"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Send,
  Truck,
  PackageX,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { urunTalepBekliyorKaydet } from "@/lib/order-utils";

export default function YeniTalepIcerik() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [talepKonusu, setTalepKonusu] = useState("");
  const [talepBaslik, setTalepBaslik] = useState("");
  const [talepMesaji, setTalepMesaji] = useState("");
  const [iadeYontemi, setIadeYontemi] = useState<"kart" | "magaza_kredisi">("magaza_kredisi");
  const [siparisKalemleri, setSiparisKalemleri] = useState<any[]>([]);
  const [seciliIadeKalemleri, setSeciliIadeKalemleri] = useState<Record<string, number>>({});
  const [kalemYukleniyor, setKalemYukleniyor] = useState(false);
  const [hesaplananIadeTutar, setHesaplananIadeTutar] = useState<number | null>(null);
  const [talepGonderiliyor, setTalepGonderiliyor] = useState(false);
  const [onSecilenUrunId, setOnSecilenUrunId] = useState<string | null>(null);
  const [kargoUyari, setKargoUyari] = useState(false);
  const [iadeSuresiGecti, setIadeSuresiGecti] = useState(false);
  const [paramHazir, setParamHazir] = useState(false);

  const kalemSecimKonu = talepKonusu === "iade" || talepKonusu === "iptal";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/giris");
    }
  }, [status, router]);

  useEffect(() => {
    const siparisNo = searchParams.get("siparisNo") || "";
    const konu = searchParams.get("konu") || "";
    const urunId = searchParams.get("urunId");
    const kargo = searchParams.get("kargo") === "1";

    if (siparisNo) setTalepBaslik(siparisNo);
    if (konu) setTalepKonusu(konu);
    if (urunId) setOnSecilenUrunId(urunId);
    setKargoUyari(kargo);
    setParamHazir(true);
  }, [searchParams]);

  useEffect(() => {
    if (!kalemSecimKonu || !talepBaslik.trim() || talepBaslik.trim().length < 4) {
      setSiparisKalemleri([]);
      setSeciliIadeKalemleri({});
      setHesaplananIadeTutar(null);
      setIadeSuresiGecti(false);
      return;
    }

    const timer = setTimeout(async () => {
      setKalemYukleniyor(true);
      try {
        const res = await fetch(
          `/api/destek/siparis-kalemleri?siparisNo=${encodeURIComponent(talepBaslik.trim())}`
        );
        const data = await res.json();
        if (res.ok && data.success) {
          const kalemler = data.kalemler || [];
          setIadeSuresiGecti(Boolean(data.iadeSuresiGecti));
          setSiparisKalemleri(kalemler);
          if (onSecilenUrunId) {
            const kalem = kalemler.find((k: { urunId: string }) => k.urunId === onSecilenUrunId);
            if (kalem && kalem.iadeEdilebilirAdet > 0) {
              setSeciliIadeKalemleri({ [onSecilenUrunId]: 1 });
            } else {
              setSeciliIadeKalemleri({});
              setHesaplananIadeTutar(null);
            }
          } else {
            setSeciliIadeKalemleri({});
            setHesaplananIadeTutar(null);
          }
        } else {
          setSiparisKalemleri([]);
          setIadeSuresiGecti(false);
        }
      } catch {
        setSiparisKalemleri([]);
        setIadeSuresiGecti(false);
      } finally {
        setKalemYukleniyor(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [talepKonusu, talepBaslik, onSecilenUrunId, kalemSecimKonu]);

  useEffect(() => {
    if (!onSecilenUrunId || !siparisKalemleri.length) return;
    const kalem = siparisKalemleri.find((k) => k.urunId === onSecilenUrunId);
    if (kalem && kalem.iadeEdilebilirAdet > 0) {
      setSeciliIadeKalemleri({ [onSecilenUrunId]: 1 });
    }
  }, [onSecilenUrunId, siparisKalemleri]);

  useEffect(() => {
    if (!kalemSecimKonu || !Object.keys(seciliIadeKalemleri).length) {
      setHesaplananIadeTutar(null);
      return;
    }
    const tutar = siparisKalemleri.reduce((s, k) => {
      const adet = seciliIadeKalemleri[k.urunId] || 0;
      return s + k.birimFiyat * adet;
    }, 0);
    setHesaplananIadeTutar(Math.round(tutar * 100) / 100);
  }, [seciliIadeKalemleri, siparisKalemleri, kalemSecimKonu]);

  const iadeKalemAdetDegistir = (urunId: string, adet: number, max: number) => {
    const yeni = Math.max(0, Math.min(max, adet));
    setSeciliIadeKalemleri((prev) => {
      const kopya = { ...prev };
      if (yeni <= 0) delete kopya[urunId];
      else kopya[urunId] = yeni;
      return kopya;
    });
  };

  const sayfaBasligi =
    talepKonusu === "iptal"
      ? "Sipariş İptali"
      : talepKonusu === "iade"
        ? "Kolay İade"
        : "Yeni Destek Talebi";

  const geriLink = talepBaslik && (talepKonusu === "iptal" || talepKonusu === "iade")
    ? "/siparislerim"
    : "/destek-taleplerim";

  const handleTalepGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!talepKonusu || !talepMesaji || !talepBaslik) return;

    if (kalemSecimKonu && iadeSuresiGecti) {
      toast.error("15 günlük iade süresi doldu. Lütfen teknik destek konusunda genel talep oluşturun.");
      return;
    }

    let iadeKalemleri = Object.entries(seciliIadeKalemleri)
      .filter(([, adet]) => adet > 0)
      .map(([urunId, adet]) => {
        const k = siparisKalemleri.find((x) => x.urunId === urunId);
        return { urunId, adet, isim: k?.isim, birimFiyat: k?.birimFiyat };
      });

    if (kalemSecimKonu && !iadeKalemleri.length) {
      const tekKalem = siparisKalemleri.filter((k) => k.iadeEdilebilirAdet > 0);
      if (tekKalem.length === 1) {
        iadeKalemleri = [{
          urunId: tekKalem[0].urunId,
          adet: 1,
          isim: tekKalem[0].isim,
          birimFiyat: tekKalem[0].birimFiyat,
        }];
      }
    }

    if (kalemSecimKonu && siparisKalemleri.length > 1 && !iadeKalemleri.length) {
      toast.error(
        talepKonusu === "iptal"
          ? "Lütfen iptal etmek istediğiniz ürünü seçin."
          : "Lütfen iade etmek istediğiniz ürünü seçin."
      );
      return;
    }

    const kalemOzeti = iadeKalemleri.map((k) => `${k.isim || "Ürün"} x${k.adet}`).join(", ");

    setTalepGonderiliyor(true);
    const toastId = toast.loading("Talebiniz iletiliyor...");

    try {
      const res = await fetch("/api/destek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          konu: talepKonusu,
          mesaj: `[Başlık: ${talepBaslik}]\n\n${talepMesaji}${kalemOzeti ? `\n\n[${talepKonusu === "iptal" ? "İptal" : "İade"} kalemleri: ${kalemOzeti}]` : ""}${hesaplananIadeTutar ? `\n\n[Tutar: ${hesaplananIadeTutar.toLocaleString("tr-TR")} TL]` : ""}`,
          siparisNo: talepBaslik,
          ...(kalemSecimKonu ? { iadeYontemi } : {}),
          ...(kalemSecimKonu && iadeKalemleri.length ? { iadeKalemleri } : {}),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (kalemSecimKonu && iadeKalemleri.length && talepBaslik.trim()) {
          const konu = talepKonusu === "iade" ? "iade" : "iptal";
          for (const k of iadeKalemleri) {
            if (k.urunId) urunTalepBekliyorKaydet(talepBaslik.trim(), k.urunId, konu);
          }
        }
        toast.success("Talebiniz oluşturuldu. İnceleniyor.", { id: toastId });
        router.push(talepKonusu === "iptal" || talepKonusu === "iade" ? "/siparislerim" : "/destek-taleplerim");
      } else {
        toast.error(data.message || "Talep iletilemedi.", { id: toastId });
      }
    } catch {
      toast.error("Bağlantı hatası.", { id: toastId });
    } finally {
      setTalepGonderiliyor(false);
    }
  };

  if (!paramHazir || status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0 w-full gap-5 lg:gap-6">
          <Link
            href={geriLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 transition-all rounded-lg font-black text-xs uppercase tracking-widest w-max"
          >
            <ArrowLeft className="w-4 h-4" /> Geri Dön
          </Link>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-slate-800 px-5 sm:px-8 py-5 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  {talepKonusu === "iptal" ? (
                    <PackageX className="w-5 h-5 text-rose-400" />
                  ) : talepKonusu === "iade" ? (
                    <RefreshCw className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Send className="w-5 h-5 text-indigo-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{sayfaBasligi}</h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    {talepBaslik ? `Sipariş: ${talepBaslik}` : "Talep bilgilerinizi doldurun"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleTalepGonder} className="p-5 sm:p-8 flex flex-col gap-5">
              {kargoUyari && (
                <div className="p-4 sm:p-5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-amber-400 font-black text-xs uppercase tracking-widest mb-1.5">
                      Ürününüz kargoda
                    </h2>
                    <p className="text-amber-400/90 text-xs sm:text-sm leading-relaxed">
                      Kargodaki siparişler sistemden otomatik iptal edilemez. Kargo kapınıza geldiğinde{" "}
                      <span className="text-white font-bold underline">paketi teslim almayıp kapıda reddetmeniz</span>{" "}
                      gerekir. Paket bize döndüğünde iadeniz işlenir.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  İşlem Konusu
                </label>
                <select
                  value={talepKonusu}
                  onChange={(e) => setTalepKonusu(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none appearance-none"
                  required
                >
                  <option value="" disabled>
                    Lütfen bir konu seçin
                  </option>
                  <option value="iptal">Sipariş İptali / Değişiklik</option>
                  <option value="iade">Kolay İade İşlemi</option>
                  <option value="teknik">Teknik Destek / Arıza</option>
                  <option value="kargo">Kargo / Teslimat Sorunu</option>
                  <option value="diger">Diğer Konular</option>
                </select>
              </div>

              {(talepKonusu === "iptal" || talepKonusu === "kargo" || talepKonusu === "iade") && !kargoUyari && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                  <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-400/80 text-xs sm:text-sm leading-relaxed">
                    Sipariş <span className="text-white font-bold">kargodaysa</span> kapıda reddetmeniz gerekir; sistemden
                    doğrudan iptal yapılamaz.
                  </p>
                </div>
              )}

              {(talepKonusu === "iade" || talepKonusu === "iptal") && !iadeSuresiGecti && (
                <div className="p-4 sm:p-5 bg-[#020617] border border-slate-800 rounded-xl space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    İade yönteminizi seçin
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIadeYontemi("magaza_kredisi")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${iadeYontemi === "magaza_kredisi" ? "border-cyan-500/50 bg-cyan-500/10" : "border-slate-800 hover:border-slate-700"}`}
                    >
                      <p className="text-sm font-bold text-white mb-1">Mağaza kredisi</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Onay sonrası cüzdanınıza yüklenir.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIadeYontemi("kart")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${iadeYontemi === "kart" ? "border-cyan-500/50 bg-cyan-500/10" : "border-slate-800 hover:border-slate-700"}`}
                    >
                      <p className="text-sm font-bold text-white mb-1">Kartıma / hesabıma iade</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Genelde 3-7 iş günü sürer.</p>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Sipariş Numarası
                </label>
                <input
                  type="text"
                  value={talepBaslik}
                  onChange={(e) => setTalepBaslik(e.target.value)}
                  placeholder="Örn. BPC-123456"
                  className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              {kalemSecimKonu && iadeSuresiGecti && (
                <div className="p-4 sm:p-5 bg-amber-950/20 border border-amber-900/40 rounded-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-amber-300">15 günlük iade süresi doldu</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Bu sipariş için otomatik iade/iptal talebi oluşturulamaz. Sorununuz için{" "}
                      <button
                        type="button"
                        onClick={() => setTalepKonusu("teknik")}
                        className="text-cyan-400 underline underline-offset-2"
                      >
                        teknik destek
                      </button>{" "}
                      veya{" "}
                      <button
                        type="button"
                        onClick={() => setTalepKonusu("kargo")}
                        className="text-cyan-400 underline underline-offset-2"
                      >
                        kargo
                      </button>{" "}
                      konusunda genel talep oluşturabilirsiniz.
                    </p>
                  </div>
                </div>
              )}

              {kalemSecimKonu && talepBaslik.trim().length >= 4 && !iadeSuresiGecti && (
                <div className="p-4 sm:p-5 bg-[#020617] border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {talepKonusu === "iptal" ? "İptal edilecek ürünler" : "İade edilecek ürünler"}
                    </label>
                    {kalemYukleniyor && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
                  </div>
                  {siparisKalemleri.length === 0 && !kalemYukleniyor ? (
                    <p className="text-xs text-slate-500">
                      Sipariş bulunamadı veya işlem yapılabilir ürün kalmadı.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {siparisKalemleri.map((k) => {
                        const secili = seciliIadeKalemleri[k.urunId] || 0;
                        const devreDisi = k.iadeEdilebilirAdet <= 0;
                        return (
                          <div
                            key={k.urunId}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${devreDisi ? "border-slate-800/50 opacity-50" : "border-slate-800"}`}
                          >
                            <input
                              type="checkbox"
                              checked={secili > 0}
                              disabled={devreDisi}
                              onChange={(e) =>
                                iadeKalemAdetDegistir(k.urunId, e.target.checked ? 1 : 0, k.iadeEdilebilirAdet)
                              }
                              className="rounded border-slate-600 w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white">{k.isim}</p>
                              <p className="text-[11px] text-slate-500">
                                {k.birimFiyat.toLocaleString("tr-TR")} TL · işlem yapılabilir {k.iadeEdilebilirAdet} adet
                              </p>
                            </div>
                            {secili > 0 && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => iadeKalemAdetDegistir(k.urunId, secili - 1, k.iadeEdilebilirAdet)}
                                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-white">{secili}</span>
                                <button
                                  type="button"
                                  onClick={() => iadeKalemAdetDegistir(k.urunId, secili + 1, k.iadeEdilebilirAdet)}
                                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {hesaplananIadeTutar !== null && hesaplananIadeTutar > 0 && (
                    <p className="text-sm text-cyan-400 font-semibold">
                      Tahmini tutar: {hesaplananIadeTutar.toLocaleString("tr-TR")} TL
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Açıklama
                </label>
                <textarea
                  value={talepMesaji}
                  onChange={(e) => setTalepMesaji(e.target.value)}
                  placeholder="İptal veya iade nedeninizi kısaca yazın..."
                  className="w-full bg-[#020617] border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none min-h-[140px] resize-none"
                  required
                />
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Talebiniz incelendikten sonra size bildirim gider. Ortalama yanıt süresi 15 dakikadır.
                </p>
              </div>

              <button
                type="submit"
                disabled={talepGonderiliyor || !talepKonusu || !talepMesaji || !talepBaslik || (kalemSecimKonu && iadeSuresiGecti)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {talepGonderiliyor ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Talebi Gönder
                  </>
                )}
              </button>
            </form>
          </div>
    </div>
  );
}
