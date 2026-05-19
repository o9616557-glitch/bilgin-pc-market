import clientPromise from "@/lib/mongodb";

export default async function HomePage() {
  let urunler: any[] = [];
  let debugMesaj = "Bağlantı denendi...";

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    
    // 1. Önce "urunler" diye deneyelim (Türkçe karakter yok)
    let collection = db.collection("urunler");
    urunler = await collection.find({}).toArray();

    // 2. Eğer "urunler" boşsa, belki de koleksiyonun ismi farklıdır
    if (urunler.length === 0) {
       // Tüm koleksiyonları listele bakalım ne var içinde
       const collections = await db.listCollections().toArray();
       debugMesaj = "Veritabanı boş veya koleksiyon isimleri: " + collections.map(c => c.name).join(", ");
    }
  } catch (e) {
    debugMesaj = "HATA: " + e;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Bilgin PC Market</h1>
      <p style={{ color: "red" }}>{debugMesaj}</p>
      <div style={{ display: "flex", gap: "20px" }}>
        {urunler.length > 0 ? (
          urunler.map((urun: any) => (
            <div key={urun._id.toString()} style={{ border: "1px solid #ccc", padding: "20px" }}>
              <h2>{urun.isim || "İsimsiz Ürün"}</h2>
              <p>{urun.fiyat} TL</p>
            </div>
          ))
        ) : (
          <p>Ürün bulunamadı. Lütfen sayfayı yenileyin.</p>
        )}
      </div>
    </main>
  );
}