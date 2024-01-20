// db.ts
import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    connection.isConnected = mongoose.connection.readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default dbConnect;
