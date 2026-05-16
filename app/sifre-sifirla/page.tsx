import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Lütfen e-posta veya kullanıcı adı girin." }, { status: 400 });
    }

    // 🚀 REST API kapısı kapalı olduğu için doğrudan WordPress'in çalışan kalbine (wp-login.php) ateş ediyoruz.
    // Bu yöntem çekirdek fonksiyondur, 404 hatası verme şansı sıfırdır şefim!
    const wpUrl = `https://bilginpcmarket.com/wp-login.php?action=lostpassword`;

    // Tarayıcı formu gibi verileri paketliyoruz
    const formData = new URLSearchParams();
    formData.append('user_login', email);
    formData.append('redirect_to', '');

    const res = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    // WordPress formu başarıyla aldığında ya 200 döner ya da yönlendirme (302) yapar.
    // İki durumda da mail kuryeye verilmiş demektir.
    if (res.ok || res.status === 302) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Şifre sıfırlama talebi iletilemedi. Lütfen bilgilerinizi kontrol edin." }, { status: 400 });
    }
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return NextResponse.json({ error: "Sunucu bağlantı hatası oluştu." }, { status: 500 });
  }
}