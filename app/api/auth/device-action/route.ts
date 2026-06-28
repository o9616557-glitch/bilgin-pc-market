import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

// 🚀 BİNGO 1: Sayfayı Önbelleğe Almayı Kesinlikle Yasaklıyoruz!
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action");

    if (!token || !action) return NextResponse.json({ message: "Geçersiz bağlantı." }, { status: 400 });
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI as string);

    // 🚀 BİNGO 2: Date.now() yerine gerçek bir tarih objesi yolluyoruz ki Mongoose anlasın!
    const suAnkiTarih = new Date();

    const user = await User.findOne({
      pendingDeviceToken: token,
      pendingDeviceExpires: { $gt: suAnkiTarih } // Mongoose artık bu tarihi sorunsuz okuyacak
    });

    // 🚀 ORTAK KURUMSAL HTML ŞABLONU 
    const htmlSayfaUret = (baslik: string, mesaj: string, ikon: string, renk: string) => `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${baslik} - Bilgin PC Güvenlik</title>
      </head>
      <body style="background-color: #020617; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 40px 30px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; max-width: 480px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
              <div style="font-size: 65px; margin-bottom: 20px; filter: drop-shadow(0 0 10px ${renk}40);">${ikon}</div>
              <h2 style="color: ${renk}; margin-top: 0; letter-spacing: 1.5px; font-weight: 800; font-size: 24px;">${baslik}</h2>
              <div style="width: 50px; height: 3px; background-color: ${renk}; margin: 0 auto 25px auto; border-radius: 2px;"></div>
              
              <div style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin-bottom: 30px; text-align: left; background: #020617; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
                ${mesaj}
              </div>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 20px; font-weight: 500;">
                  BİLGİN PC • Güvenlik Sistemleri<br>
                  <span style="font-weight: normal; opacity: 0.7;">Artık bu pencereyi güvenle kapatabilirsiniz.</span>
              </p>
          </div>
      </body>
      </html>
    `;

    // 1. DURUM: Linkin süresi dolmuşsa
    if (!user) {
      const html = htmlSayfaUret(
        "BAĞLANTI ZAMAN AŞIMI", 
        "Güvenlik standartlarımız gereği bu onay bağlantısının kullanım süresi dolmuş veya işlem daha önce tamamlanmıştır.<br><br>Lütfen giriş ekranına dönerek işlemi yeniden başlatınız.", 
        "⏳", 
        "#f59e0b"
      );
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // 2. DURUM: BAŞARILI ONAY (İşte o kurumsal yazının olduğu yer)
    if (action === "approve") {
      if (!user.trustedDevices.includes(user.pendingDeviceInfo.cihaz)) {
        user.trustedDevices.push(user.pendingDeviceInfo.cihaz);
      }
      
      // 5 Dakikalık VIP Bilet
      user.karantinaPass = new Date(Date.now() + 5 * 60 * 1000); 
      
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      await user.save();
      const kurumsalMesaj = `
        <span style="color: #f8fafc; font-weight: bold;">Güvenlik protokolleri başarıyla tamamlandı.</span><br><br>
        Bu cihaz sistemlerimizde güvenilir olarak yetkilendirilmiştir. Lütfen giriş işlemini başlattığınız <b>asıl ekrana (ana cihazınıza)</b> geri dönünüz.<br><br>
        <strong style="color:#10b981;">Sistem işleminizi algılayarak sizi otomatik olarak bir sonraki güvenlik adımına veya panele yönlendirecektir.</strong>
      `;
      const html = htmlSayfaUret("CİHAZ YETKİLENDİRİLDİ", kurumsalMesaj, "🛡️", "#3b82f6");
      return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    } 
    
    // 3. DURUM: Reddetme ve Kilitleme
    else if (action === "reject") {
      user.activeDevices = [];
      user.pendingDeviceToken = undefined;
      user.pendingDeviceExpires = undefined;
      user.pendingDeviceInfo = undefined;
      await user.save();

      const html = htmlSayfaUret(
        "ERİŞİM ENGELLENDİ", 
        "Talebiniz üzerine bu giriş işlemi sistem tarafından <b>derhal iptal edilmiş</b> ve hesabınız koruma altına alınmıştır.<br><br>Tüm aktif oturumlarınız güvenlik amacıyla sonlandırıldı.", 
        "🚨", 
        "#ef4444"
      );
      return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
  } catch (error) {
    console.error("Cihaz Onay İşlemi Hatası:", error);
    return NextResponse.json({ message: "Sistem hatası oluştu." }, { status: 500 });
  }
}