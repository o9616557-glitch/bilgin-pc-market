import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartItems, customerDetails } = body;

    // 🎯 WORDPRESS API BİLGİLERİNİ BURAYA ÇİVİLİYORUZ ŞEF
    const WP_URL = "https://bilginpcmarket.com";
    const CONSUMER_KEY = "ck_e1b891013aba9e66100d8c5fc1e102ef58e84474";
    const CONSUMER_SECRET = "cs_dfb8416be9d98f2c54720bfb9da8d53ed19f1b63";

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

    // 🚀 İŞTE O SİHİRLİ GÜVENLİ ÖDEME LİNKİ!
    // Bu link müşteriyi direkt İyzico ekranının açılacağı ödeme sayfasına fırlatır
    //  YENİ VE DOĞRU SATIR:
const securePaymentUrl = `${WP_URL}/odeme/order-pay/${createdOrder.id}/?key=${createdOrder.order_key}&pay_for_order=true`;

    return NextResponse.json({ paymentUrl: securePaymentUrl });

  } catch (error) {
    console.error("Kasa Hatası:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}