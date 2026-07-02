import type { OrderItemLike, OrderLike } from "@/lib/order-types";

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

export function siparisKalemleri(order?: OrderLike | null) {
  const sepet = order?.sepet || [];
  const items = order?.items || order?.cartItems || [];
  if (!sepet.length) return items;
  if (!items.length) return sepet;

  return sepet.map((sepetKalem) => {
    const sepetId = String(sepetKalem.id || sepetKalem._id || sepetKalem.productId || "");
    const eslesen = items.find((item) => {
      const itemId = String(item.id || item._id || item.productId || "");
      return sepetId && itemId && sepetId === itemId;
    });

    return {
      ...(eslesen || {}),
      ...sepetKalem,
      iadeEdilenAdet: Math.max(
        Number(sepetKalem.iadeEdilenAdet || 0),
        Number(eslesen?.iadeEdilenAdet || 0)
      ),
      quantity:
        sepetKalem.quantity ||
        sepetKalem.adet ||
        eslesen?.quantity ||
        eslesen?.adet ||
        1,
      adet:
        sepetKalem.adet ||
        sepetKalem.quantity ||
        eslesen?.adet ||
        eslesen?.quantity ||
        1,
      title:
        sepetKalem.title ||
        sepetKalem.isim ||
        sepetKalem.name ||
        eslesen?.title ||
        eslesen?.isim,
      isim:
        sepetKalem.isim ||
        sepetKalem.title ||
        eslesen?.isim ||
        eslesen?.title,
    };
  });
}

export function siparisKalemiIadeAdet(
  order: OrderLike | null | undefined,
  item: OrderItemLike,
  opts?: { talepler?: UrunDestekTalepLike[]; siparisKodu?: string }
): number {
  const kalem = siparisKalemleri(order).find((k) =>
    siparisKalemRefEslesirMi(
      {
        urunId: String(k.id || k._id || k.productId),
        isim: String(k.title || k.isim || k.name),
      },
      item
    )
  );
  const kalemden = Number(kalem?.iadeEdilenAdet || item.iadeEdilenAdet || 0);

  let gecmisten = 0;
  for (const kayit of order?.iadeGecmisi || []) {
    for (const g of kayit.kalemler || []) {
      if (siparisKalemRefEslesirMi(g, item)) {
        gecmisten += Number(g.adet || 0);
      }
    }
  }

  let talepten = 0;
  const siparisKodu = opts?.siparisKodu || String(order?.siparisKodu || order?.orderNumber || "");
  if (opts?.talepler?.length && siparisKodu) {
    for (const t of opts.talepler) {
      if (t.konu !== "iade" || !t.iadeOdendi) continue;
      if (!siparisKodlariEslesir(t.siparisNo || "", siparisKodu)) continue;
      for (const g of t.iadeKalemleri || []) {
        if (siparisKalemRefEslesirMi(g, item)) {
          talepten += Number(g.adet || 0);
        }
      }
    }
  }

  return Math.max(kalemden, gecmisten, talepten);
}

/** Ürün satırında iade var mı — tek kaynak */
export function siparisKalemIadeEdildiMi(
  order: OrderLike | null | undefined,
  item: OrderItemLike,
  opts?: { talepler?: UrunDestekTalepLike[]; siparisKodu?: string }
): boolean {
  if (siparisKalemiIadeAdet(order, item, opts) > 0) return true;

  for (const kayit of order?.iadeGecmisi || []) {
    if (kayit.kalemler?.some((g) => siparisKalemRefEslesirMi(g, item))) return true;
  }

  const siparisKodu = opts?.siparisKodu || String(order?.siparisKodu || order?.orderNumber || "");
  for (const t of opts?.talepler || []) {
    if (t.konu !== "iade" || !t.iadeOdendi) continue;
    if (!siparisKodlariEslesir(t.siparisNo || "", siparisKodu)) continue;
    if (t.iadeKalemleri?.some((g) => siparisKalemRefEslesirMi(g, item))) return true;
  }

  const durum = durumMetniNorm(getOrderStatusText(order));
  if (!durumIadeMi(durum) || durumIptalMi(durum)) return false;

  const kalemler = siparisKalemleri(order);
  if (
    !kalemler.some((k) =>
      siparisKalemRefEslesirMi(
        { urunId: String(k.id || k._id || k.productId), isim: String(k.title || k.isim || k.name) },
        item
      )
    )
  ) {
    return false;
  }

  if (!durum.includes("kısmen") && !durum.includes("kismen")) return true;
  if (kalemler.length === 1) return true;

  return false;
}

