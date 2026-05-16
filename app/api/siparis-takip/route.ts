import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, email, token } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Lütfen geçerli bir sipariş numarası giriniz." }, { status: 400 });
    }

    const cleanId = orderId.replace('#', '').trim();
    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/orders/${cleanId}?consumer_key=${CK}&consumer_secret=${CS}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Sipariş bulunamadı. Lütfen bilgilerinizi kontrol ediniz." }, { status: 404 });
    }

    const order = await res.json();

    if (token) {
      let userId;
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const payload = JSON.parse(payloadString);
        userId = payload.data?.user?.id;
      } catch (e) {
        return NextResponse.json({ error: "Oturum doğrulaması başarısız oldu." }, { status: 401 });
      }

      if (Number(order.customer_id) !== Number(userId)) {
        return NextResponse.json({ error: "Bu sipariş numarası sizin hesabınıza ait görünmüyor." }, { status: 403 });
      }
    } else {
      if (!email) {
        return NextResponse.json({ error: "Ziyaretçi sorgulamaları için e-posta adresi zorunludur." }, { status: 400 });
      }
      if (order.billing?.email?.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ error: "Girdiğiniz e-posta adresi bu sipariş numarasıyla eşleşmiyor." }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, order });

  } catch (error) {
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}