import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbCheck(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  // Connect to MongoDB and update the connection status
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    connection.isConnected = mongoose.connection.readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to DB", error);
    throw new Error("Failed to connect to DB");
  }
}

export default dbCheck;
