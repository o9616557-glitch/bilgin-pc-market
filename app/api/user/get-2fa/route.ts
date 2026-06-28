import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

// 🚀 ŞEFİM BUNU EKLİYORUZ Kİ SİSTEM ÖNBELLEĞE ALIP BİZİ KANDIRMASIN (Sürekli güncel kalsın)
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem." }, { status: 401 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Eski duplikat kayıtları temizle: aynı userAgent'tan birden fazla aktif kayıt varsa
    // sadece en son kullanılanı aktif bırak, diğerlerini kapat
    const aktifKayitlar: any[] = user.activeDevices.filter((d: any) => d.isActive === true);
    if (aktifKayitlar.length > 0) {
      const gorulmisUA = new Map<string, any>(); // userAgent → en son kayıt
      for (const kayit of aktifKayitlar) {
        const ua = kayit.deviceInfo || "";
        const mevcut = gorulmisUA.get(ua);
        if (!mevcut || new Date(kayit.lastActive) > new Date(mevcut.lastActive)) {
          gorulmisUA.set(ua, kayit);
        }
      }
      // Aynı UA'dan birden fazla aktif varsa eskilerini kapat
      let degisiklikVar = false;
      for (const kayit of aktifKayitlar) {
        const ua = kayit.deviceInfo || "";
        const enYeni = gorulmisUA.get(ua);
        if (enYeni && kayit.deviceId !== enYeni.deviceId) {
          kayit.isActive = false;
          degisiklikVar = true;
        }
      }
      if (degisiklikVar) await user.save();
    }

    return NextResponse.json({
      twoFactorEmail: user.twoFactorEmail || false,
      twoFactorSms: user.twoFactorSms || false,
      activeDevices: user.activeDevices || [],
      notificationPreference: user.notificationPreference || 'new_device',
      hasPassword: !!user.password,
    }, { status: 200 });

  } catch (error) {
    console.error("GET 2FA Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}