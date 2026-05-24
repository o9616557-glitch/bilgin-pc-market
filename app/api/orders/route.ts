import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
// NOT: Kendi klasör yapına göre authOptions yolunu düzeltmen gerekebilir
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    // 🚀 NÜKLEER SİHİR: Mongoose'u atlayıp DİREKT Sipariş Takip sayfasının baktığı odaya giriyoruz!
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 

    const userEmail = session.user.email;

    // 🚀 Bütün mailleri ve bütün odaları tarayan radar (Native Driver)
    const orders = await db.collection("orders").find({
      $or: [
        { userEmail: userEmail },
        { email: userEmail },
        { "customerDetails.email": userEmail },
        { "musteri.eposta": userEmail }
      ]
    }).sort({ _id: -1 }).toArray(); // En yeniden eskiye doğru sırala

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Siparişler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}