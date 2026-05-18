import { NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';

export async function POST(req: Request) {
    try {
        // 1. İyzico'dan gelen ham form verisini okuyoruz
        const formData = await req.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return NextResponse.redirect(new URL('/sepet?error=token_yok', req.url));
        }

        // 2. Token ile İyzico'ya "Bu işlemin sonucu ne oldu?" diye soruyoruz
        return new Promise((resolve) => {
            iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, function (err: any, result: any) {
                if (err || result.status !== 'success') {
                    console.error("Ödeme Başarısız:", result);
                    // Ödeme başarısızsa müşteriyi hata mesajıyla sepete geri fırlatıyoruz
                    return resolve(NextResponse.redirect(new URL(`/sepet?status=fail&reason=${result?.errorMessage || 'bilinmiyor'}`, req.url)));
                }

                // 🌟 ÖDEME BAŞARILI! (Gerçek para çekildi)
                console.log("Efsane Başarı! Para Çekildi:", result);
                
                // Müşteriyi senin projedeki sipariş takip veya başarı sayfasına yönlendiriyoruz
                return resolve(NextResponse.redirect(new URL('/siparis-takip?status=success', req.url)));
            });
        });

    } catch (error) {
        console.error("Callback Hatası:", error);
        return NextResponse.redirect(new URL('/sepet?error=sistem_hatasi', req.url));
    }
}