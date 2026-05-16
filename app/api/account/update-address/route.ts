import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, type, address } = await request.json();
    if (!token) return NextResponse.json({ error: "Oturum anahtarı bulunamadı." }, { status: 401 });

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // 1. WordPress'ten kullanıcının ID'sini öğren
    const userRes = await fetch(`${SITE_URL}/wp-json/wp/v2/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json();
    const userId = userData.id;

    if (!userId) return NextResponse.json({ error: "WordPress kullanıcı kimliği doğrulanamadı şefim." }, { status: 404 });

    // 2. Adres paketini WooCommerce formatında hazırla
    const updateBody: any = {};
    if (type === "billing") {
      updateBody.billing = {
        first_name: address.firstName,
        last_name: address.lastName,
        phone: address.phone,
        city: address.city,
        state: address.district,
        address_1: address.fullAddress,
        country: "TR"
      };
    } else {
      updateBody.shipping = {
        first_name: address.firstName,
        last_name: address.lastName,
        city: address.city,
        state: address.district,
        address_1: address.fullAddress,
        country: "TR"
      };
    }

    // 3. WooCommerce'e gerçek güncellemeyi PUT vitesiyle şutla
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CK}&consumer_secret=${CS}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBody)
    });

    // WordPress'ten gelen ham yanıtı oku
    const wpData = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      // 🚀 ŞEFİM: WordPress'ten gelen asıl gizli hatayı buraya bağlıyoruz.
      // Artık yuvarlak bir cümle değil, WordPress tam olarak neye kızdıysa onu göreceğiz!
      return NextResponse.json({ error: wpData.message || "WooCommerce güncellemeyi reddetti." }, { status: res.status });
    }

  } catch (error) {
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}