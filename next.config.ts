import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack'e "Bu dosyaya mikroskopla bakma, dışarıdan al" diyoruz
    serverComponentsExternalPackages: ["iyzipay"],
  },
};

export default nextConfig;