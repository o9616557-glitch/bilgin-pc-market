import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Destek from "@/models/Destek";
import clientPromise from "@/lib/mongodb";
import { connectMongo } from "@/lib/mongoose";

export const dynamic = "force-dynamic";

function siparisleriTemizle(orders: Record<string, unknown>[]) {
  return orders
    .filter((o) => o.gizlendi !== true)
    .map((order) => ({
      ...order,
      _id: order._id instanceof ObjectId ? order._id.toString() : String(order._id),
      userId: order.userId instanceof ObjectId ? order.userId.toString() : order.userId,
    }))
    .sort((a, b) => {
      const aTarih = new Date((a.createdAt || a.tarih) as string).getTime();
      const bTarih = new Date((b.createdAt || b.tarih) as string).getTime();
      return bTarih - aTarih;
    });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    await connectMongo();
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const email = session.user.email;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const aranacakMailler = [...new Set([...(user.kayitliEpostalar || []), email])];

    const [rawOrders, userCart, talepler, savedSystems] = await Promise.all([
      db.collection("orders").find({
        $and: [
          {
            $or: [
              { userEmail: { $in: aranacakMailler } },
              { email: { $in: aranacakMailler } },
              { "customerDetails.email": { $in: aranacakMailler } },
              { "musteri.eposta": { $in: aranacakMailler } },
            ],
          },
          { gizlendi: { $ne: true } },
        ],
      }).sort({ createdAt: -1 }).limit(100).toArray(),
      db.collection("carts").findOne({ userId: email }),
      Destek.find({ kullaniciEmail: email, musteriGizledi: { $ne: true } })
        .sort({ createdAt: -1 })
        .lean(),
      db.collection("saved_systems").find({ userId: email }).sort({ createdAt: -1 }).toArray(),
    ]);

    const favoriteIds = user.favorites || [];
    let favorites: Record<string, unknown>[] = [];

    if (favoriteIds.length > 0) {
      const objectIdArray = favoriteIds.map((id: string) => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch {
          return id;
        }
      });

      const rawUrunler = await db.collection("products").find({
        $or: [{ _id: { $in: objectIdArray } }, { id: { $in: favoriteIds } }],
      }).toArray();

      favorites = rawUrunler.map((urun) => ({
        ...urun,
        _id: urun._id.toString(),
      }));
    }

    const systems = savedSystems.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));

    return NextResponse.json({
      addresses: user.addresses || [],
      favorites,
      talepler,
      orders: siparisleriTemizle(rawOrders as Record<string, unknown>[]),
      cart: userCart?.items || [],
      systems,
    });
  } catch (error) {
    console.error("Üye başlangıç verisi hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}
