import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ approved: false }, { status: 400 });

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ approved: false }, { status: 404 });

    // 🚀 ONAY KONTROLÜ: 
    // Eğer telefondan onay verilmişse (yani token silinmiş ve 5 dakikalık geçiş izni verilmişse)
    const isApproved = !user.pendingDeviceToken && user.karantinaPass && new Date(user.karantinaPass).getTime() > Date.now();

    return NextResponse.json({ approved: !!isApproved });
    
  } catch (error) {
    console.error("Otomatik giriş kontrol hatası:", error);
    return NextResponse.json({ approved: false }, { status: 500 });
  }
}