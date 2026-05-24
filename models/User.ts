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
  },
  { timestamps: true } 
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;