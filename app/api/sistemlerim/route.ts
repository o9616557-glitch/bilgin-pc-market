import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb"; // 🚀 BİNGO: Silinmeme sorununun çözümü bu sihirli kelimeydi!

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("bilginpcmarket");
    const savedSystems = await db.collection("saved_systems").find({ userId: session.user.email }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, systems: savedSystems });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false }, { status: 401 });

    const { name, selections } = await request.json();
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    await db.collection("saved_systems").insertOne({
      userId: session.user.email,
      name: name,
      selections: selections,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ success: false }, { status: 401 });

    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db("bilginpcmarket");

    await db.collection("saved_systems").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.email 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}