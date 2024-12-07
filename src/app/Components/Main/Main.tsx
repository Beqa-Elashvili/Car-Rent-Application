import { motion } from "framer-motion";
import { SiLamborghini } from "react-icons/si";
import { SiAstonmartin } from "react-icons/si";
import { SiFerrari } from "react-icons/si";
import { SiPorsche } from "react-icons/si";
import { SiBugatti } from "react-icons/si";
import { Input, Button } from "antd";
import { createCarImage } from "@/app/CreateCarImage";
import Image from "next/image";
import { Carousel } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import axios from "axios";
import { useEffect, useState } from "react";

export function Main() {
  const [carData, setCarData] = useState<CarsType[]>([]);

  async function GetCardata() {
    try {
      const resp = await axios.get("/api/cars");
      setCarData(resp.data.cars);
    } catch (error) {
      alert(error);
    }
  }
  console.log(carData);
  useEffect(() => {
    GetCardata();
  }, []);
  // const { carData } = useGlobalProvider();
  return (
    <div className="bg-cyan-800 h-full">
      <div className="relative">
        <Image
          alt="porche"
          quality={100}
          width={2000}
          height={2000}
          objectFit="contain"
          unoptimized
          layout="intrinsic"
          src="/porche1.jpg"
        />
        <div className="absolute flex items-center justify-between h-full p-20 inset-0">
          <h1 className="text-8xl w-1/2 font-medium text-white ">
            Luxury Cars For your Confort
          </h1>
          <Button className="p-20 text-white text-xl rounded-full bg-cyan-500 h-20 w-20">
            EXPLORE
          </Button>
        </div>
      </div>
      <Carousel
        slidesToShow={5}
        arrows
        // autoplay
        className="p-20"
        dotPosition="bottom"
        infinite={true}
      >
        {carData?.map((item: CarsType) => {
          return (
            <div className="p-2 w-full" key={item.id}>
              <div className="relative min-h-60 rounded-t-xl overflow-hidden shadow-t-xl">
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('/industrialwebp.jpg')` }}
                >
                  <img
                    src={item.img}
                    alt="carImg"
                    className="w-full h-full object-contain "
                  />
                </div>
              </div>
              <div className="p-2 bg-white rounded-b-xl shadow-xl">
                <h1 className="text-xl font-semibold">{item.make}</h1>
                <p>start with: {item.carDayCount}</p>
                <p>combination mpg : {item.combination_mpg}</p>
              </div>
            </div>
          );
        })}
      </Carousel>
      <div className="text-white w-full">
        <div className="px-2 flex justify-between ">
          <div className="flex flex-col gap-20">
            <h1>RENTAL CARS</h1>
            <p className="w-3/4 text-6xl ">Experience is everything</p>
          </div>
          <p className="w-2/6  flex items-end">
            Whether you're looking to elevate your business transportation,
            seeking a wedding getaway car, or are just ready to have an
            exhilarating experience, there is no better answer than Rental Cars.
          </p>
        </div>
        <div className="inline relative">
          <Image
            width={1000}
            height={300}
            className="object-contain w-full"
            src="/porche.jpg"
            alt=""
          />
          <div className="absolute inset-0 h-96 bg-gradient-to-t from-transparent to-black"></div>
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black to-transparent opacity-90 "></div>
        </div>
        <div className="text-9xl font-medium ">
          <div className="relative h-44 w-10/12 flex flex-col overflow-hidden justify-center m-auto">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="text-[220px] absolute"
            >
              <SiLamborghini className="opacity-40 " />
            </motion.div>

            <motion.h1
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className="ml-36"
            >
              HURACAN COUPE
            </motion.h1>
          </div>
          <div className="h-px bg-gray-900 w-full"></div>
          <div className="w-10/12 relative h-44 flex flex-col overflow-hidden justify-center m-auto">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="text-[220px] absolute"
            >
              <SiAstonmartin className="opacity-40  -rotate-12" />
            </motion.div>
            <motion.h1
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className="ml-36"
            >
              DB12 V8
            </motion.h1>
          </div>
          <div className="h-px bg-gray-900 w-full"></div>
          <div className="w-10/12 relative h-44 flex flex-col overflow-hidden justify-center m-auto">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="absolute text-[220px]"
            >
              <SiFerrari className="opacity-40  -top-3" />
            </motion.div>
            <motion.h1
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className="ml-36"
            >
              SF90 SPIDER
            </motion.h1>
          </div>
          <div className="h-px bg-gray-900 w-full"></div>
          <div className="w-10/12 relative h-44 flex flex-col overflow-hidden justify-center m-auto">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="text-[220px] absolute"
            >
              <SiPorsche className="opacity-40  top-2 -rotate-12" />
            </motion.div>
            <motion.h1
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className="ml-36"
            >
              911 GT3
            </motion.h1>
          </div>
          <div className="h-px bg-gray-900 w-full"></div>
          <div className="w-10/12 relative h-44 flex flex-col overflow-hidden justify-center m-auto">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="text-[220px] absolute"
            >
              <SiBugatti className="opacity-40  top-2" />
            </motion.div>
            <motion.h1
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 1 }}
              className="ml-36"
            >
              BUGATTI CHIRON
            </motion.h1>
          </div>
          <div className="h-px bg-gray-900 w-full"></div>
        </div>
        <div className="h-40"></div>
        <div className="h-px bg-gray-900 w-full"></div>
        <div className="relative h-96 bg-green-900 ">
          <div className="absolute inset-0 h-96 bg-gradient-to-t to-black from-transparent opacity-90 ">
            <div className="w-3/4 py-12 m-auto">
              <h1 className="text-6xl">Get a quote</h1>
              <div className="grid grid-cols-2 items-center mt-12 gap-8">
                <Input
                  placeholder="Name"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Input
                  placeholder="Phone"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <Input
                  placeholder="Email"
                  className="p-2 rounded-xl placeholder-white text-white  bg-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-none focus:outline-none "
                />
                <select
                  defaultValue={""}
                  className="p-2 rounded-xl bg-gray-400 text-white focus:outline-none"
                >
                  <option
                    className="text-black rounded bg-white"
                    disabled
                    value=""
                  >
                    Car
                  </option>
                  <option
                    className="text-black rounded bg-white"
                    value="Porche"
                  >
                    Porche
                  </option>
                  <option
                    className="text-black rounded bg-white"
                    value="Lamborghini"
                  >
                    Lamborghini
                  </option>
                  <option className="text-black rounded bg-white" value="Bmw">
                    Bmw
                  </option>
                  <option
                    className="text-black rounded bg-white"
                    value="McLaren"
                  >
                    McLaren
                  </option>
                  <option
                    className="text-black rounded bg-white"
                    value="Mercedes"
                  >
                    Mercedes
                  </option>
                </select>
              </div>
              <Button className="bg-blue-500 text-xl mt-4 w-40 border-none text-white font-medium">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
