import { ObjectId } from "mongodb";

export type KartMarkasi = "visa" | "mastercard" | "troy" | "amex" | "diger";

export interface KayitliKart {
  _id: string;
  last4: string;
  brand: KartMarkasi;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CuzdanIslem {
  _id: string;
  type: "odeme" | "iade" | "beklemede" | "basarisiz";
  title: string;
  amount: number;
  status: "tamamlandi" | "beklemede" | "basarisiz";
  statusLabel: string;
  orderCode?: string;
  paymentMethod?: string;
  cardLast4?: string;
  date: string;
}

export function kartMarkasiBul(numara: string): KartMarkasi {
  const n = numara.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^9792/.test(n)) return "troy";
  if (/^3[47]/.test(n)) return "amex";
  return "diger";
}

export function luhnGecerliMi(numara: string): boolean {
  const digits = numara.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let cift = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (cift) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    cift = !cift;
  }
  return sum % 10 === 0;
}

export function paraFormatla(tutar: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(tutar);
}

export function bosCuzdan(email: string) {
  return {
    email,
    storeCredit: 0,
    loyaltyPoints: 0,
    savedCards: [] as KayitliKart[],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function siparisleriIslemlereCevir(orders: any[]): CuzdanIslem[] {
  return orders.map((order) => {
    const hamDurum = `${order.durum || ""} ${order.status || ""}`.toLowerCase();
    const tutar = Number(order.totalPrice || order.toplamTutar || 0);
    const tarih = order.createdAt || order.tarih || new Date().toISOString();
    const kod = order.siparisKodu || order.orderNumber || "";
    const odeme = order.odemeYontemi === "kart" ? "Kredi Kartı" : order.odemeYontemi === "havale" ? "Havale / EFT" : "Ödeme";

    let type: CuzdanIslem["type"] = "odeme";
    let status: CuzdanIslem["status"] = "tamamlandi";
    let statusLabel = "Ödendi";

    if (hamDurum.includes("iptal") || hamDurum.includes("red")) {
      type = "basarisiz";
      status = "basarisiz";
      statusLabel = "Reddedildi";
    } else if (hamDurum.includes("iade")) {
      type = "iade";
      status = "tamamlandi";
      statusLabel = "İade";
    } else if (hamDurum.includes("bekl") || hamDurum.includes("ödeme bekliyor") || hamDurum.includes("havale bekliyor")) {
      type = "beklemede";
      status = "beklemede";
      statusLabel = "Beklemede";
    }

    const urunSayisi = (order.items || order.sepet || []).length;
    const title = urunSayisi > 1
      ? `Sipariş (${urunSayisi} ürün)`
      : (order.items?.[0]?.title || order.sepet?.[0]?.isim || `Sipariş ${kod}`);

    return {
      _id: order._id?.toString?.() || String(order._id),
      type,
      title,
      amount: tutar,
      status,
      statusLabel,
      orderCode: kod,
      paymentMethod: odeme,
      date: typeof tarih === "string" ? tarih : new Date(tarih).toISOString(),
    };
  });
}

export function yeniKartId() {
  return new ObjectId().toString();
}
