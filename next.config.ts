import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 🚀 İYZİCO'YU PAKETLEYİCİDEN (WEBPACK) KAÇIRAN GÜVENLİK GEÇİŞİ
    serverComponentsExternalPackages: ["iyzipay"],
  },
};

export default nextConfig;