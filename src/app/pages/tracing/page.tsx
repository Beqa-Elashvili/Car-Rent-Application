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
import { Button, Carousel, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

export default function Tracing() {
  const [TracingCars, setTracingcars] = useState<CarsType[]>([]);
  const { tracks, addCarToReserve, ChangeCarDayCount, loadingStates } =
    useGlobalProvider();

  console.log(tracks);

  const router = useRouter();
  const { data: session } = useSession();

  async function GetTracingCars() {
    try {
      const resp = await axios.get("/api/tracing");
      setTracingcars(resp.data.tracingcars);
    } catch (error) {
      console.log("error Fetch Tracing cars", error);
    }
  }

  useEffect(() => {
    GetTracingCars();
  }, []);
  const iconVariants = (duration: number) => ({
    initial: { y: -10 },
    animate: {
      y: [10, -10],
      transition: {
        duration: duration,
        ease: "linear" as "linear",
        repeat: Infinity,
        repeatType: "reverse" as "reverse",
      },
    },
  });

  return (
    <div className="w-full h-full">
      <div className="relative h-full w-full">
        <Image
          alt="porche"
          quality={100}
          width={2000}
          height={2000}
          className="w-full"
          unoptimized
          src="/pngtree.jpg"
        />
        <div className="absolute flex top-2 flex-col items-center justify-center  gap-4 md:gap-12 h-full p-2 md:p-20 inset-0">
          <motion.h1
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
            className="text-xl md:text-8xl w-full md:w-10/12 font-medium text-center text-white "
          >
            Extraordinary cars limitless journeys await
          </motion.h1>
          <div className="grid grid-cols-2 gap-x-12 md:flex md:gap-4">
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
                  <div className="relative flex flex-col items-center  md:min-h-60 rounded-t-xl overflow-hidden">
                    <motion.img
                      variants={iconVariants(2)}
                      initial="initial"
                      animate="animate"
                      src={item.img}
                      alt="carImg"
                      className="w-28 md:w-full h-14 md:h-full object-contain"
                    />
                    <div className="absolute inset-0">
                      <div className="bg-red-600 hidden md:flex items-center justify-center relative">
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
                          <h1 className="font-bold mt-6 text-2xl text-orange-500 font-serif">
                            HP
                          </h1>
                          <LiaLongArrowAltDownSolid className="absolute top-10  size-16 text-red-600 text-center transition-transform rotate-[-90deg] duration-1000 transform group-hover:rotate-[238deg]" />
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
        <div className="absolute inset-0  h-40 md:h-96 bg-gradient-to-t from-transparent to-black"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-96 bg-gradient-to-b from-transparent to-black"></div>
        <Image
          width={2000}
          className="z-10"
          height={2000}
          src="/1000_F.jpg"
          alt="car-img"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="absolute top-4 md:top-20 text-center text-center  text-xl md:text-6xl text-orange-600 font-serif">
            FAMOUS TRACKS FOR OUR ENJOYMENT
          </h1>
          <Carousel
            slidesToShow={3}
            arrows
            autoplay
            className="absolute h-full md:h-1/2 m-auto"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
            dotPosition="bottom"
            infinite={true}
          >
            {tracks?.map((item: Ttracks) => {
              return (
                <div key={item.index} className="p-4 mt-20 md:mt-0 ">
                  <div
                    onClick={() =>
                      router.push(`/pages/track/${item.index}/${item.title}`)
                    }
                    className="rounded-xl hover:cursor-pointer relative overflow-hidden group"
                  >
                    <Image
                      width={2000}
                      height={2000}
                      alt="trackimage"
                      className="w-full h-20  md:h-60 rounded-xl transition-all duration-300 md:group-hover:blur-sm"
                      src={item.img}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute hidden md:flex md:inset-0 flex-col items-center justify-center"
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
                  <div className=" block md:hidden w-24 h-6 m-auto text-start overflow-hidden">
                    <p className="text-orange-500">
                      {item.title.split("(").slice(0, 1)}...
                    </p>
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
        <div className="absolute p-2 md:p-20 inset-0 grid grid-cols-3 items-center justify-center">
          {TracingCars.slice(0, 6)?.map((item: CarsType) => {
            return (
              <div
                className="w-full z-10 cursor-pointer rounded-xl transition-transform transform hover:scale-105 duration-300 group"
                key={item._id}
              >
                <div className="relative flex flex-col items-center rounded-t-xl overflow-hidden">
                  <h1 className="text-xl hidden md:block font-sans font-medium text-amber-600">
                    {item.model}
                  </h1>
                  <Image
                    src={item.img}
                    width={2000}
                    height={2000}
                    alt="carImg"
                    onClick={() => router.push(`/pages/solocar/${item._id}`)}
                    className="w-full h-16 md:h-40 object-contain"
                  />
                  {session !== null ? (
                    <Button
                      className="bg-orange-500 border-none font-serif text-white"
                      onClick={() => addCarToReserve(item, ChangeCarDayCount)}
                    >
                      RESERVE
                      {loadingStates[item._id] && (
                        <Spin indicator={<LoadingOutlined spin />} />
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-2  items-center">
                      <Button
                        className="bg-orange-500 text-orange-900 font-serif w-full border-none text"
                        onClick={() => router.push("/register")}
                      >
                        Sign up
                        {loadingStates[item._id] && (
                          <Spin indicator={<LoadingOutlined spin />} />
                        )}
                      </Button>
                      <Button
                        className="bg-orange-500 text-orange-900 font-serif w-full border-none text"
                        onClick={() => router.push("/login")}
                      >
                        Sign in
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
