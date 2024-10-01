"use client";

import { createCarImage } from "./CreateCarImage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
// import mclarenImage from "/mclaren.jpeg";

export default function Home() {
  const router = useRouter();

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

  async function fetchCarData() {
    try {
      const response = await axios.get(
        "https://cars-by-api-ninjas.p.rapidapi.com/v1/cars",
        {
          params: { make: "Mercedes-Benz", limit: 10 },
          headers: {
            "x-rapidapi-key":
              "3ab71f1fe5msh3809073701083acp1c1c13jsn96cf5f721c27",
            "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
          },
        }
      );
      setCarData(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCarData();
  }, []);

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center">
        <img
          className="w-full object-contain"
          src="/mclaren.jpeg"
          alt="mclaren"
        />
        <div className="absolute w-full text-white ">
          <div className="relative w-full flex flex-col justify-center text-white">
            <p className="bg-white absolute mb-14 w-full h-px"></p>
            <p className="text-8xl  pl-14">THE GOLD</p>
            <p className="bg-white absolute mt-20 w-full h-px"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
