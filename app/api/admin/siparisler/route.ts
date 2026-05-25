import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GIZLI_ANAHTAR = "Bilgin123"; 

export async function GET(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    const siparisler = await db.collection("orders").find({}).sort({ tarih: -1 }).toArray();
    
    return new NextResponse(JSON.stringify({ success: true, siparisler }), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Siparişleri çekerken hata:", error);
    return NextResponse.json({ error: "Siparişler getirilemedi." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const { id, yeniDurum, musteriMesaji } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // 1. Önce siparişi bulalım ki mail atacağımız müşterinin bilgilerini çekelim
    const ObjectId = require("mongodb").ObjectId;
    const siparis = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    const guncellenecekler: any = {};
    if (yeniDurum !== undefined) guncellenecekler.durum = yeniDurum;
    if (musteriMesaji !== undefined) guncellenecekler.musteriMesaji = musteriMesaji;

    // 2. Veritabanında güncelleme yapıyoruz
    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: guncellenecekler }
    );

    // 🚀 3. AKILLI POSTACI MÜHÜRÜ: Sadece senin onay verdiğin durumlarda tetiklenir!
    if (siparis && yeniDurum && (yeniDurum === "Ödendi / Hazırlanıyor" || yeniDurum === "Kargoya Verildi" || yeniDurum === "İptal Edildi")) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "o9616557@gmail.com",
          pass: "vfph bxkd gzsv enpg", // Senin tıkır tıkır çalışan gizli uygulama şifren
        },
        tls: { rejectUnauthorized: false }
      });

      // Müşteri mailini sipariş kayıtlarından güvenli bir şekilde cımbızlıyoruz
      const musteriMaili = siparis.userEmail || siparis.email || siparis.musteri?.eposta || siparis.musteri?.email;

      if (musteriMaili) {
        let baslik = "Siparişinizin Durumu Güncellendi";
        let altMesaj = `Siparişinizin durumu <strong>${yeniDurum}</strong> olarak güncellenmiştir.`;

        // Duruma göre dinamik başlık ve kurumsal açıklamalar
        if (yeniDurum === "Ödendi / Hazırlanıyor") {
          baslik = "Ödemeniz Onaylandı! 🚀";
          altMesaj = "Ödemeniz başarıyla tarafımıza ulaşmış ve siparişiniz hazırlık aşamasına geçmiştir. Ürünleriniz uzman ekibimiz tarafından özenle paketleniyor! En kısa sürede kargoya teslim edilecektir.";
        } else if (yeniDurum === "Kargoya Verildi") {
          baslik = "Siparişiniz Kargoya Verildi! 🚚";
          altMesaj = "Beklenen an geldi! Paketiniz başarıyla yola çıkmıştır. Sipariş takip kodunuzu sitemizdeki <strong>'Sipariş Takip'</strong> ekranına yazarak kargonuzun nerede olduğunu anlık olarak izleyebilirsiniz.";
        } else if (yeniDurum === "İptal Edildi") {
          baslik = "Siparişiniz İptal Edildi ✖️";
          altMesaj = "Siparişiniz mağazamız tarafından iptal edilmiştir. İptal süreci veya ücret iadeniz hakkında detaylı bilgi almak için dükkanımızla doğrudan iletişime geçebilirsiniz.";
        }

        const mailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: baslik,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #ffffff; padding: 40px 30px; border-radius: 12px; border: 1px solid #27272a; text-align: center;">
              <h2 style="color: #00e5ff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; font-size: 24px;">${baslik}</h2>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 12px;">Merhaba <strong style="color: #fff;">${siparis.musteri?.ad || siparis.musteri?.isim || "Değerli Müşterimiz"}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 30px; padding: 0 10px;">${altMesaj}</p>
              
              <div style="background-color: #121215; padding: 20px; border-radius: 8px; margin: 0 auto 30px auto; border: 1px solid #27272a; max-width: 320px; box-shadow: 0 0 15px rgba(0, 229, 255, 0.05);">
                <p style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 1px;">Sipariş Takip Kodunuz</p>
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: bold;">${siparis.siparisKodu || "BPC-SIPARIS"}</h1>
              </div>
              
              <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin-bottom: 25px;">Siparişinizle ilgili tüm sorularınız için destek hattımız üzerinden bizimle doğrudan iletişime geçebilirsiniz.</p>
              <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Bizi tercih ettiğiniz için teşekkür ederiz!<br><br><strong style="color: #00e5ff; font-size: 16px; letter-spacing: 0.5px;">Bilgin PC Market</strong></p>
            </div>
          `,
        };

        // Maili arka planda fırlatıyoruz ki senin admin ekranında hiçbir takılma veya yavaşlama olmasın
       await transporter.sendMail(mailSecenekleri).catch((err: any) => console.log("Admin mail gönderme hatası:", err));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş güncellenirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}

// ŞEFİM: İŞTE YENİ SİLME MOTORUMUZ!
export async function DELETE(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    
    // Veritabanından o siparişi kökünden siliyoruz
    await db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş silinirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}