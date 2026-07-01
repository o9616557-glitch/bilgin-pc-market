import type { Db } from "mongodb";

/** Her 200 TL nakit/havale/kart ödemesi = 1 puan (100.000 TL → 500 puan ≈ 500 TL) */
export const PUAN_KAZANMA_HARCAMA_BASI = 200;

/** 1 puan = 1 TL indirim */
export const PUAN_TL_DEGERI = 1;

/** Ödeme adımında en az bu kadar puan kullanılabilir */
export const MIN_KULLANIM_PUAN = 50;

/** Puan + mağaza kredisi toplam indirim üst sınırı (sipariş tutarının oranı) */
export const MAX_INDIRIM_ORANI = 0.7;

/** İlerleme çubuğu hedefi (gösterim) */
export const HEDEF_HARCAMA_TL = 100_000;
export const HEDEF_ODUL_PUAN = 500;

export interface PuanHareket {
  _id: string;
  tip: "kazanma" | "kullanim" | "iptal";
  puan: number;
  aciklama: string;
  tarih: string;
  ref?: string;
  harcamaTabani?: number;
}

export function puanKazanHesapla(nakitOdemeTabani: number): number {
  if (nakitOdemeTabani <= 0) return 0;
  return Math.floor(nakitOdemeTabani / PUAN_KAZANMA_HARCAMA_BASI);
}

export function puanTlDegeri(puan: number): number {
  return puan * PUAN_TL_DEGERI;
}

export function puanIlerlemeHesapla(lifetimeOdemeTabani: number) {
  const harcama = Math.max(0, Number(lifetimeOdemeTabani) || 0);
  const donguIci = harcama % HEDEF_HARCAMA_TL;
  const kalanTL = HEDEF_HARCAMA_TL - donguIci;
  const yuzde = Math.min(100, Math.round((donguIci / HEDEF_HARCAMA_TL) * 100));
  const sonrakiOdulPuan = HEDEF_ODUL_PUAN;
  return { harcama: donguIci, hedef: HEDEF_HARCAMA_TL, kalanTL, yuzde, sonrakiOdulPuan };
}

/** Ödeme adımında kullanılabilecek maksimum puan (TL karşılığı cap ile) */
export function maxKullanilabilirPuan(
  mevcutPuan: number,
  siparisToplami: number,
  kullanilacakKredi: number
): number {
  const maxIndirimTL = siparisToplami * MAX_INDIRIM_ORANI;
  const kalanKapasite = Math.max(0, maxIndirimTL - kullanilacakKredi);
  const kalanSiparis = Math.max(0, siparisToplami - kullanilacakKredi);
  const maxTL = Math.min(kalanKapasite, kalanSiparis, puanTlDegeri(mevcutPuan));
  return Math.floor(maxTL / PUAN_TL_DEGERI);
}

export async function puanOku(db: Db, email: string): Promise<number> {
  const wallet = await db.collection("wallets").findOne({ email });
  return Number(wallet?.loyaltyPoints || 0);
}

export async function puanEkle(
  db: Db,
  email: string,
  puan: number,
  aciklama: string,
  ref?: string,
  harcamaTabani?: number
): Promise<number> {
  if (puan <= 0) throw new Error("Geçersiz puan.");

  const hareket: PuanHareket = {
    _id: crypto.randomUUID(),
    tip: "kazanma",
    puan,
    aciklama,
    tarih: new Date().toISOString(),
    ...(ref ? { ref } : {}),
    ...(harcamaTabani != null ? { harcamaTabani } : {}),
  };

  const inc: Record<string, number> = { loyaltyPoints: puan };
  if (harcamaTabani && harcamaTabani > 0) {
    inc.lifetimeOdemeTabani = harcamaTabani;
  }

  const sonuc = await db.collection("wallets").findOneAndUpdate(
    { email },
    {
      $inc: inc,
      $push: { pointHistory: hareket } as any,
      $set: { updatedAt: new Date() },
    },
    { upsert: true, returnDocument: "after" }
  );

  return Number(sonuc?.loyaltyPoints || puan);
}

export async function puanDus(
  db: Db,
  email: string,
  puan: number,
  aciklama: string,
  ref?: string
): Promise<{ kalan: number; kullanilan: number }> {
  if (puan <= 0) return { kalan: await puanOku(db, email), kullanilan: 0 };

  const wallet = await db.collection("wallets").findOne({ email });
  const mevcut = Number(wallet?.loyaltyPoints || 0);
  const kullanilan = Math.min(mevcut, Math.floor(puan));
  if (kullanilan <= 0) throw new Error("Yetersiz ödül puanı.");

  const hareket: PuanHareket = {
    _id: crypto.randomUUID(),
    tip: "kullanim",
    puan: kullanilan,
    aciklama,
    tarih: new Date().toISOString(),
    ...(ref ? { ref } : {}),
  };

  const sonuc = await db.collection("wallets").findOneAndUpdate(
    { email, loyaltyPoints: { $gte: kullanilan } },
    {
      $inc: { loyaltyPoints: -kullanilan },
      $push: { pointHistory: hareket } as any,
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" }
  );

  if (!sonuc) throw new Error("Yetersiz ödül puanı.");
  return { kalan: Number(sonuc.loyaltyPoints || 0), kullanilan };
}

export async function puanGeriYukle(
  db: Db,
  email: string,
  puan: number,
  aciklama: string,
  ref?: string
): Promise<void> {
  if (puan <= 0) return;

  const hareket: PuanHareket = {
    _id: crypto.randomUUID(),
    tip: "iptal",
    puan,
    aciklama,
    tarih: new Date().toISOString(),
    ...(ref ? { ref } : {}),
  };

  await db.collection("wallets").findOneAndUpdate(
    { email },
    {
      $inc: { loyaltyPoints: puan },
      $push: { pointHistory: hareket } as any,
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  );
}

/** Kazanılmış ödül puanını geri al (iade/iptal) */
export async function puanGeriAl(
  db: Db,
  email: string,
  puan: number,
  aciklama: string,
  ref?: string
): Promise<void> {
  if (puan <= 0) return;

  const wallet = await db.collection("wallets").findOne({ email });
  const mevcut = Number(wallet?.loyaltyPoints || 0);
  const dusulecek = Math.min(mevcut, Math.floor(puan));
  if (dusulecek <= 0) return;

  const hareket: PuanHareket = {
    _id: crypto.randomUUID(),
    tip: "iptal",
    puan: -dusulecek,
    aciklama,
    tarih: new Date().toISOString(),
    ...(ref ? { ref } : {}),
  };

  await db.collection("wallets").findOneAndUpdate(
    { email },
    {
      $inc: { loyaltyPoints: -dusulecek },
      $push: { pointHistory: hareket } as any,
      $set: { updatedAt: new Date() },
    }
  );
}
