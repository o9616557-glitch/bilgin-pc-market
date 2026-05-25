import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_URI
});

const GIZLI_ANAHTAR = process.env.NEXT_PUBLIC_PATRON_ANAHTAR || "bilgin_pc_market_VIP_2024";

export async function POST(request: Request) {
  try {
    const { sepet, musteri, odemeYontemi, toplamTutar, siparisKodu } = await request.json();

    if (!sepet || !musteri || !odemeYontemi || !toplamTutar || !siparisKodu) {
      return NextResponse.json({ error: "Eksik sipariş bilgileri." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Sipariş verisini hazırlıyoruz
    const yeniSiparis = {
      siparisKodu,
      musteri,
      sepet,
      odemeYontemi,
      toplamTutar,
      durum: odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor",
      tarih: new Date()
    };

    // Siparişi veritabanına kaydeden tek ve gerçek satırımız
    await db.collection("orders").insertOne(yeniSiparis);

    // 1. YÖNTEM: HAVALE İSE BURASI ÇALIŞIR VE İŞLEM BİTER
    if (odemeYontemi === "havale") {
      return NextResponse.json({
        success: true,
        odemeYontemi: "havale",
        siparisKodu,
        mesaj: "Siparişiniz alındı. Havale onayı bekleniyor."
      });
    }

    // 2. YÖNTEM: KREDİ KARTI İSE İYZİCO SEPETİNİ HAZIRLIYORUZ
    let sepetUrunleri = sepet.map((item: any) => ({
      id: item.id || "URUN-01",
      name: item.isim || item.title || "Donanım Ürünü",
      category1: "Bilgisayar Donanım",
      itemType: "PHYSICAL",
      price: (item.fiyat * item.adet).toString()
    }));

    const araToplam = sepet.reduce((top: number, item: any) => top + (item.fiyat * item.adet), 0);
    const kargoUcreti = araToplam > 5000 ? 0 : 150;

    if (kargoUcreti > 0) {
      sepetUrunleri.push({
        id: "KARGO-01",
        name: "Teslimat Bedeli",
        category1: "Hizmet",
        itemType: "VIRTUAL",
        price: kargoUcreti.toString()
      });
    }

    // Site linkini güvene alıyoruz
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const siteUrl = `${protocol}://${host}`;

    // İyzico veri paketi
    const iyzicoTalep = {
      locale: "tr",
      conversationId: siparisKodu,
      price: toplamTutar.toString(),
      paidPrice: toplamTutar.toString(),
      currency: "TRY",
      basketId: siparisKodu,
      paymentGroup: "PRODUCT",
      callbackUrl: `${siteUrl}/api/iyzico-sonuc?siparisKodu=${siparisKodu}`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: "MUSTERI-123",
        name: musteri.ad || "Müşteri",
        surname: musteri.soyad || "Soyadı",
        gsmNumber: musteri.telefon || "+905555555555",
        email: musteri.eposta || musteri.email || "destek@bilginpcmarket.com",
        identityNumber: "11111111111",
        lastLoginDate: "2026-05-25 12:00:00",
        registrationDate: "2026-05-25 12:00:00",
        registrationAddress: musteri.adres || "Adres Bilgisi Yok",
        ip: "85.34.78.112",
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        zipCode: "34000"
      },
      shippingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        address: musteri.adres || "Adres Bilgisi Yok",
        zipCode: "34000"
      },
      billingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        address: musteri.adres || "Adres Bilgisi Yok",
        zipCode: "34000"
      },
      basketItems: sepetUrunleri
    };

    // İyzico Formunu Başlatıyoruz
    const iyzicoSonuc: any = await new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(iyzicoTalep, (err: any, result: any) => {
        if (err) resolve({ status: "failure", errorMessage: err.message || JSON.stringify(err) });
        else resolve(result);
      });
    });

    if (iyzicoSonuc.status === "success") {
      return NextResponse.json({
        success: true,
        odemeYontemi: "kart",
        checkoutFormContent: iyzicoSonuc.checkoutFormContent
      });
    } else {
      return NextResponse.json({ error: `Iyzico Hatası: ${iyzicoSonuc.errorMessage || iyzicoSonuc.id}` }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Sipariş API Hatası:", error);
    return NextResponse.json({ error: "Sistem hatası oluştu." }, { status: 500 });
  }
}