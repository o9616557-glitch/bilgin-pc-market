import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action");

    if (!token || !action) return NextResponse.json({ message: "Geçersiz bağlantı." }, { status: 400 });
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI as string);

    // HTML ŞABLON MOTORU
    const htmlSayfaUret = (baslik: string, mesaj: string, ikon: string, renk: string) => `
      <!DOCTYPE html>
      <html lang="tr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${baslik}</title></head>
      <body style="background-color: #020617; color: #f8fafc; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 40px 30px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; max-width: 480px; width: 90%;">
              <div style="font-size: 65px; margin-bottom: 20px;">${ikon}</div>
              <h2 style="color: ${renk}; margin-top: 0;">${baslik}</h2>
              <div style="color: #cbd5e1; font-size: 15px; background: #020617; padding: 20px; border-radius: 12px; text-align: left;">${mesaj}</div>
          </div>
      </body>
      </html>
    `;

    // 🔍 AŞAMA 1: SÜREYE BAKMADAN, TOKEN VERİTABANINDA VAR MI DİYE BAKIYORUZ
    const user = await User.findOne({ pendingDeviceToken: token });

    if (!user) {
      console.log("❌ DEDEKTİF RAPORU: Bu token veritabanında HİÇ YOK! Muhtemelen eski bir maildeki linke tıklanıyor.");
      const html = htmlSayfaUret(
        "GEÇERSİZ BAĞLANTI", 
        "Bu onay bağlantısı sistemde bulunamadı. Lütfen e-posta kutunuzdaki <b>en son gelen</b> maildeki linke tıkladığınızdan emin olun.", 
        "❌", 
        "#ef4444"
      );
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // 🔍 AŞAMA 2: TOKEN BULUNDU, ŞİMDİ SAATLERİ TERMİNALE YAZDIRIP KIYASLIYORUZ
    const suAn = new Date();
    
    console.log("⏱️--- DEDEKTİF SAAT KONTROLÜ ---");
    console.log("Şu Anki Sunucu Saati :", suAn.toISOString());
    console.log("Linkin Bitiş Saati   :", new Date(user.pendingDeviceExpires).toISOString());
    console.log("---------------------------------");

    if (user.pendingDeviceExpires && new Date(user.pendingDeviceExpires).getTime() < suAn.getTime()) {
      console.log("❌ DEDEKTİF RAPORU: Token bulundu ama süresi sunucu saatine göre dolmuş!");
      const html = htmlSayfaUret(
        "BAĞLANTI ZAMAN AŞIMI", 
        "Bu bağlantının 15 dakikalık kullanım süresi dolmuştur. Lütfen giriş ekranından yeni bir onay isteyin.", 
        "⏳", 
        "#f59e0b"
      );
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // 🔍 AŞAMA 3: HER ŞEY DOĞRUYSA ONAYLA
    if (action === "approve") {
      if (!user.trustedDevices.includes(user.pendingDeviceInfo.cihaz)) {
        user.trustedDevices.push(user.pendingDeviceInfo.cihaz);
      }
      user.karantinaPass = new Date(Date.now() + 5 * 60 * 1000); 
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      await user.save();

      const html = htmlSayfaUret("CİHAZ YETKİLENDİRİLDİ", "Güvenlik protokolü tamamlandı. Giriş yaptığınız asıl ekrana dönüp tekrar giriş yapabilirsiniz.", "🛡️", "#3b82f6");
      return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

  } catch (error) {
    return NextResponse.json({ message: "Sistem hatası." }, { status: 500 });
  }
}