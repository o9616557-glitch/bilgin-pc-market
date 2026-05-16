import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Yeni nesil Next.js için dışlama (Experimental olmadan)
  serverExternalPackages: ["iyzipay"],
  
  // 🚀 2. KESİN ÇÖZÜM: WEBPACK MOTORUNU ZORLA SUSTURUYORUZ
  webpack: (config, { isServer }) => {
    if (isServer) {
      // "iyzipay" kelimesini gördüğün an paketlemeyi bırak ve atla diyoruz!
      config.externals = [...(config.externals || []), "iyzipay"];
    }
    return config;
  },
};

export default nextConfig;