import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getOrderShippingCompany, getOrderTrackingNumber, normalizeOrderStatus } from "@/lib/order-utils";
import type { OrderLike } from "@/lib/order-types";

export async function POST(request: Request) {
  try {
    const { siparisKodu } = await request.json();

    if (!siparisKodu) {
      return NextResponse.json({ error: "Lütfen bir sipariş kodu girin." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    const normalizedCode = String(siparisKodu).trim().toUpperCase();
    const siparis = await db.collection("orders").findOne({
      $expr: {
        $eq: [{ $toUpper: "$siparisKodu" }, normalizedCode]
      }
    }) as OrderLike | null;

    if (!siparis) {
      return NextResponse.json({ error: "Bu koda ait bir sipariş bulunamadı. Lütfen kodu kontrol edin." }, { status: 404 });
    }

    const takipNo = getOrderTrackingNumber(siparis);
    const kargoFirmasi = getOrderShippingCompany(siparis);
    const durum = normalizeOrderStatus(siparis);

    return NextResponse.json({
      success: true,
      siparis: {
        ...siparis,
        takipNo,
        kargoTakipNo: takipNo,
        trackingNumber: takipNo,
        kargoFirmasi,
        shippingCompany: kargoFirmasi,
        durum,
        status: durum,
      }
    });
  } catch (error) {
    console.error("TAKİP API HATASI:", error);
    return NextResponse.json({ error: "Sistem hatası oluştu." }, { status: 500 });
  }
}