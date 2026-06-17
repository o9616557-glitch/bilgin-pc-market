import clientPromise from "@/lib/mongodb";
import KendinToplaClient from "./KendinToplaClient";

// Sayfanın taze kalmasını sağlar
export const dynamic = "force-dynamic";

export default async function KendinToplaPage() {
  let tumSihirbazParcalari: any[] = [];

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Sihirbazda kullanılacak ana kategoriler (slug formatında)
    const sihirbazKategorileri = [
      "islemci", "anakart", "ram", "ekran-karti", "ssd", "kasa", "psu", "sogutma"
    ];

    // 🚀 Bütün uygun parçaları veritabanından tek seferde şak diye çekiyoruz.
    const rawUrunler = await db.collection("products").find({
      kategoriSlug: { $in: sihirbazKategorileri }
    }).toArray();

    // ID'leri Client tarafında sorun çıkarmaması için string'e çeviriyoruz
    tumSihirbazParcalari = rawUrunler.map(urun => ({
      ...urun,
      _id: urun._id.toString()
    }));

  } catch (error) {
    console.error("Sihirbaz verileri çekilirken hata:", error);
  }

  // Çekilen bütün depoyu, müşteri arayüzüne (Client'a) fırlatıyoruz!
  return <KendinToplaClient initialProducts={tumSihirbazParcalari} />;
}