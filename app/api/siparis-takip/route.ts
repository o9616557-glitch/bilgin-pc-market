import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, email } = await request.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: "Lütfen sipariş numarasını ve e-postanızı girin." }, { status: 400 });
    }

    // Kullanıcı başında # yazdıysa onu temizleyen cımbız
    const cleanId = orderId.replace('#', '').trim();

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // WooCommerce API'sinden siparişi sorguluyoruz
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/orders/${cleanId}?consumer_key=${CK}&consumer_secret=${CS}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Sipariş bulunamadı. Lütfen numarayı kontrol edin şefim." }, { status: 404 });
    }

    const order = await res.json();

    // Güvenlik Duvarı: Girilen e-posta, siparişteki fatura e-postasıyla eşleşiyor mu?
    if (order.billing?.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Girdiğiniz e-posta adresi bu sipariş numarasıyla eşleşmiyor şefim." }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("Sipariş takip hatası:", error);
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}