import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action");

    if (!token || !action) {
      return NextResponse.json({ message: "Geçersiz bağlantı." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({
      pendingDeviceToken: token,
      pendingDeviceExpires: { $gt: Date.now() }
    });

    // 🚀 DÜKKANIN KESİN ADRESİ
    const baseUrl = process.env.NEXTAUTH_URL || "https://bilginpcmarket.com";

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/giris?error=token_expired`);
    }

    if (action === "approve") {
      if (!user.trustedDevices.includes(user.pendingDeviceInfo.cihaz)) {
        user.trustedDevices.push(user.pendingDeviceInfo.cihaz);
      }
      
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      
      await user.save();

      // 🚀 ONAYLANINCA DOĞRUDAN GİRİŞ SAYFANA YÖNLENDİRİR
      return NextResponse.redirect(`${baseUrl}/giris?message=device_approved`);
    } 
    
    else if (action === "reject") {
      user.activeDevices = [];
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;

      await user.save();

      // 🚀 REDDEDİLİNCE GÜVENLİK UYARISIYLA GİRİŞ SAYFANA ATAR
      return NextResponse.redirect(`${baseUrl}/giris?alert=security_breach`);
    }

  } catch (error) {
    console.error("Cihaz Onay İşlemi Hatası:", error);
    return NextResponse.json({ message: "Sistem hatası oluştu." }, { status: 500 });
  }
}