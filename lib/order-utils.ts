import type { OrderLike } from "@/lib/order-types";

export const ORDER_STATUS_OPTIONS = [
  "Ödeme Bekliyor (Havale)",
  "Ödendi / Hazırlanıyor",
  "Kargoya Verildi",
  "Tamamlandı",
  "Kısmen İade Edildi",
  "İade Edildi",
  "İptal Edildi",
] as const;

export function getOrderStatusText(order?: OrderLike | null) {
  return order?.durum || order?.status || "";
}

export function getOrderTrackingNumber(order?: OrderLike | null) {
  return order?.takipNo || order?.kargoTakipNo || order?.trackingNumber || "";
}

export function getOrderShippingCompany(order?: OrderLike | null) {
  return order?.kargoFirmasi || order?.shippingCompany || "";
}

/** Ödeme henüz tamamlanmamış siparişler (havale/kart bekleyen) */
export function isOdemeBekleyenSiparis(order?: OrderLike | null) {
  if (!order) return false;

  const odemeDurumu = (order.odemeDurumu || "").toLowerCase();
  if (odemeDurumu === "odendi" || odemeDurumu === "onaylandi") return false;
  if (odemeDurumu === "havale_bekliyor" || odemeDurumu === "odeme_bekliyor") return true;

  const durum = getOrderStatusText(order).toLocaleLowerCase("tr-TR");
  if (durum.includes("iptal") || durum.includes("iade")) return false;
  if (
    durum.includes("hazır") ||
    durum.includes("ödendi") ||
    durum.includes("odendi") ||
    durum.includes("kargo") ||
    durum.includes("teslim") ||
    durum.includes("tamam")
  ) {
    return false;
  }

  return (
    durum.includes("ödeme bekliyor") ||
    durum.includes("odeme bekliyor") ||
    durum.includes("havale bekliyor") ||
    durum.includes("havale")
  );
}

export function isHavaleBekleyenSiparis(order?: OrderLike | null) {
  if (!order || !isOdemeBekleyenSiparis(order)) return false;

  const odemeDurumu = (order.odemeDurumu || "").toLowerCase();
  if (odemeDurumu === "havale_bekliyor") return true;

  const yontem = `${order.odemeYontemi || order.paymentMethod || ""}`.toLocaleLowerCase("tr-TR");
  if (yontem === "havale") return true;

  const durum = getOrderStatusText(order).toLocaleLowerCase("tr-TR");
  return durum.includes("havale");
}

export function normalizeOrderStatus(order?: OrderLike | null) {
  const rawStatus = `${order?.durum || ""} ${order?.status || ""} ${order?.paymentMethod || ""}`.toLocaleLowerCase("tr-TR");

  if (rawStatus.includes("kısmen iade") || rawStatus.includes("kismen iade")) return "Kısmen İade Edildi";
  if (rawStatus.includes("iade")) return "İade Edildi";
  if (rawStatus.includes("iptal") || rawStatus.includes("red")) return "İptal Edildi";
  if (rawStatus.includes("teslim") || rawStatus.includes("tamam")) return "Tamamlandı";
  if (rawStatus.includes("kargo")) return "Kargoya Verildi";
  if (rawStatus.includes("havale")) return "Ödeme Bekliyor (Havale)";
  if (rawStatus.includes("hazır") || rawStatus.includes("ödendi") || rawStatus.includes("odendi")) return "Ödendi / Hazırlanıyor";
  if (rawStatus.includes("ödeme bekliyor") || rawStatus.includes("odeme bekliyor")) return "Ödeme Bekliyor";

  return order?.durum || order?.status || "Hazırlanıyor";
}
