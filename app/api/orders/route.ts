import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import { getServerSession } from "next-auth";
// NOT: NextAuth yapılandırma dosyanızın yoluna göre importu düzenlemeyi unutmayın.
import { authOptions } from "../auth/[...nextauth]/route";

// 1. Kullanıcının Geçmiş Siparişlerini Getir (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 🚀 ŞEFİM: SİPARİŞ ARAMA RADARI GÜÇLENDİRİLDİ (İyzico veya Havale fark etmez, tüm mailleri tarar)
    const userEmail = session.user.email;
    const orders = await Order.find({
      $or: [
        { userEmail: userEmail },
        { email: userEmail },
        { "customerDetails.email": userEmail },
        { "musteri.eposta": userEmail }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Siparişler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// 2. Yeni Sipariş Oluştur (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    const body = await req.json();
    
    // 🚀 ŞEFİM: ESNEK YAKALAMA (Frontend 'shippingAddress' veya 'musteri' yollasa da artık çökmez, kabul eder)
    const items = body.items || body.cartItems || [];
    const totalPrice = body.totalPrice || body.genelToplam || 0;
    const addressData = body.shippingAddress || body.musteri || body.customerDetails || {};
    const paymentMethod = body.paymentMethod || "Havale / EFT";

    if (items.length === 0 || !totalPrice) {
      return NextResponse.json({ message: "Sipariş bilgileri eksik (Sepet boş veya tutar yok)." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // 🚀 Havale Siparişine Mührü Bas ve Kaydet
    const newOrder = new Order({
      userId: user._id,
      userEmail: session.user.email, // Mühür
      items,
      totalPrice,
      shippingAddress: addressData,
      paymentMethod: paymentMethod,
      status: "Hazırlanıyor"
    });

    await newOrder.save();

    return NextResponse.json({ 
      message: "Siparişiniz başarıyla oluşturuldu.",
      order: newOrder 
    }, { status: 201 });

  } catch (error) {
    console.error("Sipariş Oluşturulurken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}