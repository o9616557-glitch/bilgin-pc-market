/** İyzico checkoutFormContent DOM'a yerleştirir ve script'leri çalıştırır. */
export function sifirlaSayfaKilidi() {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document.body.style.position = "";
  document.documentElement.style.overflow = "";
}

export function temizleIyzicoKalintilari() {
  document.querySelectorAll("iframe").forEach((iframe) => {
    const src = iframe.getAttribute("src") || "";
    if (/iyzipay|iyzico/i.test(src)) iframe.remove();
  });

  document.querySelectorAll("script").forEach((script) => {
    const src = script.getAttribute("src") || "";
    const text = script.textContent || "";
    if (/iyzipay|iyzico|iyziInit/i.test(src + text)) script.remove();
  });

  document.querySelectorAll("#iyzipay-checkout-form, #iyzico-inject-target").forEach((el) => {
    el.innerHTML = "";
  });

  document.body.querySelectorAll(":scope > div").forEach((el) => {
    const hasIyzicoIframe = el.querySelector("iframe[src*='iyzipay'], iframe[src*='iyzico']");
    if (!hasIyzicoIframe) return;
    if (el.querySelector("main, header, nav")) return;
    el.remove();
  });

  const w = window as Window & { iyziInit?: unknown; IyziInit?: unknown; iyzipay?: unknown };
  delete w.iyziInit;
  delete w.IyziInit;
  delete w.iyzipay;

  sifirlaSayfaKilidi();
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
