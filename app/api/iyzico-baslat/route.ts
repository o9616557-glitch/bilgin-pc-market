import { NextResponse } from 'next/server';

// @ts-ignore
import Iyzipay from 'iyzipay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, checkoutForm, totalAmount } = body;

    // Şifrelerin başındaki ve sonundaki görünmez boşlukları otomatik silen (trim) sistem
    const apiKey = process.env.IYZICO_API_KEY?.trim() || "";
    const secretKey = process.env.IYZICO_SECRET_KEY?.trim() || "";

    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: "https://api.iyzipay.com" // GERÇEK CANLI SATIŞ SUNUCUSU
    });

    // Fiyatı tam İyzico'nun istediği gibi formatlıyoruz
    const formattedPrice = Number(totalAmount).toFixed(1);

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

    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
        if (result && result.status === "success") {
          resolve(NextResponse.json({ success: true, formContent: result.checkoutFormContent }));
        } else {
          resolve(NextResponse.json({ 
            success: false, 
            error: `YENİ KOD ÇALIŞTI HATA VERDİ: ${result?.errorMessage} (Hata Kodu: ${result?.errorCode})` 
          }, { status: 400 }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}