import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem. Lütfen önce giriş yapınız." }, { status: 401 });
    }

    const body = await req.json();
    const { mevcutSifre, yeniSifre } = body;

    if (!mevcutSifre || !yeniSifre) {
      return NextResponse.json({ message: "Lütfen mevcut ve yeni şifrenizi eksiksiz girin." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı kaydı bulunamadı." }, { status: 404 });
    }

    // 1. MEVCUT ŞİFRE DOĞRU MU?
    const isMatch = await bcrypt.compare(mevcutSifre, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Mevcut şifrenizi yanlış girdiniz!" }, { status: 400 });
    }

    // 2. YENİ ŞİFRE ŞU ANKİ ŞİFREYLE AYNI MI?
    const isSameAsOld = await bcrypt.compare(yeniSifre, user.password);
    if (isSameAsOld) {
      return NextResponse.json(
        { message: "Yeni şifreniz mevcut şifrenizle aynı olamaz." }, 
        { status: 400 }
      );
    }

    // 3. 🚀 YENİ ŞİFRE SON 2 ESKİ ŞİFREYLE AYNI MI?
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const eskiSifreHash of user.passwordHistory) {
        const isUsedBefore = await bcrypt.compare(yeniSifre, eskiSifreHash);
        if (isUsedBefore) {
          return NextResponse.json(
            { message: "Bu şifreyi yakın zamanda kullandınız! Lütfen son 3 şifrenizden farklı bir şifre belirleyin." }, 
            { status: 400 }
          );
        }
      }
    }

    // 4. HER ŞEY TEMİZ! YENİ ŞİFREYİ ONAYLA VE GEÇMİŞİ DÜZENLE
    const hashedPassword = await bcrypt.hash(yeniSifre, 10);
    
    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }
    
    // Şu anki şifreyi eski şifreler rafına kaldır
    user.passwordHistory.push(user.password); 

    // 🚀 İŞTE SENİN KURAL BURASI: Rafta 2'den fazla eski şifre birikirse, en eskisini çöpe at!
    // Böylece müşteri 3 tur sonra o eski şifreyi tekrar kullanabilir.
    if (user.passwordHistory.length > 2) {
      user.passwordHistory.shift(); 
    }

    // Yeni şifreyi ana çelik kasaya koy
    user.password = hashedPassword;
    
    await user.save();

    return NextResponse.json({ message: "Şifreniz başarıyla güncellendi!" }, { status: 200 });

  } catch (error) {
    console.error("Şifre güncelleme motorunda arıza:", error);
    return NextResponse.json({ message: "Sunucu hatası. Lütfen tekrar deneyin." }, { status: 500 });
  }
}