import mongoose, { Schema } from "mongoose";

const brandsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const Brands = mongoose.models.Brands || mongoose.model("Brands", brandsSchema);

export { Brands };
