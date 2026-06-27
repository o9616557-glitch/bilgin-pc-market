import mongoose, { Schema } from 'mongoose';

const menuAyarSchema = new Schema({
  kullaniciEmail: { type: String, required: true, unique: true },
  menuListesi: { type: Array, default: [] },
  // 🚀 BİNGO: Veritabanına yeni eklediğimiz renk paketlerini tanıtıyoruz
  siparisRenkleri: { type: Object, default: {} },
  pastaRenkleri: { type: Object, default: {} },
  cubukRenk: { type: Object, default: {} }
}, { timestamps: true });

const MenuAyar = mongoose.models.MenuAyar || mongoose.model('MenuAyar', menuAyarSchema);

export default MenuAyar;