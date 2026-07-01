import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const kayit = await db.collection("site_ayarlari").findOne({ _id: "duyuru" as any });

    if (!kayit?.aktif || !kayit?.metin?.trim()) {
      return NextResponse.json({ success: true, duyuru: null });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        duyuru: {
          metin: kayit.metin,
          tip: kayit.tip || "bilgi",
        },
      }),
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json({ success: true, duyuru: null });
  }
}
