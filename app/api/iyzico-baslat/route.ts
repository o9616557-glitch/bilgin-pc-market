import { NextResponse } from 'next/server';
import crypto from 'crypto'; // Node.js'in kendi içindeki şifreleme motoru

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, checkoutForm, totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY || "";
    const secretKey = process.env.IYZICO_SECRET_KEY || "";
    const baseUrl = "https://api.iyzipay.com"; // İyzico Canlı API Adresi

    // 1. İyzico'nun resmi sunucusunun bizden beklediği ham veri paketi
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
        lastLoginDate: "2026-01-01 12:00:00",
        registrationDate: "2026-01-01 12:00:00",
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

    // 🚀 EL YAPIMI İYZİCO ŞİFRELEME MOTORU (KÜTÜPHANESİZ)
    const rawBodyStr = JSON.stringify(requestData);
    const rnd = Math.random().toString(36).substring(2, 12) + Date.now();
    
    // İyzico'nun güvenlik duvarını aşmak için oluşturduğumuz imza bağı
    const signatureStr = apiKey + rnd + secretKey + rawBodyStr;
    const hash = crypto.createHash('sha1').update(signatureStr, 'utf-8').digest('base64');
    const authHeader = `IYZWS ${apiKey}:${hash}`;

    // 🚀 DOĞRUDAN İYZİCO SUNUCUSUNA NATIVE FETCH İSTEĞİ
    const iyzicoResponse = await fetch(`${baseUrl}/payment/iyziconnect/checkoutform/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authHeader,
        "x-iyzi-rnd": rnd
      },
      body: rawBodyStr
    });

    const result = await iyzicoResponse.json();

    if (result.status === "success") {
      return NextResponse.json({ success: true, formContent: result.checkoutFormContent });
    } else {
      return NextResponse.json({ success: false, error: result.errorMessage || "İyzico hatası oluştu." }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: "Bağlantı kurulurken bir arıza meydana geldi." }, { status: 500 });
  }
}