/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Senin yazdığın harici paket kuralı (Aynen koruyoruz)
  serverExternalPackages: ['iyzipay'],

  // 2. Vercel'in İyzico kaynak dosyalarını sunucuda silmesini engelleyen kesin zırh
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['node_modules/iyzipay/**/*'],
    },
  },
};

export default nextConfig;