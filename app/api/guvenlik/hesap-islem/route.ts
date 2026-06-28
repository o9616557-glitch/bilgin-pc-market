import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "bilginpcmarket";
const OAUTH_ONAY_METNI = "ONAYLA";

async function kimlikDogrula(
  dbKullanici: { password?: string },
  sifre: string | undefined,
  onayMetni: string | undefined
) {
  if (dbKullanici.password) {
    if (!sifre) {
      return { ok: false as const, hata: "Devam etmek için şifrenizi girmelisiniz." };
    }
    const sifreDogruMu = await bcrypt.compare(sifre, dbKullanici.password);
    if (!sifreDogruMu) {
      return { ok: false as const, hata: "Girdiğiniz şifre hatalı." };
    }
    return { ok: true as const };
  }

  if (onayMetni?.trim().toUpperCase() !== OAUTH_ONAY_METNI) {
    return { ok: false as const, hata: `Devam etmek için kutuya "${OAUTH_ONAY_METNI}" yazmalısınız.` };
  }
  return { ok: true as const };
}

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
    const { islem, sifre, onayMetni } = await req.json();

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

    const dogrulama = await kimlikDogrula(dbKullanici, sifre, onayMetni);
    if (!dogrulama.ok) {
      return NextResponse.json({ hata: dogrulama.hata }, { status: 400 });
    }

    if (islem === 'sil') {
      await kaliciHesapSil(db, email, dbKullanici._id as ObjectId);

      return NextResponse.json({
        mesaj: "Hesabınız silindi. Sipariş kayıtlarınız yasal zorunluluk gereği korunmaktadır."
      }, { status: 200 });
    }

    if (islem === 'dondur') {
      const pasifCihazlar = (dbKullanici.activeDevices || []).map((c: any) => ({
        ...c,
        isActive: false,
      }));

      await usersCollection.updateOne(
        { _id: dbKullanici._id },
        { $set: { isActive: false, activeDevices: pasifCihazlar } }
      );

      await db.collection("reviews").updateMany(
        { email },
        { $set: { isVisible: false } }
      );

      return NextResponse.json({ mesaj: "Hesabınız donduruldu. Tekrar giriş yapamazsınız." }, { status: 200 });
    }

    return NextResponse.json({ hata: "Geçersiz işlem türü!" }, { status: 400 });

  } catch (error) {
    console.error("Hesap İşlem Hatası:", error);
    return NextResponse.json({ hata: "Sunucu tarafında bir arıza çıktı." }, { status: 500 });
  }
}
