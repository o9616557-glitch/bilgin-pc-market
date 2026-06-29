/** İyzico checkoutFormContent DOM'a yerleştirir ve script'leri çalıştırır. */
export function temizleIyzicoKalintilari() {
  const form = document.getElementById("iyzipay-checkout-form");
  if (form) form.innerHTML = "";

  document.querySelectorAll("script[src*='iyzipay'], script[src*='iyzico']").forEach((el) => el.remove());

  const w = window as Window & { iyziInit?: unknown; IyziInit?: unknown; iyzipay?: unknown };
  delete w.iyziInit;
  delete w.IyziInit;
  delete w.iyzipay;
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
