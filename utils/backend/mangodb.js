import mongoose from "mongoose";

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { db: cachedDb };
  }

  const MONGODB_URI = process.env.MONGO_CONNECTION;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGO_CONNECTION environment variable inside .env.local"
    );
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    cachedDb = db;
    console.log("MongoDB connected.");
    return { db };
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  if (cachedDb) {
    await mongoose.connection.close();
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}
