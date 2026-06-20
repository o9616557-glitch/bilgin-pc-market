import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// DİKKAT: Kendi authOptions yoluna göre kontrol et
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. SİSTEMLERİ GETİR (Adım 3'teki "Sistemlerim" sayfasında kullanacağız)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Lütfen giriş yapın" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Kullanıcının kaydettiği tüm sistemleri tarihe göre yeniden eskiye sıralayıp getiriyoruz
    const savedSystems = await db.collection("saved_systems")
      .find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, systems: savedSystems });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sistemler çekilemedi" }, { status: 500 });
  }
}

// 2. YENİ SİSTEM KAYDET (Şu anki lehimleme işlemimiz)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Lütfen kaydetmek için giriş yapın!" }, { status: 401 });
    }

    const { name, selections } = await request.json();
    if (!name || !selections || Object.keys(selections).length === 0) {
      return NextResponse.json({ success: false, message: "Sistem adı veya parçalar eksik!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    // Sistemin kime ait olduğunu, adını ve içindeki parçaları veritabanına mühürlüyoruz
    const newSystem = {
      userId: session.user.email,
      name: name,
      selections: selections,
      createdAt: new Date(),
    };

    await db.collection("saved_systems").insertOne(newSystem);

    return NextResponse.json({ success: true, message: "Sistem başarıyla kaydedildi!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kaydetme hatası" }, { status: 500 });
  }
}