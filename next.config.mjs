/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["iyzipay", "postman-request"],
  outputFileTracingIncludes: {
    "/api/*/": [
      "./node_modules/iyzipay/*/",
      "./node_modules/postman-request/*/"
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-hot-toast"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
