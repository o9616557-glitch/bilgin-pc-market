import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import clientPromise from "@/lib/mongodb";

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
    const db = client.db("bilginpcmarket"); 
    
    // Koleksiyonları Tanımla
    const usersCollection = db.collection("users"); 
    const reviewsCollection = db.collection("reviews"); 
    const savedSystemsCollection = db.collection("saved_systems"); // Sistemlerim tablosu temizlik için eklendi

    // 4. Veritabanından Kullanıcıyı Bul
    const dbKullanici = await usersCollection.findOne({ email: session.user.email });
    if (!dbKullanici) {
      return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // 5. Şifre Doğrulama (Google veya Facebook ile girenlerde veritabanında şifre olmadığı için bu adımı es geçiyoruz)
    if (dbKullanici.password) {
      const sifreDogruMu = await bcrypt.compare(sifre, dbKullanici.password);
      if (!sifreDogruMu) {
        return NextResponse.json({ hata: "Girdiğiniz şifre hatalı." }, { status: 400 });
      }
    }

    // 🚀 6. İŞLEMLERİ ATEŞLE
    if (islem === 'sil') {
      // 1. Kullanıcıyı hesaptan tamamen sil (Adresler ve Favoriler bu işlemle birlikte yok olur)
      await usersCollection.deleteOne({ _id: dbKullanici._id });
      
      // 2. Bu kullanıcının yaptığı TÜM yorumları kalıcı olarak sil
      await reviewsCollection.deleteMany({ email: session.user.email });

      // 3. Kaydettiği tüm PC sistemlerini veritabanından temizle (Çöp kalmaz)
      await savedSystemsCollection.deleteMany({ userId: session.user.email });

      return NextResponse.json({ mesaj: "Hesabınız başarıyla silinmiştir. İyi günler dileriz." }, { status: 200 });
      
    } else if (islem === 'dondur') {
      // 1. Kullanıcının profilini pasif yap
      await usersCollection.updateOne(
        { _id: dbKullanici._id },
        { $set: { isActive: false } } 
      );
      
      // 2. Kullanıcının yorumlarını GEÇİCİ OLARAK GİZLE
      await reviewsCollection.updateMany(
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