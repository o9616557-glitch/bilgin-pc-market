import { siparisKodlariEslesir, urunKalemiEslesir } from "./order-utils";

function nakitIadeTutari(siparis: any): number {
  const odenecek = Number(siparis?.odenecekTutar);
  if (!Number.isNaN(odenecek) && odenecek >= 0) return odenecek;
  const toplam = Number(siparis?.toplamTutar || siparis?.totalPrice || 0);
  const kredi = Number(siparis?.kullanilanKredi || 0);
  const puan = Number(siparis?.kullanilanPuan || 0);
  return Math.max(0, toplam - kredi - puan);
}

/** Siparişte kart/havale ile ödenen toplam tutar */
export function siparisNakitOdemeTutari(siparis: any): number {
  return nakitIadeTutari(siparis);
}

export function kalanNakitIadeTutari(siparis: any): number {
  const nakitToplam = nakitIadeTutari(siparis);
  const toplam = siparisToplamTutar(siparis);
  const iadeEdilen = Number(siparis?.toplamIadeEdilenTutar || 0);
  if (toplam <= 0 || nakitToplam <= 0) return 0;
  const oran = Math.min(1, iadeEdilen / toplam);
  const zatenIadeNakit = Math.round(nakitToplam * oran * 100) / 100;
  return Math.max(0, Math.round((nakitToplam - zatenIadeNakit) * 100) / 100);
}

export type SepetKalemi = {
  id?: string;
  _id?: string;
  productId?: string;
  isim?: string;
  name?: string;
  fiyat?: number;
  adet?: number;
  varyasyon?: string;
  iadeEdilenAdet?: number;
};

export type IadeKalemi = {
  urunId: string;
  adet: number;
  isim?: string;
  birimFiyat?: number;
  tutar?: number;
};

export function kalemiId(k: SepetKalemi): string {
  return String(k.id || k._id || k.productId || "");
}

export function kalemiIsim(k: SepetKalemi): string {
  return k.isim || k.name || "Ürün";
}

export function kalemiFiyat(k: SepetKalemi): number {
  return Number(k.fiyat || 0);
}

export function siparisSepeti(siparis: any): SepetKalemi[] {
  return siparis?.sepet || siparis?.items || [];
}

export function siparisToplamTutar(siparis: any): number {
  const sepetToplam = sepetToplamHesapla(siparisSepeti(siparis));
  const kayitli = Number(siparis?.toplamTutar || siparis?.totalPrice || 0);
  return kayitli > 0 ? kayitli : sepetToplam;
}

export function sepetToplamHesapla(sepet: SepetKalemi[]): number {
  return sepet.reduce((s, k) => s + kalemiFiyat(k) * Number(k.adet || 1), 0);
}

export function iadeEdilebilirAdet(k: SepetKalemi): number {
  const toplam = Number(k.adet || 1);
  const iade = Number(k.iadeEdilenAdet || 0);
  return Math.max(0, toplam - iade);
}

export function kalanIadeEdilebilirTutar(siparis: any): number {
  const toplam = siparisToplamTutar(siparis);
  const iade = Number(siparis?.toplamIadeEdilenTutar || 0);
  return Math.max(0, Math.round((toplam - iade) * 100) / 100);
}

export function iadeKalemleriniDogrula(
  sepet: SepetKalemi[],
  kalemler: IadeKalemi[]
): { ok: boolean; tutar: number; hata?: string; normalized: IadeKalemi[] } {
  if (!kalemler?.length) {
    return { ok: false, tutar: 0, hata: "İade kalemi seçilmedi.", normalized: [] };
  }

  const normalized: IadeKalemi[] = [];
  let tutar = 0;

  for (const kalem of kalemler) {
    const adet = Math.floor(Number(kalem.adet || 0));
    if (adet <= 0) continue;

    const satir = eslestirSepetKalemi(sepet, kalem);
    if (!satir) {
      return { ok: false, tutar: 0, hata: "Siparişte bulunmayan ürün seçildi.", normalized: [] };
    }

    const kalan = iadeEdilebilirAdet(satir);
    if (adet > kalan) {
      return {
        ok: false,
        tutar: 0,
        hata: `${kalemiIsim(satir)} için en fazla ${kalan} adet iade edilebilir.`,
        normalized: [],
      };
    }

    const birimFiyat = kalemiFiyat(satir);
    const satirTutar = Math.round(birimFiyat * adet * 100) / 100;
    tutar += satirTutar;
    normalized.push({
      urunId: kalemiId(satir),
      adet,
      isim: kalemiIsim(satir),
      birimFiyat,
      tutar: satirTutar,
    });
  }

  if (!normalized.length) {
    return { ok: false, tutar: 0, hata: "Geçerli iade kalemi yok.", normalized: [] };
  }

  return { ok: true, tutar: Math.round(tutar * 100) / 100, normalized };
}

