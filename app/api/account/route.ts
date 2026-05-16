import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Oturum anahtarı bulunamadı." }, { status: 401 });

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // 🚀 ŞEFİM İŞTE SİHİRLİ DOKUNUŞ: 
    // Hosting firması Authorization başlığını silse bile etkilenmiyoruz.
    // Token'ı Next.js içinde yerel olarak decode edip ID'yi kendimiz cımbızlıyoruz!
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

    // 2. Bulduğumuz net ID üzerinden WooCommerce veritabanından adres bilgilerini çekiyoruz
    const customerRes = await fetch(`${SITE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CK}&consumer_secret=${CS}`);
    const customerData = await customerRes.json();

    // 3. Aynı ID üzerinden gerçek sipariş geçmişini çekiyoruz
    const ordersRes = await fetch(`${SITE_URL}/wp-json/wc/v3/orders?customer=${userId}&consumer_key=${CK}&consumer_secret=${CS}`);
    const ordersData = await ordersRes.json();

    return NextResponse.json({
      customer: customerData,
      orders: ordersData
    });

  } catch (error) {
    console.error("Hesap verileri çekme hatası:", error);
    return NextResponse.json({ error: "Veriler sunucudan çekilemedi." }, { status: 500 });
  }
}