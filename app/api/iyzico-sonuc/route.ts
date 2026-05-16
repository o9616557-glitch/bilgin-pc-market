import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const status = formData.get('status');

    // Sitenin ana adresini otomatik yakalar
    const baseUrl = request.headers.get('origin') || "https://bilginpcmarket.com";

    if (status === 'success') {
      // Ödeme başarılıysa müşteriyi sepet sayfasına zafer işaretiyle fırlatır!
      return NextResponse.redirect(`${baseUrl}/sepet?payment=success`, 303);
    } else {
      // Hata varsa veya kartta para yoksa hata mesajıyla geri atar.
      return NextResponse.redirect(`${baseUrl}/sepet?payment=failed`, 303);
    }
  } catch (error) {
    return NextResponse.redirect(`https://bilginpcmarket.com/sepet?payment=error`, 303);
  }
}