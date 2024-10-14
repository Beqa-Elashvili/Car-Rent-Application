"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Main } from "./Components/Main";

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
          params: { make: "bugatti", model: "", limit: 10, year: "2024" },
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

  // useEffect(() => {
  //   fetchCarData();
  // }, []);
  console.log(carData);

  return (
    <div className="w-full">
      <Main />
    </div>
  );
}