/** Ürün satırı tamamen iade edildi mi */
export function siparisKalemTamIadeMi(
  order: OrderLike | null | undefined,
  item: OrderItemLike,
  opts?: { talepler?: UrunDestekTalepLike[]; siparisKodu?: string }
): boolean {
  const itemAdet = Number(item.quantity || item.adet || item.miktar || 1);
  const iadeAdet = siparisKalemiIadeAdet(order, item, opts);
  if (iadeAdet > 0) return iadeAdet >= itemAdet;

  const durum = durumMetniNorm(getOrderStatusText(order));
  if (!siparisKalemIadeEdildiMi(order, item, opts)) return false;
  if (!durum.includes("kısmen") && !durum.includes("kismen")) return true;
  if ((siparisKalemleri(order).length || 0) === 1) return true;

  return false;
}

export function siparisIadeOzeti(order?: OrderLike | null) {
  if (!order) return { var: false, kismi: false, tam: false };

  const durum = durumMetniNorm(getOrderStatusText(order));
  if (durumIptalMi(durum)) return { var: false, kismi: false, tam: false };

  const items = siparisKalemleri(order);
  const iadeKalemleri = items.filter((item) => siparisKalemiIadeAdet(order, item) > 0);

  if (iadeKalemleri.length > 0) {
    const tumKalemlerIade = items.every((item) => {
      const adet = Number(item.quantity || item.adet || item.miktar || 1);
      return siparisKalemiIadeAdet(order, item) >= adet;
    });
    return { var: true, kismi: !tumKalemlerIade, tam: tumKalemlerIade };
  }

  if (durumIadeMi(durum)) {
    const tam = !durum.includes("kısmen") && !durum.includes("kismen");
    return { var: true, kismi: !tam, tam };
  }

  return { var: false, kismi: false, tam: false };
}

/** Ödeme henüz tamamlanmamış siparişler (havale/kart bekleyen) */
export function isOdemeBekleyenSiparis(order?: OrderLike | null) {
  if (!order) return false;

  const durum = durumMetniNorm(getOrderStatusText(order));
  if (durumIptalMi(durum) || durumIadeMi(durum)) return false;
  if (siparisIadeOzeti(order).var) return false;
  if (
    durum.includes("hazır") ||
    durum.includes("hazir") ||
    durum.includes("ödendi") ||
    durum.includes("odendi") ||
    durum.includes("kargo") ||
    durum.includes("teslim") ||
    durum.includes("tamam")
  ) {
    return false;
  }

  const odemeDurumu = (order.odemeDurumu || "").toLowerCase();
  if (odemeDurumu === "odendi" || odemeDurumu === "onaylandi") return false;
  if (odemeDurumu === "havale_bekliyor" || odemeDurumu === "odeme_bekliyor") return true;

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

  if (rawStatus.includes("iptal") || rawStatus.includes("i̇ptal") || rawStatus.includes("red")) {
    return "İptal Edildi";
  }

  const iadeOzeti = siparisIadeOzeti(order);
  if (iadeOzeti.var) {
    return iadeOzeti.tam ? "İade Edildi" : "Kısmen İade Edildi";
  }

  if (rawStatus.includes("kısmen iade") || rawStatus.includes("kismen iade")) return "Kısmen İade Edildi";
  if (rawStatus.includes("iade")) return "İade Edildi";
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

function isimNorm(s?: string | null) {
  return String(s || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim();
}

export function siparisKalemIdleri(item: OrderItemLike): string[] {
  return [
    ...new Set(
      [item.id, item._id, item.productId, item.slug]
        .filter(Boolean)
        .map((v) => String(v).trim())
        .filter(Boolean)
    ),
  ];
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
    if (tid.length >= 8 && uid.length >= 8) {
      if (tid.endsWith(uid.slice(-12)) || uid.endsWith(tid.slice(-12))) return true;
      if (tid.endsWith(uid.slice(-8)) || uid.endsWith(tid.slice(-8))) return true;
    }
  }
  if (talepKalem.isim && urunIsim) {
    const a = isimNorm(talepKalem.isim);
    const b = isimNorm(urunIsim);
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.length >= 8 && b.length >= 8 && (a.includes(b.slice(0, 24)) || b.includes(a.slice(0, 24)))) {
      return true;
    }
  }
  return false;
}

