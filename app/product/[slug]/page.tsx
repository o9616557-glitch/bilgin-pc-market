import React from "react";
import ProductClient from "./ProductClient";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. ANA ÜRÜNÜ FİŞEK GİBİ KENDİ MONGO KASAMIZDAN ÇEKİYORUZ!
  const client = await clientPromise;
  const db = client.db("bilginpcmarket");

  let product = null;
  try {
    // Önce ID'ye göre ara, bulamazsa slug(isim) olarak ara
    if (ObjectId.isValid(slug)) {
      product = await db.collection("products").findOne({ _id: new ObjectId(slug) });
    }
    if (!product) {
      product = await db.collection("products").findOne({ slug: slug });
    }
    if (!product) {
      // Slug olarak da bulamadıysa, adından veya isimden bul
      product = await db.collection("products").findOne({ $or: [{ name: slug }, { isim: slug }] });
    }
  } catch (e) {
    console.error("Ürün çekilirken hata:", e);
  }

  // 2. RAKİP ÜRÜNLERİ DE KENDİ VERİTABANIMIZDAN ÇEKİYORUZ
  let allProducts: any[] = [];
  try {
    allProducts = await db.collection("products").find({}).toArray();
  } catch (error) {
    console.error("Diğer ürünler çekilemedi şefim:", error);
  }

  // ŞEFİM: İŞTE O KIRMIZI ÇİZGİLERİ YOK EDEN KURŞUN GEÇİRMEZ TEMİZLİK MOTORU!
  // MongoDB objelerini frontend'in anlayacağı kusursuz ve saf JSON formatına çeviriyoruz.
  const temizUrun = product 
    ? JSON.parse(JSON.stringify({ ...product, _id: product._id.toString() })) 
    : null;

  const temizTumUrunler = allProducts.map(p => 
    JSON.parse(JSON.stringify({ ...p, _id: p._id ? p._id.toString() : p.id }))
  );

  // 3. FİŞEK GİBİ ARAYÜZE (PRODUCT CLIENT) TERTEMİZ PASLA
  return <ProductClient product={temizUrun} allProducts={temizTumUrunler} />;
}