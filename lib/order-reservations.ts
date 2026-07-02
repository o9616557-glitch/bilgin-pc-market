import type { Db } from "mongodb";
import { magazaKrediEkle } from "@/lib/magaza-kredi";
import { puanGeriYukle } from "@/lib/odul-puan";

const KART_BEKLEME_ASIMI_MS = 30 * 60 * 1000;
export const HAVALE_BEKLEME_ASIMI_MS = 24 * 60 * 60 * 1000;

const BASARILI_ODEME_DURUMLARI = ["odendi", "onaylandi"];

function musteriEmailSorgusu(email: string) {
  return {
    $or: [
      { userEmail: email },
      { email },
      { "customerDetails.email": email },
      { "musteri.eposta": email },
    ],
  };
}

function siparisTarihi(siparis: { createdAt?: Date | string; tarih?: Date | string }) {
  return new Date(siparis.createdAt || siparis.tarih || 0);
}

async function taslakRezervleriniIadeEt(
  db: Db,
  email: string,
  siparis: {
    siparisKodu?: string;
    kullanilanKredi?: number;
    kullanilanPuan?: number;
    rezervIadeEdildi?: boolean;
  },
  aciklama: string
) {
  if (siparis.rezervIadeEdildi) return;

  const siparisKodu = siparis?.siparisKodu || "";
  const kullanilanKredi = Number(siparis?.kullanilanKredi || 0);
  const kullanilanPuan = Number(siparis?.kullanilanPuan || 0);

  if (kullanilanKredi > 0) {
    await magazaKrediEkle(db, email, kullanilanKredi, `${aciklama} (${siparisKodu})`, siparisKodu);
  }

  if (kullanilanPuan > 0) {
    await puanGeriYukle(db, email, kullanilanPuan, `${aciklama} (${siparisKodu})`, siparisKodu);
  }
}

async function kullanicininSonrakiBasariliOdemeVarMi(
  db: Db,
  email: string,
  taslakTarihi: Date
) {
  const basarili = await db.collection("orders").findOne({
    $and: [
      musteriEmailSorgusu(email),
      { odemeDurumu: { $in: BASARILI_ODEME_DURUMLARI } },
      { musteriyeGoster: true },
      {
        $or: [
          { createdAt: { $gte: taslakTarihi } },
          { tarih: { $gte: taslakTarihi } },
        ],
      },
    ],
  });

  return Boolean(basarili);
}

async function gecersizKartTaslagiIsaretle(
  db: Db,
  siparis: {
    _id: unknown;
    siparisKodu?: string;
    toplamTutar?: number;
    totalPrice?: number;
    odenecekTutar?: number;
    supersededBy?: string;
  },
  neden: string
) {
  await db.collection("orders").updateOne(
    { _id: siparis._id },
    {
      $set: {
        gizlendi: true,
        gecersizDeneme: true,
        rezervIadeEdildi: true,
        odemeDurumu: "iptal",
        durum: "Geçersiz Ödeme Denemesi",
        status: "Geçersiz Ödeme Denemesi",
        odemeHataMesaji: neden,
        kullanilanKredi: 0,
        kullanilanPuan: 0,
        odenecekTutar: Number(siparis?.toplamTutar || siparis?.totalPrice || siparis?.odenecekTutar || 0),
        ...(siparis.supersededBy ? { supersededBy: siparis.supersededBy } : {}),
      },
    }
  );
}

/** Başarılı ödeme sonrası aynı müşterinin diğer bekleyen kart taslaklarını kapatır */
export async function basariliOdemeSonrasiEskiTaslaklariKapat(
  db: Db,
  email: string,
  basariliSiparisKodu: string
) {
  if (!email) return;

  const bekleyenTaslaklar = await db.collection("orders").find({
    $and: [
      musteriEmailSorgusu(email),
      { siparisKodu: { $ne: basariliSiparisKodu } },
      { musteriyeGoster: false },
      { odemeDurumu: "odeme_bekliyor" },
      { odemeYontemi: { $in: ["kart", "bkm"] } },
      { rezervIadeEdildi: { $ne: true } },
      { gecersizDeneme: { $ne: true } },
    ],
  }).toArray();

  for (const taslak of bekleyenTaslaklar) {
    await taslakRezervleriniIadeEt(
      db,
      email,
      taslak,
      "Başarılı ödeme sonrası eski taslak iptal"
    );
    await gecersizKartTaslagiIsaretle(db, {
      ...taslak,
      supersededBy: basariliSiparisKodu,
    }, "Başarılı ödeme yapıldığı için bu taslak geçersiz sayıldı.");
  }
}

