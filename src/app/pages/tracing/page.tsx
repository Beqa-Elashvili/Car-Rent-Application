"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";

export default function Tracing() {
  const [TracingCars, setTracingcars] = useState<CarsType[]>([]);

  async function GetTracingCars() {
    try {
      const resp = await axios.get("/api/tracing");
      setTracingcars(resp.data.tracingCars);
    } catch (error) {
      console.log("thisis error ", error);
    }
  }

  useEffect(() => {
    GetTracingCars();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="relative w-full">
        <Image
          alt="porche"
          quality={100}
          width={2000}
          height={2000}
          className="w-full"
          unoptimized
          src="/pngtree.jpg"
        />
        <div className="absolute flex items-center justify-center h-full p-20 inset-0">
          <motion.h1
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            className="text-8xl w-10/12 font-medium text-center text-white "
          >
            Extraordinary cars, limitless journeys await
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
