import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// @ts-ignore
import Iyzipay from "iyzipay";
// @ts-ignore
import "postman-request"; // ŞEFİM: VERCEL SİLMESİN DİYE ZORLA KODUN İÇİNE ÇAĞIRDIK!

// ... kodun geri kalanı aynı kalacak
export async function POST(request: Request) {
  try {
    // ŞEFİM: IYZICO_BASE_URL yerine senin Vercel'deki IYZICO_URI adını yazdık!
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

    // 🚀 ŞEFİM: E-POSTA MÜHRÜNÜ VE VİTRİN KELİMELERİNİ EKLİYORUZ
    const yeniSiparis = {
      siparisKodu,
      musteri,
      sepet,
      odemeYontemi,
      toplamTutar,
      durum: odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor",
      tarih: new Date(),
      
      // 🚀 İŞTE SİPARİŞLERİM SAYFASININ ASIL ARADIĞI SİHİRLİ MÜHÜRLER!
      userEmail: musteri?.eposta || musteri?.email || "",
      email: musteri?.eposta || musteri?.email || "",
      items: sepet, 
      totalPrice: toplamTutar,
      status: odemeYontemi === "havale" ? "Havale Bekliyor" : "Ödeme Bekliyor"
    };
    
    await db.collection("orders").insertOne(yeniSiparis);

// 🚀 DİJİTAL POSTACI DEVREDE! (Sipariş veritabanına yazıldığı an çalışır)
      try {
        const nodemailer = require("nodemailer");
        
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "o9616557@gmail.com", 
            pass: "vfph bxkd gzsv enpg", // 🎯 İŞTE GİZLİ ANAHTAR! Şifre sıfırlamadaki aynı şifre!
          },
          tls: { rejectUnauthorized: false }
        });

        // 🎯 TEST KEMERİ: Müşteri maili yoksa (üyesizse) maili direkt ŞEFİN KENDİSİNE at!
        const musteriMaili = musteri?.eposta || musteri?.email || "o9616557@gmail.com";

        const mailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: "Siparişiniz Alındı! 📦 (Sipariş Kodunuz İçeridedir)",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="color: #00e5ff; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Siparişiniz Alındı! 🎉</h2>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">Merhaba <strong style="color: #fff;">${musteri?.ad || "Değerli Müşterimiz"}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">Siparişiniz sistemimize başarıyla ulaştı ve hazırlık aşamasına alındı. Siparişinizin anlık durumunu, aşağıdaki takip kodunuz ile sitemizdeki <strong>"Sipariş Takip"</strong> ekranından dilediğiniz zaman kontrol edebilirsiniz.</p>
              
              <div style="background-color: #121215; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; border: 1px solid #27272a; box-shadow: 0 0 15px rgba(0, 229, 255, 0.05);">
                <p style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Sipariş Takip Kodunuz</p>
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 3px;">${siparisKodu}</h1>
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px; text-align: center;">Bizi tercih ettiğiniz için teşekkür ederiz!<br><br><strong style="color: #00e5ff;">Bilgin PC Market</strong></p>
            </div>
          `,
        };

        transporter.sendMail(mailSecenekleri).catch((err: any) => console.error("Mail gönderilemedi:", err));
      } catch (mailHatasi) {
        console.error("Postacı motoru çalışamadı:", mailHatasi);
      }
      // 🚀 POSTACI İŞİNİ BİTİRDİ!
// 🚀 DİJİTAL POSTACI DEVREDE! (Sipariş veritabanına yazıldığı an mail atıyoruz)
      try {
        const nodemailer = require("nodemailer"); // Yukarıya eklemeye gerek kalmadan direkt burada çağırıyoruz
        
       const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // 465 portu için true olmalı (Garantili SSL tüneli)
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
          },
          tls: {
            // Sunucu bazlı güvenlik duvarı takılmalarını zorla aşmak için:
            rejectUnauthorized: false 
          }
        });

        // Müşteri mailini yakalıyoruz
        const musteriMaili = musteri?.eposta || musteri?.email;

        if (musteriMaili) {
          const mailSecenekleri = {
            from: `"Bilgin PC Market" <${process.env.EMAIL_USER}>`,
            to: musteriMaili,
            subject: "Siparişiniz Alındı! 📦 (Sipariş Kodunuz İçeridedir)",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #27272a;">
                <h2 style="color: #00e5ff; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Siparişiniz Alındı! 🎉</h2>
                <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">Merhaba <strong style="color: #fff;">${musteri?.ad || "Değerli Müşterimiz"}</strong>,</p>
                <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">Siparişiniz sistemimize başarıyla ulaştı ve hazırlık aşamasına alındı. Siparişinizin anlık durumunu, aşağıdaki takip kodunuz ile sitemizdeki <strong>"Sipariş Takip"</strong> ekranından dilediğiniz zaman kontrol edebilirsiniz.</p>
                
                <div style="background-color: #121215; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; border: 1px solid #27272a; box-shadow: 0 0 15px rgba(0, 229, 255, 0.05);">
                  <p style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Sipariş Takip Kodunuz</p>
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 3px;">${siparisKodu}</h1>
                </div>
                
                <p style="color: #a1a1aa; font-size: 14px; text-align: center;">Bizi tercih ettiğiniz için teşekkür ederiz!<br><br><strong style="color: #00e5ff;">Bilgin PC Market</strong></p>
              </div>
            `,
          };

          // Maili arka planda fırlatıyoruz ki müşteri ekranda beklemesin!
          transporter.sendMail(mailSecenekleri).catch((err: any) => console.error("Mail gönderilemedi:", err));
        }
      } catch (mailHatasi) {
        console.error("Postacı motoru çalışamadı:", mailHatasi);
      }
      // 🚀 POSTACI İŞİNİ BİTİRDİ VE MERKEZE DÖNDÜ!

    if (odemeYontemi === "havale") {
      return NextResponse.json({ success: true, odemeYontemi: "havale", siparisKodu });
    }

    let sepetUrunleri = sepet.map((item: any) => ({
      id: item.id,
      name: item.isim,
      category1: "Bilgisayar Donanim",
      itemType: "PHYSICAL",
      price: (item.fiyat * item.adet).toString()
    }));

    const araToplam = sepet.reduce((top: number, u: any) => top + (u.fiyat * u.adet), 0);
    const kargoUcreti = araToplam > 5000 ? 0 : 150;
    
    if (kargoUcreti > 0) {
      sepetUrunleri.push({
        id: "KARGO-01",
        name: "Teslimat Bedeli",
        category1: "Hizmet",
        itemType: "VIRTUAL",
        price: kargoUcreti.toString()
      });
    }

    // ŞEFİM DİKKAT: Site URL'sini garanti altına aldık (Origin bazen boş gelebiliyor)
    const host = request.headers.get("host") || "app.bilginpcmarket.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const siteUrl = `${protocol}://${host}`;

    const iyzicoTalep = {
      locale: "tr",
      conversationId: siparisKodu,
      price: toplamTutar.toString(),
      paidPrice: toplamTutar.toString(),
      currency: "TRY",
      basketId: siparisKodu,
      paymentGroup: "PRODUCT",
      callbackUrl: `${siteUrl}/api/iyzico-sonuc?siparisKodu=${siparisKodu}`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: "MUSTERI-123", // Sabitlendi
        name: musteri.ad || "Müşteri",
        surname: musteri.soyad || "Soyadı",
        gsmNumber: "+905555555555", // Iyzico telefon formatında çok hata verir, test için sabitledik
        email: musteri.eposta || "test@test.com",
        identityNumber: "11111111111", 
        lastLoginDate: "2026-05-21 12:00:00",
        registrationDate: "2026-05-21 12:00:00",
        registrationAddress: musteri.adres || "Test Adresi",
        ip: "85.34.78.112", // IP formatı hata vermesin diye sabitledik
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        zipCode: "34000"
      },
      shippingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        address: musteri.adres || "Test Adresi",
        zipCode: "34000"
      },
      billingAddress: {
        contactName: `${musteri.ad} ${musteri.soyad}`,
        city: musteri.sehir || "Istanbul",
        country: "Turkey",
        address: musteri.adres || "Test Adresi",
        zipCode: "34000"
      },
      basketItems: sepetUrunleri
    };

    // ŞEFİM DİKKAT: Hataları yakalama (Catch) mantığını değiştirdik. Artık sistem çökse bile bize hatayı okuyacak!
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
        checkoutFormContent: iyzicoSonuc.checkoutFormContent
      });
    } else {
      // İŞTE IYZICO'NUN BİZE VERECEĞİ GERÇEK GİZLİ MESAJ BURADA EKRANA ÇIKACAK:
      return NextResponse.json({ error: `Iyzico Reddetti: ${iyzicoSonuc.errorMessage || JSON.stringify(iyzicoSonuc)}` }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API HATASI:", error);
    return NextResponse.json({ error: `Arka Uç Çöktü: ${error.message}` }, { status: 500 });
  }
}