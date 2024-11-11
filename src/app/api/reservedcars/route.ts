import { ConnectDB } from "utils/connect";
import { reservedCars } from "models/userModal";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: any) {
  try {
    await ConnectDB();
    const ReservedCars = await reservedCars.find();
    return NextResponse.json({ ReservedCars });
  } catch (error) {
    console.error("Error fetching cars", error);
    return NextResponse.json(
      { message: "Error fetching cars data" },
      { status: 500 }
    );
  }
}

export async function POST(req: any) {
  try {
    const { title, description } = await req.json();
    await ConnectDB();
    console.log("Database connected successfully");
    await reservedCars.create({ title, description });
    return NextResponse.json({ message: "Cars Reserved" }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to reserve car" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: any) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Car ID is required" },
        { status: 400 }
      );
    }
    await ConnectDB();
    const deletedCar = await reservedCars.findOneAndDelete({ _id: id });
    if (!deletedCar) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Reserved car deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting car:", error);
    return NextResponse.json(
      { message: "Failed to delete car", error },
      { status: 500 }
    );
  }
}
