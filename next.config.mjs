/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["iyzipay", "postman-request"],
    outputFileTracingIncludes: {
      "/api/**/*": [
        "./node_modules/iyzipay/**/*",
        "./node_modules/postman-request/**/*"
      ],
    },
  },
};

export default nextConfig;