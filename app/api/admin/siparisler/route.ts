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

    // 1. SİHİRLİ DOKUNUŞ: Önce siparişi bulalım ki kime mail atacağımızı bilelim
    const siparis = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    const guncellenecekler: any = {};
    if (yeniDurum !== undefined) guncellenecekler.durum = yeniDurum;
    if (musteriMesaji !== undefined) guncellenecekler.musteriMesaji = musteriMesaji;

    // 2. Veritabanında güncelleme yapıyoruz (Senin orijinal kodun)
    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: guncellenecekler }
    );

    // 🚀 3. POSTACI DEVREDE: Eğer durum değiştiyse ve önemli bir aşamaysa mail fırlat!
    if (siparis && yeniDurum && (yeniDurum === "Ödendi / Hazırlanıyor" || yeniDurum === "Kargoya Verildi" || yeniDurum === "İptal Edildi")) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "o9616557@gmail.com",
          pass: "vfph bxkd gzsv enpg",
        },
        tls: { rejectUnauthorized: false }
      });

      // Müşteri mailini siparişten akıllıca çekiyoruz
      const musteriMaili = siparis.userEmail || siparis.email || siparis.musteri?.eposta || siparis.musteri?.email;

      if (musteriMaili) {
        let baslik = "Siparişinizin Durumu Güncellendi";
        let altMesaj = `Siparişinizin durumu <strong>${yeniDurum}</strong> olarak güncellenmiştir.`;

        if (yeniDurum === "Ödendi / Hazırlanıyor") {
          baslik = "Ödemeniz Onaylandı! 🚀";
          altMesaj = "Ödemeniz başarıyla tarafımıza ulaşmış ve siparişiniz hazırlık aşamasına geçmiştir. Ürünleriniz özenle paketleniyor!";
        } else if (yeniDurum === "Kargoya Verildi") {
          baslik = "Siparişiniz Kargoya Verildi! 🚚";
          altMesaj = "Paketiniz yola çıkmıştır! Sipariş takip kodunuzla kargo durumunuzu anlık olarak sitemizden sorgulayabilirsiniz.";
        } else if (yeniDurum === "İptal Edildi") {
          baslik = "Siparişiniz İptal Edildi ✖️";
          altMesaj = "Siparişiniz mağazamız tarafından iptal edilmiştir. Eğer bir hata olduğunu düşünüyorsanız müşteri hizmetlerimizle iletişime geçebilirsiniz.";
        }

        const mailSecenekleri = {
          from: `"Bilgin PC Market" <o9616557@gmail.com>`,
          to: musteriMaili,
          subject: baslik,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #ffffff; padding: 40px 30px; border-radius: 12px; border: 1px solid #27272a; text-align: center;">
              <h2 style="color: #00e5ff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">${baslik}</h2>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Merhaba <strong style="color: #fff;">${siparis.musteri?.ad || siparis.musteri?.isim || "Değerli Müşterimiz"}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">${altMesaj}</p>
              
              <div style="background-color: #121215; padding: 20px; border-radius: 8px; margin: 0 auto 30px auto; border: 1px solid #27272a; max-width: 300px; box-shadow: 0 0 15px rgba(0, 229, 255, 0.05);">
                <p style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Sipariş Kodu</p>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">${siparis.siparisKodu || "BPC-Sipariş"}</h1>
              </div>
              
              <p style="color: #a1a1aa; font-size: 14px;">Bizi tercih ettiğiniz için teşekkür ederiz!<br><br><strong style="color: #00e5ff;">Bilgin PC Market</strong></p>
            </div>
          `,
        };

        // Maili arka planda atıyoruz ki senin admin panelin hiç donmasın!
        transporter.sendMail(mailSecenekleri).catch((err: any) => console.log("Admin mail yollama hatası:", err));
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