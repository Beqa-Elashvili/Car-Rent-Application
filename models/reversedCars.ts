import mongoose, { Schema, Document } from "mongoose";

type CarsType = {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
};

interface ICars extends Document {
  ReversedCars: CarsType[];
  userId: string;
}
const reservedCarSchema = new mongoose.Schema(
  {
    ReversedCars: {
      type: [Schema.Types.Mixed],
      default: [],
    },
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
