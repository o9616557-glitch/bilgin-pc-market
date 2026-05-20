import clientPromise from "@/lib/mongodb";

export default async function UrunDetaySayfasi({ params }: { params: { slug: string } }) {
  // URL'deki ürünün adını (slug) alıyoruz
  const slug = params.slug;

  let urun = null;

  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 
    
    // Veritabanından bu slug'a (veya isme) sahip ürünü çekiyoruz
    urun = await db.collection("products").findOne({ slug: slug }); 
    // Not: Eğer veritabanında 'slug' diye bir alanın yoksa, burayı isme veya id'ye göre ayarlayacağız.
  } catch (e) {
    console.error("HATA:", e);
  }

  // Eğer ürün bulunamazsa
  if (!urun) {
    return (
      <main style={{ padding: "100px 20px", textAlign: "center" }}>
        <h1>Ürün Bulunamadı</h1>
        <p>Aradığınız ürün yayından kaldırılmış veya adresi yanlış olabilir.</p>
      </main>
    );
  }

  // Ürün Bulunursa Gösterilecek Şablon (Gelecekte buraya FPS, Tablolar eklenecek)
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Sol Taraf: Resim Alanı */}
        <div style={{ flex: "1 1 400px", background: "#f9f9f9", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
          <div style={{ width: "100%", height: "400px", background: "#eee", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
             Buraya Ürün Resmi Gelecek
          </div>
        </div>

        {/* Sağ Taraf: Ürün Bilgileri */}
        <div style={{ flex: "1 1 400px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{urun.isim || "Ürün Adı"}</h1>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0070f3", marginBottom: "20px" }}>
            {urun.fiyat} TL
          </p>
          
          <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "8px 16px", borderRadius: "8px", display: "inline-block", marginBottom: "30px" }}>
            {urun.stok_durumu || "Stokta Var"}
          </div>

          <p style={{ color: "#555", lineHeight: "1.6", marginBottom: "30px" }}>
            Bu alan ürünün kısa açıklaması için ayrılmıştır. Yarın burayı veritabanından dinamik çekeceğiz.
          </p>

          <button style={{ width: "100%", padding: "15px", fontSize: "1.2rem", background: "black", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Sepete Ekle
          </button>
        </div>

      </div>

      {/* Alt Kısım: Teknik Özellikler ve FPS (Yarın Burayı Şahlandıracağız) */}
      <div style={{ marginTop: "60px", borderTop: "1px solid #ddd", paddingTop: "40px" }}>
        <h2>Teknik Özellikler ve Performans Testleri</h2>
        <p>Yarın bu kısma sekme (tab) sistemi kurup FPS grafiklerini yerleştireceğiz.</p>
      </div>
    </main>
  );
}