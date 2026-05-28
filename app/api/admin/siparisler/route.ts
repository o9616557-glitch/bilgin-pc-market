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
  let baslik = "SİPARİŞ DURUMUNUZ GÜNCELLENDİ";
  let altMesaj = `Siparişinizin durumu <strong>${yeniDurum}</strong> olarak güncellenmiştir.`;

  // 🚀 HARF BOZULMASINI ÖNLEMEK İÇİN BAŞLIKLARI DİREKT BÜYÜK YAZDIK
  if (yeniDurum === "Ödendi / Hazırlanıyor") {
    baslik = "SİPARİŞİNİZ ONAYLANDI 🚀";
    altMesaj = "Ödemeniz başarıyla tarafımıza ulaşmış ve siparişiniz hazırlık aşamasına geçmiştir. Ürünleriniz uzman ekibimiz tarafından özenle paketleniyor! En kısa sürede kargoya teslim edilecektir.";
  } else if (yeniDurum === "Kargoya Verildi") {
    baslik = "SİPARİŞİNİZ KARGOYA VERİLDİ 📦";
    altMesaj = "Beklenen an geldi! Paketiniz başarıyla yola çıkmıştır. Sipariş takip kodunuzu sitemizdeki <strong>Sipariş Takip</strong> ekranına yazarak kargonuzun nerede olduğunu anlık olarak izleyebilirsiniz.";
  } else if (yeniDurum === "İptal Edildi") {
    baslik = "SİPARİŞİNİZ İPTAL EDİLDİ ❌";
    altMesaj = "Siparişiniz mağazamız tarafından iptal edilmiştir. İptal süreci veya ücret iadeniz hakkında detaylı bilgi almak için dükkanımızla doğrudan iletişime geçebilirsiniz.";
  }

  const mailSecenekleri = {
    from: '"Bilgin PC Market" <o9616557@gmail.com>', // Kendi mailin kalsın
    to: musteriMaili,
    subject: baslik,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #03050a; color: #ffffff; padding: 40px 30px; border-radius: 16px; border: 1px solid rgba(0, 229, 255, 0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
        
        <h2 style="color: #00e5ff; letter-spacing: 1px; margin-bottom: 24px; font-size: 26px; font-weight: 900; text-shadow: 0 0 10px rgba(0,229,255,0.4); text-align: center;">${baslik}</h2>
        
        <p style="color: #e4e4e7; font-size: 16px; line-height: 1.6; margin-bottom: 16px; text-align: center;">Merhaba <strong style="color: #fff;">${siparis.musteri?.ad || siparis.musteri?.isim || "Değerli Müşterimiz"}</strong>,</p>
        
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 35px; padding: 0 15px; text-align: center;">${altMesaj}</p>

        <div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 12px; margin: 0 auto 35px auto; border: 1px dashed rgba(0, 229, 255, 0.4); max-width: 320px; text-align: center;">
          <p style="color: #a1a1aa; font-size: 12px; margin-bottom: 12px; letter-spacing: 1px;">SİPARİŞ TAKİP KODUNUZ</p>
          
          <div style="background-color: #000000; padding: 12px 20px; border-radius: 8px; display: inline-block; border: 1px solid rgba(0,229,255,0.2); user-select: all; -webkit-user-select: all;">
            <h1 style="color: #00e5ff; margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 900; display: inline-block;">${siparis.siparisKodu || "BPC-SIPARIS"}</h1>
          </div>
          
          <p style="color: #71717a; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
            <span style="font-size: 14px; vertical-align: middle;">📋</span> Kodu kopyalamak için üzerine basılı tutun
          </p>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; text-align: center;">
          
          <h3 style="color: #ffffff; font-size: 18px; margin-bottom: 8px; letter-spacing: 0.5px;">Yardıma mı İhtiyacınız Var?</h3>
          <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin-top: 0; margin-bottom: 25px; padding: 0 10px;">
            Siparişinizle ilgili en ufak bir sorunuzda veya talebinizde hiç endişelenmeyin. Uzman ekibimiz size destek olmak için bir mesaj uzağınızda!
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
              <span style="color: #00e5ff; font-weight: 900; font-size: 14px; float: right;">0850 305 59 68</span>
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