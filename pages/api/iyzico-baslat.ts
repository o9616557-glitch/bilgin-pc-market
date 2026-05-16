import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import Iyzipay from 'iyzipay';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { cart, checkoutForm, totalAmount } = req.body;

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY || "",
      secretKey: process.env.IYZICO_SECRET_KEY || "",
      uri: "https://api.iyzipay.com" 
    });

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: Math.floor(Math.random() * 100000000).toString(),
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: "B" + Math.floor(Math.random() * 100000),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "https://bilginpcmarket.com/api/iyzico-sonuc",
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: "BY789",
        name: checkoutForm.firstName,
        surname: checkoutForm.lastName,
        gsmNumber: checkoutForm.phone,
        email: checkoutForm.email,
        identityNumber: "11111111111",
        lastLoginDate: "2023-01-01 12:00:00",
        registrationDate: "2023-01-01 12:00:00",
        registrationAddress: checkoutForm.fullAddress,
        ip: "85.34.78.112",
        city: checkoutForm.city,
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: checkoutForm.firstName + " " + checkoutForm.lastName,
        city: checkoutForm.city,
        country: "Turkey",
        address: checkoutForm.fullAddress,
        zipCode: "34732"
      },
      billingAddress: {
        contactName: checkoutForm.firstName + " " + checkoutForm.lastName,
        city: checkoutForm.city,
        country: "Turkey",
        address: checkoutForm.fullAddress,
        zipCode: "34732"
      },
      basketItems: cart.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        category1: "Donanım",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: (parseFloat(item.price.replace(/[^\d]/g, "")) / (item.price.replace(/[^\d]/g, "") > 1000000 ? 100 : 1)).toString()
      }))
    };

    iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
      if (err) {
        return res.status(500).json({ success: false, error: "İyzico sunucu bağlantı hatası." });
      } else if (result.status === "success") {
        return res.status(200).json({ success: true, formContent: result.checkoutFormContent });
      } else {
        return res.status(400).json({ success: false, error: result.errorMessage });
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Beklenmeyen bir hata oluştu." });
  }
}