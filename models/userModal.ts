import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
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

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export { User };
