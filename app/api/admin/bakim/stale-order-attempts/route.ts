import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GIZLI_ANAHTAR = "Bilgin123";

type BakimOrder = {
  _id: unknown;
  siparisKodu?: string;
  odemeDurumu?: string;
  durum?: string;
  status?: string;
  musteriyeGoster?: boolean;
  gizlendi?: boolean;
  gecersizDeneme?: boolean;
  supersededBy?: string;
  odemeHataMesaji?: string;
  createdAt?: Date | string;
  tarih?: Date | string;
};

function parseBool(value: string | null) {
  return value === "1" || value === "true";
}

function formatOrder(order: BakimOrder) {
  return {
    id: String(order._id),
    siparisKodu: order.siparisKodu || "-",
    odemeDurumu: order.odemeDurumu || "-",
    durum: order.durum || order.status || "-",
    musteriyeGoster: Boolean(order.musteriyeGoster),
    gizlendi: Boolean(order.gizlendi),
    gecersizDeneme: Boolean(order.gecersizDeneme),
    supersededBy: order.supersededBy || null,
    odemeHataMesaji: order.odemeHataMesaji || "-",
    createdAt: order.createdAt || order.tarih || null,
  };
}

async function adayKayitlariGetir(
  includeIptal: boolean,
  limit: number
) {
  const client = await clientPromise;
  const db = client.db("bilginpcmarket");

  const query = {
    $and: [
      { bakimTemizlendiAt: { $exists: false } },
      {
        $or: [
          { odemeDurumu: "zaman_asimi" },
          { gecersizDeneme: true },
          ...(includeIptal
            ? [
                {
                  musteriyeGoster: false,
                  odemeDurumu: "iptal",
                  odemeHataMesaji: { $exists: true, $ne: "" },
                },
              ]
            : []),
        ],
      },
    ],
  };

  const orders = await db
    .collection("orders")
    .find(query)
    .sort({ tarih: -1, createdAt: -1 })
    .limit(limit)
    .toArray();

  return {
    db,
    orders,
    summary: {
      total: orders.length,
      zamanAsimi: orders.filter((order) => order.odemeDurumu === "zaman_asimi").length,
      gecersizDeneme: orders.filter((order) => order.gecersizDeneme === true).length,
      iptal: orders.filter((order) => order.odemeDurumu === "iptal").length,
    },
  };
}

function yetkiKontrol(request: Request) {
  const gelenAnahtar = request.headers.get("x-patron-anahtar");
  return gelenAnahtar === GIZLI_ANAHTAR;
}

export async function GET(request: Request) {
  try {
    if (!yetkiKontrol(request)) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const url = new URL(request.url);
    const includeIptal = parseBool(url.searchParams.get("includeIptal"));
    const limit = Math.min(Number(url.searchParams.get("limit") || "200"), 500);

    const { orders, summary } = await adayKayitlariGetir(includeIptal, Number.isFinite(limit) ? limit : 200);

    return NextResponse.json({
      success: true,
      dryRun: true,
      includeIptal,
      summary,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("Stale order attempts önizleme hatası:", error);
    return NextResponse.json({ error: "Bakım önizlemesi oluşturulamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!yetkiKontrol(request)) {
      return NextResponse.json({ error: "Erişim Engellendi!" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const includeIptal = Boolean(body?.includeIptal);
    const limit = Math.min(Number(body?.limit || 200), 500);

    const { db, orders, summary } = await adayKayitlariGetir(includeIptal, Number.isFinite(limit) ? limit : 200);

    if (orders.length === 0) {
      return NextResponse.json({
        success: true,
        applied: true,
        modifiedCount: 0,
        summary,
        orders: [],
      });
    }

    const ids = orders.map((order) => order._id);
    const result = await db.collection("orders").updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          gizlendi: true,
          gecersizDeneme: true,
          musteriyeGoster: false,
          bakimTemizlendiAt: new Date(),
          bakimTemizligiNotu: "Eski başarısız/zaman aşımı ödeme denemesi operasyon listesinden çıkarıldı.",
        },
      }
    );

    return NextResponse.json({
      success: true,
      applied: true,
      includeIptal,
      modifiedCount: result.modifiedCount,
      summary,
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("Stale order attempts bakım hatası:", error);
    return NextResponse.json({ error: "Bakım işlemi tamamlanamadı." }, { status: 500 });
  }
}
