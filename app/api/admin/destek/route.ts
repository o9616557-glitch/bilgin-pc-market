import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Destek from "@/models/Destek";

const GIZLI_ANAHTAR = "Bilgin123";

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

function guvenlikKontrolu(request: Request) {
  const anahtar = request.headers.get("x-patron-anahtar");
  return anahtar === GIZLI_ANAHTAR;
}

export async function GET(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  await connectDB();
  try {
    const talepler = await Destek.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, talepler });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  await connectDB();
  try {
    const body = await request.json();
    const { id, action, mesaj, durum } = body;

    if (action === "reply") {
      // 🚀 BİNGO: strict: false ekledik. Modelde olmasa bile zorla kaydeder!
      const guncelTalep = await Destek.findByIdAndUpdate(
        id,
        { 
          $push: { mesajlar: { gonderen: "admin", metin: mesaj, tarih: new Date() } },
          $set: { durum: "Yanıt Bekleniyor" } 
        },
        { new: true, strict: false } 
      );
      return NextResponse.json({ success: true, talep: guncelTalep });
    } 
    
    if (action === "status") {
      const guncelTalep = await Destek.findByIdAndUpdate(id, { durum }, { new: true, strict: false });
      return NextResponse.json({ success: true, talep: guncelTalep });
    }

    return NextResponse.json({ success: false, message: "Geçersiz işlem" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function DELETE(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) await Destek.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}