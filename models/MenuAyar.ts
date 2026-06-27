import mongoose from 'mongoose';

// MongoDB'ye kaydedeceğimiz verinin haritası (Sadece Email ve Menü Listesi)
const MenuAyarSchema = new mongoose.Schema({
  kullaniciEmail: { 
    type: String, 
    required: true, 
    unique: true 
  },
  menuListesi: { 
    type: Array, 
    default: [] 
  }
}, { timestamps: true });

// Çakışmaları önlemek için Next.js'e özel export mantığı
export default mongoose.models.MenuAyar || mongoose.model('MenuAyar', MenuAyarSchema);