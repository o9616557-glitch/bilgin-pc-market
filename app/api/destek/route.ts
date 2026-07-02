import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import mongoose from "mongoose";
import Destek from "@/models/Destek";
import clientPromise from "@/lib/mongodb";

// 🚀 NETXJS TUZAĞINI KIRAN MOTOR: Önbelleğe almayı yasaklar, her saniye veritabanından canlı çeker!
export const dynamic = "force-dynamic";

function talepNoUret() {
  return `DST-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    
    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
    
    const talepler = await Destek.find({ 
      kullaniciEmail: session.user.email,
      musteriGizledi: { $ne: true } 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, talepler });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    
    const body = await request.json();
    const { konu, mesaj, siparisNo, iadeYontemi, iadeKalemleri } = body;
    if (!konu || !mesaj) return NextResponse.json({ success: false, message: "Eksik bilgi." }, { status: 400 });

    const iadeKonu = konu === "iade" || konu === "iptal";
    if (iadeKonu && iadeYontemi && !["kart", "magaza_kredisi"].includes(iadeYontemi)) {
      return NextResponse.json({ success: false, message: "Geçersiz iade yöntemi." }, { status: 400 });
    }

    let dogrulanmisKalemler: any[] = [];
    let iadeTipi: "tam" | "kismi" | undefined;
    let hesaplananTutar: number | undefined;

    if (iadeKonu && siparisNo) {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      const { siparisBul } = await import("@/lib/siparis-bul");
      const { siparisOtomatikIadeIptalKapaliMi } = await import("@/lib/order-utils");
      const siparis = await siparisBul(db, String(siparisNo).trim());
      if (siparis && siparisOtomatikIadeIptalKapaliMi(siparis)) {
        return NextResponse.json({
          success: false,
          message: "15 günlük iade süresi doldu. Lütfen teknik destek veya kargo konusunda genel talep oluşturun.",
        }, { status: 400 });
      }
    }

    if ((konu === "iade" || konu === "iptal") && siparisNo && iadeKalemleri?.length) {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      const { siparisBul } = await import("@/lib/siparis-bul");
      const { iadeKalemleriniDogrula, musteriKalemleriniSepeteEslestir, siparisSepeti, siparisToplamTutar } = await import("@/lib/iade-hesapla");
      const siparis = await siparisBul(db, String(siparisNo).trim());
      if (!siparis) {
        return NextResponse.json({ success: false, message: "Sipariş bulunamadı." }, { status: 404 });
      }
      const { siparisOtomatikIadeIptalKapaliMi } = await import("@/lib/order-utils");
      if (siparisOtomatikIadeIptalKapaliMi(siparis)) {
        return NextResponse.json({
          success: false,
          message: "15 günlük iade süresi doldu. Lütfen teknik destek veya kargo konusunda genel talep oluşturun.",
        }, { status: 400 });
      }
      const siparisEmail = (siparis.userEmail || siparis.email || siparis.musteri?.eposta || "").toLowerCase();
      if (siparisEmail && siparisEmail !== session.user.email.toLowerCase()) {
        return NextResponse.json({ success: false, message: "Bu sipariş size ait değil." }, { status: 403 });
      }
      const sepet = siparisSepeti(siparis);
      const eslesmisKalemler = musteriKalemleriniSepeteEslestir(sepet, iadeKalemleri);
      const dogrulama = iadeKalemleriniDogrula(sepet, eslesmisKalemler);
      if (!dogrulama.ok) {
        return NextResponse.json({ success: false, message: dogrulama.hata }, { status: 400 });
      }
      dogrulanmisKalemler = dogrulama.normalized;
      hesaplananTutar = dogrulama.tutar;
      const toplam = siparisToplamTutar(siparis);
      iadeTipi = dogrulama.tutar >= toplam - 0.01 ? "tam" : "kismi";
    }

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    let benzersizTalepNo = talepNoUret();
    let varMi = await Destek.findOne({ talepNo: benzersizTalepNo });
    while (varMi) {
      benzersizTalepNo = talepNoUret();
      varMi = await Destek.findOne({ talepNo: benzersizTalepNo });
    }

    const yeniTalep = new Destek({
      talepNo: benzersizTalepNo,
      kullaniciEmail: session.user.email,
      konu: konu,
      durum: "İnceleniyor",
      ...(siparisNo ? { siparisNo: String(siparisNo).trim() } : {}),
      ...(iadeKonu && iadeYontemi ? { iadeYontemi } : {}),
      ...(dogrulanmisKalemler.length ? { iadeKalemleri: dogrulanmisKalemler, iadeTipi, iadeTutari: hesaplananTutar } : {}),
      mesajlar: [{ gonderen: "Musteri", metin: mesaj }]
    });

    await yeniTalep.save();
    return NextResponse.json({ success: true, message: "Oluşturuldu.", talep: yeniTalep });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });

    const body = await request.json();
    const { talepId, mesaj } = body;
    if (!talepId || !mesaj) return NextResponse.json({ success: false, message: "Eksik bilgi." }, { status: 400 });

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    // 🚀 BİNGO: Müşteri tarafına da strict: false ekledik. Modelde olmasa bile anında zorla kaydeder!
    const guncelTalep = await Destek.findOneAndUpdate(
      { _id: talepId, kullaniciEmail: session.user.email },
      { 
        $push: { mesajlar: { gonderen: "Musteri", metin: mesaj, tarih: new Date() } },
        $set: { durum: "İnceleniyor" } 
      },
      { new: true, strict: false }
    );

    if (!guncelTalep) return NextResponse.json({ success: false, message: "Talep bulunamadı." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Cevabınız iletildi.", talep: guncelTalep });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    if (id) {
      await Destek.findOneAndUpdate(
        { _id: id, kullaniciEmail: session.user.email },
        { $set: { musteriGizledi: true } },
        { new: true, strict: false }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}