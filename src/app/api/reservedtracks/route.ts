import { User } from "models/userModal";
import { reservedTracks } from "models/reserveTracks";
import { NextResponse } from "next/server";
import { ConnectDB } from "utils/connect";
import mongoose from "mongoose";

export async function POST(req: any) {
  try {
    await ConnectDB();
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
      totalPrice: track.totalPrice,
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
    await ConnectDB();
    const userId = req.nextUrl.searchParams.get("userId");
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid User ID format" },
          { status: 400 }
        );
      }
      console.log("Looking for userId:", userId);

      const ReservedTracksData = await reservedTracks.find({ userId });

      if (ReservedTracksData.length === 0) {
        return NextResponse.json(
          { message: "No tracks reserved by this user." },
          { status: 404 }
        );
      }

      return NextResponse.json({ ReservedTracks: ReservedTracksData });
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
export async function DELETE(req: any) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const trackId = req.nextUrl.searchParams.get("id");
    const deleteAll = req.nextUrl.searchParams.get("deleteAll");

    await ConnectDB();

    if (deleteAll === "true") {
      const result = await reservedTracks.deleteMany({});
      return NextResponse.json(
        {
          message: "All reserved tracks deleted successfully",
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

      const deletedTracks = await reservedTracks.deleteMany({ userId });

      if (deletedTracks.deletedCount === 0) {
        return NextResponse.json(
          { message: "No reserved tracks found for this user" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "All reserved tracks for user deleted successfully",
          deletedCount: deletedTracks.deletedCount,
        },
        { status: 200 }
      );
    }

    if (trackId) {
      if (!mongoose.Types.ObjectId.isValid(trackId)) {
        return NextResponse.json(
          { message: "Invalid Track ID format" },
          { status: 400 }
        );
      }

      const deletedTrack = await reservedTracks.findOneAndDelete({
        _id: trackId,
      });

      if (!deletedTrack) {
        return NextResponse.json(
          { message: "Reserved track not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Reserved track deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Track ID, User ID, or deleteAll flag is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error while deleting reserved track:", error);
    return NextResponse.json(
      { message: "Failed to delete reserved track", error },
      { status: 500 }
    );
  }
}
