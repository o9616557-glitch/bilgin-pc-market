import { NextResponse } from 'next/server';

// @ts-ignore
import Iyzipay from 'iyzipay';

// 🚀 İŞTE VERCEL'İ DİZE GETİREN O SİHİRLİ KOMUTLAR!
// Turbopack'e "Bu dosyaya dokunma, klasik Node.js motoruyla çalıştır" emrini verir.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY || "";
    const secretKey = process.env.IYZICO_SECRET_KEY || "";

    if (!apiKey || !secretKey) {
      return NextResponse.json({ success: false, error: "API Şifreleri Vercel'de eksik!" }, { status: 400 });
    }

    const isSandbox = apiKey.startsWith("sandbox-");
    const siteBaseUrl = request.headers.get('origin') || "https://bilginpcmarket.com";
    
    // Fiyatı string formatında sabitliyoruz
    const formattedPrice = Number(totalAmount).toFixed(1);

    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: isSandbox ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com"
    });

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: formattedPrice,
      paidPrice: formattedPrice,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${siteBaseUrl}/api/iyzico-sonuc`,
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: "BY789",
        name: "Ahmet",
        surname: "Yilmaz",
        gsmNumber: "+905555555555",
        email: "test@gmail.com",
        identityNumber: "11111111111",
        lastLoginDate: "2026-01-01 12:00:00",
        registrationDate: "2026-01-01 12:00:00",
        registrationAddress: "Moda Caddesi No:5",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: "Ahmet Yilmaz",
        city: "Istanbul",
        country: "Turkey",
        address: "Moda Caddesi No:5",
        zipCode: "34732"
      },
      billingAddress: {
        contactName: "Ahmet Yilmaz",
        city: "Istanbul",
        country: "Turkey",
        address: "Moda Caddesi No:5",
        zipCode: "34732"
      },
      // 🚀 MATEMATİK HATASINI ENGELLEYEN TEK PARÇA SEPET
      basketItems: [
        {
          id: "SEPET-100",
          name: "Bilgin PC Market Sepet Tutari",
          category1: "Donanim",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: formattedPrice // Toplam tutarla birebir aynı fiyata sahip tek ürün!
        }
      ]
    };

    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: "İyzico sunucusuna ulaşılamadı." }, { status: 500 }));
        } else if (result.status === "success") {
          resolve(NextResponse.json({ success: true, formContent: result.checkoutFormContent }));
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: `İYZİCO REDDETTİ: ${result.errorMessage} (Hata Kodu: ${result.errorCode})` 
          }, { status: 400 }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sunucu hatası: " + (error as Error).message }, { status: 500 });
  }
}