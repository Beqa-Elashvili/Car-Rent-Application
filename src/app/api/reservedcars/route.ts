import { ConnectDB } from "utils/connect";
import { User } from "models/userModal";
import { reservedCars } from "models/reversedCars";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: any) {
  try {
    await ConnectDB();
    const userId = req.nextUrl.searchParams.get("userId");
    const carId = req.nextUrl.searchParams.get("carId");

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid User ID format" },
          { status: 400 }
        );
      }
      console.log("Looking for userId:", userId);

      const ReservedCars = await reservedCars.find({ userId });

      if (ReservedCars.length === 0) {
        return NextResponse.json(
          { message: "No cars reserved by this user." },
          { status: 404 }
        );
      }

      return NextResponse.json({ ReservedCars });
    }

    if (carId) {
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return NextResponse.json(
          { message: "Invalid Car ID format" },
          { status: 400 }
        );
      }


      const car = await reservedCars.findById(carId);

      if (!car) {
        return NextResponse.json({ message: "Car not found" }, { status: 404 });
      }

      return NextResponse.json({ car });
    }

    return NextResponse.json(
      { message: "User ID or Car ID is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching car data:", error);

    return NextResponse.json(
      { message: "Error fetching car data", error: error },
      { status: 500 }
    );
  }
}
export async function POST(req: any) {
  try {
    const { userId, car } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid userId format" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!car || !car.model || !car.dayPrice) {
      return NextResponse.json(
        {
          message:
            "Car data is incomplete. Ensure model and dayPrice are provided.",
        },
        { status: 400 }
      );
    }

    const newReservation = new reservedCars({
      city_mpg: car.city_mpg,
      brand: car.brand,
      class: car.class,
      combination_mpg: car.combination_mpg,
      cylinders: car.cylinders,
      displacement: car.displacement,
      drive: car.drive,
      fuel_type: car.fuel_type,
      highway_mpg: car.highway_mpg,
      horsepower: car.horsepower,
      make: car.make,
      model: car.model,
      transmission: car.transmission,
      year: car.year,
      carDayCount: 1,
      dayPrice: car.dayPrice,
      img: car.img,
      userId,
    });

    await newReservation.save();

    return NextResponse.json(
      { message: "Car Reserved", reservedCar: newReservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to reserve car", error },
      { status: 500 }
    );
  }
}
export async function PUT(req: any) {
  try {
    const { userId, carId, carImg, action } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    if (carId && !mongoose.Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        { message: "Invalid Car ID format" },
        { status: 400 }
      );
    }

    if (!carId && !carImg) {
      return NextResponse.json(
        { message: "Either carId or carImg must be provided" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const reservation = await reservedCars.findOne({
      userId,
      $or: [{ _id: carId }, { img: carImg }],
    });

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found for this car and user" },
        { status: 404 }
      );
    }

    if (action === "increase") {
      reservation.carDayCount += 1;
    } else if (action === "decrease") {
      if (reservation.carDayCount > 1) {
        reservation.carDayCount -= 1;
      } else {
        return NextResponse.json(
          { message: "Car day count cannot be less than 1" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
    await reservation.save();

    return NextResponse.json(
      {
        message: `Car day count ${
          action === "increase" ? "incremented" : "decremented"
        } successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating car day count:", error);
    return NextResponse.json(
      { message: "Failed to update car day count", error },
      { status: 500 }
    );
  }
}
export async function DELETE(req: any) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const carId = req.nextUrl.searchParams.get("id");
    const deleteAll = req.nextUrl.searchParams.get("deleteAll");

    await ConnectDB();

    if (deleteAll === "true") {
      const result = await reservedCars.deleteMany({});
      return NextResponse.json(
        {
          message: "All reserved cars deleted successfully",
          deletedCount: result.deletedCount,
        },
        { status: 200 }
      );
    }

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid User ID format" },
          { status: 400 }
        );
      }

      const deletedCars = await reservedCars.deleteMany({ userId });

      if (deletedCars.deletedCount === 0) {
        return NextResponse.json(
          { message: "No reserved cars found for this user" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "All reserved cars for user deleted successfully",
          deletedCount: deletedCars.deletedCount,
        },
        { status: 200 }
      );
    }

    if (carId) {
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return NextResponse.json(
          { message: "Invalid Car ID format" },
          { status: 400 }
        );
      }

      const deletedCar = await reservedCars.findOneAndDelete({ _id: carId });

      if (!deletedCar) {
        return NextResponse.json(
          { message: "Reserved car not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Reserved car deleted successfully" },
        { status: 200 }
      );
    }

    // If no userId, carId, or deleteAll parameter is provided
    return NextResponse.json(
      { message: "Car ID, User ID, or deleteAll flag is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error while deleting reserved car:", error);
    return NextResponse.json(
      { message: "Failed to delete reserved car", error },
      { status: 500 }
    );
  }
}
