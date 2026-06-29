/** İyzico checkoutFormContent DOM'a yerleştirir ve script'leri çalıştırır. */

export function sifirlaSayfaKilidi() {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document.body.style.position = "";
  document.documentElement.style.overflow = "";
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
      src.startsWith("chrome-error:") ||
      iframe.closest("#iyzico-panel, #iyzipay-checkout-form, #iyzico-inject-target");

    if (odemeIframe) iframe.remove();
  });
}

/** Aynı sayfada yeni form yüklemeden önce — hafif temizlik */
export function temizleIyzicoKalintilari() {
  silOdemeIframeKalintilari();
  silIyzicoScriptleri();

  document.querySelectorAll("#iyzipay-checkout-form, #iyzico-inject-target").forEach((el) => {
    el.innerHTML = "";
  });
}

/** Ödeme sayfasından çıkınca — tüm iframe ve overlay kalıntılarını kaldır */
export function temizleOdemeSayfasiKalintilari() {
  silIyzicoScriptleri();

  document.querySelectorAll("iframe").forEach((iframe) => {
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    iframe.remove();
  });

  document.querySelectorAll("#iyzipay-checkout-form, #iyzico-inject-target").forEach((el) => {
    el.innerHTML = "";
  });

  document.querySelectorAll("div").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (el.closest("header, nav, main")) return;
    const style = getComputedStyle(el);
    if (style.position !== "fixed" && style.position !== "absolute") return;
    const z = parseInt(style.zIndex || "0", 10);
    const iyzicoIcerik =
      el.id?.toLowerCase().includes("iyzi") ||
      el.querySelector("iframe") ||
      el.innerHTML.toLowerCase().includes("iyziinit");
    if (iyzicoIcerik && z >= 50) el.remove();
  });

  document.body.querySelectorAll(":scope > div").forEach((el) => {
    if (el.querySelector("main, header, nav")) return;
    if (el.querySelector("iframe") || el.id?.toLowerCase().includes("iyzi")) el.remove();
  });

  sifirlaSayfaKilidi();
}

/** İyzico açıkken güvenli çıkış — tam sayfa yönlendirme */
export function odemeSayfasindanCik(hedef: string) {
  temizleOdemeSayfasiKalintilari();
  window.location.assign(hedef);
}

export function enjekteIyzicoCheckoutForm(container: HTMLElement, html: string) {
  temizleIyzicoKalintilari();

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
}

export function iyzicoFormuYuklendiMi(): boolean {
  const form = document.getElementById("iyzipay-checkout-form");
  if (form?.querySelector("iframe")) return true;
  return Boolean(document.querySelector("iframe[src*='iyzipay'], iframe[src*='iyzico']"));
}
