import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { MongoClient } from "mongodb";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getArg(flag) {
  return process.argv.includes(flag);
}

function formatOrder(order) {
  return {
    id: String(order._id),
    siparisKodu: order.siparisKodu || "-",
    odemeDurumu: order.odemeDurumu || "-",
    durum: order.durum || order.status || "-",
    musteriyeGoster: Boolean(order.musteriyeGoster),
    gizlendi: Boolean(order.gizlendi),
    gecersizDeneme: Boolean(order.gecersizDeneme),
    odemeHataMesaji: order.odemeHataMesaji || "-",
    createdAt: order.createdAt || order.tarih || null,
  };
}

async function main() {
  const rootDir = process.cwd();
  loadEnvFile(path.join(rootDir, ".env.local"));
  loadEnvFile(path.join(rootDir, ".env"));

  const shouldApply = getArg("--apply");
  const shouldIncludeIptal = getArg("--include-iptal");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : 200;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI bulunamadı. .env.local veya .env tanımlayın.");
  }

  const query = {
    $or: [
      { odemeDurumu: "zaman_asimi" },
      { gecersizDeneme: true },
      ...(shouldIncludeIptal
        ? [
            {
              musteriyeGoster: false,
              odemeDurumu: "iptal",
              odemeHataMesaji: { $exists: true, $ne: "" },
            },
          ]
        : []),
    ],
  };

  const client = new MongoClient(uri, { maxPoolSize: 5 });

  try {
    await client.connect();
    const db = client.db("bilginpcmarket");
    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ tarih: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    console.log("");
    console.log(`Aday kayıt sayısı: ${orders.length}`);
    console.table(orders.map(formatOrder));

    if (!shouldApply) {
      console.log("");
      console.log("Dry-run tamamlandı. Değişiklik uygulanmadı.");
      console.log("Gerçek temizlik için:");
      console.log("npm run cleanup:stale-order-attempts -- --apply");
      console.log("");
      console.log("İptal edilmiş başarısız denemeleri de dahil etmek için:");
      console.log("npm run cleanup:stale-order-attempts -- --apply --include-iptal");
      return;
    }

    if (orders.length === 0) {
      console.log("Güncellenecek kayıt bulunamadı.");
      return;
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

    console.log("");
    console.log(`Temizlik tamamlandı. Güncellenen kayıt: ${result.modifiedCount}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Temizlik scripti başarısız oldu:");
  console.error(error);
  process.exit(1);
});
