import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "bilginpcmarket";

async function kaliciHesapSil(db: Db, email: string, userId: ObjectId) {
  await Promise.all([
    db.collection("reviews").deleteMany({ email }),
    db.collection("saved_systems").deleteMany({ userId: email }),
    db.collection("carts").deleteMany({ userId: email }),
    db.collection("desteks").deleteMany({ kullaniciEmail: email }),
    db.collection("wallets").deleteMany({ email }),
  ]);

  await db.collection("users").deleteOne({ _id: userId });
}

export async function POST(req: Request) {
  try {
    const { islem, sifre } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ hata: "Önce giriş yapmalısınız." }, { status: 401 });
    }

    const email = session.user.email;
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const dbKullanici = await usersCollection.findOne({ email });
    if (!dbKullanici) {
      return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    if (dbKullanici.password) {
      if (!sifre) {
        return NextResponse.json({ hata: "Devam etmek için şifrenizi girmelisiniz." }, { status: 400 });
      }
      const sifreDogruMu = await bcrypt.compare(sifre, dbKullanici.password);
      if (!sifreDogruMu) {
        return NextResponse.json({ hata: "Girdiğiniz şifre hatalı." }, { status: 400 });
      }
    }

    if (islem === 'sil') {
      await kaliciHesapSil(db, email, dbKullanici._id as ObjectId);

      return NextResponse.json({
        mesaj: "Hesabınız silindi. Sipariş kayıtlarınız yasal zorunluluk gereği korunmaktadır."
      }, { status: 200 });
    }

    if (islem === 'dondur') {
      await usersCollection.updateOne(
        { _id: dbKullanici._id },
        { $set: { isActive: false } }
      );

      await db.collection("reviews").updateMany(
        { email },
        { $set: { isVisible: false } }
      );

      return NextResponse.json({ mesaj: "Hesabınız başarıyla dondurulmuştur. İyi günler dileriz." }, { status: 200 });
    }

    return NextResponse.json({ hata: "Geçersiz işlem türü!" }, { status: 400 });

  } catch (error) {
    console.error("Hesap İşlem Hatası:", error);
    return NextResponse.json({ hata: "Sunucu tarafında bir arıza çıktı." }, { status: 500 });
  }
}
