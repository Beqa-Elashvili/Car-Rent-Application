import { Orders } from "models/orders";
import { User } from "models/userModal";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectDB } from "utils/connect";

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
export async function DELETE(req: any) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const orderId = req.nextUrl.searchParams.get("id");
    const deleteAll = req.nextUrl.searchParams.get("deleteAll");

    await ConnectDB();

    if (deleteAll === "true") {
      const result = await Orders.deleteMany({});
      return NextResponse.json(
        {
          message: "All orders deleted successfully",
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

      const deletedCars = await Orders.deleteMany({ userId });

      if (deletedCars.deletedCount === 0) {
        return NextResponse.json(
          { message: "No orders found to delete for this user" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "All orders for user deleted successfully",
          deletedCount: deletedCars.deletedCount,
        },
        { status: 200 }
      );
    }

    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json(
          { message: "Invalid Order ID format" },
          { status: 400 }
        );
      }

      const deletedCar = await Orders.findOneAndDelete({ _id: orderId });

      if (!deletedCar) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Order deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Order ID, User ID, or deleteAll flag is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error while deleting orders:", error);
    return NextResponse.json(
      { message: "Failed to delete orders", error },
      { status: 500 }
    );
  }
}
