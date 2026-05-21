/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ŞEFİM: Listeye "postman-request" eklendi!
    serverComponentsExternalPackages: ["iyzipay", "postman-request"],
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/iyzipay/**/*"],
    },
  },
};

export default nextConfig;