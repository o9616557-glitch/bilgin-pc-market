import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import mongoose from "mongoose";
import Destek from "@/models/Destek";

function talepNoUret() {
  return `DST-${Math.floor(100000 + Math.random() * 900000)}`;
}

// ⬇️ 1. GET METODU (Müşterinin sadece gizlemediği talepleri getirir)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    
    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);
    
    // BİNGO: musteriGizledi değeri true OLMAYANLARI getir. (Yani sildiklerini getirme)
    const talepler = await Destek.find({ 
      kullaniciEmail: session.user.email,
      musteriGizledi: { $ne: true } 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, talepler });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ⬇️ 2. POST METODU (Yeni Talep)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    
    const body = await request.json();
    const { konu, mesaj } = body;
    if (!konu || !mesaj) return NextResponse.json({ success: false, message: "Eksik bilgi." }, { status: 400 });

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    let benzersizTalepNo = talepNoUret();
    let varMi = await Destek.findOne({ talepNo: benzersizTalepNo });
    while (varMi) {
      benzersizTalepNo = talepNoUret();
      varMi = await Destek.findOne({ talepNo: benzersizTalepNo });
    }

    const yeniTalep = new Destek({
      talepNo: benzersizTalepNo,
      kullaniciEmail: session.user.email,
      konu: konu,
      durum: "İnceleniyor",
      mesajlar: [{ gonderen: "Musteri", metin: mesaj }]
    });

    await yeniTalep.save();
    return NextResponse.json({ success: true, message: "Oluşturuldu.", talep: yeniTalep });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ⬇️ 3. PUT METODU (Müşteri Cevap Yazar)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });

    const body = await request.json();
    const { talepId, mesaj } = body;
    if (!talepId || !mesaj) return NextResponse.json({ success: false, message: "Eksik bilgi." }, { status: 400 });

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    const guncelTalep = await Destek.findOneAndUpdate(
      { _id: talepId, kullaniciEmail: session.user.email },
      { 
        $push: { mesajlar: { gonderen: "Musteri", metin: mesaj, tarih: new Date() } },
        $set: { durum: "İnceleniyor" } 
      },
      { new: true }
    );

    if (!guncelTalep) return NextResponse.json({ success: false, message: "Talep bulunamadı." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Cevabınız iletildi.", talep: guncelTalep });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ⬇️ 4. DELETE METODU (Sanal Silme / Arşivleme) 🚀
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    // BİNGO: "findOneAndDelete" yerine "findOneAndUpdate" kullanıyoruz.
    // Veriyi silmiyoruz, içine { musteriGizledi: true } damgası vuruyoruz.
    if (id) {
      await Destek.findOneAndUpdate(
        { _id: id, kullaniciEmail: session.user.email },
        { $set: { musteriGizledi: true } },
        { new: true, strict: false } // Modelde bu alan olmasa bile zorla kaydeder
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}