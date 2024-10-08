import mongoose from "mongoose";

export async function ConnectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("connected to db.");
  } catch (error) {
    console.error("Error while connecting to DB", error);
  }
}
