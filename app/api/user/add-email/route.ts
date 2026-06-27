import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });

    const { yeniMail } = await req.json();
    if (!yeniMail || !yeniMail.includes('@')) return NextResponse.json({ message: "Geçersiz mail formatı" }, { status: 400 });

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });

    // Eğer çanta daha önce hiç oluşmamışsa oluştur
    if (!user.kayitliEpostalar) user.kayitliEpostalar = [];
    
    // Eğer mail zaten çantada yoksa ekle
    if (!user.kayitliEpostalar.includes(yeniMail)) {
      user.kayitliEpostalar.push(yeniMail);
      await user.save();
    }

    return NextResponse.json({ message: "E-Posta çantaya eklendi!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}