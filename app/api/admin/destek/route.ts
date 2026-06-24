import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Kendi nextauth yoluna göre ayarla şefim
import mongoose from "mongoose";
import Destek from "@/models/Destek"; // Az önce oluşturduğumuz modelin yolu

// 🚀 RASTGELE JİLET GİBİ TALEP NUMARASI ÜRETEN MOTOR (Örn: DST-583921)
function talepNoUret() {
  const rastgele = Math.floor(100000 + Math.random() * 900000);
  return `DST-${rastgele}`;
}

// ⬇️ 1. GET METODU: Giriş yapan kullanıcının kendi taleplerini veritabanından çeker
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 🔒 GÜVENLİK KALKANI: Giriş yapılmadıysa veriyi koklatmıyoruz
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    }

    // Veritabanı bağlantı kontrolü
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Müşterinin e-postasına göre açtığı tüm talepleri tarihe göre en yeni üstte olacak şekilde çekiyoruz
    const talepler = await Destek.find({ kullaniciEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, talepler });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Talepler çekilirken hata oluştu." }, { status: 500 });
  }
}

// ⬇️ 2. POST METODU: Müşteri formdan "Gönder" dediğinde yeni talep oluşturur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await request.json();
    const { konu, mesaj } = body;

    if (!konu || !mesaj) {
      return NextResponse.json({ success: false, message: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Çakışma ihtimaline karşı benzersiz bir talep numarası üretene kadar dönen döngü
    let benzersizTalepNo = talepNoUret();
    let varMi = await Destek.findOne({ talepNo: benzersizTalepNo });
    while (varMi) {
      benzersizTalepNo = talepNoUret();
      varMi = await Destek.findOne({ talepNo: benzersizTalepNo });
    }

    // Yeni destek dokümanını hazırlayıp ilk mesajı içeri atıyoruz
    const yeniTalep = new Destek({
      talepNo: benzersizTalepNo,
      kullaniciEmail: session.user.email,
      konu: konu,
      durum: "İnceleniyor",
      mesajlar: [
        {
          gonderen: "Musteri",
          metin: mesaj
        }
      ]
    });

    await yeniTalep.save();

    return NextResponse.json({ 
      success: true, 
      message: "Talebiniz başarıyla oluşturuldu.",
      talep: yeniTalep
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Talep oluşturulurken bir hata meydana geldi." }, { status: 500 });
  }
}

// ⬇️ 3. PUT METODU: Müşterinin Admin'e (Sana) cevap yazmasını sağlar 🚀
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await request.json();
    const { talepId, mesaj } = body;

    if (!talepId || !mesaj) {
      return NextResponse.json({ success: false, message: "Boş mesaj gönderilemez." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 🔒 Sadece KENDİ talebine cevap yazabilsin diye e-posta kontrolü yapıyoruz (Başkası hackleyemesin)
    const guncelTalep = await Destek.findOneAndUpdate(
      { _id: talepId, kullaniciEmail: session.user.email },
      { 
        // Mesajı listeye ekle (Gönderen: Musteri)
        $push: { mesajlar: { gonderen: "Musteri", metin: mesaj, tarih: new Date() } },
        // Müşteri cevap yazınca Admin panelinde "İnceleniyor" olarak görünsün ki senin haberin olsun
        $set: { durum: "İnceleniyor" } 
      },
      { new: true }
    ).lean();

    if (!guncelTalep) {
      return NextResponse.json({ success: false, message: "Talep bulunamadı veya yetkiniz yok." }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Cevabınız iletildi.",
      talep: guncelTalep
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Cevap gönderilirken hata oluştu." }, { status: 500 });
  }
}