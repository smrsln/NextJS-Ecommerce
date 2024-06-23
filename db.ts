import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbCheck(): Promise<void> {
  // Check if already connected and the connection is open
  if (connection.isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // Attempt to connect or reconnect to MongoDB and update the connection status
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    connection.isConnected = mongoose.connection.readyState;

    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB connected successfully");
    } else {
      // Handle cases where connection is established but not ready
      console.error("MongoDB connection is not ready");
      throw new Error("MongoDB connection is not ready");
    }
  } catch (error) {
    console.error("Failed to connect to DB", error);
    throw new Error("Failed to connect to DB");
  }
}

export default dbCheck;
