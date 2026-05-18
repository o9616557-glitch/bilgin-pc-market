import { NextResponse } from 'next/server';
// 👑 KESİN ÇÖZÜM: Ana motoru devre dışı bırakıp doğrudan alt modülü çağırıyoruz (scandir hatası imkansız hale gelir)
// @ts-ignore
import CheckoutForm from 'iyzipay/lib/resources/checkout-form';

export const dynamic = "force-dynamic";

const iyzicoConfig = {
    apiKey: process.env.IYZICO_API_KEY || '',
    secretKey: process.env.IYZICO_SECRET_KEY || '',
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
};

export async function POST(req: Request): Promise<Response> {
    try {
        const formData = await req.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return NextResponse.redirect(new URL('/sepet?error=token_yok', req.url));
        }

        const redirectResponse = await new Promise<NextResponse>((resolve) => {
            // Hatalı üst sınıf yerine doğrudan geri çağırma alt sınıfını ayağa kaldırıyoruz
            const checkoutFormInstance = new CheckoutForm(iyzicoConfig);

            checkoutFormInstance.retrieve({ locale: 'tr', token }, function (err: any, result: any) {
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