// @ts-ignore
import CheckoutFormInitialize from 'iyzipay/lib/resources/CheckoutFormInitialize';
// @ts-ignore
import CheckoutForm from 'iyzipay/lib/resources/CheckoutForm';

// Canlı ortam değişkenlerini güvenle bağlıyoruz
const iyzicoConfig = {
    apiKey: process.env.IYZICO_API_KEY || '',
    secretKey: process.env.IYZICO_SECRET_KEY || '',
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
};

/**
 * 👑 ULTRA BYPASS MOTORU: 
 * Ne Vercel'in dosya budama sistemine takılır ne de scandir hatası verir.
 * Diğer API dosyalarındaki orijinal çağrı yapılarını (initialize ve retrieve) bozmadan taklit eder.
 */
const iyzipay = {
    checkoutForm: {
        initialize: (request: any, callback: any) => {
            const instance = new CheckoutFormInitialize(iyzicoConfig);
            instance.create(request, callback);
        },
        retrieve: (request: any, callback: any) => {
            const instance = new CheckoutForm(iyzicoConfig);
            instance.retrieve(request, callback);
        }
    }
};

export default iyzipay;