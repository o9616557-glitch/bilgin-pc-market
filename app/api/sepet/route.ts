import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
// Eğer NextAuth kullanıyorsan burayı açabilirsin:
// import { getServerSession } from "next-auth"; 
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// 1. BULUTTAN SEPETİ ÇEKME
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // 🚀 HESAP YAKALAMA MOTORU
    // Şefim, /api/favorites/route.ts dosyasında giriş yapan adamın ID'sini nasıl buluyorsan 
    // o kodu buraya yapıştırman lazım. Örnek popüler yöntemler:
    
    // Yöntem A (NextAuth kullanıyorsan):
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;

    // Yöntem B (Custom Token/Cookie kullanıyorsan):
    // const userId = request.headers.get("Authorization") VEYA çerez kontrolü;

    // Şimdilik test etmek için buraya senin kendi kullanıcı ID'ni veya session yöntemini koyalım:
    const userId = "GIRIS_YAPAN_KULLANICI_ID_BURAYA"; // 👈 Burayı favorites'teki gibi bağlamalıyız patron

    if (!userId) {
      return NextResponse.json({ success: false, message: "Giriş yapılmadı" }, { status: 401 });
    }

    const userCart = await db.collection("carts").findOne({ userId: String(userId) });
    
    return NextResponse.json({ 
      success: true, 
      cart: userCart ? userCart.items : [] 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sepet çekilemedi" }, { status: 500 });
  }
}

// 2. BULUTA SEPETİ YEDEKLEME
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const { items } = await request.json(); 

    // 🚀 Aynı şekilde kullanıcıyı burada da yakalıyoruz
    const userId = "GIRIS_YAPAN_KULLANICI_ID_BURAYA"; // 👈 Giriş yapan adamın ID'si

    if (!userId) {
      return NextResponse.json({ success: false, message: "Giriş yapılmadı" }, { status: 401 });
    }

    // Kullanıcının sepetini veritabanında güncelle veya yoksa yarat
    await db.collection("carts").updateOne(
      { userId: String(userId) },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Sepet buluta yedeklendi." });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Sepet yedeklenemedi" }, { status: 500 });
  }
}