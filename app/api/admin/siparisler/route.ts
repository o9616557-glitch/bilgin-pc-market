import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { siparisOdulPuanVer, siparisIadeCuzdanIslemleri } from "@/lib/siparis-puan";

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
    
    const siparisler = await db.collection("orders").find({
      $nor: [
        {
          musteriyeGoster: false,
          odemeDurumu: "odeme_bekliyor",
          odemeYontemi: { $in: ["kart", "bkm"] },
        },
      ],
    }).sort({ tarih: -1 }).toArray();
    
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

    const { id, yeniDurum, musteriMesaji, kargoFirmasi, takipNo } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const ObjectId = require("mongodb").ObjectId;
    const siparis = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    const guncellenecekler: any = {};
    if (yeniDurum !== undefined) {
      guncellenecekler.durum = yeniDurum;
      guncellenecekler.status = yeniDurum;
      if (yeniDurum === "Ödeme Bekliyor (Havale)") {
        guncellenecekler.musteriyeGoster = true;
        guncellenecekler.odemeDurumu = "havale_bekliyor";
      }
      if (yeniDurum === "Ödendi / Hazırlanıyor" || yeniDurum === "Kargoya Verildi" || yeniDurum === "Tamamlandı") {
        guncellenecekler.musteriyeGoster = true;
        guncellenecekler.odemeDurumu = "onaylandi";
      }
      if (yeniDurum === "İptal Edildi") {
        guncellenecekler.odemeDurumu = "iptal";
      }
    }
    if (musteriMesaji !== undefined) guncellenecekler.musteriMesaji = musteriMesaji;
    if (kargoFirmasi !== undefined) {
      guncellenecekler.kargoFirmasi = kargoFirmasi;
      guncellenecekler.shippingCompany = kargoFirmasi;
    }
    if (takipNo !== undefined) {
      guncellenecekler.takipNo = takipNo;
      guncellenecekler.kargoTakipNo = takipNo;
      guncellenecekler.trackingNumber = takipNo;
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: guncellenecekler }
    );

    const guncelSiparis = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (guncelSiparis && yeniDurum === "İptal Edildi") {
      await siparisIadeCuzdanIslemleri(db, guncelSiparis);
    }

    if (guncelSiparis && yeniDurum === "İade Edildi" && !guncelSiparis.iadeCuzdanIslendi) {
      await siparisIadeCuzdanIslemleri(db, guncelSiparis);
    }

    if (
      guncelSiparis &&
      yeniDurum &&
      (yeniDurum === "Ödendi / Hazırlanıyor" || yeniDurum === "Kargoya Verildi" || yeniDurum === "Tamamlandı")
    ) {
      await siparisOdulPuanVer(db, guncelSiparis);
    }

    if (siparis && yeniDurum && (yeniDurum === "Ödendi / Hazırlanıyor" || yeniDurum === "Kargoya Verildi" || yeniDurum === "Tamamlandı" || yeniDurum === "İptal Edildi")) {
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

      const musteriMaili = siparis.userEmail || siparis.email || siparis.musteri?.eposta || siparis.musteri?.email;

      if (musteriMaili) {
        let baslik = "SİPARİŞ DURUMUNUZ GÜNCELLENDİ";
        let altMesaj = `Siparişinizin durumu <strong>${yeniDurum}</strong> olarak güncellenmiştir.`;
        let anaRenk = "#3b82f6"; 
        let ikon = "🔄";

        if (yeniDurum === "Ödendi / Hazırlanıyor") {
          baslik = "SİPARİŞ ONAYLANDI";
          altMesaj = "Ödemeniz başarıyla tarafımıza ulaşmış ve siparişiniz hazırlık aşamasına geçmiştir. Ürünleriniz uzman ekibimiz tarafından özenle paketleniyor! En kısa sürede kargoya teslim edilecektir.";
          anaRenk = "#f59e0b"; 
          ikon = "⏳";
        } else if (yeniDurum === "Kargoya Verildi") {
          baslik = "KARGONUZ YOLA ÇIKTI";
          altMesaj = "Paketiniz başarıyla kargo firmasına teslim edildi! Takip kodunuzu kullanarak siparişinizi anlık olarak izleyebilirsiniz.";
          anaRenk = "#10b981"; 
          ikon = "🚀";
        } else if (yeniDurum === "Tamamlandı") {
          baslik = "SİPARİŞ TESLİM EDİLDİ";
          altMesaj = "Siparişiniz başarıyla teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.";
          anaRenk = "#00d2ff"; 
          ikon = "🎉";
        } else if (yeniDurum === "İptal Edildi") {
          baslik = "SİPARİŞ İPTAL EDİLDİ";
          altMesaj = "Siparişiniz mağazamız tarafından iptal edilmiştir. İptal süreci veya ücret iadeniz hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.";
          anaRenk = "#ef4444"; 
          ikon = "❌";
        }

        const aliciAdSoyad = (siparis.musteri?.ad || siparis.musteri?.isim) 
          ? `${siparis.musteri?.ad || siparis.musteri?.isim} ${siparis.musteri?.soyad || ""}`.trim() 
          : "Değerli Müşterimiz";

        // 📦 GÜVENLİ VE KATRE SİYAHI KARGO TAKİP KUTUSU
        let kargoAlaniHtml = "";
        const finalKargoFirma = kargoFirmasi || siparis.kargoFirmasi || "Standart Kargo";
        const finalTakipNo = takipNo || siparis.takipNo;

        if (yeniDurum === "Kargoya Verildi" && finalTakipNo) {
          kargoAlaniHtml = `
            <div style="background-color: #0b1712; border: 1px solid #10b981; padding: 25px; border-radius: 12px; margin: 0 auto 35px auto; max-width: 320px; text-align: left; box-shadow: 0 5px 15px rgba(16,185,129,0.15);">
              <h3 style="color: #10b981; font-size: 14px; margin-top: 0; margin-bottom: 15px; letter-spacing: 1px; text-align: center; border-bottom: 1px dashed rgba(16, 185, 129, 0.3); padding-bottom: 10px;">📦 KARGO BİLGİSİ</h3>
              
              <div style="margin-bottom: 12px; font-size: 15px; overflow: hidden;">
                <span style="color: #a1a1aa; float: left;">Firma:</span>
                <strong style="color: #ffffff; float: right; text-transform: uppercase;">${finalKargoFirma}</strong>
              </div>
              <div style="font-size: 15px; overflow: hidden;">
                <span style="color: #a1a1aa; float: left;">Takip No:</span>
                <strong style="color: #10b981; float: right; letter-spacing: 1px;">${finalTakipNo}</strong>
              </div>
            </div>
          `;
        }

        // 💎 SİTENİN ÖZEL NEON MAVİSİ İLE MODERLEŞTİRİLMİŞ SİTE İÇİ SİPARİŞ KUTUSU
        const siteIciTakipHtml = `
          <div style="background-color: #0b0e17; border: 1px solid #00d2ff; padding: 25px; border-radius: 12px; margin: 0 auto 35px auto; max-width: 320px; text-align: left; box-shadow: 0 5px 15px rgba(0,210,255,0.15);">
            <h3 style="color: #00d2ff; font-size: 14px; margin-top: 0; margin-bottom: 15px; letter-spacing: 1px; text-align: center; border-bottom: 1px dashed rgba(0, 210, 255, 0.3); padding-bottom: 10px;">📋 SİTE İÇİ SİPARİŞ KODU</h3>
            
            <div style="text-align: center; margin-top: 15px; margin-bottom: 10px;">
              <div style="background-color: #000000; padding: 12px 20px; border-radius: 8px; display: inline-block; border: 1px solid #1e293b;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 900; display: inline-block;">${siparis.siparisKodu || "BPC-SIPARIS"}</h1>
              </div>
            </div>
            <p style="color: #94a3b8; font-size: 11px; margin-top: 15px; margin-bottom: 0; text-align: center;">Sitemizdeki <strong>Sipariş Takip</strong> ekranından bu kod ile sorgulama yapabilirsiniz.</p>
          </div>
        `;

        const mailSecenekleri = {
          from: '"Bilgin PC Market" <o9616557@gmail.com>', 
          to: musteriMaili,
          subject: `${ikon} ${baslik} - Bilgin PC Market`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 40px 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
              
              <h2 style="color: ${anaRenk}; letter-spacing: 1px; margin-bottom: 24px; font-size: 24px; font-weight: 900; text-align: center; text-transform: uppercase;">${ikon} ${baslik}</h2>
              
              <p style="color: #e4e4e7; font-size: 16px; line-height: 1.6; margin-bottom: 16px; text-align: center;">Merhaba <strong style="color: #fff;">${aliciAdSoyad}</strong></p>
              
              <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 35px; padding: 0 10px; text-align: center;">${altMesaj}</p>

              ${kargoAlaniHtml}

              ${siteIciTakipHtml}

              <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; text-align: center;">
                
                <h3 style="color: #ffffff; font-size: 17px; margin-bottom: 8px; letter-spacing: 0.5px;">Yardıma mı İhtiyacınız Var?</h3>
                <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin-top: 0; margin-bottom: 25px; padding: 0 10px;">
                  Siparişinizle ilgili en ufak bir sorunuzda veya talebinizde endişelenmeyin. Uzman ekibimiz size destek olmak için bir mesaj uzağınızda!
                </p>

                <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; text-align: left; max-width: 350px; margin: 0 auto;">
                  
                  <div style="margin-bottom: 14px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 10px; overflow: hidden;">
                    <span style="font-size: 16px; margin-right: 8px; float: left;">💬</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold; float: left;">WhatsApp:</span> 
                    <span style="color: #10b981; font-weight: 900; font-size: 14px; float: right;">0532 734 50 23</span>
                  </div>

                  <div style="margin-bottom: 14px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 10px; overflow: hidden;">
                    <span style="font-size: 16px; margin-right: 8px; float: left;">📞</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold; float: left;">Müşteri Hizm:</span> 
                    <span style="color: #3b82f6; font-weight: 900; font-size: 14px; float: right;">0850 305 59 68</span>
                  </div>

                  <div style="overflow: hidden;">
                    <span style="font-size: 16px; margin-right: 8px; float: left;">🌐</span>
                    <span style="color: #e4e4e7; font-size: 14px; font-weight: bold; float: left;">Web:</span> 
                    <a href="https://www.bilginpcmarket.com" style="color: #a1a1aa; font-size: 13px; text-decoration: none; float: right;">bilginpcmarket.com</a>
                  </div>

                </div>
              </div>
            
            </div>
          `
        };

        await transporter.sendMail(mailSecenekleri).catch((err: any) => console.log("Admin mail gönderme hatası:", err));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş güncellenirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}

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
    
    await db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sipariş silinirken hata:", error);
    return NextResponse.json({ error: "Sistem hatası." }, { status: 500 });
  }
}