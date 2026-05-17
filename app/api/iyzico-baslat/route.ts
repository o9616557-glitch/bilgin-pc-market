import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Orijinal paketin yaptığı şifrelemenin birebir aynısını yapan güvenli fonksiyon
function generatePKI(obj: any): string {
  let pki = '[';
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          pki += key + '=[';
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object' && value[i] !== null) {
              pki += generatePKI(value[i]) + ', ';
            } else {
              pki += value[i] + ', ';
            }
          }
          if (value.length > 0) pki = pki.slice(0, -2);
          pki += '],';
        } else if (typeof value === 'object') {
          pki += key + '=' + generatePKI(value) + ',';
        } else {
          pki += key + '=' + value + ',';
        }
      }
    }
  }
  if (pki.endsWith(',')) pki = pki.slice(0, -1);
  pki += ']';
  return pki;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutForm, totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY?.trim() || "";
    const secretKey = process.env.IYZICO_SECRET_KEY?.trim() || "";

    const safeAmount = totalAmount ? totalAmount.toString().replace(/,/g, '') : "0";
    const formattedPrice = Number(safeAmount).toFixed(1);

    const requestData = {
      locale: "tr",
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: formattedPrice,
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: "PRODUCT",
      buyer: {
        id: "BY789",
        name: checkoutForm?.firstName || "Ahmet",
        surname: checkoutForm?.lastName || "Yılmaz",
        gsmNumber: checkoutForm?.phone || "+905555555555",
        email: checkoutForm?.email || "test@gmail.com",
        identityNumber: "11111111111",
        lastLoginDate: "2023-01-01 12:00:00",
        registrationDate: "2023-01-01 12:00:00",
        registrationAddress: checkoutForm?.fullAddress || "Moda Caddesi No:5",
        ip: "85.34.78.112",
        city: checkoutForm?.city || "İstanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: (checkoutForm?.firstName || "Ahmet") + " " + (checkoutForm?.lastName || "Yılmaz"),
        city: checkoutForm?.city || "İstanbul",
        country: "Turkey",
        address: checkoutForm?.fullAddress || "Moda Caddesi No:5",
        zipCode: "34732"
      },
      billingAddress: {
        contactName: (checkoutForm?.firstName || "Ahmet") + " " + (checkoutForm?.lastName || "Yılmaz"),
        city: checkoutForm?.city || "İstanbul",
        country: "Turkey",
        address: checkoutForm?.fullAddress || "Moda Caddesi No:5",
        zipCode: "34732"
      },
      basketItems: [
        {
          id: "SEPET-100",
          name: "Bilgin PC Market Sepet Tutarı",
          category1: "Donanım",
          itemType: "PHYSICAL",
          price: formattedPrice
        }
      ],
      callbackUrl: "https://bilginpcmarket.com/api/iyzico-sonuc",
      currency: "TRY",
      paidPrice: formattedPrice,
      enabledInstallments: [2, 3, 6, 9, 12]
    };

    const pkiString = generatePKI(requestData);
    const rnd = Math.random().toString(36).substring(2, 12) + Date.now();
    const signatureStr = apiKey + rnd + secretKey + pkiString;
    const hash = crypto.createHash('sha1').update(signatureStr, 'utf-8').digest('base64');
    const authHeader = `IYZWS ${apiKey}:${hash}`;

    const iyzicoResponse = await fetch("https://api.iyzipay.com/payment/iyzipos/checkoutform/initialize/auth/ecom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authHeader,
        "x-iyzi-rnd": rnd
      },
      body: JSON.stringify(requestData)
    });

    const result = await iyzicoResponse.json();

    if (result.status === "success") {
      return NextResponse.json({ success: true, formContent: result.checkoutFormContent });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: `İYZİCO REDDETTİ: ${result.errorMessage} (Hata Kodu: ${result.errorCode})` 
      }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: `SİSTEM HATASI: ${error.message}` }, { status: 500 });
  }
}