export function eslestirSepetKalemi(
  sepet: SepetKalemi[],
  ref: { urunId?: string; isim?: string }
): SepetKalemi | null {
  const refId = String(ref.urunId || "").trim();
  if (refId) {
    const satir = sepet.find((s) => {
      const id = kalemiId(s);
      return (
        id === refId ||
        String(s.id || "") === refId ||
        String(s._id || "") === refId ||
        String(s.productId || "") === refId
      );
    });
    if (satir) return satir;
  }

  if (ref.isim) {
    const norm = ref.isim.toLowerCase().trim();
    const tam = sepet.find((s) => kalemiIsim(s).toLowerCase().trim() === norm);
    if (tam) return tam;
    return (
      sepet.find(
        (s) =>
          kalemiIsim(s).toLowerCase().includes(norm.slice(0, 20)) ||
          norm.includes(kalemiIsim(s).toLowerCase().slice(0, 20))
      ) || null
    );
  }

  return null;
}

export function musteriKalemleriniSepeteEslestir(
  sepet: SepetKalemi[],
  kalemler: IadeKalemi[]
): IadeKalemi[] {
  return kalemler.map((k) => {
    const satir = eslestirSepetKalemi(sepet, k);
    if (!satir) return k;
    const birimFiyat = kalemiFiyat(satir);
    const adet = Number(k.adet || 0);
    return {
      urunId: kalemiId(satir),
      adet,
      isim: kalemiIsim(satir),
      birimFiyat,
      tutar: Math.round(birimFiyat * adet * 100) / 100,
    };
  });
}

export function mesajdanKalemleriCikar(metin: string): IadeKalemi[] {
  const block = metin.match(/\[(?:İade|İptal|Iade|Iptal) kalemleri:\s*([^\]]+)\]/i);
  if (!block?.[1]) return [];

  const kalemler: IadeKalemi[] = [];
  for (const part of block[1].split(",")) {
    const trimmed = part.trim();
    const match = trimmed.match(/^(.+?)\s+x(\d+)$/i);
    if (!match) continue;
    kalemler.push({
      urunId: "",
      isim: match[1].trim(),
      adet: Number(match[2]) || 1,
    });
  }
  return kalemler;
}

function isimNorm(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function urunIdEslesir(a: string, b: string) {
  const sa = String(a || "").trim();
  const sb = String(b || "").trim();
  if (!sa || !sb) return false;
  if (sa === sb) return true;
  if (sa.length >= 12 && sb.length >= 12 && (sa.endsWith(sb.slice(-12)) || sb.endsWith(sa.slice(-12)))) {
    return true;
  }
  return false;
}

function siparisKalemiEslestir(
  siparisKalemleri: Array<{
    urunId: string;
    isim: string;
    birimFiyat: number;
    iadeEdilebilirAdet: number;
  }>,
  mk: IadeKalemi
) {
  if (mk.urunId) {
    const idEslesme = siparisKalemleri.find((k) => urunIdEslesir(k.urunId, mk.urunId));
    if (idEslesme) return idEslesme;
  }

  if (mk.isim) {
    const norm = isimNorm(mk.isim);
    const tam = siparisKalemleri.find((k) => isimNorm(k.isim) === norm);
    if (tam) return tam;
    const kismi = siparisKalemleri.find(
      (k) =>
        isimNorm(k.isim).includes(norm.slice(0, 20)) ||
        norm.includes(isimNorm(k.isim).slice(0, 20))
    );
    if (kismi) return kismi;
  }

  if (mk.birimFiyat && mk.birimFiyat > 0) {
    const fiyatEslesme = siparisKalemleri.filter(
      (k) => Math.abs(k.birimFiyat - mk.birimFiyat!) < 0.02
    );
    if (fiyatEslesme.length === 1) return fiyatEslesme[0];
  }

  return null;
}

export function iadeKalemlerindenSecimOlustur(
  siparisKalemleri: Array<{
    urunId: string;
    isim: string;
    birimFiyat: number;
    iadeEdilebilirAdet: number;
  }>,
  musteriKalemleri: IadeKalemi[]
) {
  const secim: Record<string, number> = {};
  let tutar = 0;

  for (const mk of musteriKalemleri) {
    const sk = siparisKalemiEslestir(siparisKalemleri, mk);
    if (!sk || sk.iadeEdilebilirAdet <= 0) continue;

    const adet = Math.min(Number(mk.adet || 1), sk.iadeEdilebilirAdet);
    secim[sk.urunId] = adet;
    tutar += sk.birimFiyat * adet;
  }

  return { secim, tutar: Math.round(tutar * 100) / 100 };
}

export function mesajdanTutarCikar(metin: string): number | null {
  const match = metin.match(/\[Tutar:\s*([^\]]+)\]/i);
  if (!match?.[1]) return null;
  const ham = match[1].trim().replace(/[^\d.,]/g, "");
  if (!ham) return null;
  const normalized = ham.includes(",")
    ? ham.replace(/\./g, "").replace(",", ".")
    : ham;
  const val = Number(normalized);
  return !Number.isNaN(val) && val > 0 ? Math.round(val * 100) / 100 : null;
}

