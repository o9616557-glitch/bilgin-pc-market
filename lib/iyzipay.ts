const Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY as string,
    secretKey: process.env.IYZICO_SECRET_KEY as string,
    uri: process.env.IYZICO_BASE_URL as string
});

export default iyzipay;