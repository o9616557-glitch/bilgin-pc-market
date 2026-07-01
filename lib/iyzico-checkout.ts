/** İyzico checkoutFormContent — script çalıştırma ve çıkışta temizlik */

export function sifirlaSayfaKilidi() {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document.body.style.position = "";
  document.documentElement.style.overflow = "";
}

/** İyzico tam ekranı kapat — siyah ekran / body kilidi kalıntısını önler */
export function iyzicoTamEkranKapat() {
  temizleIyzicoKalintilari();
  document.documentElement.classList.remove("iyzico-tam-ekran");
  document.body.classList.remove("iyzico-tam-ekran");
  sifirlaSayfaKilidi();
}

function silIyzicoScriptleri() {
  document.querySelectorAll("script").forEach((script) => {
    const src = script.getAttribute("src") || "";
    const text = script.textContent || "";
    if (/iyzipay|iyzico|iyziInit/i.test(src + text)) script.remove();
  });

  const w = window as Window & { iyziInit?: unknown; IyziInit?: unknown; iyzipay?: unknown };
  delete w.iyziInit;
  delete w.IyziInit;
  delete w.iyzipay;
}

function silOdemeIframeKalintilari() {
  document.querySelectorAll("iframe").forEach((iframe) => {
    const src = iframe.getAttribute("src") || "";
    const odemeIframe =
      /iyzipay|iyzico/i.test(src) ||
      !src ||
      src === "about:blank" ||
      src.startsWith("chrome-error:");

    if (odemeIframe) iframe.remove();
  });
}

/** Aynı sayfada yeniden yüklemeden önce */
export function temizleIyzicoKalintilari() {
  silOdemeIframeKalintilari();
  silIyzicoScriptleri();

  document.querySelectorAll("#iyzipay-checkout-form").forEach((el) => {
    el.innerHTML = "";
  });
}

/** Ödeme sayfasından çıkınca (anasayfa / geri) — iframe kalıntısı sil */
export function temizleOdemeSayfasiKalintilari() {
  silIyzicoScriptleri();
  silOdemeIframeKalintilari();

  document.querySelectorAll("#iyzipay-checkout-form").forEach((el) => {
    el.innerHTML = "";
  });

  document.body.querySelectorAll(":scope > div").forEach((el) => {
    if (el.querySelector("main, header, nav")) return;
    if (el.querySelector("iframe")) el.remove();
  });

  sifirlaSayfaKilidi();
}

export function enjekteIyzicoCheckoutForm(container: HTMLElement, html: string) {
  silOdemeIframeKalintilari();
  silIyzicoScriptleri();

  const temizHtml = html.replace(
    /<div[^>]*id=["']iyzipay-checkout-form["'][^>]*>\s*<\/div>/gi,
    ""
  );

  container.innerHTML = temizHtml;

  container.querySelectorAll("script").forEach((oldScript) => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode?.replaceChild(newScript, oldScript);
  });

  iyzicoIframeKaydirmaAyarla();
}

/** Taksit listesi vb. için iframe içi / dışı kaydırma */
export function iyzicoIframeKaydirmaAyarla() {
  document.querySelectorAll("iframe").forEach((iframe) => {
    const src = iframe.getAttribute("src") || "";
    if (!/iyzipay|iyzico|cpp\.iyzipay/i.test(src) && src && src !== "about:blank") return;

    iframe.setAttribute("scrolling", "yes");
    iframe.style.width = "100%";
    iframe.style.minHeight = "100dvh";
    iframe.style.maxHeight = "none";
    iframe.style.border = "0";
    iframe.style.display = "block";
    iframe.style.position = "relative";
  });
}

export function iyzicoIframeVarMi(): boolean {
  return Boolean(
    document.querySelector(
      "iframe[src*='iyzipay'], iframe[src*='iyzico'], iframe[src*='cpp.iyzipay']"
    )
  );
}
