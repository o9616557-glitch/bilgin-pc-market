import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";
// @ts-ignore
import "postman-request"; 

export async function POST(request: Request) {
  try {
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_URI
    });
    
    const body = await request.json();
    const { musteri, sepet, odemeYontemi, toplamTutar } = body;

    if (!musteri || !sepet || !odemeYontemi || !toplamTutar) {
      return NextResponse.json({ error: "Formda eksik bilgi var şef!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const siparisKodu = `BPC-${Math.floor(100000 + Math.random() * 900000)}`;

    const yeniSiparis = {
      siparisKodu,
      musteri,
      sepet,
      odemeYontemi,
      toplamTutar,
      durum: odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor",
      tarih: new Date(),
      userEmail: musteri?.eposta || musteri?.email || "",
      email: musteri?.eposta || musteri?.email || "",
      items: sepet, 
      totalPrice: toplamTutar,
      status: odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor"
    };
    
    await db.collection("orders").insertOne(yeniSiparis);

    // 🚀 SADECE HAVALE İSE MAİL AT (Kredi kartıysa asla atma, parayı bekle!)
    if (odemeYontemi === "havale") {
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", port: 465, secure: true,
          auth: { user: "o9616557@gmail.com", pass: process.env.EMAIL_PASS },
          tls: { rejectUnauthorized: false }
        });

        const musteriMaili = musteri?.eposta || musteri?.email || "o9616557@gmail.com";
        const mailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: "Siparişiniz Alındı! 📦 (Havale Bekleniyor)",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="color: #00e5ff; text-align: center; text-transform: uppercase;">Siparişiniz Alındı! 🎉</h2>
              <p>Merhaba <strong style="color: #fff;">${musteri?.ad || ""} ${musteri?.soyad || ""}</strong>,</p>
              <p>Siparişiniz sistemimize başarıyla ulaştı. Havale/EFT işleminiz onaylandığında siparişiniz hazırlık aşamasına geçilecektir.</p>
              
              <div style="background-color: #121215; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #27272a; box-shadow: 0 0 15px rgba(0, 229, 255, 0.05);">
                <h3 style="color: #00e5ff; margin-top: 0; border-bottom: 1px solid #27272a; padding-bottom: 10px;">Sipariş Bilgileriniz</h3>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Sipariş Kodu:</strong> <span style="color: #fff;">${siparisKodu}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Ad Soyad:</strong> <span style="color: #fff;">${musteri?.ad || ""} ${musteri?.soyad || ""}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Telefon:</strong> <span style="color: #fff;">${musteri?.telefon || "-"}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Şehir / İlçe:</strong> <span style="color: #fff;">${musteri?.sehir || ""} / ${musteri?.ilce || ""}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Teslimat Adresi:</strong> <span style="color: #fff;">${musteri?.adres || "-"}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Ödenecek Tutar:</strong> <span style="color: #00e5ff; font-weight: bold; font-size: 18px;">${toplamTutar} TL</span></p>
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px; text-align: center;">Bizi tercih ettiğiniz için teşekkür ederiz!<br><br><strong style="color: #00e5ff;">Bilgin PC Market</strong></p>
            </div>
          `
        };
        transporter.sendMail(mailSecenekleri).catch((err: any) => console.error(err));
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

    const iyzicoTalep = {
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

    const iyzicoSonuc: any = await new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(iyzicoTalep, (err: any, result: any) => {
        if (err) resolve({ status: "failure", errorMessage: err.message || JSON.stringify(err) });
        else resolve(result);
      });
    });

    if (iyzicoSonuc.status === "success") {
      return NextResponse.json({ success: true, odemeYontemi: "kart", checkoutFormContent: iyzicoSonuc.checkoutFormContent });
    } else {
      return NextResponse.json({ error: `Iyzico Reddetti: ${iyzicoSonuc.errorMessage || JSON.stringify(iyzicoSonuc)}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Arka Uç Çöktü: ${error.message}` }, { status: 500 });
  }
}