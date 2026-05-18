/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Harici paket kuralı
  serverExternalPackages: ['iyzipay'],

  // 2. Vercel dosya taşıma zırhı
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['node_modules/iyzipay/**/*'],
    },
  },
};

export default nextConfig;