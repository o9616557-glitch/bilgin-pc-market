import type { Db } from "mongodb";
import { puanEkle, puanGeriYukle, puanGeriAl, puanKazanHesapla } from "@/lib/odul-puan";
import { magazaKrediEkle } from "@/lib/magaza-kredi";
import {
  type IadeKalemi,
  kalanIadeEdilebilirTutar,
  oransalIadeMiktarlari,
  sepetIadeAdetleriniGuncelle,
  siparisSepeti,
} from "@/lib/iade-hesapla";

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
 * Kısmi veya tam iade: puan/kredi oransal iade, sepet kalemlerinde iade adedi güncelleme.
 */
export async function siparisIadeIslemleri(
  db: Db,
  siparis: any,
  iadeTutar: number,
  opts?: { talepNo?: string; kalemler?: IadeKalemi[]; yontem?: "kart" | "magaza_kredisi" }
): Promise<{ tamIade: boolean; gercekIade: number } | null> {
  if (!siparis || iadeTutar <= 0) return null;

  const email = siparisEmail(siparis);
  if (!email) return null;

  const kalan = kalanIadeEdilebilirTutar(siparis);
  if (kalan <= 0) return null;

  const {
    gercekIade,
    buPuanGeriAl,
    buPuanIade,
    buKrediIade,
    buTabanGeriAl,
    tamIade,
    yeniToplamIade,
  } = oransalIadeMiktarlari(siparis, iadeTutar);

  if (gercekIade <= 0) return null;

  const kod = siparis.siparisKodu || "";
  const ref = opts?.talepNo || kod;

  if (buPuanGeriAl > 0 && siparis.puanVerildi) {
    await puanGeriAl(
      db,
      email,
      buPuanGeriAl,
      `İade — kazanılan puan geri alındı (${kod})`,
      kod
    );
  }

  if (buTabanGeriAl > 0) {
    await db.collection("wallets").updateOne(
      { email },
      { $inc: { lifetimeOdemeTabani: -buTabanGeriAl } }
    );
  }

  if (buPuanIade > 0) {
    await puanGeriYukle(
      db,
      email,
      buPuanIade,
      `İade — kullanılan puan iadesi (${kod})`,
      kod
    );
  }

  if (buKrediIade > 0) {
    await magazaKrediEkle(
      db,
      email,
      buKrediIade,
      `İade — kullanılan mağaza kredisi iadesi (${kod})`,
      kod
    );
  }

  const sepet = siparisSepeti(siparis);
  const guncelSepet = opts?.kalemler?.length
    ? sepetIadeAdetleriniGuncelle(sepet, opts.kalemler)
    : sepet;

  const iadeKaydi = {
    talepNo: opts?.talepNo || null,
    tutar: gercekIade,
    tarih: new Date(),
    kalemler: opts?.kalemler || [],
    tamIade,
    yontem: opts?.yontem || "kart",
  };

  const yeniDurum = tamIade ? "İade Edildi" : "Kısmen İade Edildi";

  await db.collection("orders").updateOne(
    { _id: siparis._id },
    {
      $set: {
        sepet: guncelSepet,
        items: guncelSepet,
        toplamIadeEdilenTutar: yeniToplamIade,
        iadeEdilenPuanGeriAl: Number(siparis.iadeEdilenPuanGeriAl || 0) + buPuanGeriAl,
        iadeEdilenKullanilanPuan: Number(siparis.iadeEdilenKullanilanPuan || 0) + buPuanIade,
        iadeEdilenKredi: Number(siparis.iadeEdilenKredi || 0) + buKrediIade,
        iadeEdilenPuanKazanmaTabani: Number(siparis.iadeEdilenPuanKazanmaTabani || 0) + buTabanGeriAl,
        durum: yeniDurum,
        status: yeniDurum,
        ...(tamIade
          ? {
              iadeCuzdanIslendi: true,
              puanVerildi: buPuanGeriAl >= Number(siparis.kazanilanPuan || 0) ? false : siparis.puanVerildi,
              krediIadeEdildi: Number(siparis.iadeEdilenKredi || 0) + buKrediIade >= Number(siparis.kullanilanKredi || 0),
              kullanilanPuanIadeEdildi:
                Number(siparis.iadeEdilenKullanilanPuan || 0) + buPuanIade >= Number(siparis.kullanilanPuan || 0),
            }
          : {}),
      },
      $push: { iadeGecmisi: iadeKaydi } as any,
    }
  );

  return { tamIade, gercekIade };
}

/**
 * Tam kalan iade (iptal veya eski tam-iade akışı).
 */
export async function siparisIadeCuzdanIslemleri(db: Db, siparis: any): Promise<void> {
  if (!siparis || siparis.iadeCuzdanIslendi) return;
  const kalan = kalanIadeEdilebilirTutar(siparis);
  if (kalan <= 0) return;
  await siparisIadeIslemleri(db, siparis, kalan);
}
