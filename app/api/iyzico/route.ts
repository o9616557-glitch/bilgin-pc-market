import { NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Next.js sepetinden ve adres formundan gelen gerçek verileri yakalıyoruz
        const { cartItems, customerDetails, totalPrice } = body;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Sepet boş' }, { status: 400 });
        }

        // Fiyatı İyzico formatına (Örn: 34500.00) güvenle çeviriyoruz
        const formattedPrice = parseFloat(totalPrice).toFixed(2);

        const request = {
            locale: 'tr',
            conversationId: 'BPC-' + Math.floor(Math.random() * 1000000), // Benzersiz Sipariş Kodu
            price: formattedPrice,
            paidPrice: formattedPrice,
            currency: 'TRY',
            basketId: 'BASKET-' + Math.floor(Math.random() * 100000),
            paymentGroup: 'PRODUCT',
            callbackUrl: "https://www.bilginpcmarket.com/api/iyzico-callback", // Ödeme bitince Vercel'de döneceği yer
            enabledInstallments: [2, 3, 6, 9], // Peşin fiyatına taksit kanalları
            buyer: {
                id: 'CUST-' + Math.floor(Math.random() * 10000),
                name: customerDetails?.first_name || 'Ziyaretçi',
                surname: customerDetails?.last_name || 'Müşteri',
                gsmNumber: customerDetails?.phone || '+905551234567',
                email: customerDetails?.email || 'satis@bilginpcmarket.com',
                identityNumber: '11111111111', // T.C. Kimlik Zorunluluğu
                lastLoginDate: '2026-05-18 21:30:00',
                registrationDate: '2026-05-10 12:00:00',
                registrationAddress: customerDetails?.address_1 || 'Belirtilmedi',
                ip: '85.34.78.112',
                city: customerDetails?.city || 'Istanbul',
                country: 'Turkey',
                zipCode: customerDetails?.postcode || '34000'
            },
            shippingAddress: {
                contactName: `${customerDetails?.first_name || 'Müşteri'} ${customerDetails?.last_name || ''}`,
                city: customerDetails?.city || 'Istanbul',
                country: 'Turkey',
                address: customerDetails?.address_1 || 'Belirtilmedi',
                zipCode: customerDetails?.postcode || '34000'
            },
            billingAddress: {
                contactName: `${customerDetails?.first_name || 'Müşteri'} ${customerDetails?.last_name || ''}`,
                city: customerDetails?.city || 'Istanbul',
                country: 'Turkey',
                address: customerDetails?.address_1 || 'Belirtilmedi',
                zipCode: customerDetails?.postcode || '34000'
            },
            // 🔥 HATALI ÇARPMANIN DÜZELTİLDİĞİ GÜVENLİ ALAN: Önce sayıya çevirip sonra çarpıyoruz
            basketItems: cartItems.map((item: any, idx: number) => ({
                id: item.id?.toString() || `PROD-${idx}`,
                name: item.name || 'Bilgisayar Bileşeni',
                category1: 'Donanım',
                itemType: 'PHYSICAL',
                price: (parseFloat(item.price) * (item.quantity || 1)).toFixed(2)
            }))
        };

        return new Promise((resolve) => {
            iyzipay.checkoutFormInitialize.create(request, function (err: any, result: any) {
                if (err) {
                    console.error("İyzico API Hatası:", err);
                    return resolve(NextResponse.json({ success: false, error: err }, { status: 500 }));
                }
                return resolve(NextResponse.json({ success: true, data: result }));
            });
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Kritik Sunucu Hatası' }, { status: 500 });
    }
}