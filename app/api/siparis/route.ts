import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";

export async function POST(request: Request) {
  try {
    // ŞEFİM: IYZICO_BASE_URL yerine senin Vercel'deki IYZICO_URI adını yazdık!
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_URI
    });
    const body = await request.json();
    const { musteri, sepet, odemeYontemi, toplamTutar } = body;

    if (!musteri || !sepet || !odemeYontemi || !toplamTutar) {
      return NextResponse.json({ error: "Formda eksik bilgi var şef!" }, { status: 400 });
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

    let sepetUrunleri = sepet.map((item: any) => ({
      id: item.id,
      name: item.isim,
      category1: "Bilgisayar Donanim",
      itemType: "PHYSICAL",
      price: (item.fiyat * item.adet).toString()
    }));

    const araToplam = sepet.reduce((top: number, u: any) => top + (u.fiyat * u.adet), 0);
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

    // ŞEFİM DİKKAT: Site URL'sini garanti altına aldık (Origin bazen boş gelebiliyor)
    const host = request.headers.get("host") || "app.bilginpcmarket.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const siteUrl = `${protocol}://${host}`;

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
        id: "MUSTERI-123", // Sabitlendi
        name: musteri.ad || "Müşteri",
        surname: musteri.soyad || "Soyadı",
        gsmNumber: "+905555555555", // Iyzico telefon formatında çok hata verir, test için sabitledik
        email: musteri.eposta || "test@test.com",
        identityNumber: "11111111111", 
        lastLoginDate: "2026-05-21 12:00:00",
        registrationDate: "2026-05-21 12:00:00",
        registrationAddress: musteri.adres || "Test Adresi",
        ip: "85.34.78.112", // IP formatı hata vermesin diye sabitledik
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        zipCode: "34000"
      },
      shippingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        address: musteri.adres || "Test Adresi",
        zipCode: "34000"
      },
      billingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        address: musteri.adres || "Test Adresi",
        zipCode: "34000"
      },
      basketItems: sepetUrunleri
    };

    // ŞEFİM DİKKAT: Hataları yakalama (Catch) mantığını değiştirdik. Artık sistem çökse bile bize hatayı okuyacak!
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
      // İŞTE IYZICO'NUN BİZE VERECEĞİ GERÇEK GİZLİ MESAJ BURADA EKRANA ÇIKACAK:
      return NextResponse.json({ error: `Iyzico Reddetti: ${iyzicoSonuc.errorMessage || JSON.stringify(iyzicoSonuc)}` }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API HATASI:", error);
    return NextResponse.json({ error: `Arka Uç Çöktü: ${error.message}` }, { status: 500 });
  }
}