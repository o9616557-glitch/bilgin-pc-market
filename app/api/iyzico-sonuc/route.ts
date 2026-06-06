import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";

export async function POST(request: Request) {
  try {
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_URI
    });

    const formData = await request.formData();
    const token = formData.get("token");
    
    const url = new URL(request.url);
    const siparisKodu = url.searchParams.get("siparisKodu");

    if (!token || !siparisKodu) {
      return NextResponse.redirect(new URL("/odeme?hata=eksik_bilgi", request.url), 303);
    }

    const sonuc: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({
        locale: "tr", conversationId: siparisKodu as string, token: token as string
      }, (err: any, result: any) => {
        if (err) reject(err); else resolve(result);
      });
    });

    if (sonuc.paymentStatus === "SUCCESS") {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      
      // 🔥 İŞTE DEĞİŞEN YER: Senin sistemin bunu (Eğik Çizgi) olarak istiyormuş
      await db.collection("orders").updateOne(
        { siparisKodu: siparisKodu },
        { $set: { durum: "Ödendi / Hazırlanıyor", status: "Ödendi / Hazırlanıyor", odemeYontemi: "Kredi Kartı", odemeId: sonuc.paymentId } }
      );

      try {
        const siparis = await db.collection("orders").findOne({ siparisKodu: siparisKodu });
        const musteriMaili = siparis?.email || siparis?.userEmail || siparis?.musteri?.eposta || "o9616557@gmail.com";
        const musteri = siparis?.musteri || {};
        const toplamTutar = siparis?.toplamTutar || siparis?.totalPrice || 0;

        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", port: 465, secure: true,
          auth: { user: "o9616557@gmail.com", pass: process.env.EMAIL_PASS },
          tls: { rejectUnauthorized: false }
        });

        const mailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: "Ödemeniz Başarılı! 🚀 (Siparişiniz Hazırlanıyor)",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="color: #3b82f6; text-align: center; text-transform: uppercase;">Ödemeniz Alındı! 🎉</h2>
              <p>Merhaba <strong style="color: #fff;">${musteri?.ad || ""} ${musteri?.soyad || ""}</strong>,</p>
              <p>Ödemeniz Iyzico tarafından başarıyla onaylandı. Siparişiniz şu an <strong>Hazırlanıyor</strong> aşamasına geçmiştir.</p>
              
              <div style="background-color: #121215; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #27272a; box-shadow: 0 0 15px rgba(0, 229, 255, 0.05);">
                <h3 style="color: #3b82f6; margin-top: 0; border-bottom: 1px solid #27272a; padding-bottom: 10px;">Sipariş Detayları</h3>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Sipariş Kodu:</strong> <span style="color: #fff;">${siparisKodu}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Ad Soyad:</strong> <span style="color: #fff;">${musteri?.ad || ""} ${musteri?.soyad || ""}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Telefon:</strong> <span style="color: #fff;">${musteri?.telefon || "-"}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Şehir / İlçe:</strong> <span style="color: #fff;">${musteri?.sehir || ""} / ${musteri?.ilce || ""}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Teslimat Adresi:</strong> <span style="color: #fff;">${musteri?.adres || "-"}</span></p>
                <p style="color: #a1a1aa; font-size: 14px;"><strong>Ödenen Tutar:</strong> <span style="color: #3b82f6; font-weight: bold; font-size: 18px;">${toplamTutar} TL</span></p>
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px; text-align: center;">Bizi tercih ettiğiniz için teşekkür ederiz!<br><br><strong style="color: #3b82f6;">Bilgin PC Market</strong></p>
            </div>
          `
        };
        transporter.sendMail(mailSecenekleri).catch((err: any) => console.log(err));
      } catch (mailHatasi) { }

      return NextResponse.redirect(new URL(`/siparis-basarili?kodu=${siparisKodu}`, request.url), 303);
    } else {
      return NextResponse.redirect(new URL("/odeme?hata=odeme_reddedildi", request.url), 303);
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/odeme?hata=sistem_hatasi", request.url), 303);
  }
}