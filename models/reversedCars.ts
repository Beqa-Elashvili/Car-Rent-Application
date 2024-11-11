import mongoose, { Schema, Document } from "mongoose";

interface ICars extends Document {
  title: string;
  description: string;
  userId: string;
}

const reservedCarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ReversedCars: [],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const reservedCars =
  mongoose.models.ReservedCars ||
  mongoose.model<ICars>("reservedCars", reservedCarSchema);

export { reservedCars };

