import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb'; 
import MenuAyar from '@/models/MenuAyar';

// 🟢 GET: Sayfa açıldığında kullanıcının daha önce kaydettiği menüyü çeker
export async function GET(req: Request) {
  try {
    await connectMongoDB; // ŞEFİM DİKKAT: Sondaki () parantezleri sildik!
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    const ayar = await MenuAyar.findOne({ kullaniciEmail: email });
    return NextResponse.json({ success: true, data: ayar });
  } catch (error) {
    console.error("Menü çekme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}

// 🔴 POST: Kullanıcı "KAYDET BİTİR"e bastığında yeni menüyü kaydeder
export async function POST(req: Request) {
  try {
    await connectMongoDB; // ŞEFİM DİKKAT: Buradaki () parantezleri de sildik!
    const body = await req.json();
    const { kullaniciEmail, menuListesi } = body;

    if (!kullaniciEmail) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    // Kullanıcıyı bul ve menüsünü güncelle
    const guncelAyar = await MenuAyar.findOneAndUpdate(
      { kullaniciEmail: kullaniciEmail },
      { menuListesi: menuListesi },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: guncelAyar });
  } catch (error) {
    console.error("Menü kaydetme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}