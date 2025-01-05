import { User } from "models/userModal";
import { reservedTracks } from "models/reserveTracks";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: any) {
  try {
    const { userId, track } = await req.json();

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

    if (!track || !track.title || !track.location) {
      return NextResponse.json(
        {
          message: "Track data is incomplete",
        },
        { status: 400 }
      );
    }

    const newReservation = new reservedTracks({
      title: track.title,
      loop: track.loop,
      rentPrice: track.rentPrice,
      dayRentPrice: track.dayRentPrice,
      location: track.location,
      description: track.description,
      dayStart: track.dayStart,
      dayEnd: track.dayEnd,
      dayCount: track.dayCount,
      oneLap: track.oneLap,
      userId,
    });

    await newReservation.save();

    return NextResponse.json(
      { message: "Track Reserved", reservedTracks: newReservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to reserve track", error },
      { status: 500 }
    );
  }
}

export async function GET(req: any) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid User ID format" },
          { status: 400 }
        );
      }
      console.log("Looking for userId:", userId);

      const ReservedTracks = await reservedTracks.find({ userId });

      if (ReservedTracks.length === 0) {
        return NextResponse.json(
          { message: "No tracks reserved by this user." },
          { status: 404 }
        );
      }

      return NextResponse.json({ ReservedTracks });
    }

    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching ReserveTracks data:", error);

    return NextResponse.json(
      { message: "Error fetching ReserveTracks data", error: error },
      { status: 500 }
    );
  }
}
