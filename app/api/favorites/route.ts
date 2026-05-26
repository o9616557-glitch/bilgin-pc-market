import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User"; // Kendi model yoluna göre kontrol et
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Kendi authOptions yoluna göre kontrol et

// 1. Kullanıcının Favori Listesini Getir (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    
    // 🚀 SİHİRLİ DOKUNUŞ 1: Kullanıcı DB'de yoksa (Google ile yeni girdiyse) hata verme, boş favori listesi dön.
    if (!user) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    return NextResponse.json({ favorites: user.favorites || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Favoriler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// 2. Favorilere Ürün Ekle veya Çıkar (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Ürün ID'si gerekli." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    let user = await User.findOne({ email: session.user.email });
    
    // 🚀 SİHİRLİ DOKUNUŞ 2: Kullanıcı DB'de yoksa (Google kullanıcısıysa), onu anında veritabanına kaydet!
    if (!user) {
      user = new User({
        email: session.user.email,
        name: session.user.name || "Google Kullanıcısı",
        favorites: []
      });
      // Veritabanına bu yeni adamı ekledik!
    }

    // Eğer ürün zaten favorilerde varsa listeden çıkar, yoksa ekle (Toggle mantığı - KORUNDU)
    const favoriteIndex = user.favorites.indexOf(productId);
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1); // Listeden sil
    } else {
      user.favorites.push(productId); // Listeye ekle
    }

    await user.save();

    return NextResponse.json({
      message: favoriteIndex > -1 ? "Ürün favorilerden çıkarıldı." : "Ürün favorilere eklendi.",
      favorites: user.favorites
    }, { status: 200 });

  } catch (error: any) {
    console.error("Favori Güncellenirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}