import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import Destek from "@/models/Destek";
import { magazaKrediEkle } from "@/lib/magaza-kredi";
import { siparisNoCikar, siparisTutarBul, siparisBul } from "@/lib/siparis-bul";
import { siparisIadeIslemleri } from "@/lib/siparis-puan";
import {
  iadeKalemleriniDogrula,
  iadeKalemlerindenSecimOlustur,
  kalanIadeEdilebilirTutar,
  kalanNakitIadeTutari,
  mesajdanKalemleriCikar,
  musteriKalemleriniSepeteEslestir,
  oransalIadeMiktarlari,
  sepetKalemleriniIadeOzetineCevir,
  siparisNakitOdemeTutari,
  siparisSepeti,
  siparisToplamTutar,
} from "@/lib/iade-hesapla";

// 🚀 ADMİN ÖNBELLEK KİLİDİ: Admin panelinin de anlık canlı veri çekmesini sağlar (Tembelliği önler)
export const dynamic = "force-dynamic";

const GIZLI_ANAHTAR = "Bilgin123";

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

function guvenlikKontrolu(request: Request) {
  const anahtar = request.headers.get("x-patron-anahtar");
  return anahtar === GIZLI_ANAHTAR;
}

export async function GET(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  await connectDB();
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const taleplerRaw = await Destek.find().sort({ createdAt: -1 }).lean();

    const talepler = await Promise.all(
      taleplerRaw.map(async (talep: any) => {
        const konu = talep.konu;
        if (konu !== "iade" && konu !== "iptal") return talep;

        const kod = siparisNoCikar(talep);
        if (!kod) {
          return { ...talep, siparisTutari: null, siparisKoduBulunan: null, siparisBulundu: false };
        }

        const sonuc = await siparisTutarBul(db, kod);
        const siparis = await siparisBul(db, kod);
        const sepet = siparis ? siparisSepeti(siparis) : [];
        const siparisKalemleri = sepet.length ? sepetKalemleriniIadeOzetineCevir(sepet) : [];
        const kalanIade = siparis ? kalanIadeEdilebilirTutar(siparis) : sonuc.tutar;
        const nakitOdeme = siparis ? siparisNakitOdemeTutari(siparis) : null;
        const kalanNakit = siparis ? kalanNakitIadeTutari(siparis) : null;

        const metin = (talep.mesajlar || []).map((m: { metin?: string }) => m.metin || "").join("\n");
        let musteriKalemleri = talep.iadeKalemleri?.length
          ? [...talep.iadeKalemleri]
          : mesajdanKalemleriCikar(metin);

        if (siparis && musteriKalemleri.length) {
          musteriKalemleri = musteriKalemleriniSepeteEslestir(sepet, musteriKalemleri);
        }

        let onerilenTutar = kalanIade;
        if (musteriKalemleri.length && siparisKalemleri.length) {
          const dogrulama = siparis
            ? iadeKalemleriniDogrula(sepet, musteriKalemleri)
            : { ok: false, tutar: 0 };
          if (dogrulama.ok) {
            onerilenTutar = dogrulama.tutar;
          } else {
            const { tutar } = iadeKalemlerindenSecimOlustur(siparisKalemleri, musteriKalemleri);
            if (tutar > 0) onerilenTutar = tutar;
          }
        }

        return {
          ...talep,
          siparisTutari: sonuc.tutar,
          siparisKoduBulunan: sonuc.siparisKodu,
          siparisBulundu: sonuc.bulundu,
          siparisKalemleri,
          kalanIadeEdilebilir: kalanIade,
          nakitOdemeTutari: nakitOdeme,
          kalanNakitIade: kalanNakit,
          kullanilanKredi: siparis ? Number(siparis.kullanilanKredi || 0) : 0,
          kullanilanPuan: siparis ? Number(siparis.kullanilanPuan || 0) : 0,
          onerilenIadeTutar: onerilenTutar,
          iadeKalemleri: musteriKalemleri.length ? musteriKalemleri : talep.iadeKalemleri,
        };
      })
    );

    return NextResponse.json({ success: true, talepler });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  await connectDB();
  try {
    const body = await request.json();
    const { id, action, mesaj, durum } = body;

    if (action === "reply") {
      // 🚀 BİNGO: strict: false ekledik. Modelde olmasa bile zorla kaydeder!
      const guncelTalep = await Destek.findByIdAndUpdate(
        id,
        { 
          $push: { mesajlar: { gonderen: "Admin", metin: mesaj, tarih: new Date() } },
          $set: { durum: "Yanıt Bekleniyor" } 
        },
        { new: true, strict: false } 
      );
      return NextResponse.json({ success: true, talep: guncelTalep });
    } 
    
    if (action === "status") {
      const guncelTalep = await Destek.findByIdAndUpdate(id, { durum }, { new: true, strict: false });
      return NextResponse.json({ success: true, talep: guncelTalep });
    }

    if (action === "iade_tamamla") {
      const { tutar, yontem, iadeKalemleri: bodyKalemler } = body;

      const talep = await Destek.findById(id);
      if (!talep) return NextResponse.json({ success: false, message: "Talep bulunamadı." });
      if (talep.iadeOdendi) {
        return NextResponse.json({ success: false, message: "Bu talep için iade zaten işlendi." });
      }

      const client = await clientPromise;
      const db = client.db("bilginpcmarket");

      const kod = siparisNoCikar(talep);
      const siparis = kod ? await siparisBul(db, kod) : null;
      const kalemler = bodyKalemler?.length ? bodyKalemler : talep.iadeKalemleri || [];

      let tutarNum = Number(tutar);
      let dogrulanmisKalemler = kalemler;

      if (siparis && kalemler.length) {
        const dogrulama = iadeKalemleriniDogrula(siparisSepeti(siparis), kalemler);
        if (!dogrulama.ok) {
          return NextResponse.json({ success: false, message: dogrulama.hata }, { status: 400 });
        }
        dogrulanmisKalemler = dogrulama.normalized;
        if (!tutarNum || tutarNum <= 0) tutarNum = dogrulama.tutar;
      }

      if (!tutarNum || tutarNum <= 0) {
        if (siparis) {
          tutarNum = kalanIadeEdilebilirTutar(siparis);
        } else if (kod) {
          const sonuc = await siparisTutarBul(db, kod);
          tutarNum = Number(sonuc.tutar || 0);
        }
      }

      if (!tutarNum || tutarNum <= 0) {
        return NextResponse.json({
          success: false,
          message: "Geçerli bir iade tutarı girin veya sipariş numarasını kontrol edin.",
        });
      }

      if (siparis) {
        const kalan = kalanIadeEdilebilirTutar(siparis);
        if (tutarNum > kalan + 0.01) {
          return NextResponse.json({
            success: false,
            message: `En fazla ${kalan.toLocaleString("tr-TR")} TL iade edilebilir.`,
          }, { status: 400 });
        }
      }

      const yontemFinal = yontem || talep.iadeYontemi || "kart";
      const siparisEtiket = talep.siparisNo || talep.talepNo;
      const toplamSiparis = siparis ? siparisToplamTutar(siparis) : tutarNum;
      const iadeTipi = tutarNum >= toplamSiparis - 0.01 ? "tam" : "kismi";

      const oranHesap = siparis ? oransalIadeMiktarlari(siparis, tutarNum) : null;
      const nakitIadeMiktari = oranHesap?.buNakitIade ?? tutarNum;

      let islemSonuc: { tamIade: boolean; gercekIade: number } | null = null;
      if (siparis) {
        islemSonuc = await siparisIadeIslemleri(db, siparis, tutarNum, {
          talepNo: talep.talepNo,
          kalemler: dogrulanmisKalemler.length ? dogrulanmisKalemler : undefined,
          yontem: yontemFinal,
        });
        if (!islemSonuc) {
          return NextResponse.json({ success: false, message: "İade işlenemedi (kalan tutar yok)." }, { status: 400 });
        }
        tutarNum = islemSonuc.gercekIade;
      }

      const gercekNakitIade = siparis && oranHesap
        ? nakitIadeMiktari
        : tutarNum;

      if (yontemFinal === "magaza_kredisi") {
        const yuklenecek = gercekNakitIade;
        if (yuklenecek > 0) {
          await magazaKrediEkle(
            db,
            talep.kullaniciEmail,
            yuklenecek,
            `İade — ${siparisEtiket}`,
            talep.talepNo
          );
        }
      }

      const tipMetni = iadeTipi === "kismi" ? "Kısmi iade" : "Tam iade";
      const adminMesaj =
        yontemFinal === "magaza_kredisi"
          ? `${tipMetni} tamamlandı (${tutarNum.toLocaleString("tr-TR")} TL sipariş iadesi). Puan/kredi düzenlemeleri yapıldı. Nakit ödeme kısmı olan ${gercekNakitIade.toLocaleString("tr-TR")} TL mağaza kredisi olarak yüklendi.`
          : `${tipMetni} tamamlandı (${tutarNum.toLocaleString("tr-TR")} TL sipariş iadesi). Puan/kredi düzenlemeleri yapıldı. Kart/banka iadeniz ${gercekNakitIade.toLocaleString("tr-TR")} TL (nakit ödeme kısmı) başlatıldı; 3-7 iş günü içinde yansıyacaktır.`;

      const guncelTalep = await Destek.findByIdAndUpdate(
        id,
        {
          iadeOdendi: true,
          iadeTutari: tutarNum,
          iadeNakitTutari: gercekNakitIade,
          iadeYontemi: yontemFinal,
          iadeTipi,
          ...(dogrulanmisKalemler.length ? { iadeKalemleri: dogrulanmisKalemler } : {}),
          durum: "Çözüldü",
          $push: { mesajlar: { gonderen: "Admin", metin: adminMesaj, tarih: new Date() } },
        },
        { new: true, strict: false }
      );

      return NextResponse.json({ success: true, talep: guncelTalep });
    }

    return NextResponse.json({ success: false, message: "Geçersiz işlem" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function DELETE(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) await Destek.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}