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
    image: {
      type: String,
      default: null,
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

  // 🚀 İki Adımlı Doğrulama Tercihleri
    twoFactorEmail: { type: Boolean, default: false },
    twoFactorSms: { type: Boolean, default: false },

    // 🚀 ŞEFİM İŞTE EKSİK OLAN RAFLAR BUNLAR! (Kodun ve Sürenin Tutulduğu Yer)
    twoFactorCode: { type: String },
    twoFactorExpires: { type: Date },

    // 🚀 AKTİF CİHAZLAR RADARI İÇİN HAFIZA RAFI
  activeDevices: [{
      deviceId: { type: String, required: true },
      deviceInfo: { type: String },
      ipAddress: { type: String },
      location: { type: String },
      isActive: { type: Boolean, default: true }, // 🚀 İŞTE YENİ DAMGAMIZ: İlk girişte otomatik "true" (Aktif) olur
      lastActive: { type: Date, default: Date.now }
  }], // 🚀 ŞEFİM DİKKAT: Buraya virgülü attık!

  // 🚀 ŞEFİN EFSANE GÜVENLİK ŞARTELLERİ VE GÜVENLİ CİHAZ HAFIZASI
  notificationPreference: { 
    type: String, 
    enum: ['all', 'new_device', 'none'], 
    default: 'new_device' 
  },
  trustedDevices: [String], // 🚀 DİKKAT: Buraya virgülü çaktık!

  // 🛡️ GUARD (BEKLEYEN CİHAZ ONAY) SİSTEMİ İÇİN YENİ RAFLAR
  pendingDeviceToken: { type: String },
  pendingDeviceExpires: { type: Date },
  pendingDeviceInfo: { type: Object },
  
  // 🚀 İŞTE BİZİ SONSUZ DÖNGÜYE SOKAN EKSİK BİLET BURASI!
  karantinaPass: { type: Date },

  // 🚀 HESAP DONDURMA / SİLME İŞLEMLERİ İÇİN GEREKLİ KONTROL
  isActive: { type: Boolean, default: true },

  // Profil sayfası görsel varlıkları
  profileBanner: { type: String, default: null },
  tileImages: { type: Map, of: String, default: {} },
  pingRenk: { type: String, default: null },

},
{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;