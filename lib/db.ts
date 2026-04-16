
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongoose: any; // Using var for global augmentation
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      '❌ MONGODB_URI is not defined. Please add it to your Environment Variables.'
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,  // 30s — gives Atlas DNS time to resolve
      socketTimeoutMS: 60000,           // 60s socket timeout
      connectTimeoutMS: 30000,          // 30s connection timeout
      heartbeatFrequencyMS: 10000,      // check connections every 10s
      maxPoolSize: 10,
    };

    console.log('🔌 Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB Atlas connected successfully');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
