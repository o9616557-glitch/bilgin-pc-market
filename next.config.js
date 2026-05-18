/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. İyzico'yu harici paket olarak kilitliyoruz
  serverExternalPackages: ['iyzipay'],

  experimental: {
    // 👑 NÜKLEER ÇÖZÜM: Maskeyi '**/*' yaparak Next.js App Router'ın bu klasörü 
    // gözden kaçırma ihtimalini sıfıra indiriyoruz. Vercel bu klasörü zorla yükleyecek!
    outputFileTracingIncludes: {
      '**/*': ['node_modules/iyzipay/lib/resources/**/*'],
    },
  },
};

module.exports = nextConfig;