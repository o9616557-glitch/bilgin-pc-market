import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";

// Iyzico bağlantısını başlatıyoruz
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { musteri, sepet, odemeYontemi, toplamTutar } = body;

    if (!musteri || !sepet || !odemeYontemi || !toplamTutar) {
      return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const siparisKodu = `BPC-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. ADIM: Siparişi veritabanına "Ödeme Bekliyor" olarak kaydediyoruz
    const yeniSiparis = {
      siparisKodu,
      musteri,
      sepet,
      odemeYontemi,
      toplamTutar,
      durum: odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor",
      tarih: new Date()
    };
    await db.collection("orders").insertOne(yeniSiparis);

    // 2. ADIM: Eğer ödeme yöntemi HAVALE ise doğrudan başarı dönüyoruz
    if (odemeYontemi === "havale") {
      return NextResponse.json({ success: true, odemeYontemi: "havale", siparisKodu });
    }

    // 3. ADIM: Ödeme yöntemi KART ise Iyzico Ödeme Formunu tetikliyoruz
    const sepetUrunleri = sepet.map((item: any) => ({
      id: item.id,
      name: item.isim,
      category1: "Bilgisayar Donanım",
      itemType: "PHYSICAL",
      price: item.fiyat.toString()
    }));

    const iyzicoTalep = {
      locale: "tr",
      conversationId: siparisKodu,
      price: toplamTutar.toString(),
      paidPrice: toplamTutar.toString(),
      currency: "TRY",
      basketId: siparisKodu,
      paymentGroup: "PRODUCT",
      // Test ettiğin sitenin adresi (Lokalde çalışırken localhost, canlıda kendi sitenin domaini olmalı)
      callbackUrl: `${request.headers.get("origin")}/api/iyzico-sonuc?siparisKodu=${siparisKodu}`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: musteri.telefon,
        name: musteri.ad,
        surname: musteri.soyad,
        gsmNumber: musteri.telefon.startsWith("0") ? musteri.telefon : `+90${musteri.telefon}`,
        email: musteri.eposta,
        identityNumber: "11111111111", // Test için sabit TC verilebilir
        lastLoginDate: "2026-05-21 12:00:00",
        registrationDate: "2026-05-21 12:00:00",
        registrationAddress: musteri.adres,
        ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
        city: musteri.sehir,
        country: "Turkey",
        zipCode: "34000"
      },
      shippingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir,
        country: "Turkey",
        address: musteri.adres,
        zipCode: "34000"
      },
      billingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir,
        country: "Turkey",
        address: musteri.adres,
        zipCode: "34000"
      },
      basketItems: sepetUrunleri
    };

    // Iyzico'dan güvenli formu istiyoruz
    const iyzicoSonuc: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(iyzicoTalep, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (iyzicoSonuc.status === "success") {
      // Başarılıysa ön yüze Iyzico formunun yükleneceği HTML kodunu dönüyoruz
      return NextResponse.json({
        success: true,
        odemeYontemi: "kart",
        checkoutFormContent: iyzicoSonuc.checkoutFormContent
      });
    } else {
      return NextResponse.json({ error: iyzicoSonuc.errorMessage || "Iyzico bağlantı hatası." }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API HATASI:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}