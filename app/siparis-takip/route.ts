import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { siparisKodu } = await request.json();

    if (!siparisKodu) {
      return NextResponse.json({ error: "Lütfen bir sipariş kodu girin." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Veritabanında (orders tablosunda) bu kodu arıyoruz
    const siparis = await db.collection("orders").findOne({ siparisKodu: siparisKodu.trim() });

    if (!siparis) {
      return NextResponse.json({ error: "Bu koda ait bir sipariş bulunamadı. Lütfen kodu kontrol edin." }, { status: 404 });
    }

    return NextResponse.json({ success: true, siparis });
  } catch (error) {
    console.error("TAKİP API HATASI:", error);
    return NextResponse.json({ error: "Sistem hatası oluştu." }, { status: 500 });
  }
}