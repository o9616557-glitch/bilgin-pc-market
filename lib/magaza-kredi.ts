import type { Db } from "mongodb";

export interface KrediHareket {
  _id: string;
  tip: "yukleme" | "kullanim";
  tutar: number;
  aciklama: string;
  tarih: string;
  ref?: string;
}

export async function magazaKrediOku(db: Db, email: string): Promise<number> {
  const wallet = await db.collection("wallets").findOne({ email });
  return Number(wallet?.storeCredit || 0);
}

export async function magazaKrediEkle(
  db: Db,
  email: string,
  tutar: number,
  aciklama: string,
  ref?: string
): Promise<number> {
  if (tutar <= 0) throw new Error("Geçersiz tutar.");

  const hareket: KrediHareket = {
    _id: crypto.randomUUID(),
    tip: "yukleme",
    tutar,
    aciklama,
    tarih: new Date().toISOString(),
    ...(ref ? { ref } : {}),
  };

  const sonuc = await db.collection("wallets").findOneAndUpdate(
    { email },
    {
      $inc: { storeCredit: tutar },
      $push: { creditHistory: hareket } as any,
      $set: { updatedAt: new Date() },
    },
    { upsert: true, returnDocument: "after" }
  );

  return Number(sonuc?.storeCredit || tutar);
}

export async function magazaKrediDus(
  db: Db,
  email: string,
  tutar: number,
  aciklama: string,
  ref?: string
): Promise<{ kalan: number; kullanilan: number }> {
  if (tutar <= 0) return { kalan: await magazaKrediOku(db, email), kullanilan: 0 };

  const wallet = await db.collection("wallets").findOne({ email });
  const mevcut = Number(wallet?.storeCredit || 0);
  const kullanilan = Math.min(mevcut, tutar);
  if (kullanilan <= 0) throw new Error("Yetersiz mağaza kredisi.");

  const hareket: KrediHareket = {
    _id: crypto.randomUUID(),
    tip: "kullanim",
    tutar: kullanilan,
    aciklama,
    tarih: new Date().toISOString(),
    ...(ref ? { ref } : {}),
  };

  const sonuc = await db.collection("wallets").findOneAndUpdate(
    { email, storeCredit: { $gte: kullanilan } },
    {
      $inc: { storeCredit: -kullanilan },
      $push: { creditHistory: hareket } as any,
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" }
  );

  if (!sonuc) throw new Error("Yetersiz mağaza kredisi.");

  return { kalan: Number(sonuc.storeCredit || 0), kullanilan };
}

/** İyzico sepet tutarını indirime göre orantılı küçültür */
export function sepetFiyatlariniAyarla(
  sepet: any[],
  kargoUcreti: number,
  toplamTutar: number,
  toplamIndirim: number
): { urunler: { id: string; name: string; category1: string; itemType: string; price: string }[]; odenecek: number } {
  const odenecek = Math.max(0, toplamTutar - toplamIndirim);
  if (odenecek === 0) return { urunler: [], odenecek: 0 };

  const oran = odenecek / toplamTutar;
  const urunler = sepet.map((item: any) => ({
    id: String(item.id),
    name: item.isim,
    category1: "Bilgisayar Donanim",
    itemType: "PHYSICAL",
    price: (Math.round(item.fiyat * item.adet * oran * 100) / 100).toString(),
  }));

  if (kargoUcreti > 0) {
    urunler.push({
      id: "KARGO-01",
      name: "Teslimat Bedeli",
      category1: "Hizmet",
      itemType: "VIRTUAL",
      price: (Math.round(kargoUcreti * oran * 100) / 100).toString(),
    });
  }

  return { urunler, odenecek };
}
