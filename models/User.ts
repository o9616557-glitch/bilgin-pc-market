import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Örn: Ev, İş
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String }, // 🚀 ŞEFİM YENİ EKLENDİ (E-Posta Rafı)
  city: { type: String, required: true },
  district: { type: String, required: true },
  fullAddress: { type: String, required: true },
  isDefaultDelivery: { type: Boolean, default: false }, 
  isDefaultBilling: { type: Boolean, default: false },  
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lütfen bir isim giriniz'],
    },
    email: {
      type: String,
      required: [true, 'Lütfen bir e-posta giriniz'],
      unique: true, 
    },
    password: {
      type: String,
      required: [true, 'Lütfen bir şifre giriniz'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetToken: String,
    resetTokenExpiry: Date,
    
    // YENİ EKLENEN ALANLAR
    favorites: [{ 
      type: String // Ürün ID'lerini string olarak tutacağız
    }],
    addresses: [addressSchema], // Kullanıcının birden fazla adresi olabilir
    
   // 🚀 ŞEFİM YENİ EKLENDİ (Eski Şifreler Hafızası - Son 3 Şifre Kuralı İçin)
    passwordHistory: [{ 
      type: String 
    }],

    // 🚀 ŞEFİM YENİ EKLENDİ (İki Adımlı Doğrulama Tercihleri)
   twoFactorEmail: { type: Boolean, default: false }, // 🚀 Artık ilk girişte kapalı!
    twoFactorSms: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;