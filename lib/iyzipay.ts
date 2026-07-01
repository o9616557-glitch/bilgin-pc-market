// @ts-ignore
import CheckoutFormInitialize from 'iyzipay/lib/resources/CheckoutFormInitialize';
// @ts-ignore
import CheckoutForm from 'iyzipay/lib/resources/CheckoutForm';

import { iyzicoConfig } from "@/lib/iyzico-config";

// Canlı ortam değişkenlerini güvenle bağlıyoruz
const iyzicoConfigValues = iyzicoConfig();

/**
 * 👑 ULTRA BYPASS MOTORU: 
 * Ne Vercel'in dosya budama sistemine takılır ne de scandir hatası verir.
 * Diğer API dosyalarındaki orijinal çağrı yapılarını (initialize ve retrieve) bozmadan taklit eder.
 */
const iyzipay = {
    checkoutForm: {
        initialize: (request: any, callback: any) => {
            const instance = new CheckoutFormInitialize(iyzicoConfigValues);
            instance.create(request, callback);
        },
        retrieve: (request: any, callback: any) => {
            const instance = new CheckoutForm(iyzicoConfigValues);
            instance.retrieve(request, callback);
        }
    }
};

export default iyzipay;