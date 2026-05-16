import { NextResponse } from 'next/server';

// 🚀 İYZİCO'NUN HATALI ANA DOSYASINI TAMAMEN ES GEÇİP, 
// DİREKT ÖDEME FORMUNU BAŞLATAN ALT PARÇAYI NOKTA ATIŞI ÇAĞIRIYORUZ!
// @ts-ignore
const CheckoutFormInitialize = require('iyzipay/lib/resources/CheckoutFormInitialize');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, checkoutForm, totalAmount } = body;

    // Sınıfı doğrudan ayarlarımızla ayağa kaldırıyoruz
    const checkoutFormInitInstance = new CheckoutFormInitialize({
      apiKey: process.env.IYZICO_API_KEY || "",
      secretKey: process.env.IYZICO_SECRET_KEY || "",
      uri: "https://api.iyzipay.com" 
    });

    const requestData = {
      locale: "tr", 
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: "TRY", 
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: "PRODUCT", 
      callbackUrl: "https://bilginpcmarket.com/api/iyzico-sonuc",
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: "BY789",
        name: checkoutForm.firstName,
        surname: checkoutForm.lastName,
        gsmNumber: checkoutForm.phone,
        email: checkoutForm.email,
        identityNumber: "11111111111",
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
        itemType: "PHYSICAL", 
        price: (parseFloat(item.price.replace(/[^\d]/g, "")) / (item.price.replace(/[^\d]/g, "") > 1000000 ? 100 : 1)).toString()
      }))
    };

    return new Promise((resolve) => {
      checkoutFormInitInstance.create(requestData, (err: any, result: any) => {
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