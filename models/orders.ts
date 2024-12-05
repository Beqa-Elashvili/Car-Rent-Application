import mongoose, { Schema, Document } from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    drivingLicense: { type: String, default: "" },
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    cvc: { type: String, required: true },
    cardunlock: { type: String, required: true },
    cardName: { type: String, required: true },
    TotalPrice: { type: String, required: true },
    TotalDays: { type: String, required: true },
  },
  { timestamps: true }
);

const Orders = mongoose.models.Orders || mongoose.model("Orders", ordersSchema);

export { Orders };
