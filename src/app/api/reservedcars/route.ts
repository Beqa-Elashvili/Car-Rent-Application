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

      console.log("Found Reserved Cars:", ReservedCars);

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

      console.log("Looking for carId:", carId);

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

    const existingReservation = await reservedCars.findOne({
      userId,
      model: car.model,
    });

    if (existingReservation) {
      existingReservation.carDayCount += 1;
      existingReservation.dayPrice = car.dayPrice; 
      await existingReservation.save();

      return NextResponse.json(
        {
          message: "Car reservation updated. Day count increased.",
          reservedCar: existingReservation,
        },
        { status: 200 }
      );
    } else {
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
    }
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
    const { userId, carId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        { message: "Invalid Car ID format" },
        { status: 400 }
      );
    }

    await ConnectDB();
    const reservation = await reservedCars.findOne({ _id: carId, userId });

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found for this car and user" },
        { status: 404 }
      );
    }

    if (reservation.carDayCount > 1) {
      reservation.carDayCount -= 1;
      await reservation.save();
      return NextResponse.json(
        { message: "Car day count decremented successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Car day count cannot be less than 1" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error while decrementing car day count:", error);
    return NextResponse.json(
      { message: "Failed to decrement car day count", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: any) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const carId = req.nextUrl.searchParams.get("id");

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid User ID format" },
          { status: 400 }
        );
      }

      await ConnectDB();

      const deletedCars = await reservedCars.deleteMany({ userId });

      if (deletedCars.deletedCount === 0) {
        return NextResponse.json(
          { message: "No cars found to delete for this user" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "All reserved cars deleted successfully" },
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

      await ConnectDB();

      const deletedCar = await reservedCars.findOneAndDelete({ _id: carId });

      if (!deletedCar) {
        return NextResponse.json({ message: "Car not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Reserved car deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Car ID or User ID is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error while deleting car:", error);
    return NextResponse.json(
      { message: "Failed to delete car", error },
      { status: 500 }
    );
  }
}
