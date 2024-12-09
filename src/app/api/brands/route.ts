import { Brands } from "models/brands";
import { Cars } from "models/cars";
import { NextResponse } from "next/server";
import { ConnectDB } from "utils/connect";

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const { brand, brands } = await req.json();

    // Handle single brand creation
    if (brand) {
      if (!brand?.name || !brand?.img) {
        return NextResponse.json(
          { message: "Brand name and image are required" },
          { status: 400 }
        );
      }

      const newBrand = new Brands({
        name: brand.name,
        img: brand.img,
      });

      await newBrand.save();

      return NextResponse.json(
        { message: "Brand created successfully", brand: newBrand },
        { status: 201 }
      );
    }

    if (brands && Array.isArray(brands)) {
      const invalidBrand = brands.find((b) => !b?.name || !b?.img);
      if (invalidBrand) {
        return NextResponse.json(
          { message: "Each brand must have a 'name' and 'img'." },
          { status: 400 }
        );
      }

      const newBrands = await Brands.insertMany(brands);

      return NextResponse.json(
        { message: "Brands created successfully", brands: newBrands },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message:
          'Invalid request format. Provide either "brand" or an array of "brands".',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating brand(s):", error);
    return NextResponse.json(
      { message: "Failed to create brand(s)" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  try {
    await ConnectDB();
    const brands = await Brands.find({});

    if (!brands.length) {
      return NextResponse.json({ message: "No brands found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Brands retrieved successfully", brands },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