export async function staleKartBekleyenSiparisleriTemizle(db: Db, email: string) {
  const esik = new Date(Date.now() - KART_BEKLEME_ASIMI_MS);

  const bekleyenler = await db.collection("orders").find({
    $and: [
      musteriEmailSorgusu(email),
      { musteriyeGoster: false },
      { odemeDurumu: "odeme_bekliyor" },
      { rezervIadeEdildi: { $ne: true } },
      { gecersizDeneme: { $ne: true } },
      {
        $or: [
          { createdAt: { $lte: esik } },
          { tarih: { $lte: esik } },
        ],
      },
    ],
  }).toArray();

  for (const siparis of bekleyenler) {
    const taslakTarihi = siparisTarihi(siparis);
    const sonrakiBasariliVar = await kullanicininSonrakiBasariliOdemeVarMi(db, email, taslakTarihi);

    await taslakRezervleriniIadeEt(
      db,
      email,
      siparis,
      sonrakiBasariliVar
        ? "Başarılı ödeme sonrası eski taslak iptal"
        : "Zaman aşımı — kart ödemesi tamamlanmadı"
    );

    if (sonrakiBasariliVar) {
      await gecersizKartTaslagiIsaretle(
        db,
        siparis,
        "Başarılı ödeme yapıldığı için bu taslak geçersiz sayıldı."
      );
      continue;
    }

    await db.collection("orders").updateOne(
      { _id: siparis._id },
      {
        $set: {
          gizlendi: true,
          gecersizDeneme: true,
          rezervIadeEdildi: true,
          odemeDurumu: "zaman_asimi",
          durum: "Zaman Aşımı",
          status: "Zaman Aşımı",
          kullanilanKredi: 0,
          kullanilanPuan: 0,
          odenecekTutar: Number(siparis?.toplamTutar || siparis?.totalPrice || 0),
        },
      }
    );
  }
}

/** 1 gün içinde ödemesi gelmeyen havale siparişlerini iptal eder; puan/kredi iade edilir */
export async function staleHavaleBekleyenSiparisleriTemizle(db: Db, email?: string) {
  const esik = new Date(Date.now() - HAVALE_BEKLEME_ASIMI_MS);

  const filtre: Record<string, unknown>[] = [
    { odemeDurumu: "havale_bekliyor" },
    { rezervIadeEdildi: { $ne: true } },
    { gecersizDeneme: { $ne: true } },
    {
      $or: [
        { createdAt: { $lte: esik } },
        { tarih: { $lte: esik } },
      ],
    },
  ];

  if (email) {
    filtre.unshift(musteriEmailSorgusu(email));
  }

  const bekleyenler = await db.collection("orders").find({ $and: filtre }).toArray();

  for (const siparis of bekleyenler) {
    const siparisEmail = String(
      siparis.userEmail || siparis.email || siparis.musteri?.eposta || email || ""
    );
    if (!siparisEmail) continue;

    await taslakRezervleriniIadeEt(
      db,
      siparisEmail,
      siparis,
      "Zaman aşımı — havale/EFT ödemesi alınamadı"
    );

    await db.collection("orders").updateOne(
      { _id: siparis._id },
      {
        $set: {
          musteriyeGoster: true,
          rezervIadeEdildi: true,
          odemeDurumu: "iptal",
          durum: "İptal Edildi",
          status: "İptal Edildi",
          odemeHataMesaji:
            "1 gün içinde havale/EFT ödemesi alınamadığı için sipariş otomatik iptal edildi.",
          kullanilanKredi: 0,
          kullanilanPuan: 0,
        },
      }
    );
  }
}

export async function bekleyenSiparisleriTemizle(db: Db, email: string) {
  await staleKartBekleyenSiparisleriTemizle(db, email);
  await staleHavaleBekleyenSiparisleriTemizle(db);
}
