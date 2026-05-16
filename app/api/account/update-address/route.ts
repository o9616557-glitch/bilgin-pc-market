import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, type, address } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı kimliği (ID) eksik şefim." }, { status: 400 });
    }

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

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

    // Doğrudan netleşen ID üzerinden WooCommerce'e PUT komutu fırlatıyoruz
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CK}&consumer_secret=${CS}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBody)
    });

    const wpData = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: wpData.message || "WooCommerce güncellemeyi reddetti." }, { status: res.status });
    }

  } catch (error) {
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}