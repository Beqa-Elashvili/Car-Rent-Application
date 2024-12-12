"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import { createCarImage } from "@/app/CreateCarImage";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Button } from "antd/es/radio";
import { useRouter } from "next/navigation";

export default function ReserveCars() {
  const { ReserveCars } = useGlobalProvider();
  const router = useRouter();
  const TotalPrice = localStorage.getItem("reserveTotalPrice");

  const TotalDayCount = () => {
    const total = ReserveCars.reduce((accimulator, car) => {
      return accimulator + car.carDayCount;
    }, 0);
    return total;
  };

  return (
    <div className="bg-gray-900 min-h-screen h-full w-full text-center text-white p-12">
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
                  onClick={() =>
                    router.push(`/pages/solocar/${undefined}/${item._id}}`)
                  }
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
      <div className="w-full bg-green-500 rounded-xl p-12">
        <div className="w-3/6 m-auto flex flex-col gap-2 text-start">
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Days:</h1>
            <span>{TotalDayCount()} x</span>
          </div>
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Cars:</h1>
            <span>{ReserveCars.length} x</span>
          </div>
          <div className="bg-white text-yellow-600 flex p-2 rounded-xl">
            <h1 className="w-20">Total Price:</h1>
            <span>{TotalPrice} $</span>
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
