import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 🚀 İYZİCO'NUN ŞİFRELEME MATEMATİĞİ (Pakete İhtiyaç Duymadan Biz Yapıyoruz)
function generatePKI(data: any) {
  let pki = '[';
  const append = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") pki += k + '=' + v + ','; };
  const appendPrice = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") pki += k + '=' + Number(v).toFixed(1) + ','; };
  const appendArray = (k: string, arr: any[]) => { if (arr && arr.length > 0) pki += k + '=[' + arr.join(', ') + '],'; };

  append('locale', data.locale);
  append('conversationId', data.conversationId);
  appendPrice('price', data.price);
  append('basketId', data.basketId);
  append('paymentGroup', data.paymentGroup);

  if (data.buyer) {
    let b = '[';
    const appB = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") b += k + '=' + v + ','; };
    appB('id', data.buyer.id);
    appB('name', data.buyer.name);
    appB('surname', data.buyer.surname);
    appB('identityNumber', data.buyer.identityNumber);
    appB('email', data.buyer.email);
    appB('gsmNumber', data.buyer.gsmNumber);
    appB('registrationDate', data.buyer.registrationDate);
    appB('lastLoginDate', data.buyer.lastLoginDate);
    appB('registrationAddress', data.buyer.registrationAddress);
    appB('city', data.buyer.city);
    appB('country', data.buyer.country);
    appB('zipCode', data.buyer.zipCode);
    appB('ip', data.buyer.ip);
    pki += 'buyer=' + b.slice(0, -1) + '],';
  }

  if (data.shippingAddress) {
    let s = '[';
    const appS = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") s += k + '=' + v + ','; };
    appS('address', data.shippingAddress.address);
    appS('zipCode', data.shippingAddress.zipCode);
    appS('contactName', data.shippingAddress.contactName);
    appS('city', data.shippingAddress.city);
    appS('country', data.shippingAddress.country);
    pki += 'shippingAddress=' + s.slice(0, -1) + '],';
  }

  if (data.billingAddress) {
    let b = '[';
    const appS = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") b += k + '=' + v + ','; };
    appS('address', data.billingAddress.address);
    appS('zipCode', data.billingAddress.zipCode);
    appS('contactName', data.billingAddress.contactName);
    appS('city', data.billingAddress.city);
    appS('country', data.billingAddress.country);
    pki += 'billingAddress=' + b.slice(0, -1) + '],';
  }

  if (data.basketItems) {
    let items: string[] = [];
    data.basketItems.forEach((item: any) => {
      let i = '[';
      const appI = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") i += k + '=' + v + ','; };
      const appIPrice = (k: string, v: any) => { if (v !== undefined && v !== null && v !== "") i += k + '=' + Number(v).toFixed(1) + ','; };
      appI('id', item.id);
      appIPrice('price', item.price);
      appI('name', item.name);
      appI('category1', item.category1);
      appI('category2', item.category2);
      appI('itemType', item.itemType);
      appI('subMerchantKey', item.subMerchantKey);
      appIPrice('subMerchantPrice', item.subMerchantPrice);
      items.push(i.slice(0, -1) + ']');
    });
    pki += 'basketItems=[' + items.join(', ') + '],';
  }

  append('callbackUrl', data.callbackUrl);
  append('paymentSource', data.paymentSource);
  append('currency', data.currency);
  append('posOrderId', data.posOrderId);
  appendPrice('paidPrice', data.paidPrice);
  append('forceThreeDS', data.forceThreeDS);
  append('cardUserKey', data.cardUserKey);
  appendArray('enabledInstallments', data.enabledInstallments);

  return pki.slice(0, -1) + ']';
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutForm, totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY?.trim() || "";
    const secretKey = process.env.IYZICO_SECRET_KEY?.trim() || "";

    const formattedPrice = Number(totalAmount || 0).toFixed(1);

    const requestData = {
      locale: "tr",
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: formattedPrice,
      paidPrice: formattedPrice,
      currency: "TRY",
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: "PRODUCT",
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
          itemType: "PHYSICAL",
          price: formattedPrice
        }
      ]
    };

    // 🚀 PAKETSİZ SAF ŞİFRELEME (Vercel bunu bozamaz!)
    const pkiString = generatePKI(requestData);
    const rnd = Math.random().toString(36).substring(2, 12) + Date.now();
    const signatureStr = apiKey + rnd + secretKey + pkiString;
    const hash = crypto.createHash('sha1').update(signatureStr, 'utf-8').digest('base64');
    const authHeader = `IYZWS ${apiKey}:${hash}`;

    // 🚀 SAF FETCH İLE İYZİCO'YA BAĞLANTI
    const iyzicoResponse = await fetch("https://api.iyzipay.com/payment/iyziconnect/checkoutform/initialize", {
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
    return NextResponse.json({ success: false, error: `CRITICAL ERROR: ${error.message}` }, { status: 500 });
  }
}