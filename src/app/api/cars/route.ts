import mongoose from "mongoose";
import { Cars } from "models/cars";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "utils/connect";

export async function POST(req: NextRequest) {
  try {
    const { car, cars } = await req.json();

    // Check if a single car object is provided
    if (car) {
      const newCar = new Cars({
        city_mpg: car.city_mpg,
        class: car.class,
        combination_mpg: car.combination_mpg,
        cylinders: car.cylinders,
        displacement: car.displacement,
        drive: car.drive,
        horsepower: car.horsepower,
        fuel_type: car.fuel_type,
        highway_mpg: car.highway_mpg,
        make: car.make,
        brand: car.brand,
        model: car.model,
        transmission: car.transmission,
        year: car.year,
        carDayCount: car.carDayCount || 0,
        dayPrice: car.dayPrice || 0,
        img: car.img,
      });

      await newCar.save();
      return NextResponse.json(
        { message: "Car created successfully", car: newCar },
        { status: 201 }
      );
    }
    // Check if multiple cars are provided
    else if (cars && Array.isArray(cars)) {
      const newCars = await Cars.insertMany(cars);
      return NextResponse.json(
        { message: "Cars created successfully", cars: newCars },
        { status: 201 }
      );
    }
    // Invalid request format
    else {
      return NextResponse.json(
        {
          message:
            'Invalid request format. Provide either a "car" or an array of "cars".',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to process car(s)", error },
      { status: 500 }
    );
  }
}

// PUT: Update car details by carId
export async function PUT(req: NextRequest) {
  try {
    const { carId, carData } = await req.json();

    // Validate carId and carData
    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        { message: "Invalid or missing car ID" },
        { status: 400 }
      );
    }

    if (!carData || typeof carData !== "object") {
      return NextResponse.json(
        { message: "Car data is required and should be an object" },
        { status: 400 }
      );
    }

    // Update the car with new data
    const updatedCar = await Cars.findByIdAndUpdate(
      carId,
      { $set: carData },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Car updated successfully", car: updatedCar },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { message: "Failed to update car", error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const brand = url.searchParams.get("brand");
    const id = url.searchParams.get("id");
    const minDayPrice = url.searchParams.get("minDayPrice");
    const maxDayPrice = url.searchParams.get("maxDayPrice");
    const model = url.searchParams.get("model");
    const carClass = url.searchParams.get("class");
    const limit = url.searchParams.get("limit");
    const page = url.searchParams.get("page") || "1";

    await ConnectDB();

    if (id) {
      const car = await Cars.findById(id);
      if (!car) {
        return NextResponse.json(
          { message: "Car not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ car }, { status: 200 });
    }

    const query: any = {};

    if (brand && model) {
      query.brand = brand;
      query.model = { $regex: new RegExp(model, "i") };
    } else if (brand) {
      query.brand = brand;
    } else if (model) {
      query.model = { $regex: new RegExp(model, "i") };
    }

    if (carClass) {
      query.class = carClass;
    }

    if (minDayPrice || maxDayPrice) {
      query.dayPrice = {};
      if (minDayPrice) query.dayPrice.$gte = Number(minDayPrice);
      if (maxDayPrice) query.dayPrice.$lte = Number(maxDayPrice);
    }

    const queryOptions: any = {};

    const limitValue = Number(limit) || 10;
    const pageValue = Number(page) || 1;

    queryOptions.limit = limitValue;
    queryOptions.skip = (pageValue - 1) * limitValue;

    const cars = await Cars.find(query, null, queryOptions);

    if (cars.length === 0) {
      return NextResponse.json({ message: "No cars found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        cars,
        pagination: {
          page: pageValue,
          limit: limitValue,
          totalCount: await Cars.countDocuments(query),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { message: "Failed to fetch cars", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const carId = req.nextUrl.searchParams.get("id");

    if (carId) {
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return NextResponse.json(
          { message: "Invalid Car ID format" },
          { status: 400 }
        );
      }

      const deletedCar = await Cars.findOneAndDelete({ _id: carId });

      if (!deletedCar) {
        return NextResponse.json({ message: "Car not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Car deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Car ID is required" },
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
