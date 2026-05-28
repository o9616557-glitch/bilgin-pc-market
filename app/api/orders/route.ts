import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// =================================================================
// 1. SİPARİŞLERİ EKRANA GETİRME MOTORU
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

    const safeOrders = rawOrders.map((order) => {
      const rawItems = order.items || order.sepet || order.cartItems || [];
      const safeItems = rawItems.map((item: any) => ({
        ...item,
        title: item.title || item.isim || item.name || "Ürün",
        quantity: item.quantity || item.adet || item.miktar || 1,
        price: Number(item.price || item.fiyat || 0),
        image: item.image || item.resim || "https://app.bilginpcmarket.com/placeholder.png"
      }));

      // 🚀 NÜKLEER TARAYICI: Admin paneli nereye yazarsa yazsın kaybetmemek için tüm durum kelimelerini birleştiriyoruz!
      const butunDurumlar = `${order.durum || ""} ${order.status || ""} ${order.paymentMethod || ""}`;

      return {
        ...order,
        _id: order._id.toString(),
        items: safeItems,
        totalPrice: Number(order.totalPrice || order.toplamTutar || order.genelToplam || 0),
        createdAt: order.createdAt || order.tarih || new Date().toISOString(),
        shippingAddress: order.shippingAddress || order.musteri || order.customerDetails || {},
        // 🚀 Trenin (Vagonun) okuması için bu kelime deposunu yolluyoruz
        searchableStatus: butunDurumlar,
        status: order.status || order.durum || "Hazırlanıyor"
      };
    });

    return NextResponse.json({ orders: safeOrders }, { status: 200 });
  } catch (error) {
    console.error("Siparişler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// =================================================================
// 2. YENİ SİPARİŞ OLUŞTURMA MOTORU
// =================================================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });
    const body = await req.json();
    const items = body.items || body.cartItems || [];
    const totalPrice = body.totalPrice || body.genelToplam || 0;
    const addressData = body.shippingAddress || body.musteri || body.customerDetails || {};
    const paymentMethod = body.paymentMethod || "Havale / EFT";

    if (items.length === 0 || !totalPrice) return NextResponse.json({ message: "Eksik veri." }, { status: 400 });
    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: "Kullanıcı yok." }, { status: 404 });

    const defaultStatus = "Hazırlanıyor";
    const newOrder = new Order({
      userId: user._id, userEmail: session.user.email, items, totalPrice, shippingAddress: addressData,
      paymentMethod: paymentMethod, status: defaultStatus, durum: defaultStatus
    });

    await newOrder.save();
    return NextResponse.json({ message: "Siparişiniz başarıyla oluşturuldu.", order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// =================================================================
// 3. SİPARİŞ SİLME MOTORU
// =================================================================
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    if (!orderId) return NextResponse.json({ message: "ID eksik." }, { status: 400 });
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    await db.collection("orders").deleteOne({ _id: new ObjectId(orderId) });
    return NextResponse.json({ message: "Silindi." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Hata." }, { status: 500 });
  }
}