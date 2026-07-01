import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GIZLI_ANAHTAR = "Bilgin123";

export async function GET(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const kayit = await db.collection("site_ayarlari").findOne({ _id: "duyuru" as any });

    return NextResponse.json({
      success: true,
      duyuru: {
        metin: kayit?.metin || "",
        aktif: Boolean(kayit?.aktif),
        tip: kayit?.tip || "bilgi",
      },
    });
  } catch {
    return NextResponse.json({ error: "Duyuru getirilemedi." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const gelenAnahtar = request.headers.get("x-patron-anahtar");
    if (gelenAnahtar !== GIZLI_ANAHTAR) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const body = await request.json();
    const metin = String(body.metin || "").trim();
    const aktif = Boolean(body.aktif);
    const tip = ["bilgi", "uyari", "kampanya"].includes(body.tip) ? body.tip : "bilgi";

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    await db.collection("site_ayarlari").updateOne(
      { _id: "duyuru" as any },
      {
        $set: {
          metin,
          aktif: aktif && metin.length > 0,
          tip,
          guncellemeTarihi: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Duyuru kaydedilemedi." }, { status: 500 });
  }
}
