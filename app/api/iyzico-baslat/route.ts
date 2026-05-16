/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 🚀 İŞTE ÇÖZÜM: İYZİCO'NUN KENDİ ŞİFRELEME ALGORİTMASININ BİREBİR KLONU
// Elle yazım hatasını (Hata 11'i) %100 ortadan kaldıran dinamik motor.
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
    const { cart, totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY || "";
    const secretKey = process.env.IYZICO_SECRET_KEY || "";

    if (!apiKey || !secretKey) {
      return NextResponse.json({ success: false, error: "API Şifreleri eksik! Vercel paneline şifreleri girmelisiniz." }, { status: 400 });
    }

    const isSandbox = apiKey.startsWith("sandbox-");
    const iyzicoBaseUrl = isSandbox ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com";
    const siteBaseUrl = request.headers.get('origin') || "https://bilginpcmarket.com";
    
    const formattedPrice = Number(totalAmount).toFixed(1);

    const requestData = {
      locale: "tr",
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: formattedPrice,
      paidPrice: formattedPrice,
      currency: "TRY",
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: "PRODUCT",
      callbackUrl: `${siteBaseUrl}/api/iyzico-sonuc`,
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: "BY789",
        name: "Ahmet",
        surname: "Yilmaz", // Şifreleme bozulmasın diye Türkçe karakter kullanmadık
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
      basketItems: cart.map((item: any) => ({
        id: item.id.toString(),
        name: "Test Urunu", 
        category1: "Donanim",
        itemType: "PHYSICAL",
        price: formattedPrice
      }))
    };

    // 🚀 Matematiksel hesaplama devreye giriyor!
    const pkiString = generatePKI(requestData);
    const rnd = Math.random().toString(36).substring(2, 12) + Date.now();
    const signatureStr = apiKey + rnd + secretKey + pkiString;
    const hash = crypto.createHash('sha1').update(signatureStr, 'utf-8').digest('base64');
    const authHeader = `IYZWS ${apiKey}:${hash}`;

    const iyzicoResponse = await fetch(`${iyzicoBaseUrl}/payment/iyziconnect/checkoutform/initialize`, {
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
        error: `İYZİCO DİYOR Kİ: ${result.errorMessage} (Hata Kodu: ${result.errorCode})` 
      }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sunucu hatası: " + (error as Error).message }, { status: 500 });
  }
}