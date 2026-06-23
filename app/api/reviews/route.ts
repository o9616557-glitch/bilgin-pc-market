import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GIZLI_ANAHTAR = "Bilgin123";

// 1. GET: Yorumları ve Soruları Çekme
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const gelenAnahtar = request.headers.get("x-patron-anahtar");

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    let sorgu: any = {};

    if (productId) {
      sorgu.productId = String(productId);
    }

    // Eğer istek atan kişi yönetici değilse, sadece onaylanmış ve dondurulmamış yorumları göster
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      sorgu.onaylandi = true;
      sorgu.isVisible = { $ne: false }; // dondurulmuş olanlar (false olanlar) listelenmez
    }

    const veriler = await db.collection("reviews").find(sorgu).sort({ tarih: -1 }).toArray();

    return NextResponse.json({ success: true, data: veriler });
  } catch (error) {
    return NextResponse.json({ error: "Veriler çekilemedi." }, { status: 500 });
  }
}

// 2. POST: Müşteri yorum veya soru gönderdiğinde çalışır
export async function POST(request: Request) {
  try {
    // Giriş yapmış kullanıcının oturumunu alıyoruz
    const session = await getServerSession(authOptions);
    
    const body = await request.json();
    const { productId, type, name, rating, text } = body;

    const yeniVeri = {
      productId: String(productId),
      email: session?.user?.email || null, // Silme ve dondurma eşleşmesi için e-posta kaydediliyor
      type: type || "review", 
      name: name || "Misafir",
      rating: Number(rating) || 5,
      text: text || "",
      answer: null, 
      onaylandi: false, 
      isVisible: true, // Varsayılan olarak görünür ayarlanıyor
      tarih: new Date()
    };

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    await db.collection("reviews").insertOne(yeniVeri);

    return NextResponse.json({ success: true, mesaj: "Başarıyla gönderildi, patron onayı bekliyor!" });
  } catch (error) {
    return NextResponse.json({ error: "Gönderilemedi." }, { status: 500 });
  }
}

// 3. PUT: Onaylama ve Cevap Yazma Motoru
export async function PUT(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const body = await request.json();
    const { id, onaylandi, answer } = body;

    if (!id) return NextResponse.json({ error: "ID eksik" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    const guncellenecekler: any = {};
    if (onaylandi !== undefined) guncellenecekler.onaylandi = onaylandi;
    if (answer !== undefined) guncellenecekler.answer = answer;

    await db.collection("reviews").updateOne(
      { _id: new ObjectId(id) },
      { $set: guncellenecekler }
    );

    return NextResponse.json({ success: true, mesaj: "Başarıyla güncellendi!" });
  } catch (error) {
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

// 4. DELETE: Yorumları Çöpe Atma Motoru
export async function DELETE(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, mesaj: "Başarıyla silindi!" });
  } catch (error) {
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}