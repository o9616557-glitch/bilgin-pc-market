import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions); 
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "İzinsiz işlem." }, { status: 401 });
    }

    const { currentDeviceId } = await req.json();

    if (!currentDeviceId) {
      return NextResponse.json({ message: "Cihaz kimliği eksik." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // 🚀 BÜYÜK TEMİZLİK: Şu an elimde tuttuğum cihaz ($ne: currentDeviceId) HARİCİNDEKİ tüm cihazları defterden sil!
    await User.updateOne(
      { email: session.user.email },
      { $pull: { activeDevices: { deviceId: { $ne: currentDeviceId } } } }
    );

    return NextResponse.json({ message: "Diğer cihazlar başarıyla kapatıldı." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}