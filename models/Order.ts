import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // Ürün ID'si
  title: { type: String, required: true },     // Ürün Adı
  image: { type: String, required: true },     // Ürün Görseli
  price: { type: Number, required: true },     // Ürün Birim Fiyatı
  quantity: { type: Number, required: true },  // Adet
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    items: [orderItemSchema], // Sipariş edilen ürünlerin listesi
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      title: String,
      fullName: String,
      phone: String,
      city: String,
      district: String,
      fullAddress: String,
    },
    paymentMethod: {
      type: String,
      default: 'Iyzico / Kredi Kartı',
    },
    status: {
      type: String,
      enum: ['Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi'],
      default: 'Hazırlanıyor',
    },
  },
  { timestamps: true } // Sipariş tarihini otomatik tutar
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;