import React from "react";

import { Metadata } from "next";

// 🚀 SİHİRLİ SEO MOTORU: Google bu sayfaya girdiği an bu fonksiyon çalışır!
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    
    // Senin kendi hızlı MongoDB bağlantınla ürünü buluyoruz
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const product = await db.collection("products").findOne({ slug: resolvedParams.slug });

    if (!product || !product.isim) {
      return { title: "Ürün Bulunamadı | Bilgin PC" };
    }

    // Açıklamadaki HTML kodlarını (<h2>, <p>) temizle ve 160 karaktere kısalt
    const temizAciklama = product.açıklama 
      ? product.açıklama.replace(/<[^>]+>/g, '').substring(0, 160) + "..." 
      : `${product.isim} en uygun fiyatlarla stoklarımızda!`;

    return {
      title: `${product.isim} | Bilgin PC`,
      description: temizAciklama,
      openGraph: {
        title: product.isim,
        description: temizAciklama,
        images: [{ url: product.resim || "https://via.placeholder.com/600", width: 800, height: 600 }],
      },
    };
  } catch (error) {
    return { title: "Ürün Detayı | Bilgin PC" };
  }
} 

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