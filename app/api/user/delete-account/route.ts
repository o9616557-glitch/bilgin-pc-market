import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Oturum bulunamadı." }, { status: 401 });
    }

    const email = session.user.email;

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const db = mongoose.connection.db;

    // 1. DESTEK TALEPLERİNİ (ÇÖPLERİ) YAK
    await db!.collection("tickets").deleteMany({ email: email });

    // 2. YORUMLARI KAZI
    await db!.collection("reviews").deleteMany({ email: email });

    // 🚀 3. YENİ EKLENEN KISIM: CÜZDAN VE KARTLARI KÖKTEN YOK ET! (Tam Güvenlik)
    // Adamın sistemde kayıtlı olan bakiyesi, puanları ve kredi kartı bilgileri acımadan silinir.
    // (Eğer veritabanında bu tabloların ismi farklıysa buradaki "wallets" veya "cards" ismini kendine göre düzeltirsin şefim)
    await db!.collection("wallets").deleteMany({ email: email });
    await db!.collection("cards").deleteMany({ email: email });
    await db!.collection("savedCards").deleteMany({ email: email }); // Alternatif kart tablosu ismi ihtimaline karşı

    // 🛡️ 4. SİPARİŞ KORUMA KALKANI (MUHASEBE İÇİN)
    // "orders" tablosuna dokunulmaz. Kasamız ve gelir/gider tablomuz sağlam kalır.

    // 5. KULLANICIYI ATOMİZE ET!
    // Her şeyi temizledikten sonra adamın ana giriş kaydını (User) tamamen uçuruyoruz.
    await db!.collection("users").deleteOne({ email: email });

    return NextResponse.json({ 
      message: "Hesabınız, cüzdan ve kart bilgilerinizle birlikte tamamen silindi. (Ticari işlemleriniz yasa gereği muhasebe kayıtlarında korunmaktadır)" 
    }, { status: 200 });

  } catch (error) {
    console.error("Tam Kapsamlı Silme Hatası:", error);
    return NextResponse.json({ message: "Hesap silinirken bir hata oluştu." }, { status: 500 });
  }
}