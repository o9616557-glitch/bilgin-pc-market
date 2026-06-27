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

    if (!kullaniciAyari || !kullaniciAyari.menuListesi || kullaniciAyari.menuListesi.length === 0) {
      kullaniciAyari = await MenuAyar.create({
        kullaniciEmail: email,
        menuListesi: FABRIKA_AYARI_MENU
      });
      return NextResponse.json({ success: true, data: kullaniciAyari });
    }

    const kayitliListe = kullaniciAyari.menuListesi;
    const eksikKutular = FABRIKA_AYARI_MENU.filter(f => !kayitliListe.some((k: any) => k.id === f.id));

    if (eksikKutular.length > 0) {
      const guncelSira = [...kayitliListe, ...eksikKutular];
      kullaniciAyari.menuListesi = guncelSira;
      await kullaniciAyari.save(); 
    }

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
    
    // 🚀 BİNGO: Artık arka plan sadece menüleri değil, tüm renk ayarlarını da teslim alıyor
    const { kullaniciEmail, menuListesi, siparisRenkleri, pastaRenkleri, cubukRenk } = body;

    if (!kullaniciEmail) {
      return NextResponse.json({ success: false, message: "Email eksik!" }, { status: 400 });
    }

    const guncelAyar = await MenuAyar.findOneAndUpdate(
      { kullaniciEmail: kullaniciEmail },
      { 
        menuListesi: menuListesi,
        siparisRenkleri: siparisRenkleri,
        pastaRenkleri: pastaRenkleri,
        cubukRenk: cubukRenk
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: guncelAyar });
  } catch (error) {
    console.error("Ayar kaydetme hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}