import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; 

// 1. Kullanıcının Adreslerini Getir (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] }, { status: 200 });
  } catch (error) {
    console.error("Adresler Getirilirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// 2. Yeni Adres Ekle (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
    }

    const newAddress = await req.json();
    
    // 🚀 BİNGO: E-Posta kontrolü sisteme lehimlendi!
    if (!newAddress.title || !newAddress.fullName || !newAddress.phone || !newAddress.email || !newAddress.fullAddress) {
      return NextResponse.json({ message: "Lütfen e-posta dahil gerekli tüm adres alanlarını doldurun." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // ŞEFİM: TAHT OYUNLARI KURALI (Sadece bir varsayılan adres olabilir)
    if (newAddress.isDefaultDelivery) {
      user.addresses.forEach((addr: any) => { addr.isDefaultDelivery = false; });
    }
    if (newAddress.isDefaultBilling) {
      user.addresses.forEach((addr: any) => { addr.isDefaultBilling = false; });
    }

    // Yeni ve güncel adresi listeye ekle
    user.addresses.push(newAddress);
    await user.save();
    
    return NextResponse.json({ 
      message: "Adres başarıyla eklendi.",
      addresses: user.addresses 
    }, { status: 201 });

  } catch (error) {
    console.error("Adres Eklenirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// 3. Adres Güncelle (PUT)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...guncellenenAlan } = body;

    if (!_id) {
      return NextResponse.json({ message: "Adres ID belirtilmedi." }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const adres = user.addresses.id(_id);
    if (!adres) {
      return NextResponse.json({ message: "Adres bulunamadı." }, { status: 404 });
    }

    Object.assign(adres, guncellenenAlan);
    await user.save();

    return NextResponse.json({ message: "Adres güncellendi.", addresses: user.addresses }, { status: 200 });
  } catch (error) {
    console.error("Adres Güncellenirken Hata:", error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}

// 4. Adres Sil (DELETE)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get('id');

        if (!addressId) {
            return NextResponse.json({ message: "Adres ID belirtilmedi." }, { status: 400 });
        }

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        const user = await User.findOne({ email: session.user.email });
        
        user.addresses.pull({ _id: addressId });
        await user.save();

        return NextResponse.json({ message: "Adres silindi.", addresses: user.addresses }, { status: 200 });

    } catch(error) {
        console.error("Adres Silinirken Hata:", error);
        return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
    }
}