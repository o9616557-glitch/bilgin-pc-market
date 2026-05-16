import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Oturum anahtarı bulunamadı." }, { status: 401 });

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // 1. Müşterinin cebindeki JWT token ile WordPress'ten onun ID'sini öğreniyoruz
    const userRes = await fetch(`${SITE_URL}/wp-json/wp/v2/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json();
    const userId = userData.id;

    if (!userId) return NextResponse.json({ error: "Kullanıcı ID'si alınamadı." }, { status: 404 });

    // 2. WooCommerce API'sinden bu ID'ye ait gerçek Adres ve Profil bilgilerini çekiyoruz
    const customerRes = await fetch(`${SITE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CK}&consumer_secret=${CS}`);
    const customerData = await customerRes.json();

    // 3. WooCommerce API'sinden bu ID'ye ait gerçek Sipariş Geçmişini çekiyoruz
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