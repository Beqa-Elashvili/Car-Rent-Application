"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import {
  CarsType,
  TRentalTracks,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { LoadingOutlined } from "@ant-design/icons";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import useGetUpdatedPrice from "@/app/hooks/GetDiscounthook/useGetDiscount";
import { Spin } from "antd";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useSession } from "next-auth/react";

export default function ReserveCars() {
  const {
    ReserveCars,
    reservedTracks,
    userId,
    ChangeCarDayCount,
    deleteReservedCar,
    loading,
    loadingStates,
    deleteReserveTrack,
  } = useGlobalProvider();
  const { getUpdatedPrice } = useGetUpdatedPrice();

  const router = useRouter();
  const { data: session } = useSession();

  const getTotalPrice = () => {
    const totalRentCarPrice = ReserveCars.reduce((accumulator, car) => {
      const { updatedPrice } = getUpdatedPrice(car.dayPrice, car.carDayCount);
      return accumulator + updatedPrice * car.carDayCount;
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
      {loading ? (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />{" "}
        </>
      ) : (
        <>
          {ReserveCars.length !== 0 || reservedTracks.length !== 0 ? (
            <>
              {ReserveCars?.map((item: CarsType) => {
                const handleTotalPrices = () => {
                  let updated = 0;
                  const { updatedPrice, discountPercentage } = getUpdatedPrice(
                    item.dayPrice,
                    item.carDayCount
                  );
                  updated += updatedPrice * item.carDayCount;
                  return { updated, discountPercentage };
                };
                const { discountPercentage, updated } = handleTotalPrices();

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
                            Price per Day.Rental :{" "}
                            <span>$ {item.dayPrice}</span>
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
                      <div className="block md:flex items-center gap-4">
                        <div className="flex gap-2 mt-2 md:mt-0 items-center justify-between">
                          <button
                            onClick={() =>
                              ChangeCarDayCount(item, false, "increase")
                            }
                          >
                            <CiCirclePlus className="size-8  text-gray-600 hover:text-gray-700" />
                          </button>
                          {loadingStates[item._id] ? (
                            <Spin />
                          ) : (
                            <div>{item.carDayCount}</div>
                          )}
                          <button
                            onClick={() => {
                              ChangeCarDayCount(item, false, "decrease");
                            }}
                          >
                            <CiCircleMinus className="size-8 text-gray-600 hover:text-gray-700" />
                          </button>
                          <div>${updated}</div>
                          {discountPercentage !== 0 && (
                            <span className="text-red-500">
                              -{discountPercentage} %
                            </span>
                          )}
                          <button
                            className="text-end"
                            onClick={() =>
                              deleteReservedCar(item._id, false, () => {})
                            }
                          >
                            <TiDeleteOutline className="size-8 text-gray-600 hover:text-gray-700" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            router.push(`/pages/solocar/${item._id}`)
                          }
                          className="hidden md:flex items-center text-xl hover:cursor-pointer h-full hover:text-green-500"
                        >
                          <p>Review</p>
                          <span>
                            <MdOutlineNavigateNext className="text-9xl" />
                          </span>
                        </button>
                        <Button
                          onClick={() =>
                            router.push(`/pages/solocar/${item._id}`)
                          }
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
              {reservedTracks?.length !== 0 && (
                <>
                  <h1 className="text-3xl text-orange-500 font-mono p-2">
                    TRACKS
                  </h1>
                  {reservedTracks?.map((item: TRentalTracks) => {
                    return (
                      <div className="cursor-pointer" key={item._id}>
                        <div className="bg-yellow-500 p-2 rounded-xl mx-2 md:flex items-center  justify-between">
                          <div className="flex md:text-start flex-col">
                            <p className="font-medium text-xl">
                              {item.title.toUpperCase()} |{" "}
                              {item.location.toUpperCase()}
                            </p>
                            <div className="text-md">
                              <p>
                                Price per Day.Rental :{" "}
                                <span>
                                  ${" "}
                                  {item.dayRentPrice
                                    ? item.dayRentPrice
                                    : item.rentPrice}
                                </span>
                              </p>
                              <p className="text-red-500 text-bold">
                                {item.oneLap && <>One Lap (ONLY)</>}
                              </p>
                              <p>Period: {item.dayCount} day</p>
                              <h1>Total: {item.totalPrice} $</h1>
                            </div>
                          </div>
                          <div className="text-center md:flex items-center gap-4">
                            <div
                              className="border-none mt-2"
                              onClick={() =>
                                deleteReserveTrack(item._id, false)
                              }
                            >
                              <TiDeleteOutline className="size-8 m-auto text-gray-600 hover:text-gray-700" />
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
                        </div>
                        <div className="bg-gray-200 mt-4 h-px w-full mb-4"></div>
                      </div>
                    );
                  })}
                </>
              )}
              <div className="w-full bg-orange-900 rounded-xl p-2 md:p-12">
                <div className=" w-full md:w-3/6 m-auto flex flex-col gap-2 text-start">
                  <Button
                    onClick={() =>
                      session &&
                      deleteReservedCar(session?.user?.id, true, () => {})
                    }
                    className="bg-red-600 text-white border-none font-semibold"
                  >
                    Delete all reserved car
                  </Button>
                  <Button
                    onClick={() => session && deleteReserveTrack("", true)}
                    className="bg-red-600 text-white border-none font-semibold"
                  >
                    Delete all reserved track
                  </Button>
                  <div className="bg-white text-yellow-600 flex justify-between p-2 rounded-xl">
                    <h1>Total Days:</h1>
                    <span>{TotalDayCount()} x</span>
                  </div>
                  <div className="bg-white text-yellow-600 flex justify-between p-2 rounded-xl">
                    <h1>Total Cars:</h1>
                    <span>{ReserveCars.length} x</span>
                  </div>
                  <div className="bg-white text-yellow-600 flex justify-between p-2 rounded-xl">
                    <h1>Total Track:</h1>
                    <span>{reservedTracks.length} x</span>
                  </div>
                  <div className="bg-white text-yellow-600 flex justify-between p-2 rounded-xl">
                    <h1>Total Price:</h1>
                    <span>{getTotalPrice()} $</span>
                  </div>
                  {!userId ? (
                    <button
                      onClick={() => router.push("/register")}
                      className="text-center bg-blue-500 hover:bg-blue-600 p-2 rounded-xl w-3/6 m-auto"
                    >
                      Sign Up
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/pages/chackout")}
                      className="text-center bg-orange-500 mt-2 hover:bg-blue-600 p-2 rounded-xl w-3/6 m-auto"
                    >
                      Go to Chackout
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-white flex flex-col gap-4 items-cente font-mono">
              <h1 className="text-6xl">No Reserved</h1>
              {userId ? (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      className="bg-orange-500 w-40 text-white font-mono border-none px-14"
                      onClick={() => router.push("/pages/collection")}
                    >
                      Explore
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => router.push("/register")}
                        className="w-40 bg-orange-500 font-mono text-white border-none"
                      >
                        Sign up
                      </Button>
                      <Button
                        onClick={() => router.push("/login")}
                        className="w-40 bg-orange-500 font-mono text-white border-none"
                      >
                        Sign in
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
