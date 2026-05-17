import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Oturum anahtarı bulunamadı." }, { status: 401 });

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    let userId;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadString);
      userId = payload.data?.user?.id;
    } catch (e) {
      return NextResponse.json({ error: "Oturum şifresi çözülemedi şefim." }, { status: 400 });
    }

    if (!userId) return NextResponse.json({ error: "Kullanıcı ID'si tespit edilemedi." }, { status: 404 });

    // 🚀 ŞEFİM İŞTE BEKLEMEYİ BİTİREN PARALEL MOTOR (Promise.all)
    // Adres bilgilerini ve Sipariş geçmişini WooCommerce'den AYNI ANDA talep ediyoruz!
    const [customerRes, ordersRes] = await Promise.all([
      fetch(`${SITE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CK}&consumer_secret=${CS}`),
      fetch(`${SITE_URL}/wp-json/wc/v3/orders?customer=${userId}&consumer_key=${CK}&consumer_secret=${CS}`)
    ]);

    // Gelen iki cevabı da yine beklemeden aynı anda JSON formatına çözüyoruz
    const [customerData, ordersData] = await Promise.all([
      customerRes.json(),
      ordersRes.json()
    ]);

    return NextResponse.json({
      customer: customerData,
      orders: ordersData
    });

  } catch (error) {
    console.error("Hesap verileri çekme hatası:", error);
    return NextResponse.json({ error: "Veriler sunucudan çekilemedi." }, { status: 500 });
  }
}