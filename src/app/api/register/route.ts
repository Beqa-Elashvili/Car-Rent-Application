import { ConnectDB } from "utils/connect";
import User from "models/userModal";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: any) {
  try {
    await ConnectDB();
    const { username, email, password } = await req.json();
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    return NextResponse.json(
      {
        message: "User registered",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("error while registered", error);
    return NextResponse.json(
      { message: "Error occured while registering the user." },
      { status: 500 }
    );
  }
}
