import clientPromise from "@/lib/mongodb";

export default async function HomePage() {
  let urunler: any[] = [];
  
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    // KOLEKSİYON ADINI TAM OLARAK "ürünler" YAPTIK
    urunler = await db.collection("ürünler").find({}).toArray();
  } catch (e) {
    console.error("HATA:", e);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Bilgin PC Market</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {urunler.length > 0 ? (
          urunler.map((urun) => (
            <div key={urun._id.toString()} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
              <h2>{urun.isim}</h2>
              <p style={{ fontWeight: "bold" }}>{urun.fiyat} TL</p>
              <p>Stok: {urun.stok_durumu}</p>
            </div>
          ))
        ) : (
          <p>Veritabanı bağlantısı kuruldu ama ürünler yüklenemedi. Lütfen koleksiyon ismini kontrol et.</p>
        )}
      </div>
    </main>
  );
}