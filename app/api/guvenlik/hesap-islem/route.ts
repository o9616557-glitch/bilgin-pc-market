import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";

// ⚠️ ŞEFİN DİKKATİNE: Kendi auth ve mongodb bağlantı yollarını buraya yazmalısın
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import clientPromise from "@/lib/mongodb"; // Saf MongoDB bağlantı dosyan (genelde böyledir)

export async function POST(req: Request) {
  try {
    // 1. Gelen Paketi Teslim Al
    const { islem, sifre } = await req.json();

    // 2. Güvenlik Duvarı: Oturum Açmış Adamı Bul
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ hata: "Önce giriş yapmalısınız şefim!" }, { status: 401 });
    }

    // 3. SAF MONGODB'YE BAĞLAN
    const client = await clientPromise;
    // ⚠️ DİKKAT: Veritabanı adını (test, mydatabase vs.) kendininkine göre ayarla
    const db = client.db(); 
    // ⚠️ DİKKAT: Kullanıcıların olduğu koleksiyonun adını yaz (genelde 'users' olur)
    const usersCollection = db.collection("users"); 

    // 4. Veritabanından Kullanıcıyı Bul
    const dbKullanici = await usersCollection.findOne({ email: session.user.email });
    if (!dbKullanici) {
      return NextResponse.json({ hata: "Kullanıcı bulunamadı!" }, { status: 404 });
    }

    // 5. Şifre Doğrulama (Bcrypt ile kriptoyu çöz)
    const sifreDogruMu = await bcrypt.compare(sifre, dbKullanici.password);
    if (!sifreDogruMu) {
      return NextResponse.json({ hata: "Girdiğiniz şifre hatalı usta!" }, { status: 400 });
    }

    // 🚀 6. ŞİFRE DOĞRUYSA İŞLEMİ ATEŞLE (SAF MONGODB KOMUTLARI)
    if (islem === 'sil') {
      // Dükkanı Dinamitle: Kullanıcıyı koleksiyondan acımadan sil
      await usersCollection.deleteOne({ _id: dbKullanici._id });
      return NextResponse.json({ mesaj: "Hesap kalıcı olarak silindi." }, { status: 200 });
      
    } else if (islem === 'dondur') {
      // Uykuya Yatır: Kullanıcının verisini pasif yap
      await usersCollection.updateOne(
        { _id: dbKullanici._id },
        { $set: { isActive: false } } // Senin sistemde dondurulma ibaresi neyse onu yazabilirsin
      );
      return NextResponse.json({ mesaj: "Hesap başarıyla donduruldu." }, { status: 200 });
      
    } else {
      return NextResponse.json({ hata: "Geçersiz işlem türü!" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Hesap İşlem Hatası:", error);
    return NextResponse.json({ hata: "Sunucu tarafında bir arıza çıktı usta." }, { status: 500 });
  }
}