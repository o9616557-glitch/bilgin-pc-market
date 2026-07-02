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

export type UrunDestekTalepLike = {
  konu?: string;
  durum?: string;
  siparisNo?: string;
  iadeYontemi?: "kart" | "magaza_kredisi";
  iadeOdendi?: boolean;
  iadeKalemleri?: { urunId?: string; isim?: string; adet?: number }[];
};

const URUN_TALEP_KEY = "bilgin_urun_talep";

export function siparisKodlariEslesir(a: string, b: string) {
  const na = String(a || "").trim().toUpperCase();
  const nb = String(b || "").trim().toUpperCase();
  if (!na || !nb) return false;
  if (na === nb) return true;
  const bpcA = na.match(/BPC-?\d{6}/);
  const bpcB = nb.match(/BPC-?\d{6}/);
  return Boolean(bpcA && bpcB && bpcA[0] === bpcB[0]);
}

export function urunKalemiEslesir(
  talepKalem: { urunId?: string; isim?: string },
  urunId: string,
  urunIsim?: string
) {
  const tid = String(talepKalem.urunId || "").trim();
  const uid = String(urunId || "").trim();
  if (tid && uid) {
    if (tid === uid) return true;
    if (tid.length >= 12 && uid.length >= 12 && (tid.endsWith(uid.slice(-12)) || uid.endsWith(tid.slice(-12)))) {
      return true;
    }
  }
  if (talepKalem.isim && urunIsim) {
    return talepKalem.isim.toLowerCase().trim() === urunIsim.toLowerCase().trim();
  }
  return false;
}

export function urunIcinAcikDestekEtiketi(
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim?: string
): string | null {
  const acik = talepler.find((t) => {
    if (t.durum === "Çözüldü") return false;
    if (t.konu !== "iptal" && t.konu !== "iade") return false;
    if (!siparisKodlariEslesir(t.siparisNo || "", siparisKodu)) return false;
    if (t.iadeKalemleri?.length) {
      return t.iadeKalemleri.some((k) => urunKalemiEslesir(k, urunId, urunIsim));
    }
    return false;
  });
  if (!acik) return null;

  if (acik.durum === "Yanıt Bekleniyor") {
    return acik.konu === "iade" ? "İade Yanıtı Bekleniyor" : "İptal Yanıtı Bekleniyor";
  }
  return acik.konu === "iade" ? "İade Onayı Bekleniyor" : "İptal Onayı Bekleniyor";
}

/** @deprecated urunIcinAcikDestekEtiketi kullanın */
export function urunIcinAcikDestekDurumu(
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim?: string
): string | null {
  return urunIcinAcikDestekEtiketi(talepler, siparisKodu, urunId, urunIsim);
}

export function urunTalepBekliyorKaydet(
  siparisKodu: string,
  urunId: string,
  konu: "iade" | "iptal" = "iptal"
) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${URUN_TALEP_KEY}:${siparisKodu}:${urunId}`, konu);
}

export function urunTalepBekliyorKonu(
  siparisKodu: string,
  urunId: string
): "iade" | "iptal" | null {
  if (typeof window === "undefined") return null;
  const val = sessionStorage.getItem(`${URUN_TALEP_KEY}:${siparisKodu}:${urunId}`);
  if (val === "iade" || val === "iptal") return val;
  if (val === "1") return "iptal";
  return null;
}

export function urunTalepBekliyorMu(siparisKodu: string, urunId: string) {
  return urunTalepBekliyorKonu(siparisKodu, urunId) !== null;
}

export function urunBekleyenIslemEtiketi(
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim: string | undefined,
  iadeEdilenAdet: number
): string | null {
  if (iadeEdilenAdet > 0) {
    urunTalepBekliyorTemizle(siparisKodu, urunId);
    return null;
  }

  const acikEtiket = urunIcinAcikDestekEtiketi(talepler, siparisKodu, urunId, urunIsim);
  if (acikEtiket) return acikEtiket;
  return null;
}

export function urunTalepBekliyorTemizle(siparisKodu: string, urunId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${URUN_TALEP_KEY}:${siparisKodu}:${urunId}`);
}

