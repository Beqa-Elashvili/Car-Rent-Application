import { ConnectDB } from "utils/connect";
import { User } from "models/userModal";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: any) {
  try {
    await ConnectDB();

    const { username, email, password, isAdmin, adminSecret } =
      await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    let userRole = false;
    if (isAdmin) {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { message: "Invalid admin secret" },
          { status: 403 }
        );
      }
      userRole = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin: userRole,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error while registering:", error);
    return NextResponse.json(
      { message: "Error occurred while registering the user.", error },
      { status: 500 }
    );
  }
}
