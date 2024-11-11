import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}
interface ICars extends Document {
  title: string;
  description: string;
  userId: string;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Must provide a username"],
    },
    email: {
      type: String,
      required: [true, "Must provide an email"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Must provide a password"],
    },
  },
  {
    timestamps: true,
  }
);

const reservedCarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const reservedCars =
  mongoose.models.ReservedCars ||
  mongoose.model<ICars>("reservedCars", reservedCarSchema);

export { User, reservedCars };
