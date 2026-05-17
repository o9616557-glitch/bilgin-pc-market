import type { NextConfig } from "next";

const nextConfig: any = {
  // Hem İyzico'yu hem de onun kargocusunu Vercel'den koruyoruz!
  serverExternalPackages: ["iyzipay", "postman-request"],
  
  outputFileTracingIncludes: {
    "/api/**/*": [
      "./node_modules/iyzipay/**/*",
      "./node_modules/postman-request/**/*"
    ]
  }
};

export default nextConfig;