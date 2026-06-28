import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Geçersiz veya eksik onay kodu." }, { status: 400 });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ message: "Bu onay bağlantısı geçersiz veya süresi dolmuş." }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Hesabınız başarıyla onaylandı!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}