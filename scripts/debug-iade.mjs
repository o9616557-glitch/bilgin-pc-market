import { MongoClient } from "mongodb";
import fs from "fs";

const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const uri = env.split("\n").find((l) => l.startsWith("MONGODB_URI="))?.slice("MONGODB_URI=".length).trim();

const client = new MongoClient(uri);
await client.connect();
const db = client.db("bilginpcmarket");

const orders = await db
  .collection("orders")
  .find({ $or: [{ durum: /iade/i }, { status: /iade/i } ] })
  .sort({ _id: -1 })
  .limit(5)
  .toArray();

const out = [];
for (const o of orders) {
  out.push(`=== SIPARIS ${o.siparisKodu || o.orderNumber} | durum: ${o.durum} | status: ${o.status}`);
  out.push(`toplamIadeEdilenTutar: ${o.toplamIadeEdilenTutar}`);
  const items = (o.sepet?.length ? o.sepet : o.items) || [];
  out.push("KALEMLER:");
  for (const k of items) {
    out.push(`  - ${(k.isim || k.title || k.name || "?").slice(0, 30)} | idVar: ${Boolean(k.id || k._id || k.productId)} | adet: ${k.adet || k.quantity} | iadeEdilenAdet: ${k.iadeEdilenAdet}`);
  }
  const gecmis = (o.iadeGecmisi || []).map((g) => ({
    tamIade: g.tamIade,
    kalemAdet: (g.kalemler || []).length,
    kalemler: (g.kalemler || []).map((kk) => ({ isim: (kk.isim || "?").slice(0, 25), urunIdVar: Boolean(kk.urunId), adet: kk.adet })),
  }));
  out.push("iadeGecmisi: " + JSON.stringify(gecmis));
}
console.log(out.join("\n"));

// Ilgili destek talepleri
const talepler = await db
  .collection("destektalepleri")
  .find({ konu: "iade", iadeOdendi: true })
  .sort({ _id: -1 })
  .limit(5)
  .toArray();
const tout = ["\n=== IADE TALEPLERI ==="];
for (const t of talepler) {
  const kalemler = (t.iadeKalemleri || []).map((kk) => ({ isim: (kk.isim || "?").slice(0, 25), urunIdVar: Boolean(kk.urunId), adet: kk.adet }));
  tout.push(`talep siparisNo: ${t.siparisNo} | iadeKalemleri: ${JSON.stringify(kalemler)}`);
}
console.log(tout.join("\n"));

await client.close();
