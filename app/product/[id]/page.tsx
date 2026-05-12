// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import FpsMotoru from "./fpsmotoru";
import ProductGallery from "./productgallery";
import ProductCompare from "./productcompare";

// BURASI KASANIN ANAHTARI - SİLDİĞİMİZ İÇİN HATA VERMİŞTİ
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

const turkceSozluk: Record<string, string> = {
  "model": "Model",
  "grafik_motoru": "Grafik Motoru",
  "ai_performansi": "AI Performansı",
  "bus_standarti": "Veri Yolu Standartı",
  "opengl": "OpenGL",
  "bellek": "Bellek",
  "saat_hizi": "Saat Hızı",
  "saatr_hizi": "Saat Hızı",
  "cuda_cekirdegi": "CUDA Çekirdeği",
  "bellek_hizi": "Bellek Hızı",
  "bellek_arayuzu": "Bellek Arayüzü",
  "cozunurluk": "Çözünürlük",
  "maksimum_ekran_destegi": "Maksimum Ekran Desteği",
  "boyutlar": "Boyutlar",
  "tavsiye_edilen_guc_kaynagi": "Tavsiye Edilen Güç Kaynağı",
  "guc_baglantilari": "Güç Bağlantıları",
  "yuva": "Yuva",
  "aura_sync": "Aura Sync"
};

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // VERİ ÇEKME - 100 YERİNE 10 ÜRÜN ÇEKEREK HIZLANDIRDIK
  const [wcRes, wpRes, allProductsRes] = await Promise.all([
    api.get(`products/${id}`).catch(() => ({ data: {} })),
    fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product/${id}`).then(res => res.json()).catch(() => ({})),
    api.get('products', { per_page: 10, status: 'publish' }).catch(() => ({ data: [] }))
  ]);

  const product = wcRes.data;
  const acf = product.acf || wpRes.acf || {};
  const uzunAciklama = product.description || "<p>Teknik analiz girilmemiştir.</p>";

  const productList = allProductsRes.data
    .map((p: any) => ({ id: p.id, name: p.name }))
    .filter((p: any) => p.id.toString() !== id.toString());

  return (
    <div className="bg-[#0b1120] min-h-screen p-4 md:p-10 text-white font-sans text-left tracking-normal">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* ANA ÜRÜN KARTI */}
        <div className="bg-[#111827] rounded-[25px] border border-slate-800/50 grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-2xl mb-6">
          <div className="p-6 md:p-10 bg-[#0b0f1a] flex items-start justify-center lg:border-r border-slate-800/50">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="p-6 md:p-10 space-y-6 flex flex-col justify-center">
            <div>
              <span className="text-blue-500 text-[10px] font-black tracking-widest mb-1 block uppercase">Performance Series</span>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white capitalize">{product.name}</h1>
              <div className="text-2xl md:text-3xl font-black text-blue-500 mt-3">{product.price} TL</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(acf).map(([key, value]: any) => {
                if (!value || typeof value === 'object' || key.toLowerCase().includes('fps')) return null;
                const duzgunBaslik = turkceSozluk[key.toLowerCase()] || key.replace(/_/g, ' ');
                return (
                  <div key={key} className="bg-[#0b0f1a] p-3 rounded-lg border border-slate-800/50">
                    <span className="text-[10px] text-slate-300 font-bold block mb-1 border-b border-white/5 pb-1 capitalize tracking-normal">{duzgunBaslik}</span>
                    <span className="text-blue-400 font-black text-xs block uppercase tracking-normal">{String(value)}</span>
                  </div>
                );
              })}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all uppercase">
              Sisteme Dahil Et
            </button>
          </div>
        </div>

        {/* CİHAZ ÖZETİ */}
        <details className="group bg-[#111827] rounded-[20px] border border-slate-800/50 overflow-hidden shadow-xl">
          <summary className="flex justify-between items-center p-4 md:p-5 cursor-pointer list-none select-none hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold">📄</div>
              <span className="text-blue-500 font-black text-base tracking-widest uppercase">Cihaz Özeti ve Detaylar</span>
            </div>
            <div className="bg-[#0b1120] w-10 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform">▼</div>
          </summary>
          <div className="p-4 md:p-8 pt-4 text-slate-300 text-xs md:text-sm border-t border-slate-800/30 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-4" dangerouslySetInnerHTML={{ __html: uzunAciklama }} />
        </details>

        {/* FPS MOTORU */}
        <details className="group bg-[#111827] rounded-[20px] border border-slate-800/50 overflow-hidden shadow-xl" open>
          <summary className="flex justify-between items-center p-4 md:p-5 cursor-pointer list-none select-none hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 w-8 h-8 rounded flex items-center justify-center text-black text-[10px]">⚡</div>
              <span className="text-green-500 font-black text-base tracking-widest uppercase">Performans Analizi</span>
            </div>
            <div className="bg-[#0b1120] w-10 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform">▼</div>
          </summary>
          <div className="p-4 md:p-8 pt-0 border-t border-slate-800/20">
            {acf && <FpsMotoru acf={acf} />}
          </div>
        </details>

        {/* KIYASLAMA MOTORU */}
        <details className="group bg-[#111827] rounded-[20px] border border-slate-800/50 overflow-hidden shadow-xl">
          <summary className="flex justify-between items-center p-4 md:p-5 cursor-pointer list-none select-none hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-slate-600 w-8 h-8 rounded flex items-center justify-center text-white text-xs">⚖️</div>
              <span className="text-slate-400 font-black text-base tracking-widest uppercase">Teknik Kıyaslama Motoru</span>
            </div>
            <div className="bg-[#0b1120] w-10 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform">▼</div>
          </summary>
          <div className="p-4 md:p-8 pt-4 border-t border-slate-800/30">
            <ProductCompare currentProduct={{ name: product.name, acf }} productList={productList} />
          </div>
        </details>

      </div>
    </div>
  );
}