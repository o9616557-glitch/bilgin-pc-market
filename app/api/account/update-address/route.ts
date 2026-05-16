import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, type, address } = await request.json();
    if (!token) return NextResponse.json({ error: "Oturum yok." }, { status: 401 });

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // WordPress User ID'yi öğren
    const userRes = await fetch(`${SITE_URL}/wp-json/wp/v2/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json();
    const userId = userData.id;

    // WooCommerce formatına göre adres paketini hazırlıyoruz
    const updateBody: any = {};
    if (type === "billing") {
      updateBody.billing = {
        first_name: address.firstName,
        last_name: address.lastName,
        phone: address.phone,
        city: address.city,
        state: address.district,
        address_1: address.fullAddress
      };
    } else {
      updateBody.shipping = {
        first_name: address.firstName,
        last_name: address.lastName,
        city: address.city,
        state: address.district,
        address_1: address.fullAddress
      };
    }

    // 🚀 ŞEFİM İŞTE BURAYI DEĞİŞTİRDİK: method: 'PUT' yaptık!
    // WooCommerce güncelleme isteklerinde 'PUT' metodunu zorunlu kılar.
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${CK}&consumer_secret=${CS}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBody)
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "WooCommerce adres güncelleyemedi." }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Sunucu bağlantı hatası." }, { status: 500 });
  }
}