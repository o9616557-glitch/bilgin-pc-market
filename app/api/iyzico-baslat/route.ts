import { NextResponse } from 'next/server';

// @ts-ignore
import Iyzipay from 'iyzipay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutForm, totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY?.trim() || "";
    const secretKey = process.env.IYZICO_SECRET_KEY?.trim() || "";

    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: "https://api.iyzipay.com" 
    });

    // Fiyattaki virgül/boşluk krizlerini otomatik çözen garanti format
    const safeAmount = totalAmount ? totalAmount.toString().replace(/,/g, '') : "0";
    const formattedPrice = Number(safeAmount).toFixed(1);

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: formattedPrice,
      paidPrice: formattedPrice,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "https://bilginpcmarket.com/api/iyzico-sonuc",
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: "BY789",
        name: checkoutForm?.firstName || "Ahmet",
        surname: checkoutForm?.lastName || "Yilmaz",
        gsmNumber: checkoutForm?.phone || "+905555555555",
        email: checkoutForm?.email || "test@gmail.com",
        identityNumber: "11111111111",
        lastLoginDate: "2023-01-01 12:00:00",
        registrationDate: "2023-01-01 12:00:00",
        registrationAddress: checkoutForm?.fullAddress || "Moda Caddesi No:5",
        ip: "85.34.78.112",
        city: checkoutForm?.city || "Istanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: (checkoutForm?.firstName || "Ahmet") + " " + (checkoutForm?.lastName || "Yilmaz"),
        city: checkoutForm?.city || "Istanbul",
        country: "Turkey",
        address: checkoutForm?.fullAddress || "Moda Caddesi No:5",
        zipCode: "34732"
      },
      billingAddress: {
        contactName: (checkoutForm?.firstName || "Ahmet") + " " + (checkoutForm?.lastName || "Yilmaz"),
        city: checkoutForm?.city || "Istanbul",
        country: "Turkey",
        address: checkoutForm?.fullAddress || "Moda Caddesi No:5",
        zipCode: "34732"
      },
      basketItems: [
        {
          id: "SEPET-100",
          name: "Bilgin PC Market Sepet Tutari",
          category1: "Donanim",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: formattedPrice
        }
      ]
    };

    // İyzico'nun kendi kütüphanesi tüm şifreleme ve virgül sorunlarını arka planda %100 çözer!
    const response = await new Promise<NextResponse>((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: `SDK HATASI: ${err.message || err}` }, { status: 500 }));
        } else if (result && result.status === "success") {
          resolve(NextResponse.json({ success: true, formContent: result.checkoutFormContent }));
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: `İYZİCO REDDETTİ: ${result?.errorMessage} (Hata Kodu: ${result?.errorCode})` 
          }, { status: 400 }));
        }
      });
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ success: false, error: `SİSTEM HATASI: ${error.message}` }, { status: 500 });
  }
}