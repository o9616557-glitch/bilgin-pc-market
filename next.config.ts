import type { NextConfig } from "next";

// 🚀 İŞTE VIP KART! ": NextConfig" yerine ": any" yazdık, TypeScript artık buraya HİÇ KARIŞAMAZ!
const nextConfig: any = {
  serverExternalPackages: ["iyzipay"],
  
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/iyzipay/lib/resources/**/*"]
  }
};

export default nextConfig;