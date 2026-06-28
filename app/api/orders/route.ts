import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 🚀 VERCEL ÖNBELLEK KİLİDİNİ PARÇALAMA EMİRLERİ
export const dynamic = "force-dynamic";
export const revalidate = 0;

// =================================================================
// 1. SİPARİŞLERİ EKRANA GETİRME MOTORU (ŞEFİN DEV AĞI 🎯)
// =================================================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    const currentEmail = session.user.email;

    // 🚀 BİNGO: ŞEFİN ÇANTASINDAKİ TÜM E-POSTALARI ÇEKİYORUZ!
    const dbUser = await User.findOne({ email: currentEmail }).select("kayitliEpostalar");
    
    // Eğer çantada başka mailler varsa hepsini al, yoksa sadece mevcut olanı bir dizi yap.
    let aranacakMailler = [currentEmail]; 
    if (dbUser && dbUser.kayitliEpostalar && dbUser.kayitliEpostalar.length > 0) {
      // Mevcut mail de çantada değilse diye garantiye alıp hepsini birleştiriyoruz
      aranacakMailler = [...new Set([...dbUser.kayitliEpostalar, currentEmail])];
    }

    // 🚀 İŞTE HİLE BURADA: Sadece currentEmail'i değil, aranacakMailler dizisindeki ($in) HERHANGİ BİR maili arıyor!
    const rawOrders = await db.collection("orders").find({
      $and: [
        {
          $or: [
            { userEmail: { $in: aranacakMailler } },
            { email: { $in: aranacakMailler } },
            { "customerDetails.email": { $in: aranacakMailler } },
            { "musteri.eposta": { $in: aranacakMailler } }
          ]
        },
        { gizlendi: { $ne: true } } 
      ]
    }).sort({ _id: -1 }).toArray();

    // 🚀 KURYE ARKA ODAYA (PRODUCTS) HIZLI GEÇİŞ YAPIYOR!
    const safeOrders = await Promise.all(rawOrders.map(async (order) => {
      const rawItems = order.items || order.sepet || order.cartItems || [];
      
      const safeItems = await Promise.all(rawItems.map(async (item: any) => {
        let zimbaliKategori = ""; 
        
        try {
          // Kurye barkodu alıyor
          const queryId = item._id || item.id || item.productId;
          if (queryId) {
            const isObjId = typeof queryId === "string" && queryId.length === 24;
            const filter = isObjId ? { _id: new ObjectId(queryId) } : { id: queryId };
            
            // Depoya koşup asıl ürünü buluyor
            const gercekUrun = await db.collection("products").findOne(filter);
            if (gercekUrun) {
              // Bulduğu asıl kategori etiketini (slug) cebe atıyor
              zimbaliKategori = gercekUrun.kategoriSlug || gercekUrun.kategori || gercekUrun.slug || "";
            }
          }
        } catch (e) {
           // Depoda hata olursa çaktırmadan devam et
        }

        return {
          ...item,
          // 🧠 MÜKEMMEL DOKUNUŞ: Depodan bulduğu etiketi fişe basıyor!
          kategoriSlug: zimbaliKategori || item.kategoriSlug || item.kategori || "",
          title: item.title || item.isim || item.name || "Ürün",
          quantity: item.quantity || item.adet || item.miktar || 1,
          price: Number(item.price || item.fiyat || 0),
          image: item.image || item.resim || "https://app.bilginpcmarket.com/placeholder.png"
        };
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
    }));

    return NextResponse.json({ orders: safeOrders }, { status: 200 });
  } catch (error) {
    console.error("Siparişler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// =================================================================
// 2. YENİ SİPARİŞ OLUŞTURMA MOTORU (ŞALTERLİ MAİLE KESİYOR 🎯)
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

    // 🚀 BİNGO: ŞEFİN ŞALTERİ AÇIK OLAN MAİLİNİ KULLAN (Yoksa anamaile at)
    const faturaEpostasi = user.aktifEposta || user.email;

    const defaultStatus = "Hazırlanıyor";
    const newOrder = new Order({
      userId: user._id, 
      userEmail: faturaEpostasi, // 🎯 Şalterdeki maile kesti faturayı!
      items, 
      totalPrice, 
      shippingAddress: addressData,
      paymentMethod: paymentMethod, 
      status: defaultStatus, 
      durum: defaultStatus
    });

    await newOrder.save();
    return NextResponse.json({ message: "Siparişiniz başarıyla oluşturuldu.", order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// =================================================================
// 3. SİPARİŞ SİLME MOTORU (ORİJİNAL)
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
    
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { gizlendi: true } }
    );
    
    return NextResponse.json({ message: "Silindi." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Hata." }, { status: 500 });
  }
}