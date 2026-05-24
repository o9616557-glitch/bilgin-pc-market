import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
// NOT: Kendi klasör yapına göre authOptions yolunu düzeltmen gerekebilir
import { authOptions } from "../auth/[...nextauth]/route";

// =================================================================
// 1. SİPARİŞLERİ EKRANA GETİRME MOTORU (SİYAH EKRAN KORUMALI)
// =================================================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 

    const userEmail = session.user.email;

    // Bütün mailleri ve bütün odaları tarayan radar
    const rawOrders = await db.collection("orders").find({
      $or: [
        { userEmail: userEmail },
        { email: userEmail },
        { "customerDetails.email": userEmail },
        { "musteri.eposta": userEmail }
      ]
    }).sort({ _id: -1 }).toArray();

    // 🚀 NÜKLEER KORUMA: Vitrin sayfası (Siyah Ekran) çökmesin diye eski Türkçe kelimeleri standartlaştırıyoruz!
    const safeOrders = rawOrders.map((order) => ({
      ...order,
      _id: order._id.toString(), // MongoDB ID'sini stringe çevirir (Çökmeyi önler)
      items: order.items || order.sepet || order.cartItems || [], // Hayat kurtaran satır: Sepeti Items yapar!
      totalPrice: order.totalPrice || order.toplamTutar || order.genelToplam || 0,
      createdAt: order.createdAt || order.tarih || new Date().toISOString(),
      shippingAddress: order.shippingAddress || order.musteri || order.customerDetails || {}
    }));

    return NextResponse.json({ orders: safeOrders }, { status: 200 });
  } catch (error) {
    console.error("Siparişler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// =================================================================
// 2. YENİ SİPARİŞ OLUŞTURMA MOTORU (ŞEFİN ORİJİNAL KODU - GERİ GELDİ!)
// =================================================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    const body = await req.json();
    
    // ŞEFİM: ESNEK YAKALAMA
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

    // Yeni siparişi veritabanına kaydet
    const newOrder = new Order({
      userId: user._id,
      userEmail: session.user.email,
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