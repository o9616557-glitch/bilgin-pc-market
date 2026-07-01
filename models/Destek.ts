import mongoose from 'mongoose';

// Alt şema: Talep içindeki karşılıklı mesajlaşmaları tutar
const MesajSchema = new mongoose.Schema({
  gonderen: { 
    type: String, 
    enum: ['Musteri', 'Admin'], 
    required: true 
  },
  metin: { 
    type: String, 
    required: true 
  },
  tarih: { 
    type: Date, 
    default: Date.now 
  }
});

const IadeKalemiSchema = new mongoose.Schema({
  urunId: { type: String, required: true },
  adet: { type: Number, required: true },
  isim: { type: String },
  birimFiyat: { type: Number },
  tutar: { type: Number },
}, { _id: false });

const DestekSchema = new mongoose.Schema({
  talepNo: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Örn: DST-847291 gibi jilet bir kod üreteceğiz
  
  kullaniciEmail: { 
    type: String, 
    required: true 
  }, // Hangi müşterinin talebi olduğunu bilmek için
  
  konu: { 
    type: String, 
    enum: ['iade', 'iptal', 'teknik', 'kargo', 'diger'],
    required: true 
  },
  
  siparisNo: { type: String },
  iadeYontemi: { type: String, enum: ['kart', 'magaza_kredisi'] },
  iadeTutari: { type: Number },
  iadeTipi: { type: String, enum: ['tam', 'kismi'] },
  iadeKalemleri: [IadeKalemiSchema],
  iadeOdendi: { type: Boolean, default: false }, // İkonları ve renkleri buna göre belirleyeceğiz
  
  durum: { 
    type: String, 
    enum: ['İnceleniyor', 'Yanıt Bekleniyor', 'Çözüldü'], 
    default: 'İnceleniyor' 
  },
  
  mesajlar: [MesajSchema], // Karşılıklı chat döngüsü burada tutulacak
  
}, { timestamps: true });

export default mongoose.models.Destek || mongoose.model('Destek', DestekSchema);