export const UYE_VERI_EVENT = "bilgin-uye-verisi-hazir";
export const HESAP_GUNCELLENDI_EVENT = "bilgin-hesap-guncellendi";

export type UyeBaslangicVerisi = {
  addresses: unknown[];
  favorites: unknown[];
  talepler: unknown[];
  orders: unknown[];
  cart: unknown[];
  systems: unknown[];
};

export function uyeOnbellektenOku(): Partial<UyeBaslangicVerisi> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("bilgin_uye_baslangic");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function uyeOnbellegineYaz(veri: UyeBaslangicVerisi) {
  if (typeof window === "undefined") return;

  const aciklar = (veri.talepler as { durum?: string }[]).filter((t) => t.durum !== "Çözüldü");
  const acilMesaj = aciklar.some((t) => t.durum === "Yanıt Bekleniyor");

  sessionStorage.setItem("bilgin_uye_baslangic", JSON.stringify(veri));
  sessionStorage.setItem("bilgin-favoriler", JSON.stringify(veri.favorites));
  sessionStorage.setItem("bilgin-adresler", JSON.stringify(veri.addresses));
  sessionStorage.setItem(
    "bilgin_hesabim_data",
    JSON.stringify({
      adresSayisi: veri.addresses.length,
      favoriSayisi: veri.favorites.length,
      tumSiparisler: veri.orders,
    })
  );
  sessionStorage.setItem(
    "bilgin_destek_ozet",
    JSON.stringify({ sayi: aciklar.length, acil: acilMesaj })
  );
  sessionStorage.setItem("bilgin_siparisler", JSON.stringify(veri.orders));

  if (veri.cart) {
    localStorage.setItem("bilgin-sepet", JSON.stringify(veri.cart));
  }
  localStorage.setItem("bilgin_kayitli_sistemler", JSON.stringify(veri.systems));

  window.dispatchEvent(new CustomEvent(HESAP_GUNCELLENDI_EVENT));
  window.dispatchEvent(new CustomEvent(UYE_VERI_EVENT, { detail: veri }));
}

export function uyeOnbellektenGoster() {
  const onbellek = uyeOnbellektenOku();
  if (!onbellek) return false;
  uyeOnbellegineYaz({
    addresses: onbellek.addresses || [],
    favorites: onbellek.favorites || [],
    talepler: onbellek.talepler || [],
    orders: onbellek.orders || [],
    cart: onbellek.cart || [],
    systems: onbellek.systems || [],
  });
  return true;
}
