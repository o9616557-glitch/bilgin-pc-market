import FavoriClient from "./FavoriClient"; // (NOT: Client dosyanın adı neyse buraya onu yaz, örn: "./FavoriClient")

export const dynamic = "force-dynamic";

export default function FavorilerimPage() {
  // 🚀 BİNGO: Sunucuyu yoran ve sistemi donduran HİÇBİR 'await' veya fetch yok!
  // İskelet şablonu (loading) 0.001 saniyede yok olur.
  // Topu direkt senin o kusursuz çalışan Client'ına atıyoruz, veriyi o çekecek!
  return <FavoriClient initialFavorites={[]} />;
}