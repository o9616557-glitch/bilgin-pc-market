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

    const satir = sepet.find((s) => kalemiId(s) === String(kalem.urunId));
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
    const kalem = kalemler.find((k) => k.urunId === kalemiId(satir));
    if (!kalem) return satir;
    return {
      ...satir,
      iadeEdilenAdet: Number(satir.iadeEdilenAdet || 0) + kalem.adet,
    };
  });
}
