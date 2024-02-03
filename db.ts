// db.ts
import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  // Connect to MongoDB and update the connection status
  await mongoose.connect(process.env.MONGODB_URI!);
  connection.isConnected = mongoose.connection.readyState;
  console.log("MongoDB connected successfully");
}

export default dbConnect;
