import mongoose from "mongoose";
import { Cars } from "models/cars";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    const { car, cars } = await req.json();

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
    } else if (cars && Array.isArray(cars)) {
      const newCars = await Cars.insertMany(cars);
      return NextResponse.json(
        { message: "Cars created successfully", cars: newCars },
        { status: 201 }
      );
    } else {
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const brand = url.searchParams.get("brand");

    const query = brand ? { brand } : {};

    const cars = await Cars.find(query);

    if (cars.length === 0) {
      return NextResponse.json({ message: "No cars found." }, { status: 404 });
    }

    return NextResponse.json({ cars }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching cars:", error);

    return NextResponse.json(
      { message: "Failed to fetch cars", error: error.message || error },
      { status: 500 }
    );
  }
}
