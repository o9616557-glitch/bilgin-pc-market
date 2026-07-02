import type { Db } from "mongodb";
import { magazaKrediEkle } from "@/lib/magaza-kredi";
import { puanGeriYukle } from "@/lib/odul-puan";

const KART_BEKLEME_ASIMI_MS = 30 * 60 * 1000;

export async function staleKartBekleyenSiparisleriTemizle(db: Db, email: string) {
  const esik = new Date(Date.now() - KART_BEKLEME_ASIMI_MS);

  const bekleyenler = await db.collection("orders").find({
    $and: [
      {
        $or: [
          { userEmail: email },
          { email },
          { "customerDetails.email": email },
          { "musteri.eposta": email },
        ],
      },
      { musteriyeGoster: false },
      { odemeDurumu: "odeme_bekliyor" },
      { rezervIadeEdildi: { $ne: true } },
      {
        $or: [
          { createdAt: { $lte: esik } },
          { tarih: { $lte: esik } },
        ],
      },
    ],
  }).toArray();

  for (const siparis of bekleyenler) {
    const siparisKodu = siparis?.siparisKodu || "";
    const kullanilanKredi = Number(siparis?.kullanilanKredi || 0);
    const kullanilanPuan = Number(siparis?.kullanilanPuan || 0);

    if (kullanilanKredi > 0) {
      await magazaKrediEkle(db, email, kullanilanKredi, `Zaman aşımı — kart ödemesi tamamlanmadı (${siparisKodu})`, siparisKodu);
    }

    if (kullanilanPuan > 0) {
      await puanGeriYukle(db, email, kullanilanPuan, `Zaman aşımı — kart ödemesi tamamlanmadı (${siparisKodu})`, siparisKodu);
    }

    await db.collection("orders").updateOne(
      { _id: siparis._id },
      {
        $set: {
          rezervIadeEdildi: true,
          odemeDurumu: "zaman_asimi",
          kullanilanKredi: 0,
          kullanilanPuan: 0,
          odenecekTutar: Number(siparis?.toplamTutar || siparis?.totalPrice || 0),
        },
      }
    );
  }
}
