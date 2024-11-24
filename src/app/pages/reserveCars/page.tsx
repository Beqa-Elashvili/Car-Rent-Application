"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import { createCarImage } from "@/app/CreateCarImage";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Button } from "antd/es/radio";

export default function ReserveCars() {
  const { ReserveCars } = useGlobalProvider();
  console.log(ReserveCars);
  return (
    <div className="bg-gray-900 h-full w-full text-white p-12">
      {ReserveCars?.map((item: CarsType) => {
        const initialPrice = 1230;
        const carsNum = item.carDayCount;
        const handleTotalPrices = () => {
          return initialPrice * carsNum;
        };
        return (
          <div key={item._id}>
            <div className="bg-yellow-500 p-2 rounded-xl md:flex items-center justify-between">
              <div className="flex flex-col">
                <img
                  className="w-40 flex w-full md:hidden "
                  src={createCarImage(item)}
                  alt="Carimg"
                />

                <p className="font-medium text-xl">
                  {item.make.toUpperCase()} | {item.model.toUpperCase()}
                </p>
                <div className="text-md">
                  <p>
                    Price per Day.Rental : <span>432432$</span>
                  </p>
                  <p>Period: 8+ days</p>
                  <p>Day: {item.carDayCount}</p>
                </div>
              </div>
              <img
                className="hidden md:block w-60"
                src={createCarImage(item)}
                alt="Carimg"
              />
              <div>
                <h1 className="hidden md:flex items-center text-xl hover:cursor-pointer h-full hover:text-green-500">
                  <p>Review</p>
                  <span>
                    <MdOutlineNavigateNext className="text-9xl" />
                  </span>
                </h1>
                <Button className="flex items-center justify-center md:hidden text-center w-full bg-green-400 text-white border-none mt-2 rounded text-lg">
                  Review
                </Button>
              </div>
            </div>
            <div className="bg-gray-200 mt-4 h-px w-full mb-4"></div>
          </div>
        );
      })}
    </div>
  );
}
