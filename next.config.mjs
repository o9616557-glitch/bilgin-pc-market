/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["iyzipay"],
    // ŞEFİM: İŞTE BALYOZ BURASI! Vercel'e dosyaları zorla paketletiyoruz.
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/iyzipay/**/*"],
    },
  },
};

export default nextConfig;