import { Tracing } from "models/tracing";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ConnectDB } from "utils/connect";

export async function POST(req: NextResponse) {
  try {
    const { TracingCar, TracingCars } = await req.json();

    if (TracingCar) {
      const newCar = new Tracing({
        city_mpg: TracingCar.city_mpg,
        class: TracingCar.class,
        combination_mpg: TracingCar.combination_mpg,
        cylinders: TracingCar.cylinders,
        displacement: TracingCar.displacement,
        drive: TracingCar.drive,
        horsepower: TracingCar.horsepower,
        fuel_type: TracingCar.fuel_type,
        highway_mpg: TracingCar.highway_mpg,
        make: TracingCar.make,
        brand: TracingCar.brand,
        model: TracingCar.model,
        transmission: TracingCar.transmission,
        year: TracingCar.year,
        carDayCount: TracingCar.carDayCount || 0,
        dayPrice: TracingCar.dayPrice || 0,
        img: TracingCar.img,
      });

      await newCar.save();
      return NextResponse.json(
        { message: "Tracing car created successfully", car: newCar },
        { status: 201 }
      );
    } else if (TracingCars && Array.isArray(TracingCars)) {
      const newCars = await Tracing.insertMany(TracingCars);
      return NextResponse.json(
        { message: "Tracing car created successfully", TracingCars: newCars },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message:
            'Invalid request format. Provide either a "TracingCar" or an array of "TracingCars".',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to process TracingCar(s)", error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
      const car = await Tracing.findById(id);
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

    const tracingcars = await Tracing.find(query, null, queryOptions);

    if (tracingcars.length === 0) {
      return NextResponse.json(
        { message: "No TracingCars found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        tracingcars,
        pagination: {
          page: pageValue,
          limit: limitValue,
          totalCount: await Tracing.countDocuments(query),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching TracingCars:", error);
    return NextResponse.json(
      { message: "Failed to fetch TracingCars", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: any) {
  try {
    const carId = req.nextUrl.searchParams.get("id");

    if (carId) {
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return NextResponse.json(
          { message: "Invalid Car ID format" },
          { status: 400 }
        );
      }

      const deletedCar = await Tracing.findOneAndDelete({ _id: carId });

      if (!deletedCar) {
        return NextResponse.json({ message: "Tracing Car not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "car deleted successfully" },
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
