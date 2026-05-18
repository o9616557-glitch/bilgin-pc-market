import { NextResponse } from 'next/server';
// 👑 DOĞRU BAĞLANTI: Hazırladığımız zırhlı ana motoru çağırıyoruz
import iyzipay from '@/lib/iyzipay';

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
    try {
        const formData = await req.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return NextResponse.redirect(new URL('/sepet?error=token_yok', req.url));
        }

        const redirectResponse = await new Promise<NextResponse>((resolve) => {
            iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, function (err: any, result: any) {
                if (err || result.status !== 'success') {
                    console.error("Ödeme Başarısız:", result);
                    const reason = result?.errorMessage || 'bilinmiyor';
                    resolve(NextResponse.redirect(new URL(`/sepet?status=fail&reason=${encodeURIComponent(reason)}`, req.url)));
                } else {
                    console.log("Efsane Başarı! Para Çekildi:", result);
                    resolve(NextResponse.redirect(new URL('/siparis-takip?status=success', req.url)));
                }
            });
        });

        return redirectResponse;

    } catch (error) {
        console.error("Callback Hatası:", error);
        return NextResponse.redirect(new URL('/sepet?error=sistem_hatasi', req.url));
    }
}