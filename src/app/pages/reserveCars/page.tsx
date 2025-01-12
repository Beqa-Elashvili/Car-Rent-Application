"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import {
  CarsType,
  TRentalTracks,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Button } from "antd/es/radio";
import { useRouter } from "next/navigation";

export default function ReserveCars() {
  const { ReserveCars, reservedTracks } = useGlobalProvider();
  const router = useRouter();

  const getTotalPrice = () => {
    const totalRentCarPrice = ReserveCars.reduce((accimulator, car) => {
      return accimulator + car.dayPrice * car.carDayCount;
    }, 0);
    const totalRentTrackPrice = reservedTracks.reduce((accumulator, track) => {
      return accumulator + track.totalPrice;
    }, 0);
    const totalPrice = totalRentCarPrice + totalRentTrackPrice;
    return totalPrice;
  };

  const TotalDayCount = () => {
    const totalReserveCars = ReserveCars.reduce((accimulator, car) => {
      return accimulator + car.carDayCount;
    }, 0);
    const totalTrack = reservedTracks.reduce((accumulator, track) => {
      return accumulator + track.dayCount;
    }, 0);
    const total = totalReserveCars + totalTrack;
    return total;
  };

  return (
    <div className="bg-gray-900 min-h-screen h-full w-full text-center text-white p-14">
      {ReserveCars?.map((item: CarsType) => {
        return (
          <div key={item._id}>
            <div className="bg-yellow-500 p-2 rounded-xl md:flex items-center justify-between">
              <div className="flex md:text-start flex-col">
                <img
                  className="w-40 flex object-cover w-full md:hidden "
                  src={item.img}
                  alt="Carimg"
                />

                <p className="font-medium text-xl">
                  {item.make.toUpperCase()} | {item.model.toUpperCase()}
                </p>
                <div className="text-md">
                  <p>
                    Price per Day.Rental : <span>$ {item.dayPrice}</span>
                  </p>
                  <p>Period: 8+ days</p>
                  <p>Day: {item.carDayCount}</p>
                </div>
              </div>
              <img
                className="hidden md:block w-60"
                src={item.img}
                alt="Carimg"
              />
              <div>
                <button
                  onClick={() => router.push(`/pages/solocar/${item._id}`)}
                  className="hidden md:flex items-center text-xl hover:cursor-pointer h-full hover:text-green-500"
                >
                  <p>Review</p>
                  <span>
                    <MdOutlineNavigateNext className="text-9xl" />
                  </span>
                </button>
                <Button
                  onClick={() => router.push(`/pages/solocar/${item._id}`)}
                  className="flex items-center justify-center md:hidden text-center w-full bg-green-400 text-white border-none mt-2 rounded text-lg"
                >
                  Review
                </Button>
              </div>
            </div>
            <div className="bg-gray-200 mt-4 h-px w-full mb-4"></div>
          </div>
        );
      })}
      <h1 className="text-3xl text-orange-500 font-mono p-2">TRACKS</h1>
      {reservedTracks?.map((item: TRentalTracks) => {
        return (
          <div key={item._id}>
            <div className="bg-yellow-500 p-2 rounded-xl mx-2 md:flex items-center  justify-between">
              <div className="flex md:text-start flex-col">
                <p className="font-medium text-xl">
                  {item.title.toUpperCase()} | {item.location.toUpperCase()}
                </p>
                <div className="text-md">
                  <p>
                    Price per Day.Rental :{" "}
                    <span>
                      $ {item.dayRentPrice ? item.dayRentPrice : item.rentPrice}
                    </span>
                  </p>
                  <p className="text-red-500 text-bold">
                    {item.oneLap && <>One Lap (ONLY)</>}
                  </p>
                  <p>Period: {item.dayCount} day</p>
                  <h1>Total: {item.totalPrice} $</h1>
                </div>
              </div>
              <div className="flex flex-col md:flex gap-2">
                <p>Date</p>
                <p className="h-px bg-gray-200 w-full"></p>
                {item.oneLap ? (
                  <h1>{item.dayStart}</h1>
                ) : (
                  <div className="flex flex-col gap-2">
                    <h1>{item.dayStart}</h1>
                    <h1>{item.dayEnd}</h1>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-200 mt-4 h-px w-full mb-4"></div>
          </div>
        );
      })}

      <div className="w-full bg-green-500 rounded-xl p-2 md:p-12">
        <div className=" w-full md:w-3/6 m-auto flex flex-col gap-2 text-start">
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Days:</h1>
            <span>{TotalDayCount()} x</span>
          </div>
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Cars:</h1>
            <span>{ReserveCars.length} x</span>
          </div>
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Track:</h1>
            <span>{reservedTracks.length} x</span>
          </div>
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Price:</h1>
            <span>{getTotalPrice()} $</span>
          </div>
          <button
            onClick={() => router.push("/pages/chackout")}
            className="text-center bg-blue-500 hover:bg-blue-600 p-2 rounded-xl w-3/6 m-auto"
          >
            Go to Chackout
          </button>
        </div>
      </div>
    </div>
  );
}
