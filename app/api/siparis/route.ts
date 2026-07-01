import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { iyzicoConfig } from "@/lib/iyzico-config";
// @ts-ignore
import Iyzipay from "iyzipay";
// @ts-ignore
import "postman-request"; 

export async function POST(request: Request) {
  try {
    const iyzipay = new Iyzipay(iyzicoConfig());
    
    const body = await request.json();
    const { musteri, sepet, odemeYontemi, toplamTutar, siparisNotu, kayitliKartId } = body;

    if (!musteri || !sepet || !odemeYontemi || !toplamTutar) {
      return NextResponse.json({ error: "Formda eksik bilgi var şef!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const siparisKodu = `BPC-${Math.floor(100000 + Math.random() * 900000)}`;

    // 🚀 BİNGO: Diğer sayfaların tanıması için orijinal "havale" ve "kart" kodları
    const gercekOdemeYontemi = odemeYontemi === "havale" ? "havale" : "kart";
    const ilkDurum = odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor";

    const yeniSiparis = {
      siparisKodu,
      musteri,
      sepet,
      odemeYontemi: gercekOdemeYontemi, 
      siparisNotu: siparisNotu || "Not eklenmemiş",
      toplamTutar,
      durum: ilkDurum, 
      tاريخ: new Date(),
      userEmail: musteri?.eposta || musteri?.email || "",
      email: musteri?.eposta || musteri?.email || "",
      items: sepet, 
      totalPrice: toplamTutar,
      status: ilkDurum
    };
    
    await db.collection("orders").insertOne(yeniSiparis);

    // ================= SADECE HAVALE İSE MAİL AT (JİLET GİBİ YENİ SÜRÜM) =================
    if (odemeYontemi === "havale") {
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", port: 465, secure: true,
          auth: { user: "o9616557@gmail.com", pass: process.env.EMAIL_PASS || "vfph bxkd gzsv enpg" },
          tls: { rejectUnauthorized: false }
        });

        // 🛠️ AD SOYAD VE NOT MOTORU (Virgülsüz ve Akıllı)
        const aliciAdSoyad = (musteri?.ad || musteri?.isim) 
          ? `${musteri?.ad || musteri?.isim} ${musteri?.soyad || ""}`.trim() 
          : "Değerli Müşterimiz";

        let musteriNotuHtml = "";
        let adminNotuHtml = "";
        
        if (siparisNotu && siparisNotu !== "Not eklenmemiş" && siparisNotu.trim() !== "") {
            musteriNotuHtml = `<br><br><span style="color: #10b981; font-style: italic; font-size: 13px;">Sipariş Notunuz: "${siparisNotu}"</span>`;
            adminNotuHtml = `<p style="color: #a1a1aa; font-size: 15px;"><strong>Müşterinin Notu:</strong> <span style="color: #ffb300; font-weight: bold; font-style: italic;">"${siparisNotu}"</span></p>`;
        }

        const musteriMaili = musteri?.eposta || musteri?.email || "o9616557@gmail.com";
        
        // --- 1. MÜŞTERİYE GİDEN HAVALE BİLGİLENDİRME MAİLİ ---
        const mailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: "Siparişiniz Alındı! 📦 (Havale Bekleniyor)",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #03050a; color: #ffffff; padding: 40px 30px; border-radius: 16px; border: 1px solid rgba(0, 229, 255, 0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
              
              <h2 style="color: #3b82f6; letter-spacing: 1px; margin-bottom: 24px; font-size: 26px; font-weight: 900; text-shadow: 0 0 10px rgba(0,229,255,0.4); text-align: center;">SİPARİŞİNİZ ALINDI 🚀</h2>
              
              <p style="color: #e4e4e7; font-size: 16px; line-height: 1.6; margin-bottom: 16px; text-align: center;">Merhaba <strong style="color: #fff;">${aliciAdSoyad}</strong></p>
              
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 35px; padding: 0 15px; text-align: center;">
                Siparişiniz sistemimize başarıyla ulaştı. <strong>Havale/EFT işleminiz onaylandığında</strong> siparişiniz hazırlık aşamasına geçecektir.
                <br><br><span style="color: #3b82f6; font-weight: bold; font-size: 16px;">Ödenecek Tutar: ${toplamTutar} TL</span>${musteriNotuHtml}
              </p>

              <div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 12px; margin: 0 auto 35px auto; border: 1px dashed rgba(0, 229, 255, 0.4); max-width: 320px; text-align: center;">
                <p style="color: #a1a1aa; font-size: 12px; margin-bottom: 12px; letter-spacing: 1px;">SİPARİŞ TAKİP KODUNUZ</p>
                
                <div style="background-color: #000000; padding: 12px 20px; border-radius: 8px; display: inline-block; border: 1px solid rgba(0,229,255,0.2); user-select: all; -webkit-user-select: all;">
                  <h1 style="color: #3b82f6; margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 900; display: inline-block;">${siparisKodu}</h1>
                </div>
                
                <p style="color: #71717a; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
                  <span style="font-size: 14px; vertical-align: middle;">📋</span> Kodu kopyalamak için üzerine basılı tutun
                </p>
              </div>
              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; text-align: center;">
                
                <h3 style="color: #ffffff; font-size: 18px; margin-bottom: 8px; letter-spacing: 0.5px;">Yardıma mı İhtiyacınız Var?</h3>
                <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin-top: 0; margin-bottom: 25px; padding: 0 10px;">
                  Siparişinizle ilgili en ufak bir sorunuzda veya talebinizde  endişelenmeyin. Uzman ekibimiz size destek olmak için bir mesaj uzağınızda!
                </p>

                <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 12px; padding: 20px; text-align: left; max-width: 350px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                  
                  <div style="margin-bottom: 14px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 10px;">
                    <span style="font-size: 16px; margin-right: 8px;">💬</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold;">WhatsApp Destek:</span> 
                    <span style="color: #10b981; font-weight: 900; font-size: 14px; float: right;">0532 734 50 23</span>
                  </div>

                  <div style="margin-bottom: 14px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 10px;">
                    <span style="font-size: 16px; margin-right: 8px;">📞</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold;">Müşteri Hizm:</span> 
                    <span style="color: #3b82f6; font-weight: 900; font-size: 14px; float: right;">0850 305 59 68</span>
                  </div>

                  <div style="margin-bottom: 14px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 10px;">
                    <span style="font-size: 16px; margin-right: 8px;">✉️</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold;">E-posta:</span> 
                    <a href="mailto:info@bilginpcmarket.com" style="color: #a1a1aa; font-size: 13px; text-decoration: none; float: right;">info@bilginpcmarket.com</a>
                  </div>

                  <div style="margin-bottom: 0;">
                    <span style="font-size: 16px; margin-right: 8px;">🌐</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold;">Web:</span> 
                    <a href="https://www.bilginpcmarket.com" style="color: #a1a1aa; font-size: 13px; text-decoration: none; float: right;">www.bilginpcmarket.com</a>
                  </div>

                </div>
              </div>
            </div>
          `
        };

        // --- 2. ADMİNE (SANA) GİDEN BİLDİRİM MAİLİ ---
        const adminMailSecenekleri = {
          from: `"Bilgin PC Sistem" <o9616557@gmail.com>`,
          to: "o9616557@gmail.com",
          subject: `🚨 YENİ SİPARİŞ GELDİ! (HAVALE BEKLİYOR) - Tutar: ${toplamTutar} TL`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #3b82f6;">
              <h2 style="color: #3b82f6; text-align: center; text-transform: uppercase;">Şefim, Dükkana Yeni Havale Siparişi Düştü! 📝</h2>
              
              <div style="background-color: #121215; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #27272a;">
                <p style="color: #a1a1aa; font-size: 15px;"><strong>Müşteri:</strong> <span style="color: #fff;">${aliciAdSoyad}</span></p>
                <p style="color: #a1a1aa; font-size: 15px;"><strong>Ödenecek Para:</strong> <span style="color: #3b82f6; font-weight: bold; font-size: 18px;">${toplamTutar} TL (Havale)</span></p>
                ${adminNotuHtml}
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px; text-align: center;">Banka hesabını kontrol edip ödeme geldiyse admin panelinden durumu güncelleyebilirsin.<br><br>Hayırlı İşler!</p>
            </div>
          `
        };

        transporter.sendMail(mailSecenekleri).catch((err: any) => console.error(err));
        transporter.sendMail(adminMailSecenekleri).catch((err: any) => console.error(err));
      } catch (mailHatasi) {}

      return NextResponse.json({ success: true, odemeYontemi: "havale", siparisKodu });
    }

    // ================= KART ÖDEMESİ KISMI =================
    let sepetUrunleri = sepet.map((item: any) => ({
      id: item.id, name: item.isim, category1: "Bilgisayar Donanim", itemType: "PHYSICAL", price: (item.fiyat * item.adet).toString()
    }));

    const araToplam = sepet.reduce((top: number, u: any) => top + (u.fiyat * u.adet), 0);
    const kargoUcreti = araToplam > 5000 ? 0 : 1;
    
    if (kargoUcreti > 0) {
      sepetUrunleri.push({ id: "KARGO-01", name: "Teslimat Bedeli", category1: "Hizmet", itemType: "VIRTUAL", price: kargoUcreti.toString() });
    }

    let iyzicoCardUserKey: string | undefined;
    if (kayitliKartId) {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email || musteri?.eposta || musteri?.email;
      if (email) {
        const wallet = await db.collection("wallets").findOne({ email });
        if (wallet) {
          const kart = (wallet.savedCards || []).find(
            (k: any) => String(k._id) === String(kayitliKartId)
          );
          if (kart?.cardToken && wallet.iyzicoCardUserKey) {
            iyzicoCardUserKey = wallet.iyzicoCardUserKey;
          }
        }
      }
    }

    const iyzicoTalep: Record<string, unknown> = {
      locale: "tr", conversationId: siparisKodu, price: toplamTutar.toString(), paidPrice: toplamTutar.toString(), currency: "TRY", basketId: siparisKodu, paymentGroup: "PRODUCT",
      callbackUrl: `https://www.bilginpcmarket.com/api/iyzico-sonuc?siparisKodu=${siparisKodu}`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: "MUSTERI-123", name: musteri.ad || "Müşteri", surname: musteri.soyad || "Soyadı", gsmNumber: "+905555555555", email: musteri.eposta || "test@test.com", identityNumber: "11111111111", lastLoginDate: "2026-05-21 12:00:00", registrationDate: "2026-05-21 12:00:00", registrationAddress: musteri.adres || "Test Adresi", ip: "85.34.78.112", city: musteri.sehir || "Istanbul", country: "Turkey", zipCode: "34000"
      },
      shippingAddress: { contactName: `${musteri.ad} ${musteri.soyad}`, city: musteri.sehir || "Istanbul", country: "Turkey", address: musteri.adres || "Test Adresi", zipCode: "34000" },
      billingAddress: { contactName: `${musteri.ad} ${musteri.soyad}`, city: musteri.sehir || "Istanbul", country: "Turkey", address: musteri.adres || "Test Adresi", zipCode: "34000" },
      basketItems: sepetUrunleri
    };

    if (iyzicoCardUserKey) {
      iyzicoTalep.cardUserKey = iyzicoCardUserKey;
    }

    const iyzicoSonuc: any = await new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(iyzicoTalep, (err: any, result: any) => {
        if (err) resolve({ status: "failure", errorMessage: err.message || JSON.stringify(err) });
        else resolve(result);
      });
    });

    if (iyzicoSonuc.status === "success") {
      return NextResponse.json({
        success: true,
        odemeYontemi: "kart",
        paymentPageUrl: iyzicoSonuc.paymentPageUrl,
      });
    } else {
      return NextResponse.json({ error: `Iyzico Reddetti: ${iyzicoSonuc.errorMessage || JSON.stringify(iyzicoSonuc)}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Arka Uç Çöktü: ${error.message}` }, { status: 500 });
  }
}