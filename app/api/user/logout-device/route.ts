import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ message: "İzinsiz işlem." }, { status: 401 });

    const { deviceId } = await req.json();
    if (!deviceId) return NextResponse.json({ message: "Cihaz kimliği eksik." }, { status: 400 });

    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI as string);

    // 🚀 SİLME YOK, DAMGA VAR! O cihazı bul ve "isActive" değerini "false" yap (Yani ışığını söndür)
    await User.updateOne(
      { email: session.user.email, "activeDevices.deviceId": deviceId },
      { $set: { "activeDevices.$.isActive": false } }
    );

    return NextResponse.json({ message: "Çıkış damgası başarıyla vuruldu." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}