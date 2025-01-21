import mongoose from "mongoose";

let isConnected: boolean = false;

export async function ConnectDB(): Promise<void> {
  try {
    if (isConnected) {
      console.log("Using existing database connection.");
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    const connection = await mongoose.connect(process.env.MONGO_URI); 
    isConnected = connection.connection.readyState === 1;
    console.log("Connected to database.");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Failed to connect to the database.");
  }
}
