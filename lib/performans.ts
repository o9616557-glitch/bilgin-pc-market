/** Ana thread boşaldığında veya kısa gecikmeyle çalıştırır — ilk yüklemede kasma önler. */
export function ertele<T>(is: () => T | Promise<T>, ms = 1200): void {
  if (typeof window === "undefined") return;

  const calistir = () => {
    void is();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(calistir, { timeout: ms });
    return;
  }

  window.setTimeout(calistir, ms);
}
