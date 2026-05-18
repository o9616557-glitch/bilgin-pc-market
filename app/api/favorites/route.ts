import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";

// 1. Veritabanından Favorileri Çeken Fonksiyon (GET)
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
    }

    // WordPress REST API'den kullanıcının kendi meta bilgilerini istiyoruz
    const response = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Kullanıcı doğrulanamadı." }, { status: 401 });
    }

    const userData = await response.json();
    // WordPress meta alanında saklanan 'user_favorites' listesini çekiyoruz
    const favorites = userData.meta?.user_favorites ? JSON.parse(userData.meta.user_favorites) : [];

    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: "Sistem hatası oluştu." }, { status: 500 });
  }
}

// 2. Veritabanına Favori Ekleyen/Silen Fonksiyon (POST)
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Lütfen önce giriş yapınız." }, { status: 401 });
    }

    const body = await req.json();
    const { product, action } = body; // action: 'add' veya 'remove'

    // Kullanıcı doğrulaması için WordPress'e koşuyoruz
    const userRes = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Oturum geçersiz." }, { status: 401 });
    }

    const userData = await userRes.json();
    let currentFavorites = userData.meta?.user_favorites ? JSON.parse(userData.meta.user_favorites) : [];

    if (action === "add") {
      // Listede zaten yoksa ekle
      if (!currentFavorites.some((item: any) => Number(item.id) === Number(product.id))) {
        currentFavorites.push({
          id: Number(product.id),
          name: product.name,
          price: product.price || product.regular_price,
          image: product.image || product.images?.[0]?.src || "/placeholder.png",
          slug: product.slug
        });
      }
    } else if (action === "remove") {
      // Listeden kaldır
      currentFavorites = currentFavorites.filter((item: any) => Number(item.id) !== Number(product.id));
    }

    // Güncel listeyi WordPress veritabanına (User Meta) geri kilitliyoruz
    const updateRes = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meta: {
          user_favorites: JSON.stringify(currentFavorites),
        },
      }),
    });

    if (!updateRes.ok) {
      return NextResponse.json({ error: "Veritabanı güncellenemedi." }, { status: 500 });
    }

    return NextResponse.json({ success: true, favorites: currentFavorites });
  } catch (error) {
    return NextResponse.json({ error: "İşlem sırasında hata oluştu." }, { status: 500 });
  }
}