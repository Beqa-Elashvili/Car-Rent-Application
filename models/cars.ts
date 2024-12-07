import mongoose, { Schema } from "mongoose";

const carsSchema = new mongoose.Schema(
  {
    city_mpg: { type: Number, required: true },
    brand: { type: String, required: true },
    class: { type: String, required: true },
    combination_mpg: { type: Number, required: true },
    cylinders: { type: Number, required: true },
    displacement: { type: Number, required: true },
    drive: { type: String, required: true },
    fuel_type: { type: String, required: true },
    highway_mpg: { type: Number, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    transmission: { type: String, required: true },
    year: { type: Number, required: true },
    carDayCount: { type: Number, required: true, default: 0 },
    dayPrice: { type: Number, required: true, default: 0 },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const Cars = mongoose.models.Cars || mongoose.model("Cars", carsSchema);

export { Cars };
