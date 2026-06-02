import FavoriClient from "./FavoriClient";

export const metadata = {
  title: "Favorilerim | BİLGİN PC",
  description: "Favoriye eklediğiniz ürünler.",
};

export default function FavorilerSayfasi() {
  // Artık uzun uzun veritabanı sorgularına gerek yok.
  // Bütün işi FavoriClient içindeki Turbo Motor (UserContext) hallediyor!
  return <FavoriClient />;
}