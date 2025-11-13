import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (uri = process.env.MONGODB_URI) => {
  try {
    await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    // ⚠️ En mode test : on NE tue PAS le process
    if (process.env.NODE_ENV === 'test') {
      throw error; // laisser Jest gérer l'erreur
    }

    // En dev / prod : on garde le comportement actuel
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
};

export default connectDB;
