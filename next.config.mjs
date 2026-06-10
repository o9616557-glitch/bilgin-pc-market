/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["iyzipay", "postman-request"],
    outputFileTracingIncludes: {
      "/api/*/": [
        "./node_modules/iyzipay/*/",
        "./node_modules/postman-request/*/"
      ],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 🚀 CLOUDINARY (BULUT RESİMLERİ) İÇİN GÜVENLİK İZNİ 🚀
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;