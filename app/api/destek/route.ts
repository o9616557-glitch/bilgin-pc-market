import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Destek from "@/models/Destek"; // 🚀 BİNGO! Müşteri tarafıyla aynı modeli kullanıyoruz

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
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false, message: "Yetkisiz Erişim" }, { status: 401 });
  
  await connectDB();
  try {
    // Tüm destek taleplerini en yeniden eskiye doğru sıralayıp getir
    const talepler = await Destek.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, talepler });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Veritabanı hatası" });
  }
}

export async function PUT(request: Request) {
  if (!guvenlikKontrolu(request)) return NextResponse.json({ success: false }, { status: 401 });
  
  await connectDB();
  try {
    const body = await request.json();
    const { id, action, mesaj, durum } = body;

    // ŞEF CEVAP YAZDIYSA
    if (action === "reply") {
      const guncelTalep = await Destek.findByIdAndUpdate(
        id, 
        { 
          $push: { mesajlar: { gonderen: "admin", metin: mesaj, tarih: new Date() } },
          $set: { durum: "Yanıt Bekleniyor" } 
        }, 
        { new: true }
      ).lean();
      return NextResponse.json({ success: true, talep: guncelTalep });
    } 
    
    // ŞEF DURUM GÜNCELLEDİYSE (Örn: Çözüldü)
    if (action === "status") {
      const guncelTalep = await Destek.findByIdAndUpdate(id, { durum }, { new: true }).lean();
      return NextResponse.json({ success: true, talep: guncelTalep });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    return NextResponse.json({ success: false });
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
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}