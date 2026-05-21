/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["iyzipay"],
  experimental: {
    serverComponentsExternalPackages: ["iyzipay"]
  }
};

export default nextConfig;