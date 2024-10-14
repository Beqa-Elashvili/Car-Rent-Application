"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import { createCarImage } from "@/app/CreateCarImage";
import { Checkbox } from "antd";

export default function Page() {
  type CarsType = {
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

  const initialPrice = 1488;
  const [carPrices, setCarPrices] = useState<number[]>([]);

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

  return (
    <div className="bg-gray-500">
      <div className="grid grid-cols-3 w-10/12 m-auto gap-8 p-2">
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
                <h1 className="mt-2 text-xl text-orange-400">
                  {carPrices[index]}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
