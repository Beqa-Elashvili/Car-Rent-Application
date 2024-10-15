"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import { createCarImage } from "@/app/CreateCarImage";
import { Checkbox, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { TiDeleteOutline } from "react-icons/ti";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

export default function Page() {
  type CarsType = {
    id: any;
    city_mpg: number;
    class: string;
    combination_mpg: number;
    cylinders: number;
    displacement: number;
    drive: string;
    fuel_type: string;
    highway_mpg: number;
    make: string;
    model: string;
    transmission: string;
    year: number;
  };

  const [carData, setCarData] = useState<CarsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [carPrices, setCarPrices] = useState<number[]>([]);

  const initialPrice = 1230;

  async function fetchCarData() {
    try {
      const response = await axios.get(
        "https://cars-by-api-ninjas.p.rapidapi.com/v1/cars",
        {
          params: { make: "bmw", limit: 10 },
          headers: {
            "x-rapidapi-key":
              "3ab71f1fe5msh3809073701083acp1c1c13jsn96cf5f721c27",
            "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
          },
        }
      );
      setCarData(response.data);
      setCarPrices(new Array(response.data.length).fill(initialPrice));
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  }

  const [ReserveCars, setReserveCars] = useState<CarsType[]>([]);

  async function fetchReservecars(make: string, model: string) {
    try {
      const response = await axios.get(
        "https://cars-by-api-ninjas.p.rapidapi.com/v1/cars",
        {
          params: { make: make, model: model, limit: 1 },
          headers: {
            "x-rapidapi-key":
              "3ab71f1fe5msh3809073701083acp1c1c13jsn96cf5f721c27",
            "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
          },
        }
      );
      setReserveCars((prev) => [...prev, ...response.data]);
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCarData();
  }, []);

  const handlePriceChange = (index: number, days: number) => {
    setCarPrices((prevPrices) => {
      const newPrices = [...prevPrices];
      newPrices[index] = initialPrice - days * 100;
      return newPrices;
    });
    setSelectedDays((prevSelectedDays) => {
      const newSelectedDays = Array(carData.length).fill(0);
      newSelectedDays[index] = days;
      return newSelectedDays;
    });
  };

  const { collections } = useGlobalProvider();

  const handleCars = async (make: string, model: string) => {
    await fetchReservecars(make, model);
    setIsOpen(true);
  };

  interface CarsCount {
    [key: string]: number;
  }

  const [carsCount, setCarsCount] = useState<CarsCount>({});

  const updateCarCount = (id: number, count: number) => {
    setCarsCount((prevCounts) => ({
      ...prevCounts,
      [id]: count,
    }));
  };

  const deleteCar = (index: number) => {
    setCarsCount((prevCounts) => {
      const newCounts = { ...prevCounts };
      delete newCounts[index];
      return newCounts;
    });

    setReserveCars((prevCars) => prevCars.filter((_, i) => i !== index));
  };

  const calculateTotalPrice = () => {
    return ReserveCars.reduce((total, item, index) => {
      const carsNum = carsCount[index] || 1;
      return total + initialPrice * carsNum;
    }, 0);
  };

  useEffect(() => {
    if (ReserveCars.length === 0) {
      setIsOpen(false);
    }
  }, [ReserveCars]);

  return (
    <div className="bg-gray-800 relative">
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
              <div className="mt-4 flex flex-col gap-4">
                {ReserveCars.map((item: CarsType, index: number) => {
                  const initialPrice = 1230;
                  const carsNum = carsCount[index] || 1;

                  const handleTotalPrices = () => {
                    return initialPrice * carsNum;
                  };
                  return (
                    <>
                      <div className="bg-yellow-500 p-2 rounded-xl flex items-center">
                        <img
                          className="w-40"
                          src={createCarImage(item)}
                          alt="Carimg"
                        />
                        <div className="flex flex-col w-full">
                          <p className="font-medium text-lg">
                            {item.make.toUpperCase()} |{" "}
                            {item.model.toUpperCase()}
                          </p>
                          <div className="flex justify-between w-full">
                            <div className="text-sm">
                              <p>Price per Day.Rental</p>
                              <p>Period: 8+ days</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <button
                                onClick={() =>
                                  updateCarCount(index, carsNum + 1)
                                }
                              >
                                <CiCirclePlus className="size-8  text-gray-600 hover:text-gray-700" />
                              </button>
                              <div>{carsNum}</div>
                              <button
                                onClick={() => {
                                  if (carsNum > 1) {
                                    updateCarCount(index, carsNum - 1);
                                  }
                                }}
                              >
                                <CiCircleMinus className="size-8 text-gray-600 hover:text-gray-700" />
                              </button>
                              <div>${handleTotalPrices()}</div>
                              <button onClick={() => deleteCar(index)}>
                                <TiDeleteOutline className="size-8 text-gray-600 hover:text-gray-700" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-200 h-px w-full"></div>
                    </>
                  );
                })}
              </div>
              <h1 className="float-end font-medium text-xl">
                TOTAL: ${calculateTotalPrice()}{" "}
              </h1>
              <Button className="w-full mt-2 bg-green-500 border-none p-6 font-medium text-xl text-white">
                RESERVE
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-10/12 m-auto gap-8 p-2">
        {carData.map((car, index) => {
          const handleimg = () => {
            let angle = "";
            if (index % 2 !== 0) {
              angle = "29";
            }
            return angle;
          };
          return (
            <div key={index} className="bg-gray-300 text-white  rounded-xl">
              <img src={createCarImage(car, handleimg())} alt="carimg" />
              <div className="bg-gray-900 p-2 rounded-b-xl">
                <h1 className="text-2xl">
                  {car.make.toUpperCase()} {car.model.toUpperCase()}
                </h1>
                <h1 className="mt-2 text-lg">
                  {car.displacement} | {car.transmission} | {car.fuel_type}
                </h1>
                <h1 className="mt-2 text-xl text-green-500">
                  ${carPrices[index]}
                </h1>
                <div className="flex gap-2 mt-2">
                  <Checkbox
                    checked={selectedDays[index] === 2}
                    onChange={() => handlePriceChange(index, 2)}
                    type="checkbox"
                  />
                  <p>2 days</p>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    checked={selectedDays[index] === 4}
                    onChange={() => handlePriceChange(index, 4)}
                    type="checkbox"
                  />
                  <p>4 days</p>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    checked={selectedDays[index] === 6}
                    onChange={() => handlePriceChange(index, 6)}
                    type="checkbox"
                  />

                  <p>6 days</p>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    checked={selectedDays[index] === 8}
                    onChange={() => handlePriceChange(index, 8)}
                    type="checkbox"
                  />
                  <p>8+ days</p>
                </div>
                <Button
                  onClick={() => handleCars(car.make, car.model)}
                  className="w-full mt-2 bg-green-500 border-none"
                >
                  RESERVE
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
