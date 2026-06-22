import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action"); // 'approve' veya 'reject'

    if (!token || !action) {
      return NextResponse.json({ message: "Geçersiz bağlantı." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Token'a sahip ve süresi dolmamış kullanıcıyı bul
    const user = await User.findOne({
      pendingDeviceToken: token,
      pendingDeviceExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=token_expired', req.url));
    }

    if (action === "approve") {
      // 1. Cihazı güvenilir listesine ekle
      if (!user.trustedDevices.includes(user.pendingDeviceInfo.cihaz)) {
        user.trustedDevices.push(user.pendingDeviceInfo.cihaz);
      }
      
      // 2. Bekleyen onay verilerini temizle
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      
      await user.save();

      // Onay başarılı, kullanıcıyı giriş sayfasına yönlendir
      return NextResponse.redirect(new URL('/login?message=device_approved', req.url));
    } 
    
    else if (action === "reject") {
      // 1. Şüpheli durum tespit edildi: Tüm aktif cihazlardan çıkış yap (Oturumları sonlandır)
      user.activeDevices = [];
      
      // 2. Bekleyen verileri temizle
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;

      await user.save();

      // Kullanıcıyı şifre sıfırlama veya güvenlik uyarı sayfasına yönlendir
      return NextResponse.redirect(new URL('/sifre-sifirla?alert=security_breach', req.url));
    }

  } catch (error) {
    console.error("Cihaz Onay İşlemi Hatası:", error);
    return NextResponse.json({ message: "Sistem hatası oluştu." }, { status: 500 });
  }
}