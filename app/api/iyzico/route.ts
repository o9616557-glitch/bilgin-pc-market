import { NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';

// 👑 VERCEL HATASINI ENGELLEYEN SİHİRLİ SATIR: Next.js'e bu rotayı statik derleme diyoruz
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { cartItems, customerDetails, totalPrice } = body;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Sepet boş' }, { status: 400 });
        }

        const formattedPrice = parseFloat(totalPrice).toFixed(2);

        const request = {
            locale: 'tr',
            conversationId: 'BPC-' + Math.floor(Math.random() * 1000000),
            price: formattedPrice,
            paidPrice: formattedPrice,
            currency: 'TRY',
            basketId: 'BASKET-' + Math.floor(Math.random() * 10000),
            paymentGroup: 'PRODUCT',
            callbackUrl: "https://app.bilginpcmarket.com/api/iyzico-callback", 
            enabledInstallments: [2, 3, 6, 9],
            buyer: {
                id: 'CUST-' + Math.floor(Math.random() * 10000),
                name: customerDetails?.first_name || 'Ziyaretçi',
                surname: customerDetails?.last_name || 'Müşteri',
                gsmNumber: customerDetails?.phone || '+905551234567',
                email: customerDetails?.email || 'satis@bilginpcmarket.com',
                identityNumber: '11111111111',
                lastLoginDate: '2026-05-18 21:30:00',
                registrationDate: '2026-05-18 21:30:00',
                registrationAddress: customerDetails?.address_1 || 'Belirtilmedi',
                ip: '85.34.78.112',
                city: customerDetails?.city || 'İstanbul',
                country: 'Turkey',
                zipCode: customerDetails?.postcode || '34000'
            },
            shippingAddress: {
                contactName: `${customerDetails?.first_name || 'Müşteri'} ${customerDetails?.last_name || ''}`,
                city: customerDetails?.city || 'İstanbul',
                country: 'Turkey',
                address: customerDetails?.address_1 || 'Belirtilmedi',
                zipCode: customerDetails?.postcode || '34000'
            },
            billingAddress: {
                contactName: `${customerDetails?.first_name || 'Müşteri'} ${customerDetails?.last_name || ''}`,
                city: customerDetails?.city || 'İstanbul',
                country: 'Turkey',
                address: customerDetails?.address_1 || 'Belirtilmedi',
                zipCode: customerDetails?.postcode || '34000'
            },
            basketItems: cartItems.map((item: any, idx: number) => ({
                id: item.id?.toString() || `PROD-${idx}`,
                name: item.name || 'Bilgisayar Bileşeni',
                category1: 'Donanım',
                itemType: 'PHYSICAL',
                price: (parseFloat(item.price) * (item.quantity || 1)).toFixed(2)
            }))
        };

        const iyzicoResponse = await new Promise<NextResponse>((resolve) => {
            iyzipay.checkoutForm.initialize(request, function (err: any, result: any) {
                if (err || result?.status !== 'success') {
                    resolve(NextResponse.json({ success: false, error: result?.errorMessage || 'İyzico başlatılamadı' }, { status: 500 }));
                } else {
                    resolve(NextResponse.json({ success: true, data: result }));
                }
            });
        });

        return iyzicoResponse;

    } catch (error: any) {
        console.error("İyzico API Hatası:", error);
        return NextResponse.json({ success: false, error: 'Sistem hatası' }, { status: 500 });
    }
}