"use client";

import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { createCarImage } from "@/app/CreateCarImage";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Carousel } from "antd";
import Image from "next/image";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

export default function Car({ params }: { params: { id?: string } }) {
  const [car, setCar] = useState<CarsType>();
  const [selectedSection, setSelectedSection] = useState<string>("Information");
  const [otherImgs, setOtherImgs] = useState<boolean>(false);
  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 },
  };
  const { ReserveCars, setLoading, loading } = useGlobalProvider();
  const router = useRouter();

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "Information":
        return (
          <motion.div
            {...fadeInOut}
            className="flex text-xl text-gray-400 gap-12 justify-center items-center"
          >
            <p>{car?.make.toUpperCase()}</p>
            <p>{car?.model.toUpperCase()}</p>
            <p>{car?.year}</p>
          </motion.div>
        );
      case "Engine":
        return (
          <motion.div
            {...fadeInOut}
            className="flex text-xl text-gray-400 gap-12 justify-center items-center"
          >
            <div>
              <p className="text-sm">Displacement</p>
              <p>{car?.displacement}</p>
            </div>
            <div>
              <p className="text-sm">Transmission</p>
              <p>{car?.transmission.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm">Cylinders</p>
              <p>{car?.cylinders}</p>
            </div>
            <div>
              <p className="text-sm">HorsePower</p>
              <p>{car?.horsepower}HP</p>
            </div>
          </motion.div>
        );
      case "Class":
        return (
          <motion.div
            {...fadeInOut}
            className="grid grid-cols-4 text-xl text-gray-400 gap-12 justify-center items-center"
          >
            <div>
              <p className="text-sm">Class</p>
              <p>{car?.class.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm">Combination MPG</p>
              <p>{car?.combination_mpg}</p>
            </div>
            <div>
              <p className="text-sm">Fuel type</p>
              <p>{car?.fuel_type.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm">Drive</p>
              <p>{car?.drive}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm">Highway Mpg</p>
              <p>
                {car?.highway_mpg}{" "}
                <span className="text-gray-500">l/100km</span>
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm">City Mpg</p>
              <p>
                {car?.city_mpg} <span className="text-gray-500">l/100km</span>
              </p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const GetOneCar = async (id?: string) => {
    try {
      setLoading(true);
      const resp = await axios.get(`/api/cars?id=${id}`);
      setCar(resp.data.car);
      if (resp.data.car) {
        setLoading(false);
      }
      return;
    } catch (error) {
      console.log("Cars fetch error");
    }
    try {
      const reservedCarResponse = await axios.get(
        `/api/reservedcars?carId=${id}`
      );
      setCar(reservedCarResponse.data.car);
    } catch (error) {
      console.error("Error while fetching car from both APIs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      const timeout = setTimeout(() => {
        GetOneCar(params.id as string);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [params.id]);

  const buttonStyle = (section: string) =>
    selectedSection === section
      ? "bg-blue-500 text-white"
      : "bg-gray-700 text-gray-300";

  const [angle, setAngle] = useState<string>("0");
  const angles = ["29", "13", "0"];

  const getNextAngle = () => {
    setAngle((prevAngle) => {
      const currentIndex = angles.indexOf(prevAngle);
      const nextIndex = (currentIndex + 1) % angles.length;
      return angles[nextIndex];
    });
  };
  const getPrevAngle = () => {
    setAngle((prevAngle) => {
      const currentIndex = angles.indexOf(prevAngle);
      const prevIndex = (currentIndex - 1 + angles.length) % angles.length;
      return angles[prevIndex];
    });
  };

  const handleCarImg = (car: CarsType, angle: string) => {
    try {
      setLoading(true);
      const image = createCarImage(car, angle);
      setLoading(false);
      return image;
    } catch (error) {
      return "/gfhf";
    }
  };

  return (
    <div className="bg-gray-900 flex min-h-screen h-full flex-col justify-center p-12">
      {loading ? (
        <img className="w-2/4 m-auto" src="/Animation.gif" alt="" />
      ) : (
        <>
          {car && (
            <div className="bg-gray-900 h-screen w-full text-white flex justify-center items-center gap-12">
              <div className="text-start text-2xl flex flex-col gap-4">
                <Button
                  className={`rounded-full w-36 h-12 ${buttonStyle(
                    "Information"
                  )}`}
                  onClick={() => setSelectedSection("Information")}
                >
                  Information
                </Button>
                <Button
                  className={`rounded-full w-36 h-12 ${buttonStyle("Engine")}`}
                  onClick={() => setSelectedSection("Engine")}
                >
                  Engine
                </Button>
                <Button
                  className={`rounded-full w-36 h-12 ${buttonStyle("Class")}`}
                  onClick={() => setSelectedSection("Class")}
                >
                  Class
                </Button>
              </div>
              <div className="text-center">
                <h1 className="text-3xl mb-4">
                  {car.make.toUpperCase()} | {car.model.toUpperCase()}
                </h1>
                <Button
                  onClick={() => setOtherImgs(!otherImgs)}
                  className="rounded p-2 bg-slate-800 text-white font-medium hover:bg-slate-800"
                >
                  MORE PHOTOS
                </Button>
                <div className="flex gap-4 items-center">
                  {otherImgs ? (
                    <>
                      <p
                        onClick={() => getPrevAngle()}
                        className="text-3xl hover:text-gray-500 rounded-full cursor-pointer"
                      >
                        {"<"}
                      </p>
                      <img
                        className="w-full h-96 object-contain"
                        src={handleCarImg(car, angle)}
                        alt="Car Image"
                      />
                      <p
                        onClick={() => getNextAngle()}
                        className="text-3xl rounded-full p-2 hover:text-gray-500  cursor-pointer"
                      >
                        {">"}
                      </p>
                    </>
                  ) : (
                    <>
                      <Image
                        width={500}
                        height={1000}
                        className="w-full h-96 object-contain"
                        src={car.img}
                        alt="carImg"
                      />
                    </>
                  )}
                </div>
                <motion.div
                  key={selectedSection}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="mt-6 gap-2"
                >
                  {renderSectionContent()}
                </motion.div>
              </div>
              <Button
                onClick={() => router.push("/pages/reserveCars")}
                className="p-12 w-20 h-20 rounded-full"
              >
                Return
              </Button>
            </div>
          )}

          <Carousel
            slidesToShow={3}
            className="rounded-full bg-slate-800 p-12 "
            arrows
            autoplay
            dotPosition="bottom"
            infinite={true}
          >
            {ReserveCars?.map((item: CarsType) => (
              <div
                key={item._id}
                onClick={() => router.push(`/pages/solocar/${item._id}`)}
                className="text-center p-2 hover:bg-slate-700 rounded-full cursor-pointer"
              >
                <img
                  className="h-60 w-96 m-auto object-contain"
                  src={item.img}
                  alt="Carimg"
                />
                <div className="text-xl text-white">
                  <h1>{item.make.toUpperCase()}</h1>
                  <h1>{item.model.toUpperCase()}</h1>
                </div>
              </div>
            ))}
          </Carousel>
        </>
      )}
    </div>
  );
}
