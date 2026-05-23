import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ŞEFİM: Senin kilitli patron anahtarın
const GIZLI_ANAHTAR = "Bilgin123";

// 1. GET: Yorumları ve Soruları Çekme (Müşteri onaylıları görür, sen hepsini görürsün)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const gelenAnahtar = request.headers.get("x-patron-anahtar");

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    let sorgu: any = {};

    // Hangi ürüne girildiyse sadece onun yorumlarını getir
    if (productId) {
      sorgu.productId = String(productId);
    }

    // ŞEFİM BURASI ÇOK ÖNEMLİ: Eğer sen (Patron) bakmıyorsan, sadece ONAYLANMIŞ olanları göster!
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      sorgu.onaylandi = true;
    }

    // Tarihe göre en yeniler en üstte gelsin
    const veriler = await db.collection("reviews").find(sorgu).sort({ tarih: -1 }).toArray();

    return NextResponse.json({ success: true, data: veriler });
  } catch (error) {
    return NextResponse.json({ error: "Veriler çekilemedi." }, { status: 500 });
  }
}

// 2. POST: Müşteri yorum veya soru gönderdiğinde çalışır (Onay bekler)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, type, name, rating, text } = body;

    // Müşterinin gönderdiği veri onaylanmamış (false) olarak pakete konuyor!
    const yeniVeri = {
      productId: String(productId),
      type: type || "review", // "review" (Yorum) veya "question" (Soru)
      name: name || "Misafir",
      rating: Number(rating) || 5,
      text: text || "",
      answer: null, // Sorular için mağaza cevabı
      onaylandi: false, // İŞTE KRİTİK NOKTA! Patron onaylayana kadar gizli!
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

// 3. PUT: Patronun Onaylama ve Cevap Yazma Motoru
export async function PUT(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi! Patron değilsin." }, { status: 401 });
    }

    const body = await request.json();
    const { id, onaylandi, answer } = body;

    if (!id) return NextResponse.json({ error: "ID eksik" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Ne güncellenecekse onu ayarla (Sadece onay mı veriliyor, yoksa soruya cevap mı yazılıyor?)
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

// 4. DELETE: Patronun Küfürlü/Sahte Yorumları Çöpe Atma Motoru
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