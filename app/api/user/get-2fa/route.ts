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

// 🚀 VİTRİNE GİDEN EKSİKSİZ PAKET (ŞEFİN YENİ ÇANTASIYLA BİRLİKTE)
    return NextResponse.json({
      twoFactorEmail: user.twoFactorEmail || false,
      twoFactorSms: user.twoFactorSms || false,
      activeDevices: user.activeDevices || [],
      notificationPreference: user.notificationPreference || 'new_device',
      
      // 👇 İŞTE SİSTEMİ ŞAHLANDIRAN O EKSİK PARÇA 👇
      kayitliEpostalar: user.kayitliEpostalar || [],
      aktifEposta: user.aktifEposta || user.email || ""
    }, { status: 200 });

  } catch (error) {
    console.error("GET 2FA Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}