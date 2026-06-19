import mongoose from 'mongoose';

// 🚀 SİHİR 1: Ürün kalıbını esnettik (isim, adet, miktar... İçinde ne varsa silmeden kabul edecek)
const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: false },
  title: { type: String, required: false },
  image: { type: String, required: false },
  price: { type: Number, required: false },
  quantity: { type: Number, required: false },
}, { strict: false }); 

// 🚀 SİHİR 2: Ana Sipariş Kalıbı
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Havale siparişinde ID yoksa sistemi çökertmesin diye kapattık
  },
  userEmail: {
    type: String,
    required: false,
  },
  items: [orderItemSchema], // Sipariş ürünleri
  totalPrice: {
    type: Number,
    required: false,
  },
  shippingAddress: {
    type: Object, // İçine "musteri" de gelse, "shippingAddress" de gelse itiraz etmeden alacak
  },
  paymentMethod: {
    type: String,
    default: 'Havale / EFT',
  },
  status: {
    type: String,
    default: 'Hazırlanıyor',
  },
  // 📦 İŞTE YENİ EKLENEN KARGO BİLGİLERİ (MUTFAĞA RAFLARI ÇAKTIK)
  kargoFirmasi: {
    type: String,
    default: '',
  },
  takipNo: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
  strict: false // 🚀 NÜKLEER SİHİR: Veritabanındaki hiçbir Türkçe/İngilizce kelimeyi gizleme, hepsini Siparişlerim sayfasına yolla!
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;