import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb'; 
import MenuAyar from '@/models/MenuAyar';

// 👑 FABRİKA AYARLARI (Sistemin Tek Doğru Kaynağı)
// İleride yeni bir kutu eklersen sadece buraya yazman yeterli şefim!
const FABRIKA_AYARI_MENU = [
  { id: "profil", isim: "Profil", renk: "text-cyan-400" },
  { id: "cuzdan", isim: "Cüzdan", renk: "text-amber-400" },
  { id: "guvenlik", isim: "Güvenlik", renk: "text-emerald-400" },
  { id: "adresler", isim: "Adresler", renk: "text-cyan-400" },
  { id: "favoriler", isim: "Favoriler", renk: "text-purple-400" },
  { id: "sistemler", isim: "Sistemler", renk: "text-emerald-400" },
  { id: "kargolar", isim: "Kargolar", renk: "text-rose-400" },
  { id: "destek", isim: "Destek", renk: "text-orange-400" },
  { id: "sorgula", isim: "Sorgula", renk: "text-blue-400" }
];

// 🟢 GET: Menüyü çeker ve eksik kutu varsa otomatik veritabanını günceller
export async function GET(req: Request) {
  try {
    await connectMongoDB;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    // Kullanıcının kaydını bul
    let kullaniciAyari = await MenuAyar.findOne({ kullaniciEmail: email });

    // 1. Senaryo: Kullanıcı ilk defa giriyor, hiç kaydı yoksa direkt fabrika ayarını kaydet
    if (!kullaniciAyari || !kullaniciAyari.menuListesi || kullaniciAyari.menuListesi.length === 0) {
      kullaniciAyari = await MenuAyar.create({
        kullaniciEmail: email,
        menuListesi: FABRIKA_AYARI_MENU
      });
      return NextResponse.json({ success: true, data: kullaniciAyari });
    }

    // 2. Senaryo: Kullanıcının kaydı var ama sistemdeki yeni kutular onda eksik! (Admin çakışması çözümü)
    const kayitliListe = kullaniciAyari.menuListesi;
    const eksikKutular = FABRIKA_AYARI_MENU.filter(f => !kayitliListe.some((k: any) => k.id === f.id));

    if (eksikKutular.length > 0) {
      // Eksikleri eski listenin sonuna ekle (Veritabanını yeni fabrika ayarıyla güncelle)
      const guncelSira = [...kayitliListe, ...eksikKutular];
      kullaniciAyari.menuListesi = guncelSira;
      await kullaniciAyari.save(); // Mongo kalıcı olarak güncellendi!
    }

    return NextResponse.json({ success: true, data: kullaniciAyari });
  } catch (error) {
    console.error("Menü çekme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}

// 🔴 POST: Kullanıcı menüyü düzenleyip kapattığında yeni sırayı kaydeder
export async function POST(req: Request) {
  try {
    await connectMongoDB;
    const body = await req.json();
    const { kullaniciEmail, menuListesi } = body;

    if (!kullaniciEmail) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    const guncelAyar = await MenuAyar.findOneAndUpdate(
      { kullaniciEmail: kullaniciEmail },
      { menuListesi: menuListesi },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: guncelAyar });
  } catch (error) {
    console.error("Menü kaydetme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}