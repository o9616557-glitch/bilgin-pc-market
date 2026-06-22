import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentDeviceId } = body;

    if (!currentDeviceId) {
      return NextResponse.json({ message: "Cihaz ID eksik." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Tıklayan cihazı bulup, onun sahibine ait diğer tüm cihazları öldürüyoruz
    const user = await User.findOne({ "activeDevices.deviceId": currentDeviceId });
    
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // Şu an elimizdeki cihaz HARİÇ hepsini "Ölü (isActive: false)" olarak işaretle
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