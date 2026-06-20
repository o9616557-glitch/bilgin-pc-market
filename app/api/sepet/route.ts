import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. KULLANICININ VERİTABANINDAKİ SEPETİNİ ÇEKME (TELEFONDAN GİRİNCE)
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // NOT: /api/favorites içinde giriş yapan kullanıcıyı nasıl buluyorsan 
    // (Örn: session, cookie veya token), o mekanizmayı buraya koyuyoruz.
    // Şimdilik standart bir session/user kontrolü olduğunu varsayalım.
    const session = request.headers.get("x-user-id"); // Veya senin mevcut auth sistemin
    
    // Şefim burası senin favorilerdeki gibi kullanıcıyı yakaladığın yer olacak.
    // Eğer kullanıcı giriş yapmadıysa boş döner.
    if (!session) {
      return NextResponse.json({ success: false, message: "Giriş yapılmadı" }, { status: 401 });
    }

    const userCart = await db.collection("carts").findOne({ userId: session });
    
    return NextResponse.json({ 
      success: true, 
      cart: userCart ? userCart.items : [] 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sepet çekilemedi" }, { status: 500 });
  }
}

// 2. SEPET DEĞİŞTİKÇE VERİTABANINA ANINDA KAYDETME (BULUT YEDEKLEME)
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const { items, userId } = await request.json(); // Sepetteki ürünler ve kullanıcı id'si

    if (!userId) {
      return NextResponse.json({ success: false, message: "Giriş yapılmadı" }, { status: 401 });
    }

    // Kullanıcının sepeti varsa güncelle, yoksa yeni sepet kaydı aç (upsert)
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