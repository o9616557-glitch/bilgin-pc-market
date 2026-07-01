import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import {
  bosCuzdan,
  kartMarkasiBul,
  luhnGecerliMi,
  siparisleriIslemlereCevir,
  yeniKartId,
  type KayitliKart,
} from "@/lib/cuzdan";
import {
  iyzicoKartKaydet,
  iyzicoKartSil,
  IyzicoKartHata,
  IYZICO_KART_SAKLAMA_UYARI,
} from "@/lib/iyzico-kart";

export const dynamic = "force-dynamic";

const DB_NAME = "bilginpcmarket";
const MAX_KART = 5;

async function cuzdanGetir(email: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  let wallet = await db.collection("wallets").findOne({ email });

  if (!wallet) {
    await db.collection("wallets").insertOne(bosCuzdan(email));
    wallet = await db.collection("wallets").findOne({ email });
  }

  if (!wallet) {
    throw new Error("Cüzdan oluşturulamadı.");
  }

  const orders = await db.collection("orders").find({
    $and: [
      {
        $or: [
          { userEmail: email },
          { email },
          { "customerDetails.email": email },
          { "musteri.eposta": email },
        ],
      },
      { gizlendi: { $ne: true } },
    ],
  }).sort({ _id: -1 }).limit(20).toArray();

  const user = await db.collection("users").findOne(
    { email },
    { projection: { name: 1 } }
  );

  const savedCards: KayitliKart[] = (wallet.savedCards || []).map((k: any) => ({
    _id: k._id?.toString?.() || k._id,
    last4: k.last4,
    brand: k.brand,
    holderName: k.holderName,
    expiryMonth: k.expiryMonth,
    expiryYear: k.expiryYear,
    isDefault: !!k.isDefault,
    createdAt: k.createdAt || new Date().toISOString(),
    iyzicoHazir: !!(k.cardToken && (wallet.iyzicoCardUserKey || k.cardUserKey)),
  }));

  return {
    storeCredit: Number(wallet.storeCredit || 0),
    loyaltyPoints: Number(wallet.loyaltyPoints || 0),
    savedCards,
    transactions: siparisleriIslemlereCevir(orders),
    userName: user?.name || "",
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ hata: "Giriş yapmalısınız." }, { status: 401 });
    }

    const data = await cuzdanGetir(session.user.email);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Cüzdan GET hatası:", error);
    return NextResponse.json({ hata: "Cüzdan bilgileri alınamadı." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ hata: "Giriş yapmalısınız." }, { status: 401 });
    }

    const email = session.user.email;
    const body = await req.json();
    const { action } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const wallets = db.collection("wallets");

    let wallet = await wallets.findOne({ email });
    if (!wallet) {
      await wallets.insertOne(bosCuzdan(email));
      wallet = await wallets.findOne({ email });
    }
    if (!wallet) {
      return NextResponse.json({ hata: "Cüzdan oluşturulamadı." }, { status: 500 });
    }

    const kartlar: any[] = wallet.savedCards || [];

    if (action === "addCard") {
      const { cardNumber, holderName, expiryMonth, expiryYear } = body;
      const temizNumara = String(cardNumber || "").replace(/\D/g, "");

      if (!temizNumara || !holderName?.trim() || !expiryMonth || !expiryYear) {
        return NextResponse.json({ hata: "Kart numarası, kart sahibi ve son kullanma tarihini doldurun." }, { status: 400 });
      }
      if (kartlar.length >= MAX_KART) {
        return NextResponse.json({ hata: `En fazla ${MAX_KART} kart kaydedebilirsiniz.` }, { status: 400 });
      }
      if (!luhnGecerliMi(temizNumara)) {
        return NextResponse.json({ hata: "Geçersiz kart numarası." }, { status: 400 });
      }
      const ay = String(expiryMonth).padStart(2, "0");
      const yil = String(expiryYear).length === 4
        ? String(expiryYear).slice(-2)
        : String(expiryYear).padStart(2, "0");

      const simdi = new Date();
      const skt = new Date(2000 + parseInt(yil, 10), parseInt(ay, 10), 0);
      if (skt < simdi) {
        return NextResponse.json({ hata: "Kartın son kullanma tarihi geçmiş." }, { status: 400 });
      }

      const last4 = temizNumara.slice(-4);
      if (kartlar.some((k) => k.last4 === last4 && k.expiryMonth === ay && k.expiryYear === yil)) {
        return NextResponse.json({ hata: "Bu kart zaten kayıtlı." }, { status: 400 });
      }

      let iyzicoCardUserKey = wallet.iyzicoCardUserKey as string | undefined;
      let cardToken: string | undefined;
      let iyzicoUyari: string | undefined;

      try {
        const iyzicoSonuc = await iyzicoKartKaydet({
          email,
          cardNumber: temizNumara,
          holderName: holderName.trim(),
          expiryMonth: ay,
          expiryYear: yil,
          cardUserKey: iyzicoCardUserKey,
          externalId: email,
        });
        iyzicoCardUserKey = iyzicoSonuc.cardUserKey;
        cardToken = iyzicoSonuc.cardToken;
      } catch (iyzicoHata: unknown) {
        console.error("İyzico kart kayıt hatası:", iyzicoHata);
        const kapali =
          iyzicoHata instanceof IyzicoKartHata && iyzicoHata.kartSaklamaKapali;

        if (!kapali) {
          const mesaj =
            iyzicoHata instanceof Error
              ? iyzicoHata.message
              : "Kart güvenli ödeme sistemine kaydedilemedi.";
          return NextResponse.json({ hata: mesaj }, { status: 400 });
        }

        // 3007: Eklenti kapalı — kartı yalnızca cüzdanda tut (İyzico token'sız)
        iyzicoUyari = IYZICO_KART_SAKLAMA_UYARI;
      }

      const yeniKart = {
        _id: yeniKartId(),
        last4,
        brand: kartMarkasiBul(temizNumara),
        holderName: holderName.trim().toUpperCase(),
        expiryMonth: ay,
        expiryYear: yil,
        isDefault: kartlar.length === 0,
        createdAt: new Date().toISOString(),
        ...(cardToken ? { cardToken } : {}),
      };

      const guncelleme: Record<string, unknown> = { updatedAt: new Date() };
      if (iyzicoCardUserKey) guncelleme.iyzicoCardUserKey = iyzicoCardUserKey;

      await wallets.updateOne(
        { email },
        {
          $push: { savedCards: yeniKart } as any,
          $set: guncelleme,
        }
      );

      const data = await cuzdanGetir(email);
      return NextResponse.json({
        success: true,
        mesaj: cardToken
          ? "Kart kaydedildi ve İyzico'ya bağlandı."
          : "Kart cüzdanınıza kaydedildi.",
        uyari: iyzicoUyari,
        ...data,
      });
    }

    if (action === "deleteCard") {
      const { cardId } = body;
      if (!cardId) {
        return NextResponse.json({ hata: "Kart seçilmedi." }, { status: 400 });
      }

      const silinen = kartlar.find((k) => String(k._id) === String(cardId));
      const kalan = kartlar.filter((k) => String(k._id) !== String(cardId));

      if (silinen?.cardToken && wallet.iyzicoCardUserKey) {
        try {
          await iyzicoKartSil(wallet.iyzicoCardUserKey, silinen.cardToken);
        } catch (iyzicoHata) {
          console.error("İyzico kart silme hatası:", iyzicoHata);
        }
      }

      if (silinen?.isDefault && kalan.length > 0) {
        kalan[0].isDefault = true;
      }

      await wallets.updateOne(
        { email },
        { $set: { savedCards: kalan, updatedAt: new Date() } }
      );

      const data = await cuzdanGetir(email);
      return NextResponse.json({ success: true, mesaj: "Kart silindi.", ...data });
    }

    if (action === "setDefault") {
      const { cardId } = body;
      if (!cardId) {
        return NextResponse.json({ hata: "Kart seçilmedi." }, { status: 400 });
      }

      const guncel = kartlar.map((k) => ({
        ...k,
        isDefault: String(k._id) === String(cardId),
      }));

      await wallets.updateOne(
        { email },
        { $set: { savedCards: guncel, updatedAt: new Date() } }
      );

      const data = await cuzdanGetir(email);
      return NextResponse.json({ success: true, mesaj: "Varsayılan kart güncellendi.", ...data });
    }

    return NextResponse.json({ hata: "Geçersiz işlem." }, { status: 400 });
  } catch (error) {
    console.error("Cüzdan POST hatası:", error);
    return NextResponse.json({ hata: "İşlem tamamlanamadı." }, { status: 500 });
  }
}
