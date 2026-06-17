import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 🚀 VERCEL ÖNBELLEK KİLİDİNİ PARÇALAMA EMİRLERİ (Her saniye güncel veri çeker)
export const dynamic = "force-dynamic";
export const revalidate = 0;

// =================================================================
// 1. SİPARİŞLERİ EKRANA GETİRME MOTORU (GİZLENENLERİ GÖSTERMEZ 🎯)
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

    // 🔥 BİNGO 1: Siparişleri çekerken "gizlendi: true OLMAYANLARI" getir diyoruz!
    const rawOrders = await db.collection("orders").find({
      $and: [
        {
          $or: [
            { userEmail: userEmail },
            { email: userEmail },
            { "customerDetails.email": userEmail },
            { "musteri.eposta": userEmail }
          ]
        },
        { gizlendi: { $ne: true } } // Müşterinin sildiği (gizlediği) siparişler ekrana gelmez
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

      // 🚀 AKILLI MÜHÜR MOTORU
      const hamDurumMetni = `${order.durum || ""} ${order.status || ""} ${order.paymentMethod || ""}`.toLowerCase();
      
      let sonDurum = order.durum || order.status || "Hazırlanıyor";
      
      if (hamDurumMetni.includes("iptal") || hamDurumMetni.includes("red") || hamDurumMetni.includes("iade")) {
        sonDurum = "İptal Edildi";
      }

      return {
        ...order,
        _id: order._id.toString(),
        items: safeItems,
        totalPrice: Number(order.totalPrice || order.toplamTutar || order.genelToplam || 0),
        createdAt: order.createdAt || order.tarih || new Date().toISOString(),
        shippingAddress: order.shippingAddress || order.musteri || order.customerDetails || {},
        searchableStatus: hamDurumMetni,
        status: sonDurum, 
        durum: sonDurum
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
// 3. SİPARİŞ SİLME MOTORU (YALANCI SİLME - MONGODB'DE KALIR)
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
    
    // 🔥 BİNGO 2: DeleteOne (yok et) komutunu sildik, yerine UpdateOne (güncelle) koyduk! 
    // Siparişin veritabanındaki kaydına "gizlendi: true" etiketi yapıştırıyoruz.
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { gizlendi: true } }
    );
    
    return NextResponse.json({ message: "Sipariş siteden başarıyla gizlendi." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Hata." }, { status: 500 });
  }
}