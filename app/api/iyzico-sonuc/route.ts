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
      return NextResponse.redirect(new URL("/odeme?hata=eksik_bilgi", request.url));
    }

    const sonuc: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({
        locale: "tr", conversationId: siparisKodu as string, token: token as string
      }, (err: any, result: any) => {
        if (err) reject(err); else resolve(result);
      });
    });

    // 🚀 BANKA PARAYI ÇEKTİ, ONAYLADI! (Şimdi Mail Zamanı)
    if (sonuc.paymentStatus === "SUCCESS") {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      
      await db.collection("orders").updateOne(
        { siparisKodu: siparisKodu },
        { $set: { durum: "Ödendi - Hazırlanıyor", odemeId: sonuc.paymentId } }
      );

      // 🎯 DİJİTAL POSTACI DEVREDE: KART ONAYLANDI MAİLİ
      try {
        const siparis = await db.collection("orders").findOne({ siparisKodu: siparisKodu });
        const musteriMaili = siparis?.email || siparis?.userEmail || siparis?.musteri?.eposta || "o9616557@gmail.com";

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
          html: `<div style="background-color: #09090b; color: #fff; padding: 30px; border-radius: 12px; text-align: center;">
            <h2 style="color: #00e5ff;">Ödemeniz Alındı! 🎉</h2>
            <p>Merhaba, ödemeniz Iyzico tarafından onaylandı ve siparişiniz hazırlık aşamasına geçirildi.</p>
            <h1 style="color: #ffffff; letter-spacing: 3px;">${siparisKodu}</h1>
            <p>Bizi tercih ettiğiniz için teşekkür ederiz!<br>Bilgin PC Market</p>
          </div>`
        };
        transporter.sendMail(mailSecenekleri).catch((err: any) => console.log(err));
      } catch (mailHatasi) { }

      return NextResponse.redirect(new URL(`/siparis-basarili?kodu=${siparisKodu}`, request.url));
    } else {
      return NextResponse.redirect(new URL("/odeme?hata=odeme_reddedildi", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/odeme?hata=sistem_hatasi", request.url));
  }
}