export type IadeYontemi = "kart" | "magaza_kredisi";

export function urunIadeYontemiBul(
  order: OrderLike | null | undefined,
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim?: string
): IadeYontemi | null {
  const gecmis = order?.iadeGecmisi || [];
  for (let i = gecmis.length - 1; i >= 0; i--) {
    const kayit = gecmis[i];
    if (kayit.yontem !== "kart" && kayit.yontem !== "magaza_kredisi") continue;
    const eslesen = kayit.kalemler?.some((k) => urunKalemiEslesir(k, urunId, urunIsim));
    if (eslesen) return kayit.yontem;
  }

  for (let i = talepler.length - 1; i >= 0; i--) {
    const t = talepler[i];
    if (!t.iadeOdendi) continue;
    if (t.iadeYontemi !== "kart" && t.iadeYontemi !== "magaza_kredisi") continue;
    if (!siparisKodlariEslesir(t.siparisNo || "", siparisKodu)) continue;
    const eslesen = t.iadeKalemleri?.some((k) => urunKalemiEslesir(k, urunId, urunIsim));
    if (eslesen) return t.iadeYontemi;
  }

  return null;
}

export function urunIadeYontemiMetni(yontem?: IadeYontemi | null): string | null {
  if (yontem === "magaza_kredisi") return "Mağaza kredisine yüklendi";
  if (yontem === "kart") return "Kartınıza / hesabınıza yatırıldı";
  return null;
}

export const KART_IADE_BANKA_NOTU =
  "İade tutarının banka hesabınıza yansıması 3-7 iş günü sürebilir.";

export function siparisIadeYontemi(
  order?: OrderLike | null,
  talepler?: UrunDestekTalepLike[]
): IadeYontemi | null {
  if (!order) return null;

  const kod = String(order.siparisKodu || order.orderNumber || "");
  const iadeUrunleri = (order.items || []).filter((item) => Number(item.iadeEdilenAdet || 0) > 0);

  if (iadeUrunleri.length) {
    const yontemler = new Set<IadeYontemi>();
    for (const item of iadeUrunleri) {
      const urunId = String(item.id || item._id || item.productId || "");
      const isim = item.title || item.isim || item.name;
      const yontem = urunIadeYontemiBul(order, talepler || [], kod, urunId, isim);
      if (yontem) yontemler.add(yontem);
    }
    if (yontemler.size === 1) return [...yontemler][0];
    return null;
  }

  const gecmis = order.iadeGecmisi;
  if (gecmis?.length) {
    const son = gecmis[gecmis.length - 1]?.yontem;
    if (son === "kart" || son === "magaza_kredisi") return son;
  }

  if (!talepler?.length) return null;
  const talep = talepler.find(
    (t) =>
      t.iadeOdendi &&
      (t.iadeYontemi === "kart" || t.iadeYontemi === "magaza_kredisi") &&
      siparisKodlariEslesir(t.siparisNo || "", kod)
  );
  return talep?.iadeYontemi === "kart" || talep?.iadeYontemi === "magaza_kredisi"
    ? talep.iadeYontemi
    : null;
}

export function iadeYontemiBilgisi(yontem?: IadeYontemi | null) {
  if (yontem === "magaza_kredisi") {
    return {
      baslik: "Mağaza kredisine yüklendi",
      aciklama:
        "İade tutarı mağaza kredi cüzdanınıza eklendi. Bir sonraki alışverişinizde kullanabilirsiniz.",
      kisa: "Kredi cüzdanına yüklendi",
    };
  }
  if (yontem === "kart") {
    return {
      baslik: "Kartınıza / hesabınıza yatırıldı",
      aciklama:
        "İade tutarı ödeme yaptığınız karta veya banka hesabınıza iade edildi. Yansıması 3-7 iş günü sürebilir.",
      kisa: "Hesaba yatırıldı",
    };
  }
  return null;
}
