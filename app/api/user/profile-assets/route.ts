import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/models/User";

async function dbConnect() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// GET — banner, tileImages, pingRenk yükle
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select("profileBanner tileImages pingRenk");
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

    return NextResponse.json({
      profileBanner: user.profileBanner || null,
      tileImages: user.tileImages ? Object.fromEntries(user.tileImages) : {},
      pingRenk: user.pingRenk || null,
    });
  } catch (e) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST — banner ve/veya tileImages ve/veya pingRenk kaydet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const body = await req.json();
    const update: Record<string, any> = {};

    if ("profileBanner" in body) {
      if (body.profileBanner && body.profileBanner.length > 600_000)
        return NextResponse.json({ error: "Banner çok büyük" }, { status: 400 });
      update.profileBanner = body.profileBanner;
    }

    if ("tileImages" in body) {
      update.tileImages = body.tileImages ?? {};
    }

    if ("pingRenk" in body) {
      update.pingRenk = body.pingRenk;
    }

    if (Object.keys(update).length === 0)
      return NextResponse.json({ error: "Güncellenecek alan yok" }, { status: 400 });

    await dbConnect();
    await User.updateOne({ email: session.user.email }, { $set: update });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
