import type { Db } from "mongodb";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Talep kaydından sipariş numarasını çıkarır */
export function siparisNoCikar(talep: {
  siparisNo?: string;
  mesajlar?: { metin?: string }[];
}): string | null {
  if (talep.siparisNo?.trim()) return talep.siparisNo.trim();

  const ilkMesaj = talep.mesajlar?.[0]?.metin || "";
  const baslikEslesme = ilkMesaj.match(/\[Başlık:\s*([^\]]+)\]/i);
  if (baslikEslesme?.[1]) return baslikEslesme[1].trim();

  const bpcEslesme = ilkMesaj.match(/BPC-\d{6}/i);
  if (bpcEslesme) return bpcEslesme[0].toUpperCase();

  return null;
}

export async function siparisTutarBul(
  db: Db,
  hamKod: string
): Promise<{ tutar: number | null; siparisKodu: string | null; bulundu: boolean }> {
  const temiz = String(hamKod || "").trim();
  if (!temiz) return { tutar: null, siparisKodu: null, bulundu: false };

  const orders = db.collection("orders");
  const adaylar = new Set<string>();
  adaylar.add(temiz);
  adaylar.add(temiz.toUpperCase());

  const bpc = temiz.match(/BPC-?\s*(\d{6})/i);
  if (bpc) adaylar.add(`BPC-${bpc[1]}`);

  const sadeceRakam = temiz.replace(/\D/g, "");
  if (sadeceRakam.length >= 6) {
    adaylar.add(`BPC-${sadeceRakam.slice(-6)}`);
  }

  for (const kod of adaylar) {
    const siparis = await orders.findOne({
      $or: [
        { siparisKodu: { $regex: new RegExp(`^${escapeRegex(kod)}$`, "i") } },
        { orderNumber: { $regex: new RegExp(`^${escapeRegex(kod)}$`, "i") } },
      ],
    });
    if (siparis) {
      const tutar = Number(siparis.toplamTutar ?? siparis.totalPrice ?? 0);
      return {
        tutar: tutar > 0 ? tutar : null,
        siparisKodu: (siparis.siparisKodu as string) || kod,
        bulundu: true,
      };
    }
  }

  return { tutar: null, siparisKodu: null, bulundu: false };
}

export async function siparisBul(db: Db, hamKod: string) {
  const temiz = String(hamKod || "").trim();
  if (!temiz) return null;

  const orders = db.collection("orders");
  const adaylar = new Set<string>();
  adaylar.add(temiz);
  adaylar.add(temiz.toUpperCase());

  const bpc = temiz.match(/BPC-?\s*(\d{6})/i);
  if (bpc) adaylar.add(`BPC-${bpc[1]}`);

  const sadeceRakam = temiz.replace(/\D/g, "");
  if (sadeceRakam.length >= 6) {
    adaylar.add(`BPC-${sadeceRakam.slice(-6)}`);
  }

  for (const kod of adaylar) {
    const siparis = await orders.findOne({
      $or: [
        { siparisKodu: { $regex: new RegExp(`^${escapeRegex(kod)}$`, "i") } },
        { orderNumber: { $regex: new RegExp(`^${escapeRegex(kod)}$`, "i") } },
      ],
    });
    if (siparis) return siparis;
  }

  return null;
}
