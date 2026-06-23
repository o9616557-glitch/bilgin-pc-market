import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";

// ⚠️ ŞEFİN DİKKATİNE: Kendi auth ve mongodb bağlantı yollarını buraya yazmalısın
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import clientPromise from "@/lib/mongodb"; // Saf MongoDB bağlantı dosyan

export async function POST(req: Request) {
  try {
    // 1. Gelen Paketi Teslim Al
    const { islem, sifre } = await req.json();

    // 2. Güvenlik Duvarı: Oturum Açmış Kullanıcıyı Bul
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ hata: "Önce giriş yapmalısınız." }, { status: 401 });
    }

    // 3. SAF MONGODB'YE BAĞLAN
    const client = await clientPromise;
    const db = client.db(); 
    
    // Koleksiyonları Tanımla
    const usersCollection = db.collection("users"); 
    
    // ⚠️ DİKKAT: Yorumların/değerlendirmelerin kaydedildiği koleksiyonun adı "comments" veya "reviews" olabilir.
    // Senin veritabanında hangisiyse burayı ona göre değiştir:
    const commentsCollection = db.collection("reviews"); 

    // 4. Veritabanından Kullanıcıyı Bul
    const dbKullanici = await usersCollection.findOne({ email: session.user.email });
    if (!dbKullanici) {
      return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
    }

   // 5. Şifre Doğrulama (Google ile girenlerde şifre olmadığı için bu adımı akıllıca yönetiyoruz)
    if (dbKullanici.password) {
      // Eğer kullanıcının veritabanında şifresi varsa (Normal e-posta ile üye olmuşsa) şifreyi kontrol et
      const sifreDogruMu = await bcrypt.compare(sifre, dbKullanici.password);
      if (!sifreDogruMu) {
        return NextResponse.json({ hata: "Girdiğiniz şifre hatalı." }, { status: 400 });
      }
    } else {
      // ŞEFİM DİKKAT: Eğer dbKullanici.password YOKSA, adam Google veya Facebook ile girmiş demektir.
      // Zaten oturumu açık (session var), o yüzden şifre kontrolünü es geçip işleme onay veriyoruz.
    }

    // 🚀 6. ŞİFRE DOĞRUYSA İŞLEMİ ATEŞLE
    if (islem === 'sil') {
      // 1. Kullanıcıyı hesaptan tamamen sil
      await usersCollection.deleteOne({ _id: dbKullanici._id });
      
      // 2. Bu kullanıcının yaptığı TÜM yorumları kalıcı olarak sil
      await commentsCollection.deleteMany({ email: session.user.email });

      return NextResponse.json({ mesaj: "Hesabınız başarıyla silinmiştir. İyi günler dileriz." }, { status: 200 });
      
    } else if (islem === 'dondur') {
      // 1. Kullanıcının profilini pasif yap
      await usersCollection.updateOne(
        { _id: dbKullanici._id },
        { $set: { isActive: false } } 
      );
      
      // 2. Kullanıcının yorumlarını GEÇİCİ OLARAK GİZLE
      await commentsCollection.updateMany(
        { email: session.user.email },
        { $set: { isVisible: false } } 
      );

      return NextResponse.json({ mesaj: "Hesabınız başarıyla dondurulmuştur. İyi günler dileriz." }, { status: 200 });
      
    } else {
      return NextResponse.json({ hata: "Geçersiz işlem türü!" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Hesap İşlem Hatası:", error);
    return NextResponse.json({ hata: "Sunucu tarafında bir arıza çıktı." }, { status: 500 });
  }
}