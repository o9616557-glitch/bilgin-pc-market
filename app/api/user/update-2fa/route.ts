import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import mongoose from "mongoose";
import User from "@/models/User";

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

    // ==========================================
    // 🚀 1. KURAL: 30 GÜNLÜK OTOMATİK ÇÖP TENEKESİ
    // ==========================================
    const otuzGunOnce = new Date();
    otuzGunOnce.setDate(otuzGunOnce.getDate() - 30);

    // Defterdeki cihazları süzgece koy (Sadece son 30 günde girenleri tut)
    const temizCihazlar = user.activeDevices.filter(
      (cihaz: any) => new Date(cihaz.lastActive) > otuzGunOnce
    );

    // Eğer süzgeçte çöpe giden eski cihazlar olduysa, ana defteri güncelle
    if (temizCihazlar.length !== user.activeDevices.length) {
      user.activeDevices = temizCihazlar;
      await user.save();
    }
    // ==========================================

    return NextResponse.json({
      twoFactorEmail: user.twoFactorEmail || false,
      twoFactorSms: user.twoFactorSms || false,
      activeDevices: temizCihazlar || [], 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}