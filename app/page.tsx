import clientPromise from "@/lib/mongodb";

export default async function HomePage() {
  let urunler: any[] = [];
  
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    // SİSTEMİN "products" OLDUĞUNU KENDİ GÖZÜMÜZLE GÖRDÜK:
    urunler = await db.collection("products").find({}).toArray();
  } catch (e) {
    console.error("HATA:", e);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Bilgin PC Market</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {urunler.length > 0 ? (
          urunler.map((urun: any) => (
            <div key={urun._id.toString()} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "300px" }}>
              <h2>{urun.isim || "İsimsiz Ürün"}</h2>
              <p style={{ fontWeight: "bold" }}>{urun.fiyat} TL</p>
              <p>Stok: {urun.stok_durumu}</p>
            </div>
          ))
        ) : (
          <p>Veritabanına bağlandık ama 'products' koleksiyonu hala boş görünüyor. Lütfen Atlas panelinde verilerin 'products' içinde olduğundan emin ol.</p>
        )}
      </div>
    </main>
  );
}