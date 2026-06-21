import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz" }, { status: 401 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Depodaki gerçek ayarları vitrine yolla!
    return NextResponse.json({
      twoFactorEmail: user.twoFactorEmail || false,
      twoFactorSms: user.twoFactorSms || false,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}