import { ConnectDB } from "utils/connect";
import { Orders } from "models/orders";
import { User } from "models/userModal";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { userId, order } = await req.json(); // Expecting order data to be sent in the request body

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
    });

    // Save the new order to the database
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
    const url = new URL(req.url); // Parse the URL of the request
    const userId = url.searchParams.get("userId");
    // Ensure userId is present and is a valid MongoDB ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing User ID" },
        { status: 400 }
      );
    }

    // Find all orders for the given userId
    const orders = await Orders.find({ userId });

    // If no orders are found, return a 404
    if (orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user." },
        { status: 404 }
      );
    }

    // Return the found orders
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}
