import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cart, checkoutForm, paymentMethod, userId } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Sepetiniz boş olduğu için sipariş oluşturulamaz." }, { status: 400 });
    }

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // 1. Next.js sepet formatını WooCommerce'in istediği formata (line_items) çeviriyoruz
    const lineItems = cart.map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    // 2. Sipariş paketini WooCommerce standartlarında hazırlıyoruz
    const orderPayload: any = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === "cod" ? "Kapıda Nakit Ödeme" : "Banka Havalesi / EFT",
      set_paid: false, // Ödeme kapıda veya havale olduğu için henüz ödenmedi durumunda başlar
      billing: {
        first_name: checkoutForm.firstName,
        last_name: checkoutForm.lastName,
        address_1: checkoutForm.fullAddress,
        city: checkoutForm.city,
        state: checkoutForm.district,
        email: checkoutForm.email,
        phone: checkoutForm.phone,
        country: "TR"
      },
      shipping: {
        first_name: checkoutForm.firstName,
        last_name: checkoutForm.lastName,
        address_1: checkoutForm.fullAddress,
        city: checkoutForm.city,
        state: checkoutForm.district,
        country: "TR"
      },
      line_items: lineItems
    };

    // Eğer müşteri siteye üye girişi yapmışsa, siparişi onun profiliyle ilişkilendiriyoruz
    if (userId) {
      orderPayload.customer_id = Number(userId);
    }

    // 3. Hazırlanan dev paketi WooCommerce veritabanına PUT/POST ile şutluyoruz
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/orders?consumer_key=${CK}&consumer_secret=${CS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const orderData = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true, orderId: orderData.id });
    } else {
      return NextResponse.json({ error: orderData.message || "WooCommerce siparişi onaylamadı." }, { status: res.status });
    }

  } catch (error) {
    console.error("Sipariş oluşturma api hatası:", error);
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}