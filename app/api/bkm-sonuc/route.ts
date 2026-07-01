import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { iyzicoConfig } from "@/lib/iyzico-config";
// @ts-ignore
import Iyzipay from "iyzipay";

export async function POST(request: Request) {
  try {
    const iyzipay = new Iyzipay(iyzicoConfig());
    const formData = await request.formData();
    const token = formData.get("token");
    const url = new URL(request.url);
    const siparisKodu = url.searchParams.get("siparisKodu");

    if (!token || !siparisKodu) {
      return NextResponse.redirect(new URL("/odeme?hata=eksik_bilgi", request.url), 303);
    }

    const sonuc: any = await new Promise((resolve, reject) => {
      iyzipay.bkm.retrieve(
        { locale: "tr", conversationId: siparisKodu as string, token: token as string },
        (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (sonuc.paymentStatus === "SUCCESS") {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");

      await db.collection("orders").updateOne(
        { siparisKodu },
        {
          $set: {
            durum: "Ödendi / Hazırlanıyor",
            status: "Ödendi / Hazırlanıyor",
            odemeYontemi: "bkm",
            odemeId: sonuc.paymentId,
          },
        }
      );

      const yonlendirmeHtml = `
        <!DOCTYPE html>
        <html lang="tr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ödeme onaylandı</title>
          </head>
          <body style="background-color: #050814; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <script>
              localStorage.removeItem("bilgin-sepet");
              sessionStorage.removeItem("odeme_form_cache");
              window.location.replace("/siparis-basarili?kodu=${siparisKodu}");
            </script>
          </body>
        </html>
      `;

      return new NextResponse(yonlendirmeHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return NextResponse.redirect(new URL("/odeme?hata=odeme_reddedildi", request.url), 303);
  } catch {
    return NextResponse.redirect(new URL("/odeme?hata=sistem_hatasi", request.url), 303);
  }
}
