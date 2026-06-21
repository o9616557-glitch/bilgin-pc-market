import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User"; 
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; 
import { revalidatePath } from "next/cache"; 

export const dynamic = "force-dynamic";

// 1. Kullanıcının Favori Listesini Tam Detaylarıyla Getir (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 1. Önce kullanıcının favori ID listesini alıyoruz
    const user = await User.findOne({ email: session.user.email }).lean();
    const favoriteIds = user?.favorites || [];

    if (favoriteIds.length === 0) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    // 2. 🚀 JİLET GİBİ SÜZGEÇ: Sadece veritabanında hala VAR OLAN (silinmemiş) ürünleri çekiyoruz
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    const objectIdArray = favoriteIds.map((id: string) => {
      try { return new mongoose.Types.ObjectId(id); } catch(e) { return id; }
    });

    const rawUrunler = await db.collection("products").find({
      $or: [
        { _id: { $in: objectIdArray } },
        { id: { $in: favoriteIds } }
      ]
    }).toArray();

    const matchedProducts = rawUrunler.map(urun => ({
      ...urun,
      _id: urun._id.toString()
    }));

    // Sadece dükkanda gerçekten var olan sağlam ürünleri döndürüyoruz!
    return NextResponse.json({ favorites: matchedProducts }, { status: 200 });
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
    
    if (!user) {
      user = new User({
        email: session.user.email,
        name: session.user.name || "Google Kullanıcısı",
        password: "google_" + Math.random().toString(36).slice(-8), 
        favorites: []
      });
    }

    const favoriteIndex = user.favorites.indexOf(productId);
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1); 
    } else {
      user.favorites.push(productId); 
    }

    await user.save();

    revalidatePath("/favorilerim");

    return NextResponse.json({
      message: favoriteIndex > -1 ? "Ürün favorilerden çıkarıldı." : "Ürün favorilere eklendi.",
      favorites: user.favorites
    }, { status: 200 });

  } catch (error: any) {
    console.error("Favori Güncellenirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}