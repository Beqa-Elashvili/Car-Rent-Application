import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}
interface ICars extends Document {
  title: string;
  description: string;
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

const carsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Must provide a title for the car"],
    },
    description: {
      type: String,
      required: [true, "Must provide a description for the car"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const Cars = mongoose.models.Cars || mongoose.model<ICars>("Cars", carsSchema);

export { User, Cars };
