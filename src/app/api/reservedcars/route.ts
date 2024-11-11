import { ConnectDB } from "utils/connect";
import { reservedCars, User } from "models/userModal";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: any) {
  try {
    await ConnectDB();
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    console.log("Looking for userId:", userId); 

    const ReservedCars = await reservedCars.find({ userId });

    console.log("Found Reserved Cars:", ReservedCars); 

    if (ReservedCars.length === 0) {
      return NextResponse.json(
        { message: "No cars reserved by this user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ReservedCars });
  } catch (error) {
    console.error("Error fetching cars:", error);

    return NextResponse.json(
      { message: "Error fetching cars data", error: error },
      { status: 500 }
    );
  }
}
export async function POST(req: any) {
  try {
    const { title, description, userId } = await req.json();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const existingReservation = await reservedCars.findOne({
      title,
      userId,
    });

    if (existingReservation) {
      return NextResponse.json(
        { message: "User has already reserved this car." },
        { status: 400 }
      );
    }

    await reservedCars.create({ title, description, userId });

    return NextResponse.json({ message: "Car Reserved" }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to reserve car", error },
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Car ID format" },
        { status: 400 }
      );
    }
    await ConnectDB();
    const deletedCar = await reservedCars.findOneAndDelete({ _id: id });
    if (!deletedCar) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Reserved car deleted successfully" },
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
