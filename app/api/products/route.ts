import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; 

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bilginpcmarket"); 

    const products = await db.collection("products").find({}).toArray();

    return NextResponse.json({ products });
    
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}