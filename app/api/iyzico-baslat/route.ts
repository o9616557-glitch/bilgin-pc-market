import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, checkoutForm, totalAmount } = body;

    // 1. İYZİCO KASASINI AÇIYORUZ
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY || "",
      secretKey: process.env.IYZICO_SECRET_KEY || "",
      uri: "https://api.iyzipay.com" // Test aşamasındaysan burayı: https://sandbox-api.iyzipay.com yapmalısın
    });

    // 2. MÜŞTERİ VE SEPET VERİLERİNİ İYZİCO STANDARTLARINA PAKETLİYORUZ
    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "https://bilginpcmarket.com/api/iyzico-sonuc", // İyzico parayı çekince buraya haber verecek
      enabledInstallments: [2, 3, 6, 9, 12], // Açık taksit seçenekleri
      buyer: {
        id: "BY789",
        name: checkoutForm.firstName,
        surname: checkoutForm.lastName,
        gsmNumber: checkoutForm.phone,
        email: checkoutForm.email,
        identityNumber: "11111111111", // T.C. Kimlik (Gerekirse formdan eklenebilir)
        lastLoginDate: "2023-01-01 12:00:00",
        registrationDate: "2023-01-01 12:00:00",
        registrationAddress: checkoutForm.fullAddress,
        ip: "85.34.78.112",
        city: checkoutForm.city,
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: checkoutForm.firstName + " " + checkoutForm.lastName,
        city: checkoutForm.city,
        country: "Turkey",
        address: checkoutForm.fullAddress,
        zipCode: "34732"
      },
      billingAddress: {
        contactName: checkoutForm.firstName + " " + checkoutForm.lastName,
        city: checkoutForm.city,
        country: "Turkey",
        address: checkoutForm.fullAddress,
        zipCode: "34732"
      },
      basketItems: cart.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        category1: "Donanım",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        // Fiyat temizleme motoru (WooCommerce'den gelen virgülleri ezer)
        price: (parseFloat(item.price.replace(/[^\d]/g, "")) / (item.price.replace(/[^\d]/g, "") > 1000000 ? 100 : 1)).toString()
      }))
    };

    // 3. İYZİCO'YA BAĞLAN VE GÜVENLİ FORMU ÇEK
    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: "İyzico sunucu bağlantı hatası." }, { status: 500 }));
        } else if (result.status === "success") {
          resolve(NextResponse.json({ success: true, formContent: result.checkoutFormContent }));
        } else {
          resolve(NextResponse.json({ success: false, error: result.errorMessage }, { status: 400 }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}