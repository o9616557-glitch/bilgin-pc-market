/** İyzico API ortam değişkenleri (IYZICO_URI veya IYZICO_BASE_URL) */
export function iyzicoConfig() {
  const uri =
    process.env.IYZICO_URI ||
    process.env.IYZICO_BASE_URL ||
    "https://api.iyzipay.com";

  return {
    apiKey: process.env.IYZICO_API_KEY || "",
    secretKey: process.env.IYZICO_SECRET_KEY || "",
    uri: uri.replace(/\/+$/, ""),
  };
}
