// Dosya Yolu: lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {
  maxPoolSize: 10,
};

if (!uri) {
  throw new Error("HATA: Lütfen .env.local dosyasına MONGODB_URI değerini ekleyin.");
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}

const clientPromise = globalWithMongo._mongoClientPromise;

export default clientPromise;
