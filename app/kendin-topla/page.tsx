import clientPromise from "@/lib/mongodb";
import KendinToplaClient from "./KendinToplaClient";

export const revalidate = 60;

export default async function KendinToplaPage() {
  let tumSihirbazParcalari: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    const sihirbazKategorileri = [
      "islemci", "anakart", "ram", "ekran-karti", "ssd", "kasa", "psu", "sogutma"
    ];

    // 🚀 Sadece sihirbazın ihtiyacı olan bilgileri çekip sayfayı tüy gibi hafifletiyoruz!
    const rawUrunler = await db.collection("products").find(
      { kategoriSlug: { $in: sihirbazKategorileri } },
      { projection: { 
          isim: 1, fiyat: 1, indirimliFiyat: 1, resim: 1, 
          kategoriSlug: 1, sihirbaz_ozellikleri: 1, 
          teknik_ozellikler: 1, aciklama: 1, marka: 1, havaleIndirimi: 1
        } 
      }
    ).toArray();

    tumSihirbazParcalari = rawUrunler.map(urun => ({
      ...urun,
      _id: urun._id.toString()
    }));

  } catch (error) {
    console.error("Sihirbaz verileri çekilirken hata:", error);
  }

  return <KendinToplaClient initialProducts={tumSihirbazParcalari} />;
}