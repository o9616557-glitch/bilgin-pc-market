// @ts-ignore
import Iyzipay from 'iyzipay';

// 👑 VERCEL DERLEME ZIRHI: Env değişkenleri boş olsa bile sistemin çökmesini engeller.
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || 'sandbox-key-yedek',
    secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-secret-yedek',
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
});

export default iyzipay;