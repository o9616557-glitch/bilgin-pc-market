import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });

    const { yeniAktifMail } = await req.json();
    if (!yeniAktifMail) return NextResponse.json({ message: "Mail adresi eksik" }, { status: 400 });

    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI as string);

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });

    // BİNGO: Şalteri açtığın maili veritabanına aktif olarak yazıyoruz!
    user.aktifEposta = yeniAktifMail;
    await user.save();

    return NextResponse.json({ message: "Aktif e-posta güncellendi!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}