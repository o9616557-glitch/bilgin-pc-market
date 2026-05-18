import { NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';

export async function POST(req: Request) {
    try {
        // İyzico'ya gönderilecek sipariş ve müşteri verileri (Şimdilik test verisi)
        const request = {
            locale: 'tr',
            conversationId: 'SIPARIS-' + Math.floor(Math.random() * 100000), // Rastgele sipariş no
            price: '1.0', // Ürünlerin toplamı
            paidPrice: '1.0', // Müşterinin kartından çekilecek kesin tutar
            currency: 'TRY',
            basketId: 'BASKET-12345',
            paymentGroup: 'PRODUCT',
            callbackUrl: "https://www.bilginpcmarket.com/api/iyzico-callback", // Başarılı ödeme sonrası dönülecek yer
            enabledInstallments: [2, 3, 6, 9], // Taksit seçenekleri
            buyer: {
                id: 'BY789',
                name: 'Bilgin',
                surname: 'PC',
                gsmNumber: '+905551234567', // Telefon
                email: 'satis@bilginpcmarket.com', // E-posta
                identityNumber: '11111111111', // TC Kimlik (Zorunlu)
                lastLoginDate: '2026-05-18 20:00:00',
                registrationDate: '2026-05-10 15:12:09',
                registrationAddress: 'Teknoloji Mah. Bilişim Sok. No:1',
                ip: '85.34.78.112', // Müşterinin IP adresi
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: 'Bilgin PC',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Teknoloji Mah. Bilişim Sok. No:1',
                zipCode: '34732'
            },
            billingAddress: {
                contactName: 'Bilgin PC',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Teknoloji Mah. Bilişim Sok. No:1',
                zipCode: '34732'
            },
            basketItems: [
                {
                    id: 'BI101',
                    name: 'Test Ürünü - ASUS RTX 4060',
                    category1: 'Bilgisayar',
                    itemType: 'PHYSICAL', // Fiziki ürün
                    price: '1.0'
                }
            ]
        };

        // İyzico'dan form HTML'ini talep et
        return new Promise((resolve) => {
            iyzipay.checkoutFormInitialize.create(request, function (err: any, result: any) {
                if (err) {
                    console.error("İyzico Hata:", err);
                    return resolve(NextResponse.json({ success: false, error: err }, { status: 500 }));
                }
                // Başarılıysa İyzico'dan gelen form kodunu ekrana yolla
                return resolve(NextResponse.json({ success: true, data: result }));
            });
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Sunucu Hatası' }, { status: 500 });
    }
}