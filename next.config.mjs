/** @type {import('next').NextConfig} */
const nextConfig = {
  // Iyzico için gerekli paketleri dışarıda bırakıyoruz
  serverExternalPackages: ['iyzipay'],
  
  // Hata veren 'experimental' kısmını geçici olarak kaldırıyoruz
  // Projen düzgün çalışınca burayı tekrar optimize ederiz.
};

export default nextConfig;