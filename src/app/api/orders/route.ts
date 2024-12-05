import { Orders } from "models/orders";
import { User } from "models/userModal";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { userId, order } = await req.json();
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
    const newOrder = new Orders({
      userId,
      username: order.username,
      email: order.email,
      city: order.city,
      street: order.street,
      drivingLicense: order.drivingLicense || "",
      cardNumber: order.cardNumber,
      expiry: order.expiry,
      cvc: order.cvc,
      cardName: order.cardName,
      TotalPrice: order.TotalPrice,
      TotalDays: order.TotalDays,
      cardunlock: order.cardunlock,
    });

    await newOrder.save();

    return NextResponse.json(
      { message: "Order created successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to process order", error },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing User ID" },
        { status: 400 }
      );
    }

    const orders = await Orders.find({ userId });

    if (orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}
