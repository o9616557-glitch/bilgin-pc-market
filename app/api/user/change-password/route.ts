import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // İçerideki müşterinin kimliğini anlamak için
import bcrypt from "bcrypt"; // Şifreyi kırılmaz çelik kasaya çevirmek için
import mongoose from "mongoose";
import User from "@/models/User"; // Senin yazdığın Müşteri Defteri şablonu!

export async function POST(req: Request) {
  try {
    // 1. KİMLİK KONTROLÜ (Dükkandaki müşteri sisteme giriş yapmış mı?)
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "İzinsiz işlem. Lütfen önce giriş yapınız." }, 
        { status: 401 }
      );
    }

    // 2. VİTRİNDEN GELEN PAKETİ AÇ
    const body = await req.json();
    const { mevcutSifre, yeniSifre } = body;

    // Adam kutuları boş mu yollamış kontrol et
    if (!mevcutSifre || !yeniSifre) {
      return NextResponse.json(
        { message: "Lütfen mevcut ve yeni şifrenizi eksiksiz girin." }, 
        { status: 400 }
      );
    }

    // 3. ARKA DEPOYA (VERİTABANINA) BAĞLAN
    // MongoDB bağlantısı kopuksa yeniden bağla
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 4. MÜŞTERİYİ DEFTERDEN BUL (E-postasına göre)
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı kaydı bulunamadı." }, 
        { status: 404 }
      );
    }

    // 5. ŞİFRE KONTROLÜ (Vitrinden gelen eski şifre ile veritabanındaki şifreyi tokuştur)
    const isMatch = await bcrypt.compare(mevcutSifre, user.password);
    
    if (!isMatch) {
      return NextResponse.json(
        { message: "Mevcut şifrenizi yanlış girdiniz!" }, 
        { status: 400 }
      );
    }

    // 6. HER ŞEY DOĞRUYSA YENİ ŞİFREYİ ŞİFRELE VE KAYDET
    const hashedPassword = await bcrypt.hash(yeniSifre, 10);
    user.password = hashedPassword;
    
    // Müşteri defterini güncelle ve kapat
    await user.save();

    // 7. VİTRİNE "İŞLEM BAŞARILI" (YEŞİL NEON) SİNYALİ GÖNDER
    return NextResponse.json(
      { message: "Şifreniz başarıyla güncellendi!" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Şifre güncelleme motorunda arıza:", error);
    return NextResponse.json(
      { message: "Sunucu hatası. Çırak depoda takıldı, lütfen tekrar deneyin." }, 
      { status: 500 }
    );
  }
}