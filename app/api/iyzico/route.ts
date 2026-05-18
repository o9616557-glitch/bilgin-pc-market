import { NextResponse } from 'next/server';
// 👑 KESİN ÇÖZÜM: Ana motoru devre dışı bırakıp doğrudan alt modülü çağırıyoruz (scandir hatası imkansız hale gelir)
// @ts-ignore
import CheckoutFormInitialize from 'iyzipay/lib/resources/checkout-form-initialize';

export const dynamic = "force-dynamic";

// İyzico'nun ihtiyaç duyduğu config nesnesini doğrudan kendimiz hazırlıyoruz
const iyzicoConfig = {
    apiKey: process.env.IYZICO_API_KEY || '',
    secretKey: process.env.IYZICO_SECRET_KEY || '',
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
};

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { cartItems, customerDetails, totalPrice } = body;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Sepet boş' }, { status: 400 });
        }

        const rawPrice = parseFloat(totalPrice);
        const formattedPrice = isNaN(rawPrice) ? "0.00" : rawPrice.toFixed(2);

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
            basketItems: cartItems.map((item: any, idx: number) => {
                const itemPrice = parseFloat(item.price || 0);
                const itemQty = parseInt(item.quantity || 1);
                const finalItemPrice = isNaN(itemPrice) ? 0 : itemPrice * itemQty;

                return {
                    id: item.id?.toString() || `PROD-${idx}`,
                    name: item.name || 'Bilgisayar Bileşeni',
                    category1: 'Donanım',
                    itemType: 'PHYSICAL',
                    price: finalItemPrice.toFixed(2)
                };
            })
        };

        const iyzicoResponse = await new Promise<NextResponse>((resolve) => {
            // Hatalı üst sınıf yerine doğrudan alt sınıfı ayağa kaldırıyoruz
            const initializeInstance = new CheckoutFormInitialize(iyzicoConfig);
            
            initializeInstance.create(request, function (err: any, result: any) {
                if (err || result?.status !== 'success') {
                    console.error("İyzico Hata Detayı:", result);
                    resolve(NextResponse.json({ success: false, error: result?.errorMessage || 'İyzico başlatılamadı' }, { status: 500 }));
                } else {
                    resolve(NextResponse.json({ success: true, data: result }));
                }
            });
        });

        return iyzicoResponse;

    } catch (error: any) {
        console.error("İyzico API Ana Hatası:", error);
        return NextResponse.json({ success: false, error: error?.message || 'Sistem hatası' }, { status: 500 });
    }
}