import mongoose from 'mongoose';

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
    // 🚀 E-POSTA ONAYI İÇİN EKLENEN YENİ CEPLER
    isVerified: {
      type: Boolean,
      default: false, // Yeni kayıt olan herkes ilk başta ONAYSIZ (false) başlayacak!
    },
    verificationToken: String, // Onay linkindeki gizli bilet
    
    // Şifre sıfırlama cepleri (bunlar da kalıyor)
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true } 
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;