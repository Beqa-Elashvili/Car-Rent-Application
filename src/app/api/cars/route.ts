import mongoose from "mongoose";
import { Cars } from "models/cars";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { car } = await req.json();

    const newCar = new Cars({
      city_mpg: car.city_mpg,
      class: car.class,
      combination_mpg: car.combination_mpg,
      cylinders: car.cylinders,
      displacement: car.displacement,
      drive: car.drive,
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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to process car", error },
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
