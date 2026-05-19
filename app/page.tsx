import clientPromise from "@/lib/mongodb";

export default async function HomePage() {
  let urunler = [];
  
  try {
    const client = await clientPromise;
    // Veritabanı adının "bilginpcmarket", koleksiyon adının "urunler" olduğunu varsayıyoruz
    const db = client.db("bilginpcmarket"); 
    urunler = await db.collection("urunler").find({}).toArray();
  } catch (e) {
    console.error("MongoDB'ye bağlanırken hata oluştu:", e);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
        Bilgin PC Market - Yeni Sistem (MongoDB)
      </h1>
      
      <p style={{ fontSize: "18px", color: "green" }}>
        Eğer aşağıda ekran kartını görüyorsan, WordPress zindanlarından kurtulduk demektir!
      </p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "30px" }}>
        {urunler.length > 0 ? (
          urunler.map((urun) => (
            <div key={urun._id.toString()} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "320px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 10px 0" }}>{urun.isim}</h2>
              <p style={{ margin: "5px 0", fontSize: "24px", fontWeight: "bold", color: "#e60000" }}>{urun.fiyat} TL</p>
              <p style={{ margin: "5px 0" }}><strong>Stok:</strong> {urun.stok_durumu}</p>
              <p style={{ margin: "5px 0" }}><strong>Kategori:</strong> {urun.kategori}</p>
              <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#555" }}>{urun.Tanım}</p>
            </div>
          ))
        ) : (
          <p>Veritabanında ürün bulunamadı. Bağlantıyı kontrol edin veya ürün ekleyin.</p>
        )}
      </div>
    </main>
  );
}