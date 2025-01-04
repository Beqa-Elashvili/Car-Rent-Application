"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  CarsType,
  Ttracks,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { useRouter } from "next/navigation";
import { LiaLongArrowAltDownSolid } from "react-icons/lia";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { Button, Carousel } from "antd";

export default function Tracing() {
  const [TracingCars, setTracingcars] = useState<CarsType[]>([]);
  const { tracks, addCarToReserve } = useGlobalProvider();

  const router = useRouter();

  async function GetTracingCars() {
    try {
      const resp = await axios.get("/api/tracing");
      setTracingcars(resp.data.tracingcars);
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
            {TracingCars?.slice(0, 4).map((item: CarsType) => {
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
                              className="text-white hover:text-red-200 bg-transparent font-semibold text-sm"
                            >
                              {number}
                            </div>
                          );
                        })}
                        <div className="absolute z-20 h-full left-10">
                          <h1>
                            <h1 className="font-bold mt-6 text-2xl text-orange-500 font-serif">
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
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 h-96 bg-gradient-to-t from-transparent to-black"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent to-black"></div>
        <Image
          width={2000}
          className="z-10"
          height={2000}
          src="/1000_F.jpg"
          alt=""
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="absolute top-40 text-6xl text-orange-600 font-serif">
            FAMOUS TRACKS FOR OUR ENJOYMENT
          </h1>
          <Carousel
            slidesToShow={3}
            arrows
            autoplay
            className="absolute h-1/2 m-auto"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
            }}
            dotPosition="bottom"
            infinite={true}
          >
            {tracks?.map((item: Ttracks, index: number) => {
              return (
                <div className="p-4">
                  <div
                    className="rounded-xl relative overflow-hidden group"
                    key={index}
                  >
                    <Image
                      width={2000}
                      height={2000}
                      alt="trackimage"
                      className="h-60 rounded-xl transition-all duration-300 group-hover:blur-sm"
                      src={item.img}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <h1 className="text-2xl font-serif text-orange-600">
                        {item.title}
                      </h1>
                      <p className="text-orange-500">{item.location}</p>
                      <p className="text-orange-500 text-center p-2">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <Button className="w-1/2">
                      One lap / $ {item.rentPrice}
                    </Button>
                    <Button className="w-1/2">
                      Day / $ {item.dayRentPrice}
                    </Button>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
      <div className="relative">
        <Image
          src="/track.jpg"
          className="h-full"
          width={2000}
          height={2000}
          alt="image"
        />
        <div className="absolute p-20 inset-0 grid grid-cols-5 items-center justify-center">
          {TracingCars?.map((item: CarsType) => {
            return (
              <div
                onClick={() => router.push(`/pages/solocar/${item._id}`)}
                className="w-full z-10 cursor-pointer rounded-xl transition-transform transform hover:scale-105 duration-300 group"
                key={item._id}
              >
                <div className="relative flex flex-col items-center rounded-t-xl overflow-hidden">
                  <Image
                    src={item.img}
                    width={2000}
                    height={2000}
                    alt="carImg"
                    className="w-full h-40 object-contain"
                  />
                  <h1 className="text-xl font-sans font-medium text-orange-600">
                    {item.model}
                  </h1>
                  <Button>RESERVE</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
