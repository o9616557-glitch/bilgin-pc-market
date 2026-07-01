"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  enjekteIyzicoCheckoutForm,
  iyzicoIframeKaydirmaAyarla,
  iyzicoTamEkranKapat,
  IYZICO_CHECKOUT_STORAGE_KEY,
  temizleIyzicoKalintilari,
} from "@/lib/iyzico-checkout";

export default function OdemeIyzicoSayfasi() {
  const formRef = useRef<HTMLDivElement>(null);
  const ayrilisRef = useRef(false);
  const [durum, setDurum] = useState<"yukleniyor" | "hazir" | "yok">("yukleniyor");

  const odemeDon = () => {
    ayrilisRef.current = true;
    sessionStorage.removeItem(IYZICO_CHECKOUT_STORAGE_KEY);
    iyzicoTamEkranKapat();
    window.location.href = "/odeme?iptal=1";
  };

  useEffect(() => {
    const html = sessionStorage.getItem(IYZICO_CHECKOUT_STORAGE_KEY);
    if (!html) {
      setDurum("yok");
      return;
    }

    setDurum("hazir");
    document.documentElement.classList.add("iyzico-tam-ekran");
    document.body.classList.add("iyzico-tam-ekran");

    const baslat = () => {
      const el = formRef.current;
      if (!el) return false;
      enjekteIyzicoCheckoutForm(el, html);
      return true;
    };
    if (!baslat()) requestAnimationFrame(() => baslat());

    const scrollObserver = new MutationObserver(() => iyzicoIframeKaydirmaAyarla());
    scrollObserver.observe(document.body, { childList: true, subtree: true });
    const scrollTimers = [300, 800, 1500, 3000].map((ms) => setTimeout(iyzicoIframeKaydirmaAyarla, ms));

    const geriTusu = () => {
      if (ayrilisRef.current) return;
      sessionStorage.removeItem(IYZICO_CHECKOUT_STORAGE_KEY);
      iyzicoTamEkranKapat();
      window.location.replace("/odeme?iptal=1");
    };

    window.addEventListener("popstate", geriTusu);

    return () => {
      scrollObserver.disconnect();
      scrollTimers.forEach(clearTimeout);
      window.removeEventListener("popstate", geriTusu);
      document.documentElement.classList.remove("iyzico-tam-ekran");
      document.body.classList.remove("iyzico-tam-ekran");
      temizleIyzicoKalintilari();
    };
  }, []);

  if (durum === "yukleniyor") {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <p className="text-slate-500 text-sm">Ödeme ekranı hazırlanıyor…</p>
      </div>
    );
  }

  if (durum === "yok") {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-slate-600 text-sm">Ödeme oturumu bulunamadı.</p>
        <a
          href="/odeme"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Ödeme sayfasına dön
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="iyzico-ust-cubuk">
        <a
          href="/odeme?iptal=1"
          onClick={(e) => {
            e.preventDefault();
            odemeDon();
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 touch-manipulation min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Ödemeye dön
        </a>
      </div>
      <div className="iyzico-tam-ekran-kaplama fixed inset-0 z-[99990] bg-white w-full overflow-y-auto overscroll-y-contain">
        <div ref={formRef} id="iyzipay-checkout-form" className="responsive w-full bg-white" />
      </div>
    </>
  );
}
