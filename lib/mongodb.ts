// Dosya Yolu: lib/mongodb.ts
import { MongoClient } from 'mongodb';

// .env.local dosyamızdan bağlantı adresini alıyoruz
const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('HATA: Lütfen .env.local dosyasına MONGODB_URI değerini ekleyin.');
}

// Geliştirme (Senin bilgisayarın) ortamındaysak bağlantıyı hafızada tutuyoruz (Performans için)
if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Canlı (Vercel) ortamda normal bağlantı yapıyoruz
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Bu bağlantı köprüsünü tüm projemizde kullanmak üzere dışarı aktarıyoruz
export default clientPromise;