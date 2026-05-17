import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // İyzico'yu harici bir paket olarak tanıtır
  serverExternalPackages: ["iyzipay"],
  experimental: {
    // 🚀 İŞTE VERCEL'İ DİZE GETİREN KOMUT!
    // Vercel'e "API yüklenirken İyzico'nun resources klasörünü SAKIN silme, içine kopyala!" der.
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/iyzipay/lib/resources/**/*"]
    }
  }
};

export default nextConfig;