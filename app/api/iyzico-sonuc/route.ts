import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL
});

export async function POST(request: Request) {
  try {
    // Iyzico bize veriyi form formatında (URL-encoded) gönderir
    const formData = await request.formData();
    const token = formData.get("token");
    
    // URL'den sipariş kodunu alıyoruz
    const url = new URL(request.url);
    const siparisKodu = url.searchParams.get("siparisKodu");

    if (!token || !siparisKodu) {
      return NextResponse.redirect(new URL("/odeme?hata=eksik_bilgi", request.url));
    }

    // 1. Iyzico'ya "Bu token doğru mu, ödeme gerçekten alındı mı?" diye soruyoruz
    const sonuc: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({
        locale: "tr",
        conversationId: siparisKodu as string,
        token: token as string
      }, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // 2. Eğer ödeme başarılıysa MongoDB'yi güncelliyoruz
    if (sonuc.paymentStatus === "SUCCESS") {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      
      // Siparişin durumunu "Ödendi" olarak değiştir
      await db.collection("orders").updateOne(
        { siparisKodu: siparisKodu },
        { $set: { durum: "Ödendi - Hazırlanıyor", odemeId: sonuc.paymentId } }
      );

      // Başarılı olduğuna dair ana sayfaya yönlendir (İleride özel teşekkür sayfası yapabiliriz)
      return NextResponse.redirect(new URL(`/?siparisBasarili=${siparisKodu}`, request.url));
    } else {
      // Ödeme reddedildi (Limit yetersiz, yanlış şifre vs.)
      return NextResponse.redirect(new URL("/odeme?hata=odeme_reddedildi", request.url));
    }

  } catch (error) {
    console.error("IYZICO SONUC HATASI:", error);
    return NextResponse.redirect(new URL("/odeme?hata=sistem_hatasi", request.url));
  }
}