import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb'; 
import MenuAyar from '@/models/MenuAyar';

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

export async function GET(req: Request) {
  try {
    await connectMongoDB;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    let kullaniciAyari = await MenuAyar.findOne({ kullaniciEmail: email });

    // 🚀 ÇÖZÜM: Sadece kullanıcı hiç yoksa fabrika ayarı oluştur!
    if (!kullaniciAyari) {
      kullaniciAyari = await MenuAyar.create({
        kullaniciEmail: email,
        menuListesi: FABRIKA_AYARI_MENU
      });
      return NextResponse.json({ success: true, data: kullaniciAyari });
    }

    // Kullanıcı varsa ama menü listesi boşsa sadece onu tamamla (Yok etme!)
    const kayitliListe = kullaniciAyari.menuListesi || [];
    const eksikKutular = FABRIKA_AYARI_MENU.filter(f => !kayitliListe.some((k: any) => k.id === f.id));

    if (eksikKutular.length > 0) {
      const guncelSira = [...kayitliListe, ...eksikKutular];
      kullaniciAyari.menuListesi = guncelSira;
      await kullaniciAyari.save(); 
    }

    // Her şey tamam, kullanıcının mevcut tüm verisini (mobilKategoriler dahil) güvenle gönder
    return NextResponse.json({ success: true, data: kullaniciAyari });
  } catch (error) {
    console.error("Ayar çekme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB;
    const body = await req.json();
    
    const { kullaniciEmail, menuListesi, siparisRenkleri, pastaRenkleri, cubukRenk, mobilKategoriler } = body;

    if (!kullaniciEmail) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    let guncellenecekVeriler: any = {};
    if (menuListesi) guncellenecekVeriler.menuListesi = menuListesi;
    if (siparisRenkleri) guncellenecekVeriler.siparisRenkleri = siparisRenkleri;
    if (pastaRenkleri) guncellenecekVeriler.pastaRenkleri = pastaRenkleri;
    if (cubukRenk) guncellenecekVeriler.cubukRenk = cubukRenk;
    if (mobilKategoriler) guncellenecekVeriler.mobilKategoriler = mobilKategoriler;

    const guncelAyar = await MenuAyar.findOneAndUpdate(
      { kullaniciEmail: kullaniciEmail },
      { $set: guncellenecekVeriler },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: guncelAyar });
  } catch (error) {
    console.error("Ayar kaydetme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}