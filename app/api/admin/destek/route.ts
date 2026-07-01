import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import Destek from "@/models/Destek";
import { magazaKrediEkle } from "@/lib/magaza-kredi";
import { siparisNoCikar, siparisTutarBul } from "@/lib/siparis-bul";

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
        return {
          ...talep,
          siparisTutari: sonuc.tutar,
          siparisKoduBulunan: sonuc.siparisKodu,
          siparisBulundu: sonuc.bulundu,
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
      const { tutar, yontem } = body;

      const talep = await Destek.findById(id);
      if (!talep) return NextResponse.json({ success: false, message: "Talep bulunamadı." });
      if (talep.iadeOdendi) {
        return NextResponse.json({ success: false, message: "Bu talep için iade zaten işlendi." });
      }

      const client = await clientPromise;
      const db = client.db("bilginpcmarket");

      let tutarNum = Number(tutar);
      if (!tutarNum || tutarNum <= 0) {
        const kod = siparisNoCikar(talep);
        if (kod) {
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

      const yontemFinal = yontem || talep.iadeYontemi || "kart";
      const siparisEtiket = talep.siparisNo || talep.talepNo;

      if (yontemFinal === "magaza_kredisi") {
        await magazaKrediEkle(
          db,
          talep.kullaniciEmail,
          tutarNum,
          `İade — ${siparisEtiket}`,
          talep.talepNo
        );
      }

      const adminMesaj =
        yontemFinal === "magaza_kredisi"
          ? `İade tutarınız (${tutarNum.toLocaleString("tr-TR")} TL) mağaza kredisi olarak cüzdanınıza yüklendi. Bir sonraki alışverişinizde ödeme adımında kullanabilirsiniz.`
          : `Kart/banka iadeniz (${tutarNum.toLocaleString("tr-TR")} TL) başlatıldı. Ödediğiniz karta 3-7 iş günü içinde yansıyacaktır.`;

      const guncelTalep = await Destek.findByIdAndUpdate(
        id,
        {
          iadeOdendi: true,
          iadeTutari: tutarNum,
          iadeYontemi: yontemFinal,
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