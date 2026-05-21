import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";

export async function POST(request: Request) {
  try {
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL
    });

    const body = await request.json();
    const { musteri, sepet, odemeYontemi, toplamTutar } = body;

    if (!musteri || !sepet || !odemeYontemi || !toplamTutar) {
      return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const siparisKodu = `BPC-${Math.floor(100000 + Math.random() * 900000)}`;

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

    if (odemeYontemi === "havale") {
      return NextResponse.json({ success: true, odemeYontemi: "havale", siparisKodu });
    }

    // İŞTE ÇÖZÜM BURADA: Sepet ürünlerini Iyzico formatına çevir
    let sepetUrunleri = sepet.map((item: any) => ({
      id: item.id,
      name: item.isim,
      category1: "Bilgisayar Donanım",
      itemType: "PHYSICAL",
      price: (item.fiyat * item.adet).toString()
    }));

    // Arka planda kargoyu hesapla ve eğer kargo varsa onu da "Sanal Ürün" olarak Iyzico sepetine ekle!
    const araToplam = sepet.reduce((top: number, u: any) => top + (u.fiyat * u.adet), 0);
    const kargoUcreti = araToplam > 5000 ? 0 : 150;
    
    if (kargoUcreti > 0) {
      sepetUrunleri.push({
        id: "KARGO-01",
        name: "Teslimat / Kargo Bedeli",
        category1: "Hizmet",
        itemType: "VIRTUAL",
        price: kargoUcreti.toString()
      });
    }

    const iyzicoTalep = {
      locale: "tr",
      conversationId: siparisKodu,
      price: toplamTutar.toString(),
      paidPrice: toplamTutar.toString(),
      currency: "TRY",
      basketId: siparisKodu,
      paymentGroup: "PRODUCT",
      callbackUrl: `${request.headers.get("origin")}/api/iyzico-sonuc?siparisKodu=${siparisKodu}`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: musteri.telefon,
        name: musteri.ad,
        surname: musteri.soyad,
        gsmNumber: musteri.telefon.startsWith("0") ? musteri.telefon : `+90${musteri.telefon}`,
        email: musteri.eposta,
        identityNumber: "11111111111",
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

    const iyzicoSonuc: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(iyzicoTalep, (err: any, result: any) => {
        if (err) reject(err);
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
      // Iyzico'nun tam olarak neden reddettiğini görmek için detaylı hata yazdırıyoruz
      return NextResponse.json({ error: iyzicoSonuc.errorMessage || "Iyzico bağlantı hatası." }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API HATASI:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}