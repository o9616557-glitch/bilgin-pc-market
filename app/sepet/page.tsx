import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartItems, customerDetails } = body;

    // 🎯 WordPress API Bilgileri
    const WP_URL = "https://bilginpcmarket.com";
    
    // WooCommerce REST API anahtarlarını buraya güvenli şekilde çiviliyoruz şef.
    // Lütfen buradaki "ck_..." ve "cs_..." değerlerinin senin WordPress panelinden aldığın güncel anahtarlar olduğundan emin ol.
    const CONSUMER_KEY = "ck_a48f32bcbc7d7211a76c5b05763bf8fc5f619b01"; // Örnek anahtar, kendi anahtarınla değiştir şef
    const CONSUMER_SECRET = "cs_8c87de6ca708d74558509c25f4b553e1f0e42d76"; // Örnek secret, kendi secret'ınla değiştir şef

    // WooCommerce'in anlayacağı sipariş formatına dönüştürüyoruz
    const line_items = cartItems.map((item: any) => ({
      product_id: Number(item.id),
      quantity: Number(item.quantity)
    }));

    const orderData = {
      payment_method: "iyzico",
      payment_method_title: "Kredi Kartı (İyzico)",
      set_paid: false, // Ödeme henüz yapılmadı, İyzico sayfasında yapılacak
      status: "pending", // Ödeme bekliyor modu
      billing: {
        first_name: customerDetails?.first_name || "Müşteri",
        last_name: customerDetails?.last_name || "Yabancı",
        address_1: customerDetails?.address || "Direkt Ödeme Adresi",
        city: customerDetails?.city || "İstanbul",
        country: "TR",
        email: customerDetails?.email || "eposta@bilginpc.com",
        phone: customerDetails?.phone || "05555555555"
      },
      line_items: line_items
    };

    // WordPress'e bağlanıp siparişi yazıyoruz
    const wpRes = await fetch(`${WP_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`
      },
      body: JSON.stringify(orderData)
    });

    if (!wpRes.ok) {
      const errLog = await wpRes.text();
      console.error("WooCommerce Sipariş Hatası:", errLog);
      return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 400 });
    }

    const createdOrder = await wpRes.json();

    // 🚀 SİHİRLİ DÜZELTME BURADA:
    // Elimizle adres yazmak yerine WooCommerce'in bize siparişe özel olarak ürettiği 
    // ve sitenin diline tam uyumlu olan "payment_url" adresini doğrudan alıyoruz.
    const securePaymentUrl = createdOrder.payment_url;

    return NextResponse.json({ paymentUrl: securePaymentUrl });

  } catch (error) {
    console.error("Kasa Hatası:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}