export function talepIadeBaslangicDurumu(input: {
  siparisKalemleri: Array<{
    urunId: string;
    isim: string;
    birimFiyat: number;
    iadeEdilebilirAdet: number;
  }>;
  musteriKalemleri: IadeKalemi[];
  iadeTutari?: number | null;
  kalanIadeEdilebilir?: number | null;
  siparisTutari?: number | null;
  mesajMetni?: string;
}) {
  const { siparisKalemleri, musteriKalemleri } = input;
  const kismiSinyal =
    musteriKalemleri.length > 0 ||
    (input.iadeTutari != null && input.iadeTutari > 0) ||
    Boolean(input.mesajMetni && mesajdanKalemleriCikar(input.mesajMetni).length);

  if (musteriKalemleri.length && siparisKalemleri.length) {
    const { secim, tutar } = iadeKalemlerindenSecimOlustur(siparisKalemleri, musteriKalemleri);
    if (Object.keys(secim).length > 0) {
      const tutarKaynak =
        tutar > 0
          ? tutar
          : input.iadeTutari && input.iadeTutari > 0
            ? input.iadeTutari
            : mesajdanTutarCikar(input.mesajMetni || "");
      return {
        secim,
        tutar: tutarKaynak && tutarKaynak > 0 ? tutarKaynak : tutar,
        kismi: true,
      };
    }
  }

  if (kismiSinyal) {
    const mesajTutar = mesajdanTutarCikar(input.mesajMetni || "");
    const tutar = input.iadeTutari || mesajTutar || 0;
    return { secim: {}, tutar, kismi: true };
  }

  const tamTutar = input.kalanIadeEdilebilir || input.siparisTutari || 0;
  return { secim: {}, tutar: tamTutar, kismi: false };
}

export function sepetKalemleriniIadeOzetineCevir(sepet: SepetKalemi[]) {
  return sepet.map((k) => ({
    urunId: kalemiId(k),
    isim: kalemiIsim(k),
    birimFiyat: kalemiFiyat(k),
    adet: Number(k.adet || 1),
    iadeEdilenAdet: Number(k.iadeEdilenAdet || 0),
    iadeEdilebilirAdet: iadeEdilebilirAdet(k),
    varyasyon: k.varyasyon || "Standart Model",
  }));
}

