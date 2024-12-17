"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Button, Slider } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { TiDeleteOutline } from "react-icons/ti";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import {
  CarsType,
  TCollecttion,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "antd";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { brand: string } }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    collections,
    ReserveCars,
    carData,
    setCarData,
    loading,
    setLoading,
    error,
    fetchReservedCars,
    deleteReservedCar,
  } = useGlobalProvider();
  const router = useRouter();
  const numb = 9;
  const pathname = window.location.pathname.split("/").pop();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [maxMinprices, setMaxMinPrices] = useState({ min: 0, max: 1500 });

  const sortByPrices = (values: number[]) => {
    setMaxMinPrices({
      min: values[0],
      max: values[1],
    });
  };

  const [selectedDays, setSelectedDays] = useState<number[]>(
    Array(carData.length).fill(0)
  );
  const [prices, setPrices] = useState<number[]>(
    carData.map((car) => car.dayPrice)
  );

  async function GetCarData(brand: string, min: number, max: number) {
    try {
      let url = "/api/cars";
      setLoading(true);
      if (brand) {
        url += `?brand=${brand}`;
      }
      if (min || max) {
        url += `&minDayPrice=${min}&maxDayPrice=${max}`;
      }
      const resp = await axios.get(url);
      setCarData(resp.data.cars);
      setPrices([]);
      setSelectedDays([]);
      setLoading(false);
    } catch (error) {
      console.log("error thile fatch brand data");
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      GetCarData(params.brand, maxMinprices.min, maxMinprices.max);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [maxMinprices, params.brand]);

  const calculateTotalPrice = () => {
    const total = ReserveCars.reduce((accumulatedTotal, item) => {
      const totalCarPrice = item.dayPrice * item.carDayCount;
      return accumulatedTotal + totalCarPrice;
    }, 0);
    localStorage.setItem("reserveTotalPrice", total as unknown as string);
    return total;
  };

  useEffect(() => {
    if (ReserveCars.length === 0) {
      setIsOpen(false);
    }
  }, [ReserveCars]);

  const addCarToReserve = async (car: CarsType) => {
    try {
      const userId = session?.user.id;
      if (!userId) {
        console.error("User is not authenticated");
        return;
      }
      const response = await axios.post("/api/reservedcars", {
        userId,
        car,
      });

      fetchReservedCars();
      setIsOpen(true);
    } catch (error: any) {
      console.error("Error adding car to reserve:", error);
    }
  };

  const decrementCarDayCount = async (car: CarsType) => {
    try {
      if (!userId) {
        console.error("User is not authenticated");
        return;
      }
      if (car.carDayCount === 1) {
        deleteReservedCar(car._id, false, setIsOpen);
        return;
      }
      const response = await axios.put("/api/reservedcars", {
        userId,
        carId: car._id,
      });

      fetchReservedCars();
    } catch (error: any) {
      console.error("Error decrementing car day count:", error);
    }
  };

  const handleDaySelection = async (index: number, days: number) => {
    setSelectedDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[index] = days;
      return updatedDays;
    });

    const basePrice = carData[index].dayPrice;
    const newPrice = getUpdatedPrice(basePrice, days);

    setPrices((prevPrices) => {
      const updatedPrices = [...prevPrices];
      updatedPrices[index] = newPrice;
      return updatedPrices;
    });
  };

  const getUpdatedPrice = (dayPrice: number, days: number) => {
    if (days === 2) return dayPrice * 0.9;
    if (days === 4) return dayPrice * 0.8;
    if (days === 6) return dayPrice * 0.7;
    if (days === 8) return dayPrice * 0.6;
    return dayPrice;
  };
  return (
    <div className="bg-gray-800 relative p-2 h-full">
      <div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key={"modal"}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="fixed overflow-y-auto  top-0 right-0 w-1/2 h-screen bg-white z-10 p-2"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 w-40 bg-red-500 hover:bg-red-600 rounded-xl float-end"
              >
                close
              </button>
              <div className="mt-12">
                <div className="bg-gray-200 h-px w-full"></div>
                <div className="py-4 flex flex-col gap-4">
                  {ReserveCars.map((item: CarsType) => {
                    const handleTotalPrices = () => {
                      return item.dayPrice * item.carDayCount;
                    };
                    return (
                      <div key={item._id}>
                        <div className="bg-yellow-500 p-2 rounded-xl flex items-center justify-center">
                          <img className="w-40" src={item.img} alt="Carimg" />
                          <div className="flex flex-col w-full">
                            <p className="font-medium text-lg">
                              {item.make.toUpperCase()} |{" "}
                              {item.model.toUpperCase()}
                            </p>
                            <div className="flex justify-between w-full">
                              <div className="text-sm">
                                <p>Price per Day.{item.dayPrice}</p>
                                <p>Period: 8+ days</p>
                              </div>
                              <div className="flex gap-2 items-center">
                                <button onClick={() => addCarToReserve(item)}>
                                  <CiCirclePlus className="size-8  text-gray-600 hover:text-gray-700" />
                                </button>
                                <div>{item.carDayCount}</div>
                                <button
                                  onClick={() => {
                                    decrementCarDayCount(item);
                                  }}
                                >
                                  <CiCircleMinus className="size-8 text-gray-600 hover:text-gray-700" />
                                </button>
                                <div>${handleTotalPrices()}</div>
                                <button
                                  onClick={() =>
                                    deleteReservedCar(
                                      item._id,
                                      false,
                                      setIsOpen
                                    )
                                  }
                                >
                                  <TiDeleteOutline className="size-8 text-gray-600 hover:text-gray-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-200 mt-4 h-px w-full"></div>
                      </div>
                    );
                  })}
                </div>
                <h1 className="float-end font-medium text-xl">
                  TOTAL: ${calculateTotalPrice()}
                </h1>
                <Button
                  disabled={!session}
                  onClick={() =>
                    session &&
                    deleteReservedCar(session?.user?.id, true, setIsOpen)
                  }
                  className="w-full mt-2 bg-red-500 border-none p-6 font-medium text-xl text-white"
                >
                  Delete All
                </Button>
                <Button
                  onClick={() => router.push("/pages/reserveCars")}
                  className="w-full mt-2 bg-green-500 border-none p-6 font-medium text-xl text-white"
                >
                  RESERVE
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between text-white h-full">
          <div className="bg-gray-700 z-40 rounded p-2 w-60">
            {collections.map((item: TCollecttion, index: number) => (
              <div
                key={index}
                onClick={() => router.push(`/pages/brands/${item.name}`)}
                className={`flex items-center cursor-pointer hover:bg-gray-700 h-14 overflow-hidden rounded-xl p-2 gap-2 ${
                  pathname === item.name && "bg-gray-800"
                }`}
              >
                <img
                  className="w-12 h-12 object-contain"
                  src={item.img}
                  alt="logo"
                />
                <p>{item.name}</p>
              </div>
            ))}
            <Button
              disabled={ReserveCars.length === 0}
              onClick={() => setIsOpen(!isOpen)}
              className="rounded w-full border-none font-medium text-white bg-green-600 p-2 cursor-pointer hover:bg-green-700 mt-2"
            >
              Reserved
            </Button>
            <div className="border text-center p-2 mt-2 rounded">
              <h1 className="font-medium">PRICES SORT</h1>
              <Slider
                onChange={(e: number[]) => sortByPrices(e)}
                range
                max={1500}
                min={0}
                defaultValue={[maxMinprices.min, maxMinprices.max]}
              />
              <div className="flex w-full gap-2">
                <div className="border w-full border-orange-500 rounded  p-2">
                  $ {maxMinprices.min}
                </div>
                <div className="border w-full border-orange-500 rounded  p-2">
                  $ {maxMinprices.max}
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-10/12 m-auto gap-8 p-2 text-center">
              {Array.from({ length: numb }).map((_item, index: number) => (
                <div key={index} className="flex flex-col gap-4">
                  <Skeleton.Image active />
                  <Skeleton.Input active size="large" />
                  <Skeleton.Input active size="large" />
                  <img className="w-3/5 m-auto" src="/Animation.gif" alt="" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="bg-gray-700 rounded-xl grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-10/12 gap-8 p-2">
                {carData.length === 0 ? (
                  <h1 className="text-gray-500">Sorry there is no cars</h1>
                ) : (
                  <>
                    {carData?.map((car: CarsType, index: number) => {
                      return (
                        <div
                          key={car._id}
                          className="bg-gray-300 text-white rounded-xl"
                        >
                          <img
                            className="h-40 text-center w-full object-contain"
                            src={car.img}
                            alt="carimg"
                          />
                          <div className="bg-gray-900 p-2 rounded-b-xl">
                            <h1 className="text-2xl min-h-16">
                              {car.make.toUpperCase()} {car.model.toUpperCase()}
                            </h1>
                            <h1 className="mt-2 text-lg">
                              {car.displacement} | {car.transmission} |{" "}
                              {car.fuel_type}
                            </h1>
                            <h1 className="mt-2 text-xl text-green-500">
                              $ {prices[index] ? prices[index] : car.dayPrice}
                            </h1>
                            <div className="flex gap-2 mt-2">
                              <Checkbox
                                checked={selectedDays[index] === 2}
                                onChange={() => handleDaySelection(index, 2)}
                                type="checkbox"
                              />
                              <p>2 days</p>
                            </div>
                            <div className="flex gap-2">
                              <Checkbox
                                checked={selectedDays[index] === 4}
                                onChange={() => handleDaySelection(index, 4)}
                                type="checkbox"
                              />
                              <p>4 days</p>
                            </div>
                            <div className="flex gap-2">
                              <Checkbox
                                checked={selectedDays[index] === 6}
                                onChange={() => handleDaySelection(index, 6)}
                                type="checkbox"
                              />
                              <p>6 days</p>
                            </div>
                            <div className="flex gap-2">
                              <Checkbox
                                checked={selectedDays[index] === 8}
                                onChange={() => handleDaySelection(index, 8)}
                                type="checkbox"
                              />
                              <p>8+ days</p>
                            </div>
                            <Button
                              onClick={() => addCarToReserve(car)}
                              className="w-full mt-2 bg-green-500 border-none"
                            >
                              RESERVE
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                {error && <div>{error}</div>}
                <img src="/" alt="" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
