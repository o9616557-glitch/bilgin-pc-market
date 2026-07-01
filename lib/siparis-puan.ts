import type { Db } from "mongodb";
import { puanEkle, puanGeriYukle, puanGeriAl, puanKazanHesapla } from "@/lib/odul-puan";
import { magazaKrediEkle } from "@/lib/magaza-kredi";

const ODUL_VERILEBILIR_DURUMLAR = [
  "Ödendi / Hazırlanıyor",
  "Kargoya Verildi",
  "Tamamlandı",
];

function siparisEmail(siparis: any): string {
  return (siparis?.userEmail || siparis?.email || siparis?.musteri?.eposta || "").toLowerCase();
}

/** Nakit/kart/havale ile ödenen tutar — puan kazanım tabanı */
export function siparisPuanKazanmaTabani(siparis: any): number {
  const odenecek = Number(siparis?.odenecekTutar);
  if (!Number.isNaN(odenecek) && odenecek >= 0) return odenecek;
  const toplam = Number(siparis?.toplamTutar || siparis?.totalPrice || 0);
  const kredi = Number(siparis?.kullanilanKredi || 0);
  const puan = Number(siparis?.kullanilanPuan || 0) * 1;
  return Math.max(0, toplam - kredi - puan);
}

/** Sipariş için ödül puanı ver (idempotent) */
export async function siparisOdulPuanVer(db: Db, siparis: any): Promise<number> {
  if (!siparis || siparis.puanVerildi) return 0;

  const durum = siparis.durum || siparis.status || "";
  if (!ODUL_VERILEBILIR_DURUMLAR.includes(durum)) return 0;

  const email = siparisEmail(siparis);
  if (!email) return 0;

  const taban = siparisPuanKazanmaTabani(siparis);
  const kazanilan = puanKazanHesapla(taban);

  await db.collection("orders").updateOne(
    { _id: siparis._id },
    { $set: { puanVerildi: true, kazanilanPuan: kazanilan, puanKazanmaTabani: taban } }
  );

  if (kazanilan <= 0) return 0;

  await puanEkle(
    db,
    email,
    kazanilan,
    `Alışveriş ödülü — ${siparis.siparisKodu || ""}`,
    siparis.siparisKodu,
    taban
  );

  return kazanilan;
}

/** İptal / iade sonrası verilen puanı geri al */
export async function siparisOdulPuanGeriAl(db: Db, siparis: any): Promise<void> {
  if (!siparis?.puanVerildi) return;
  const kazanilan = Number(siparis.kazanilanPuan || 0);
  if (kazanilan <= 0) {
    await db.collection("orders").updateOne(
      { _id: siparis._id },
      { $set: { puanVerildi: false, kazanilanPuan: 0 } }
    );
    return;
  }

  const email = siparisEmail(siparis);
  if (!email) return;

  await puanGeriAl(
    db,
    email,
    kazanilan,
    `İade/iptal — kazanılan puan geri alındı (${siparis.siparisKodu || ""})`,
    siparis.siparisKodu
  );

  const taban = Number(siparis.puanKazanmaTabani || 0);
  if (taban > 0) {
    await db.collection("wallets").updateOne(
      { email },
      { $inc: { lifetimeOdemeTabani: -taban } }
    );
  }

  await db.collection("orders").updateOne(
    { _id: siparis._id },
    { $set: { puanVerildi: false, kazanilanPuan: 0, puanGeriAlindi: true } }
  );
}

/** Kullanılan puanı sipariş iptalinde iade et */
export async function siparisKullanilanPuanIade(db: Db, siparis: any): Promise<void> {
  const kullanilan = Number(siparis?.kullanilanPuan || 0);
  if (kullanilan <= 0 || siparis?.kullanilanPuanIadeEdildi) return;

  const email = siparisEmail(siparis);
  if (!email) return;

  await puanGeriYukle(
    db,
    email,
    kullanilan,
    `Sipariş iptali — kullanılan puan iadesi (${siparis.siparisKodu || ""})`,
    siparis.siparisKodu
  );

  await db.collection("orders").updateOne(
    { _id: siparis._id },
    { $set: { kullanilanPuanIadeEdildi: true } }
  );
}

/** Sipariş nakit/kart/havale ile ödenen kısım (iade tutarı için) */
export function siparisNakitIadeTutari(siparis: any): number {
  const odenecek = Number(siparis?.odenecekTutar);
  if (!Number.isNaN(odenecek) && odenecek >= 0) return odenecek;
  const toplam = Number(siparis?.toplamTutar || siparis?.totalPrice || 0);
  const kredi = Number(siparis?.kullanilanKredi || 0);
  const puan = Number(siparis?.kullanilanPuan || 0);
  return Math.max(0, toplam - kredi - puan);
}

/**
 * Tam iade: kazanılan puanı geri al, siparişte kullanılan puan/krediyi cüzdana iade et.
 * Amazon tarzı — ödeme yöntemine göre nakit iade ayrı işlenir.
 */
export async function siparisIadeCuzdanIslemleri(db: Db, siparis: any): Promise<void> {
  if (!siparis || siparis.iadeCuzdanIslendi) return;

  const email = siparisEmail(siparis);
  if (!email) return;

  await siparisOdulPuanGeriAl(db, siparis);

  const guncel = await db.collection("orders").findOne({ _id: siparis._id });
  if (guncel) await siparisKullanilanPuanIade(db, guncel);

  const kullanilanKredi = Number(siparis.kullanilanKredi || 0);
  if (kullanilanKredi > 0 && !siparis.krediIadeEdildi) {
    await magazaKrediEkle(
      db,
      email,
      kullanilanKredi,
      `İade — siparişte kullanılan mağaza kredisi iade (${siparis.siparisKodu || ""})`,
      siparis.siparisKodu
    );
  }

  await db.collection("orders").updateOne(
    { _id: siparis._id },
    {
      $set: {
        iadeCuzdanIslendi: true,
        krediIadeEdildi: kullanilanKredi > 0 ? true : siparis.krediIadeEdildi,
      },
    }
  );
}
