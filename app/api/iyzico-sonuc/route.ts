import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";
// @ts-ignore
import "postman-request"; // ŞEFİM: VERCEL SİLMESİN DİYE ZORLA KODUN İÇİNE ÇAĞIRDIK!

// ... kodun geri kalanı aynı kalacak

export async function POST(request: Request) {
  try {
   // BURAYI DA GÜNCELLEDİK
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
        locale: "tr",
        conversationId: siparisKodu as string,
        token: token as string
      }, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (sonuc.paymentStatus === "SUCCESS") {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      
      await db.collection("orders").updateOne(
        { siparisKodu: siparisKodu },
        { $set: { durum: "Ödendi - Hazırlanıyor", odemeId: sonuc.paymentId } }
      );

      return NextResponse.redirect(new URL(`/siparis-basarili?kodu=${siparisKodu}`, request.url));
    } else {
      return NextResponse.redirect(new URL("/odeme?hata=odeme_reddedildi", request.url));
    }

  } catch (error) {
    console.error("IYZICO SONUC HATASI:", error);
    return NextResponse.redirect(new URL("/odeme?hata=sistem_hatasi", request.url));
  }
}