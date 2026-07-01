import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { siparisBul } from "@/lib/siparis-bul";
import {
  iadeKalemleriniDogrula,
  kalanIadeEdilebilirTutar,
  sepetKalemleriniIadeOzetineCevir,
  siparisSepeti,
  siparisToplamTutar,
} from "@/lib/iade-hesapla";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siparisNo = searchParams.get("siparisNo")?.trim();
    if (!siparisNo) {
      return NextResponse.json({ success: false, message: "Sipariş numarası gerekli." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const siparis = await siparisBul(db, siparisNo);

    if (!siparis) {
      return NextResponse.json({ success: false, message: "Sipariş bulunamadı." }, { status: 404 });
    }

    const email = session.user.email.toLowerCase();
    const siparisEmail = (
      siparis.userEmail || siparis.email || siparis.musteri?.eposta || ""
    ).toLowerCase();

    if (siparisEmail && siparisEmail !== email) {
      return NextResponse.json({ success: false, message: "Bu sipariş size ait değil." }, { status: 403 });
    }

    const sepet = siparisSepeti(siparis);
    const kalemler = sepetKalemleriniIadeOzetineCevir(sepet);

    return NextResponse.json({
      success: true,
      siparisKodu: siparis.siparisKodu,
      toplamTutar: siparisToplamTutar(siparis),
      kalanIadeEdilebilir: kalanIadeEdilebilirTutar(siparis),
      durum: siparis.durum || siparis.status,
      kalemler,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await request.json();
    const { siparisNo, iadeKalemleri } = body;
    if (!siparisNo || !iadeKalemleri?.length) {
      return NextResponse.json({ success: false, message: "Eksik bilgi." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const siparis = await siparisBul(db, String(siparisNo).trim());

    if (!siparis) {
      return NextResponse.json({ success: false, message: "Sipariş bulunamadı." }, { status: 404 });
    }

    const email = session.user.email.toLowerCase();
    const siparisEmail = (
      siparis.userEmail || siparis.email || siparis.musteri?.eposta || ""
    ).toLowerCase();

    if (siparisEmail && siparisEmail !== email) {
      return NextResponse.json({ success: false, message: "Bu sipariş size ait değil." }, { status: 403 });
    }

    const dogrulama = iadeKalemleriniDogrula(siparisSepeti(siparis), iadeKalemleri);
    if (!dogrulama.ok) {
      return NextResponse.json({ success: false, message: dogrulama.hata }, { status: 400 });
    }

    const toplam = siparisToplamTutar(siparis);
    const iadeTipi = dogrulama.tutar >= toplam - 0.01 ? "tam" : "kismi";

    return NextResponse.json({
      success: true,
      tutar: dogrulama.tutar,
      iadeTipi,
      kalemler: dogrulama.normalized,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
