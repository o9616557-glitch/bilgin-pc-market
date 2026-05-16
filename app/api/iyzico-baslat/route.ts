import { NextResponse } from 'next/server';

// @ts-ignore
import Iyzipay from 'iyzipay';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const apiKey = process.env.IYZICO_API_KEY || "";
    const secretKey = process.env.IYZICO_SECRET_KEY || "";

    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: apiKey.startsWith("sandbox-") ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com"
    });

    // 🚀 DİKKAT: İyzico'nun Kendi Resmi Test Verisi! 
    // Sepetini vs. her şeyi yok saydık, direkt 1 TL'lik test paketi yolluyoruz.
    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      price: "1.0",
      paidPrice: "1.0",
      currency: Iyzipay.CURRENCY.TRY,
      basketId: "B67832",
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "https://bilginpcmarket.com/api/iyzico-sonuc",
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
        identityNumber: "74300864791",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34732"
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34732"
      },
      basketItems: [
        {
          id: "BI101",
          name: "Binocular",
          category1: "Collectibles",
          category2: "Accessories",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: "1.0"
        }
      ]
    };

    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
        if (result && result.status === "success") {
          resolve(NextResponse.json({ success: true, formContent: result.checkoutFormContent }));
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: `İYZİCO REDDETTİ: ${result?.errorMessage} (Hata Kodu: ${result?.errorCode})` 
          }, { status: 400 }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}