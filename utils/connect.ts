import mongoose from "mongoose";

export async function ConnectDB(): Promise<void> {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log("connected to db.");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Failed to connect to the database.");
  }
}
