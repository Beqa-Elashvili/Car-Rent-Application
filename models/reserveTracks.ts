import mongoose, { Schema } from "mongoose";

const reservedTracksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    loop: { type: Number, required: true },
    rentPrice: { type: Number, required: true },
    dayRentPrice: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    dayCount: { type: Number, required: false },
    dayStart: { type: String, required: true },
    dayEnd: { type: String, required: true },
    oneLap: { type: Boolean, required: false },
    totalPrice: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const reservedTracks =
  mongoose.models.ReservedTracks ||
  mongoose.model("ReservedTracks", reservedTracksSchema);

export { reservedTracks };
