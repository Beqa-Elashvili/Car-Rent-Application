import { ConnectDB } from "utils/connect";
import { Cars } from "models/userModal";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { title, description } = await req.json();
  await ConnectDB();
  await Cars.create({ title, description });
  return NextResponse.json({ message: "Cars Reservedd" }, { status: 201 });
}
