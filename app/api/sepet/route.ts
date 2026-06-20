import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// 🚀 DİKKAT: authOptions yolunu favoriler dosyasındaki gibi kendi projene göre kontrol et
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. BULUTTAN SADECE KİŞİYE ÖZEL SEPETİ ÇEKME
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Adam giriş yapmadıysa 401 döner, ön yüzdeki motor bunu görünce sessizce lokalde çalışmaya devam eder
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Giriş yapılmadı" }, { status: 401 });
    }

    // 🚀 BİNGO: Herkesin sepeti kendi e-posta adresine özel kilitlendi!
    const userId = session.user.email; 

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const userCart = await db.collection("carts").findOne({ userId: userId });
    
    return NextResponse.json({ 
      success: true, 
      cart: userCart ? userCart.items : [] 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sepet çekilemedi" }, { status: 500 });
  }
}

// 2. BULUTA SADECE KİŞİYE ÖZEL YEDEKLEME
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Misafirse buluta atma, lokalde bırak
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Giriş yapılmadı" }, { status: 401 });
    }

    // 🚀 BİNGO: Sepet sadece bu e-posta adresinin kasasına kaydedilir
    const userId = session.user.email; 
    const { items } = await request.json(); 

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    await db.collection("carts").updateOne(
      { userId: userId },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Sepet buluta yedeklendi." });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sepet yedeklenemedi" }, { status: 500 });
  }
}