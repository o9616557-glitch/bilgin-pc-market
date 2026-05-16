import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, email, token } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Lütfen sipariş numarasını girin şefim." }, { status: 400 });
    }

    const cleanId = orderId.replace('#', '').trim();
    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // WooCommerce API'sinden siparişi sorgula
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/orders/${cleanId}?consumer_key=${CK}&consumer_secret=${CS}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Sipariş bulunamadı. Lütfen numarayı kontrol edin şefim." }, { status: 404 });
    }

    const order = await res.json();

    // 🚀 KONTROL MERKEZİ: Giriş yapılmış mı yoksa misafir mi?
    if (token) {
      // Giriş yapan üyenin ID'sini token'dan cımbızlıyoruz
      let userId;
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const payload = JSON.parse(payloadString);
        userId = payload.data?.user?.id;
      } catch (e) {
        return NextResponse.json({ error: "Oturum doğrulaması başarısız oldu." }, { status: 401 });
      }

      // Güvenlik Duvarı: Siparişi veren müşteri ID'si ile giriş yapan kişi uyuşuyor mu?
      if (Number(order.customer_id) !== Number(userId)) {
        return NextResponse.json({ error: "Bu sipariş sizin hesabınıza ait değil şefim!" }, { status: 403 });
      }
    } else {
      // Eğer giriş yapılmadıysa eski sistem e-posta kontrolü devreye girer
      if (!email) {
        return NextResponse.json({ error: "Ziyaretçiler için e-posta adresi zorunludur." }, { status: 400 });
      }
      if (order.billing?.email?.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ error: "Girdiğiniz e-posta adresi bu siparişle eşleşmiyor şefim." }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("Sipariş takip hatası:", error);
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}