export function oransalIadeMiktarlari(siparis: any, iadeTutar: number) {
  const toplam = siparisToplamTutar(siparis);
  const oncekiIade = Number(siparis?.toplamIadeEdilenTutar || 0);
  const gercekIade = Math.min(Math.max(0, iadeTutar), kalanIadeEdilebilirTutar(siparis));
  const yeniToplamIade = oncekiIade + gercekIade;
  const oran = toplam > 0 ? gercekIade / toplam : 0;
  const kumulatifOran = toplam > 0 ? Math.min(1, yeniToplamIade / toplam) : 0;

  const kazanilan = Number(siparis.kazanilanPuan || 0);
  const kullanilanPuan = Number(siparis.kullanilanPuan || 0);
  const kullanilanKredi = Number(siparis.kullanilanKredi || 0);
  const puanTabani = Number(siparis.puanKazanmaTabani || nakitIadeTutari(siparis));
  const nakitToplam = nakitIadeTutari(siparis);

  const oncekiPuanGeriAl = Number(siparis.iadeEdilenPuanGeriAl || 0);
  const oncekiPuanIade = Number(siparis.iadeEdilenKullanilanPuan || 0);
  const oncekiKrediIade = Number(siparis.iadeEdilenKredi || 0);
  const oncekiTabanGeriAl = Number(siparis.iadeEdilenPuanKazanmaTabani || 0);

  const hedefPuanGeriAl = Math.round(kazanilan * kumulatifOran);
  const hedefPuanIade = Math.round(kullanilanPuan * kumulatifOran);
  const hedefKrediIade = Math.round(kullanilanKredi * kumulatifOran * 100) / 100;
  const hedefTabanGeriAl = Math.round(puanTabani * kumulatifOran);

  const buPuanGeriAl = Math.max(0, hedefPuanGeriAl - oncekiPuanGeriAl);
  const buPuanIade = Math.max(0, hedefPuanIade - oncekiPuanIade);
  const buKrediIade = Math.max(0, Math.round((hedefKrediIade - oncekiKrediIade) * 100) / 100);
  const buTabanGeriAl = Math.max(0, hedefTabanGeriAl - oncekiTabanGeriAl);
  const buNakitIade = Math.round(nakitToplam * oran * 100) / 100;

  const tamIade = toplam > 0 && yeniToplamIade >= toplam - 0.01;

  return {
    gercekIade,
    oran,
    kumulatifOran,
    buPuanGeriAl,
    buPuanIade,
    buKrediIade,
    buTabanGeriAl,
    buNakitIade,
    tamIade,
    yeniToplamIade,
  };
}

export function sepetIadeAdetleriniGuncelle(
  sepet: SepetKalemi[],
  kalemler: IadeKalemi[]
): SepetKalemi[] {
  return sepet.map((satir) => {
    const kalem = kalemler.find((k) =>
      urunKalemiEslesir(
        { urunId: k.urunId, isim: k.isim },
        kalemiId(satir),
        kalemiIsim(satir)
      )
    );
    if (!kalem) return satir;
    return {
      ...satir,
      iadeEdilenAdet: Number(satir.iadeEdilenAdet || 0) + kalem.adet,
    };
  });
}

function isimAnahtar(s?: string | null) {
  return String(s || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9ğüşıöç\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function iadeKalemleriniBirlestir(kayitlar: IadeKalemi[]): IadeKalemi[] {
  const birlesik = new Map<string, IadeKalemi>();
  for (const k of kayitlar) {
    const anahtar = `${String(k.urunId || "").trim()}|${isimAnahtar(k.isim)}`;
    const mevcut = birlesik.get(anahtar);
    if (!mevcut) {
      birlesik.set(anahtar, { ...k });
      continue;
    }
    mevcut.adet = Math.max(Number(mevcut.adet || 0), Number(k.adet || 0));
  }
  return [...birlesik.values()];
}

/** Sipariş + taleplerden tüm iade kalemlerini topla */
export function siparisIadeKayitlariniTopla(
  order: { siparisKodu?: string; orderNumber?: string; iadeGecmisi?: { kalemler?: IadeKalemi[] }[] },
  talepler: { siparisNo?: string; konu?: string; iadeOdendi?: boolean; durum?: string; iadeKalemleri?: IadeKalemi[] }[]
): IadeKalemi[] {
  const kayitlar: IadeKalemi[] = [];
  const kod = String(order.siparisKodu || order.orderNumber || "");

  for (const g of order.iadeGecmisi || []) {
    for (const k of g.kalemler || []) {
      if (Number(k.adet || 0) > 0) kayitlar.push(k);
    }
  }

  for (const t of talepler) {
    if (t.konu !== "iade") continue;
    if (!t.iadeOdendi && t.durum !== "Çözüldü") continue;
    if (!siparisKodlariEslesir(t.siparisNo || "", kod)) continue;
    for (const k of t.iadeKalemleri || []) {
      if (Number(k.adet || 0) > 0) kayitlar.push(k);
    }
  }

  return iadeKalemleriniBirlestir(kayitlar);
}

/** İade kayıtlarını sepet kalemlerine yaz */
export function siparisKalemlerineIadeKayitlariniUygula(
  sepet: SepetKalemi[],
  kayitlar: IadeKalemi[]
): SepetKalemi[] {
  if (!kayitlar.length) return sepet;
  return sepetIadeAdetleriniGuncelle(sepet, kayitlar);
}
