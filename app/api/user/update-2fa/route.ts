import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User from "@/models/User"; // Müşteri defterimiz

export async function POST(req: Request) {
  try {
    // 1. KİMLİK KONTROLÜ
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem. Lütfen giriş yapınız." }, { status: 401 });
    }

    // 2. VİTRİNDEN GELEN ŞALTER DURUMLARINI (Açık/Kapalı) AL
    const body = await req.json();
    const { twoFactorEmail, twoFactorSms } = body;

    // 3. VERİTABANINA BAĞLAN
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 4. MÜŞTERİYİ BUL
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // 5. ŞALTER AYARLARINI DEFTERE YAZ VE KAYDET
    user.twoFactorEmail = twoFactorEmail;
    user.twoFactorSms = twoFactorSms;
    await user.save();

    // 6. VİTRİNE "İŞLEM BAŞARILI" SİNYALİ GÖNDER
    return NextResponse.json({ message: "Güvenlik ayarlarınız başarıyla kaydedildi!" }, { status: 200 });

  } catch (error) {
    console.error("2FA güncelleme motorunda arıza:", error);
    return NextResponse.json({ message: "Sunucu hatası. Çırak takıldı." }, { status: 500 });
  }
}