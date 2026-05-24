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

    // Kullanıcının siparişlerini bul ve en yeniden en eskiye (createdAt: -1) doğru sırala
    const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

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
    const { items, totalPrice, shippingAddress, paymentMethod } = body;

    // Temel veri kontrolü
    if (!items || items.length === 0 || !totalPrice || !shippingAddress) {
      return NextResponse.json({ message: "Sipariş bilgileri eksik." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Siparişi bağlamak için kullanıcının ObjectId değerini veritabanından alıyoruz
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // Yeni siparişi veritabanına kaydet
    const newOrder = new Order({
      userId: user._id,
      userEmail: session.user.email,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || "Kredi Kartı",
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