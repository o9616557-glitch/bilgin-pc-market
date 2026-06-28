import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Oturum bulunamadı." }, { status: 401 });
    }

    const body = await req.json();
    const { currentDeviceId } = body;

    if (!currentDeviceId) {
      return NextResponse.json({ message: "Cihaz ID eksik." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const buCihaz = user.activeDevices?.find((c: any) => c.deviceId === currentDeviceId);
    if (!buCihaz) {
      return NextResponse.json({ message: "Bu cihaz oturumunuz doğrulanamadı." }, { status: 403 });
    }

    user.activeDevices.forEach((cihaz: any) => {
      if (cihaz.deviceId !== currentDeviceId) {
        cihaz.isActive = false;
      }
    });

    await user.save();

    return NextResponse.json({ message: "Diğer cihazlardan başarıyla çıkış yapıldı." }, { status: 200 });

  } catch (error) {
    console.error("Cihazları kapatma hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
