import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action");

    if (!token || !action) return NextResponse.json({ message: "Geçersiz bağlantı." }, { status: 400 });
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI as string);

    const user = await User.findOne({
      pendingDeviceToken: token,
      pendingDeviceExpires: { $gt: Date.now() }
    });

    // 🚀 ORTAK HTML ŞABLONU (Telefonda yönlendirme yapmak yerine bu sabit ekranı göstereceğiz)
    const htmlSayfaUret = (baslik: string, mesaj: string, ikon: string, renk: string) => `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${baslik} - Bilgin PC</title>
      </head>
      <body style="background-color: #020617; color: #f8fafc; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 30px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 450px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              <div style="font-size: 60px; margin-bottom: 20px;">${ikon}</div>
              <h2 style="color: ${renk}; margin-top: 0; letter-spacing: 1px; font-weight: 800;">${baslik}</h2>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">${mesaj}</p>
              <p style="color: #64748b; font-size: 13px; margin-top: 30px;">Artık bu pencereyi kapatabilirsiniz.</p>
          </div>
      </body>
      </html>
    `;

    // 1. DURUM: Linkin süresi dolmuşsa
    if (!user) {
      const html = htmlSayfaUret("SÜRE DOLDU", "Bu onay bağlantısının süresi dolmuş veya zaten kullanılmış. Lütfen bilgisayarınızdan tekrar giriş yapmayı deneyin.", "⏳", "#f59e0b");
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // 2. DURUM: Başarılı onay
    if (action === "approve") {
      if (!user.trustedDevices.includes(user.pendingDeviceInfo.cihaz)) {
        user.trustedDevices.push(user.pendingDeviceInfo.cihaz);
      }
      
      // Patron onayladı, 5 dakika boyunca kapıdan direkt geçebilir!
      user.karantinaPass = new Date(Date.now() + 5 * 60 * 1000); 
      
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      await user.save();

      const html = htmlSayfaUret("CİHAZ ONAYLANDI", "Güvenlik onayı başarıyla tamamlandı.<br><br><strong style='color:#10b981;'>Lütfen bilgisayarınıza geri dönün, sistem sizi otomatik olarak içeri alacaktır.</strong>", "✅", "#3b82f6");
      return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    } 
    // 3. DURUM: Reddetme ve Kilitleme
    else if (action === "reject") {
      user.activeDevices = [];
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      await user.save();

      const html = htmlSayfaUret("ERİŞİM ENGELLENDİ", "Güvenliğiniz için bu giriş işlemi iptal edildi ve hesabınız korumaya alındı.", "🚨", "#ef4444");
      return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
  } catch (error) {
    console.error("Cihaz Onay İşlemi Hatası:", error);
    return NextResponse.json({ message: "Sistem hatası oluştu." }, { status: 500 });
  }
}