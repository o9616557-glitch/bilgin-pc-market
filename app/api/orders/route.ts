import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
// NOT: Kendi klasör yapına göre authOptions yolunu düzeltmen gerekebilir
import { authOptions } from "../auth/[...nextauth]/route";

// =================================================================
// 1. SİPARİŞLERİ EKRANA GETİRME MOTORU (İÇİ DIŞI FULL KORUMALI)
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

    const rawOrders = await db.collection("orders").find({
      $or: [
        { userEmail: userEmail },
        { email: userEmail },
        { "customerDetails.email": userEmail },
        { "musteri.eposta": userEmail }
      ]
    }).sort({ _id: -1 }).toArray();

    // 🚀 NÜKLEER KORUMA SEVİYE 2: Sepetin İÇİNDEKİ kelimeleri de İngilizce'ye (Vitrin diline) çeviriyoruz!
    const safeOrders = rawOrders.map((order) => {
      const rawItems = order.items || order.sepet || order.cartItems || [];
      
      const safeItems = rawItems.map((item: any) => ({
        ...item,
        title: item.title || item.isim || item.name || "Ürün", // isim -> title
        quantity: item.quantity || item.adet || item.miktar || 1, // adet -> quantity
        price: Number(item.price || item.fiyat || 0), // fiyat -> price
        image: item.image || item.resim || "https://app.bilginpcmarket.com/placeholder.png" // Görsel yoksa boş kalmasın
      }));

      return {
        ...order,
        _id: order._id.toString(),
        items: safeItems,
        totalPrice: Number(order.totalPrice || order.toplamTutar || order.genelToplam || 0),
        createdAt: order.createdAt || order.tarih || new Date().toISOString(),
        shippingAddress: order.shippingAddress || order.musteri || order.customerDetails || {},
        status: order.status || order.durum || "Hazırlanıyor" // durum -> status
      };
    });

    return NextResponse.json({ orders: safeOrders }, { status: 200 });
  } catch (error) {
    console.error("Siparişler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// =================================================================
// 2. YENİ SİPARİŞ OLUŞTURMA MOTORU (ŞEFİN ORİJİNAL KODU)
// =================================================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    const body = await req.json();
    
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