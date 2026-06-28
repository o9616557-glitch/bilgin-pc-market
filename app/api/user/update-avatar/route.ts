import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json({ message: "Geçerli bir görsel gönderilmedi." }, { status: 400 });
    }

    // Sadece data URL formatını kabul et
    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ message: "Geçersiz görsel formatı." }, { status: 400 });
    }

    // ~300 KB base64 sınırı (≈ 400KB ham boyut)
    if (image.length > 400_000) {
      return NextResponse.json({ message: "Görsel çok büyük. Lütfen daha küçük bir fotoğraf seçin." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    await User.updateOne({ email: session.user.email }, { $set: { image } });

    return NextResponse.json({ message: "Profil fotoğrafı güncellendi.", image }, { status: 200 });
  } catch (error) {
    console.error("Avatar güncelleme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}
