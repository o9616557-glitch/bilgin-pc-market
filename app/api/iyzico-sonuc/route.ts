import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { iyzicoConfig } from "@/lib/iyzico-config";
import { magazaKrediEkle } from "@/lib/magaza-kredi";
import { puanGeriYukle } from "@/lib/odul-puan";
import { siparisOdulPuanVer } from "@/lib/siparis-puan";
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
      iyzipay.checkoutForm.retrieve({
        locale: "tr", conversationId: siparisKodu as string, token: token as string
      }, (err: any, result: any) => {
        if (err) reject(err); else resolve(result);
      });
    });

    if (sonuc.paymentStatus === "SUCCESS") {
      const client = await clientPromise;
      const db = client.db("bilginpcmarket");
      
      const mevcutSiparis = await db.collection("orders").findOne({ siparisKodu });
      const odemeEtiketi =
        mevcutSiparis?.odemeYontemi === "bkm" || sonuc.paymentType === "BKM"
          ? "bkm"
          : "kart";

      await db.collection("orders").updateOne(
        { siparisKodu: siparisKodu },
        {
          $set: {
            durum: "Ödendi / Hazırlanıyor",
            status: "Ödendi / Hazırlanıyor",
            odemeYontemi: odemeEtiketi,
            odemeId: sonuc.paymentId,
            musteriyeGoster: true,
            odemeDurumu: "odendi",
          },
        }
      );

      const guncelSiparis = await db.collection("orders").findOne({ siparisKodu });
      if (guncelSiparis) await siparisOdulPuanVer(db, guncelSiparis);

      try {
        const siparis = await db.collection("orders").findOne({ siparisKodu: siparisKodu });
        const musteriMaili = siparis?.email || siparis?.userEmail || siparis?.musteri?.eposta || "o9616557@gmail.com";
        const musteri = siparis?.musteri || {};
        const toplamTutar = siparis?.toplamTutar || siparis?.totalPrice || 0;
        
        // 🛠️ NOT KONTROLÜ: Eğer boşsa veya "Not eklenmemiş" ise tamamen yok say!
        const musteriNotu = siparis?.siparisNotu;
        let musteriNotuHtml = "";
        let adminNotuHtml = "";
        
        if (musteriNotu && musteriNotu !== "Not eklenmemiş" && musteriNotu !== "") {
            musteriNotuHtml = `<br><span style="color: #10b981; font-style: italic; font-size: 13px;">Sipariş Notunuz: "${musteriNotu}"</span>`;
            adminNotuHtml = `<p style="color: #a1a1aa; font-size: 15px;"><strong>Müşterinin Notu:</strong> <span style="color: #ffb300; font-weight: bold; font-style: italic;">"${musteriNotu}"</span></p>`;
        }

        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", port: 465, secure: true,
          auth: { user: "o9616557@gmail.com", pass: process.env.EMAIL_PASS },
          tls: { rejectUnauthorized: false }
        });

        // ================= 1. MÜŞTERİYE GİDEN ONAY MAİLİ =================
        const baslik = "SİPARİŞİNİZ ONAYLANDI 🚀";
        const altMesaj = `Ödemeniz başarıyla tarafımıza ulaşmış ve siparişiniz hazırlık aşamasına geçmiştir. Ürünleriniz uzman ekibimiz tarafından özenle paketleniyor! En kısa sürede kargoya teslim edilecektir.<br><br>
        <span style="color: #3b82f6; font-weight: bold;">Ödenen Tutar: ${toplamTutar} TL</span>${musteriNotuHtml}`;

        const musteriMailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: "Ödemeniz Başarılı! 🚀 (Siparişiniz Hazırlanıyor)",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #03050a; color: #ffffff; padding: 40px 30px; border-radius: 16px; border: 1px solid rgba(0, 229, 255, 0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
              
              <h2 style="color: #3b82f6; letter-spacing: 1px; margin-bottom: 24px; font-size: 26px; font-weight: 900; text-shadow: 0 0 10px rgba(0,229,255,0.4); text-align: center;">${baslik}</h2>
              
              <p style="color: #e4e4e7; font-size: 16px; line-height: 1.6; margin-bottom: 16px; text-align: center;">Merhaba <strong style="color: #fff;">${musteri?.ad || ""} ${musteri?.soyad || ""}</strong></p>
              
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 35px; padding: 0 15px; text-align: center;">${altMesaj}</p>

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

        // ================= 2. ADMİNE GİDEN BİLDİRİM MAİLİ =================
        const adminMailSecenekleri = {
          from: `"Bilgin PC Sistem" <o9616557@gmail.com>`,
          to: "o9616557@gmail.com",
          subject: `🚨 YENİ SİPARİŞ GELDİ! - Tutar: ${toplamTutar} TL`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #10b981;">
              <h2 style="color: #10b981; text-align: center; text-transform: uppercase;">Şefim, Dükkana Yeni Sipariş Düştü! 💰</h2>
              
              <div style="background-color: #121215; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #27272a;">
                <p style="color: #a1a1aa; font-size: 15px;"><strong>Müşteri:</strong> <span style="color: #fff;">${musteri?.ad || ""} ${musteri?.soyad || ""}</span></p>
                <p style="color: #a1a1aa; font-size: 15px;"><strong>Ödenen Para:</strong> <span style="color: #10b981; font-weight: bold; font-size: 18px;">${toplamTutar} TL (Kredi Kartı)</span></p>
                ${adminNotuHtml}
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px; text-align: center;">Hemen admin paneline girip detayları kontrol edebilirsin.<br><br>Hayırlı İşler!</p>
            </div>
          `
        };

        transporter.sendMail(musteriMailSecenekleri).catch((err: any) => console.log(err));
        transporter.sendMail(adminMailSecenekleri).catch((err: any) => console.log(err));

      } catch (mailHatasi) { console.log(mailHatasi) }

    // 🚀 BİNGO: İYZİCO'DAN DÖNEN MÜŞTERİYİ KARŞILAYAN GİZLİ GÜMRÜK KAPISI (SEPET İMHA MOTORU)
      const yonlendirmeHtml = `
        <!DOCTYPE html>
        <html lang="tr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ödeme Onaylandı, Yönlendiriliyor...</title>
          </head>
          <body style="background-color: #050814; color: #3b82f6; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; margin: 0;">
            <div style="text-align: center;">
              <div style="width: 50px; height: 50px; border: 4px solid rgba(59, 130, 246, 0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto;"></div>
              <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            </div>
            <script>
              // 1. Tarayıcının deposundaki sepeti acımadan yok et!
              localStorage.removeItem("bilgin-sepet");
              
              // 2. Müşteriyi sepeti tertemiz edilmiş şekilde başarılı sayfasına fırlat!
              setTimeout(function() {
                window.location.replace("/siparis-basarili?kodu=${siparisKodu}");
              }, 500); // Müşteri bu ekranı sadece yarım saniye görecek
            </script>
          </body>
        </html>
      `;
      
      return new NextResponse(yonlendirmeHtml, { 
        headers: { "Content-Type": "text/html; charset=utf-8" } 
      });
    } else {
      try {
        const client = await clientPromise;
        const db = client.db("bilginpcmarket");
        const basarisizSiparis = await db.collection("orders").findOne({ siparisKodu });
        const musteriEmail =
          basarisizSiparis?.userEmail ||
          basarisizSiparis?.email ||
          basarisizSiparis?.musteri?.eposta ||
          basarisizSiparis?.musteri?.email ||
          "";
        const kullanilanKredi = Number(basarisizSiparis?.kullanilanKredi || 0);
        const kullanilanPuan = Number(basarisizSiparis?.kullanilanPuan || 0);

        if (musteriEmail) {
          if (kullanilanKredi > 0) {
            await magazaKrediEkle(db, musteriEmail, kullanilanKredi, `İptal — ödeme reddedildi (${siparisKodu})`, siparisKodu);
          }
          if (kullanilanPuan > 0) {
            await puanGeriYukle(db, musteriEmail, kullanilanPuan, `İptal — ödeme reddedildi (${siparisKodu})`, siparisKodu);
          }
        }

        await db.collection("orders").updateOne(
          { siparisKodu },
          {
            $set: {
              gizlendi: true,
              rezervIadeEdildi: true,
              kullanilanKredi: 0,
              kullanilanPuan: 0,
              odemeDurumu: "iptal",
              odemeHataMesaji: sonuc.errorMessage || "Ödeme reddedildi",
              odenecekTutar: Number(
                basarisizSiparis?.toplamTutar ||
                basarisizSiparis?.totalPrice ||
                basarisizSiparis?.odenecekTutar ||
                0
              ),
            },
          }
        );
      } catch (cleanupError) {
        console.error("Başarısız ödeme temizliği yapılamadı:", cleanupError);
      }

      return NextResponse.redirect(new URL("/odeme?hata=odeme_reddedildi", request.url), 303);
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/odeme?hata=sistem_hatasi", request.url), 303);
  }
}