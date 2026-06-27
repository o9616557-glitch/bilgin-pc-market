import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // 🚀 VİTRİNE GİDEN ORİJİNAL VE EKSİKSİZ PAKET
    return NextResponse.json({
      twoFactorEmail: user.twoFactorEmail || false,
      twoFactorSms: user.twoFactorSms || false,
      activeDevices: user.activeDevices || [],
      notificationPreference: user.notificationPreference || 'new_device'
    }, { status: 200 });

  } catch (error) {
    console.error("GET 2FA Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}