/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { NextResponse } from 'next/server';
import crypto from 'crypto'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, checkoutForm, totalAmount } = body;

    const apiKey = process.env.IYZICO_API_KEY || "";
    const secretKey = process.env.IYZICO_SECRET_KEY || "";

    if (!apiKey || !secretKey) {
      return NextResponse.json({ success: false, error: "API Şifreleri eksik! Vercel paneline şifreleri girmelisiniz." }, { status: 400 });
    }

    const isSandbox = apiKey.startsWith("sandbox-");
    const iyzicoBaseUrl = isSandbox ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com";
    const siteBaseUrl = request.headers.get('origin') || "https://bilginpcmarket.com";
    
    // Fiyatı zorunlu olarak "15000.0" formatına çeviriyoruz
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
        name: checkoutForm.firstName || "Ahmet",
        surname: checkoutForm.lastName || "Yılmaz",
        gsmNumber: checkoutForm.phone || "5555555555",
        email: checkoutForm.email || "test@gmail.com",
        identityNumber: "11111111111",
        lastLoginDate: "2026-01-01 12:00:00",
        registrationDate: "2026-01-01 12:00:00",
        registrationAddress: checkoutForm.fullAddress || "Moda Caddesi No:5",
        ip: "85.34.78.112",
        city: checkoutForm.city || "İstanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: `${checkoutForm.firstName || "Ahmet"} ${checkoutForm.lastName || "Yılmaz"}`,
        city: checkoutForm.city || "İstanbul",
        country: "Turkey",
        address: checkoutForm.fullAddress || "Moda Caddesi No:5",
        zipCode: "34732"
      },
      billingAddress: {
        contactName: `${checkoutForm.firstName || "Ahmet"} ${checkoutForm.lastName || "Yılmaz"}`,
        city: checkoutForm.city || "İstanbul",
        country: "Turkey",
        address: checkoutForm.fullAddress || "Moda Caddesi No:5",
        zipCode: "34732"
      },
      basketItems: cart.map((item: any) => ({
        id: item.id.toString(),
        name: item.name.replace(/,/g, ' '), // İsimde virgül varsa şifrelemeyi bozmaması için siliyoruz
        category1: "Donanım",
        itemType: "PHYSICAL",
        price: formattedPrice
      }))
    };

    // 🚀 İŞTE ASIL SİHİR BURADA: İYZİCO'NUN İSTEDİĞİ MİLİMETRİK ŞİFRELEME SIRASI (HATA 11'İN ÇÖZÜMÜ)
    const pkiString = `[locale=${requestData.locale},` +
      `conversationId=${requestData.conversationId},` +
      `price=${requestData.price},` +
      `basketId=${requestData.basketId},` +
      `paymentGroup=${requestData.paymentGroup},` +
      `buyer=[id=${requestData.buyer.id},name=${requestData.buyer.name},surname=${requestData.buyer.surname},identityNumber=${requestData.buyer.identityNumber},email=${requestData.buyer.email},gsmNumber=${requestData.buyer.gsmNumber},registrationDate=${requestData.buyer.registrationDate},lastLoginDate=${requestData.buyer.lastLoginDate},registrationAddress=${requestData.buyer.registrationAddress},city=${requestData.buyer.city},country=${requestData.buyer.country},zipCode=${requestData.buyer.zipCode},ip=${requestData.buyer.ip}],` +
      `shippingAddress=[address=${requestData.shippingAddress.address},zipCode=${requestData.shippingAddress.zipCode},contactName=${requestData.shippingAddress.contactName},city=${requestData.shippingAddress.city},country=${requestData.shippingAddress.country}],` +
      `billingAddress=[address=${requestData.billingAddress.address},zipCode=${requestData.billingAddress.zipCode},contactName=${requestData.billingAddress.contactName},city=${requestData.billingAddress.city},country=${requestData.billingAddress.country}],` +
      `basketItems=[` + requestData.basketItems.map((item: any) => `[id=${item.id},price=${item.price},name=${item.name},category1=${item.category1},itemType=${item.itemType}]`).join(', ') + `],` +
      `callbackUrl=${requestData.callbackUrl},` +
      `currency=${requestData.currency},` +
      `paidPrice=${requestData.paidPrice},` +
      `enabledInstallments=[2, 3, 6, 9, 12]]`;

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