export function siparisKalemRefEslesirMi(
  ref: { urunId?: string; isim?: string },
  item: OrderItemLike
): boolean {
  const isim = String(item.title || item.isim || item.name || "");
  for (const id of siparisKalemIdleri(item)) {
    if (urunKalemiEslesir(ref, id, isim)) return true;
  }
  return urunKalemiEslesir(ref, "", isim);
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

export function durumMetniNorm(d?: string | null) {
  return (d || "").toLocaleLowerCase("tr-TR");
}

export function durumIptalMi(d?: string | null) {
  const n = durumMetniNorm(d);
  return n.includes("iptal") || n.includes("i̇ptal") || n.includes("red");
}

export function durumIadeMi(d?: string | null) {
  const n = durumMetniNorm(d);
  return n.includes("iade") || n.includes("kısmen iade") || n.includes("kismen iade");
}

export const IADE_SURESI_GUN = 15;

/** Sipariş listesinde gösterilecek durum metni */
export function siparisGosterimDurumu(order?: OrderLike | null) {
  const durum = getOrderStatusText(order);
  const d = durumMetniNorm(durum);

  if (durumIptalMi(durum)) return "İptal Edildi";

  const items = siparisKalemleri(order);
  const iadeKalemleri = items.filter((item) => siparisKalemiIadeAdet(order, item) > 0);
  if (iadeKalemleri.length > 0) {
    const hepsiIade = items.every((item) => {
      const adet = Number(item.quantity || item.adet || item.miktar || 1);
      return siparisKalemiIadeAdet(order, item) >= adet;
    });
    return hepsiIade ? "İade Edildi" : "Kısmen İade Edildi";
  }

  if (d.includes("kısmen iade") || d.includes("kismen iade")) return "Kısmen İade Edildi";
  if (d.includes("iade")) return "İade Edildi";

  return durum;
}


export function siparisTamamlandiMi(durum?: string | null) {
  const d = durumMetniNorm(durum);
  return d.includes("teslim") || d.includes("tamam");
}

export function siparisTamamlanmaTarihi(order?: OrderLike | null): Date | null {
  if (!order) return null;
  const kayitli = (order as { tamamlanmaTarihi?: string | Date }).tamamlanmaTarihi;
  if (kayitli) return new Date(kayitli);

  const durum = getOrderStatusText(order);
  const d = durumMetniNorm(durum);
  const teslimSonrasi =
    d.includes("teslim") || d.includes("tamam") || durumIadeMi(d);
  if (!teslimSonrasi) return null;

  const fallback = order.tarih || order.createdAt;
  return fallback ? new Date(fallback) : null;
}

export function siparisIadeSuresiOzeti(order?: OrderLike | null) {
  const baslangicTarihi = siparisTamamlanmaTarihi(order);

  if (!baslangicTarihi) {
    return {
      tamamlandi: false,
      gectiMi: false,
      kalanGun: IADE_SURESI_GUN,
      bitisTarihi: null as Date | null,
      baslangicTarihi: null,
    };
  }

  const bitisTarihi = new Date(
    baslangicTarihi.getTime() + IADE_SURESI_GUN * 24 * 60 * 60 * 1000
  );
  const bugun = new Date();
  const gectiMi = bugun > bitisTarihi;
  const kalanGun = Math.max(
    0,
    Math.ceil((bitisTarihi.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24))
  );

  return { tamamlandi: true, gectiMi, kalanGun, bitisTarihi, baslangicTarihi };
}

/** Tamamlanmış siparişte 15 günlük iade/iptal süresi dolduysa */
export function siparisOtomatikIadeIptalKapaliMi(order?: OrderLike | null) {
  const ozet = siparisIadeSuresiOzeti(order);
  return ozet.tamamlandi && ozet.gectiMi;
}

function urunSiparisKalemEslesir(
  kalem: OrderItemLike,
  urunId: string,
  urunIsim?: string
) {
  return urunKalemiEslesir(
    {
      urunId: String(kalem.id || kalem._id || kalem.productId),
      isim: String(kalem.title || kalem.isim || kalem.name),
    },
    urunId,
    urunIsim
  );
}

/** Ürün için iade işlemi yapıldı mı */
export function urunIadeIslendiMi(
  order: OrderLike | null | undefined,
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim: string | undefined,
  iadeEdilenAdet: number
): boolean {
  if (iadeEdilenAdet > 0) return true;

  const gecmis = order?.iadeGecmisi || [];
  if (
    gecmis.some((kayit) =>
      kayit.kalemler?.some((k) => urunKalemiEslesir(k, urunId, urunIsim))
    )
  ) {
    return true;
  }

  if (
    talepler.some((t) => {
      if (t.konu !== "iade" || !t.iadeOdendi) return false;
      if (!siparisKodlariEslesir(t.siparisNo || "", siparisKodu)) return false;
      return t.iadeKalemleri?.some((k) => urunKalemiEslesir(k, urunId, urunIsim));
    })
  ) {
    return true;
  }

  const durum = durumMetniNorm(getOrderStatusText(order));
  if (!durumIadeMi(durum) || durumIptalMi(durum)) return false;

  const kalemler = siparisKalemleri(order);
  if (!kalemler.some((k) => urunSiparisKalemEslesir(k, urunId, urunIsim))) return false;

  // Tam sipariş iadesi → tüm ürünler iade
  if (!durum.includes("kısmen") && !durum.includes("kismen")) return true;

  // Tek ürünlü sipariş + kısmi iade durumu → o ürün iade
  if (kalemler.length === 1) return true;

  return false;
}

/** null = iade yok, tam = ürün tamamen iade, kismi = ürünün bir kısmı iade */
export function urunIadeDurumu(
  order: OrderLike | null | undefined,
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim: string | undefined,
  itemAdet: number,
  iadeEdilenAdet: number
): null | "tam" | "kismi" {
  if (!urunIadeIslendiMi(order, talepler, siparisKodu, urunId, urunIsim, iadeEdilenAdet)) {
    return null;
  }

  if (iadeEdilenAdet > 0) {
    return iadeEdilenAdet >= itemAdet ? "tam" : "kismi";
  }

  const durum = durumMetniNorm(getOrderStatusText(order));
  if (!durum.includes("kısmen") && !durum.includes("kismen")) return "tam";
  if ((siparisKalemleri(order).length || 0) === 1) return "tam";

  return "kismi";
}

export function urunTamIadeMi(iadeEdilenAdet: number, itemAdet: number): boolean {
  return iadeEdilenAdet > 0 && iadeEdilenAdet >= itemAdet;
}

/** Admin tarafında tamamlanmış ürün iptali */
export function urunTamamlanmisIptalMi(
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim?: string
): boolean {
  return talepler.some((t) => {
    if (t.konu !== "iptal") return false;
    if (t.durum !== "Çözüldü") return false;
    if (!siparisKodlariEslesir(t.siparisNo || "", siparisKodu)) return false;
    if (!t.iadeKalemleri?.length) return false;
    return t.iadeKalemleri.some((k) => urunKalemiEslesir(k, urunId, urunIsim));
  });
}

export function urunIptalEdildiMi(
  order: OrderLike | null | undefined,
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim: string | undefined,
  itemAdet: number,
  iadeEdilenAdet: number
): boolean {
  if (durumIptalMi(getOrderStatusText(order))) return true;
  if (urunTamamlanmisIptalMi(talepler, siparisKodu, urunId, urunIsim)) return true;
  if (itemAdet > 0 && iadeEdilenAdet >= itemAdet) {
    return urunTamamlanmisIptalMi(talepler, siparisKodu, urunId, urunIsim);
  }
  return false;
}

/** Kısmi siparişte yalnızca henüz iptal edilmemiş kalemler için */
export function urunIptalEdilebilirMi(
  order: OrderLike | null | undefined,
  talepler: UrunDestekTalepLike[],
  siparisKodu: string,
  urunId: string,
  urunIsim: string | undefined,
  itemAdet: number,
  iadeEdilenAdet: number,
  options?: { odemeBekliyor?: boolean; teslimEdildi?: boolean }
): boolean {
  if (!order) return false;
  if (options?.odemeBekliyor || options?.teslimEdildi) return false;
  if (durumIptalMi(getOrderStatusText(order))) return false;
  if (urunIptalEdildiMi(order, talepler, siparisKodu, urunId, urunIsim, itemAdet, iadeEdilenAdet)) {
    return false;
  }
  if (urunBekleyenIslemEtiketi(talepler, siparisKodu, urunId, urunIsim, iadeEdilenAdet)) {
    return false;
  }
  if (iadeEdilenAdet > 0) return false;
  return true;
}
