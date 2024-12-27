"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import { useRouter } from "next/navigation";
import { LiaLongArrowAltDownSolid } from "react-icons/lia";
export default function Tracing() {
  const [TracingCars, setTracingcars] = useState<CarsType[]>([]);

  const router = useRouter();

  async function GetTracingCars() {
    try {
      const resp = await axios.get("/api/tracing");
      setTracingcars(resp.data.tracingcars);
    } catch (error) {
      console.log("thisis error ", error);
    }
  }
  console.log(TracingCars);

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
        <div className="absolute flex flex-col items-center justify-center  gap-12 h-full p-20 inset-0">
          <motion.h1
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            className="text-8xl w-10/12 font-medium text-center text-white "
          >
            Extraordinary cars limitless journeys await
          </motion.h1>
          <div className="flex gap-4">
            {TracingCars?.slice(3, 7).map((item: CarsType) => {
              const maxHorsePower = item.horsepower;
              const numbers = Array.from({ length: 12 }, (_, i) =>
                Math.round((maxHorsePower / 12) * (i + 1))
              );

              return (
                <div
                  onClick={() => router.push(`/pages/solocar/${item._id}`)}
                  className="w-full z-10 cursor-pointer rounded-xl transition-transform transform hover:scale-105 duration-300 group"
                  key={item._id}
                >
                  <div className="relative flex flex-col items-center min-h-60 rounded-t-xl overflow-hidden">
                    <img
                      src={item.img}
                      alt="carImg"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0">
                      <div className="bg-red-600 flex items-center justify-center relative">
                        {numbers.map((number, index) => {
                          const angle = (index * 360) / numbers.length;
                          const x = 70 + 65 * Math.cos((angle * Math.PI) / 180);
                          const y = 70 + 65 * Math.sin((angle * Math.PI) / 180);

                          return (
                            <div
                              key={number}
                              style={{
                                position: "absolute",
                                transform: `translate(-50%, -50%)`,
                                left: `${x}px`,
                                top: `${y}px`,
                              }}
                              className="text-white bg-transparent font-semibold text-sm"
                            >
                              {number}
                            </div>
                          );
                        })}
                        <div className="absolute z-20 h-full inset- left-10">
                          <h1>
                            <h1 className="font-bold mt-6 text-2xl text-white">
                              HP
                            </h1>
                            <LiaLongArrowAltDownSolid className="absolute top-10  size-16 text-red-600 text-center transition-transform rotate-[-90deg] duration-1000 transform group-hover:rotate-[238deg]" />
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className="p-2 bg-indigo-500 text-white rounded-b-xl">
                  <div className="mt-4 flex font-serif w-80 text-xl justify-between">
                    <p>{item.horsepower} HP</p>
                    {"|"}
                    <p>{item.combination_mpg}L</p>
                    {"|"}
                    <p>$ {item.dayPrice}/Day</p>
                  </div>
                </div> */}
        </div>
      </div>
    </div>
  );
}
