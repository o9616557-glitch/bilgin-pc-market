import type { NextConfig } from "next";

const nextConfig: any = {
  serverExternalPackages: ["iyzipay"],
  
  // 🚀 SİHİRLİ DOKUNUŞ: Sadece 'resources' değil, tüm 'iyzipay' klasörünü korumaya aldık!
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/iyzipay/**/*"]
  }
};

export default nextConfig;