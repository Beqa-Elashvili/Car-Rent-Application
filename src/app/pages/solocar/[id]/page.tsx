"use client";

import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { createCarImage } from "@/app/CreateCarImage";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Carousel } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

export default function Car({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<CarsType>();
  const [selectedSection, setSelectedSection] = useState<string>("Information");
  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 },
  };
  const { ReserveCars } = useGlobalProvider();

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
              <p className="text-sm">Cylinders</p>
              <p>{car?.cylinders}</p>
            </div>
            <div>
              <p className="text-sm">Transmission</p>
              <p>{car?.transmission.toUpperCase()}</p>
            </div>
          </motion.div>
        );
      case "Class":
        return (
          <motion.div
            {...fadeInOut}
            className="flex text-xl text-gray-400 gap-12 justify-center items-center"
          >
            <div>
              <p className="text-sm">Class</p>
              <p>{car?.class.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm">Fuel type</p>
              <p>{car?.fuel_type.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm">Combination MPG</p>
              <p>{car?.combination_mpg}</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const GetOneCar = async (id: string) => {
    try {
      const resp = await axios.get(`/api/reservedcars?carId=${id}`);
      setCar(resp.data.car);
    } catch (error) {
      alert("error while fetch one car");
    }
  };
  useEffect(() => {
    GetOneCar(params.id);
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

  return (
    <div className="bg-gray-900 h-full flex flex-col justify-center p-12">
      {car && (
        <div className="bg-gray-900 h-screen w-full text-white flex justify-center items-center gap-12">
          <div className="text-start text-2xl flex flex-col gap-4">
            <Button
              className={`rounded-full w-36 h-12 ${buttonStyle("Information")}`}
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
            <div className="flex gap-4 items-center">
              <p
                onClick={() => getPrevAngle()}
                className="text-3xl hover:text-gray-500 rounded-full cursor-pointer"
              >
                {"<"}
              </p>
              <img
                className="w-full h-96 object-contain"
                src={createCarImage(car, angle)}
                alt="Car Image"
              />
              <p
                onClick={() => getNextAngle()}
                className=" text-3xl rounded-full p-2 hover:text-gray-500  cursor-pointer"
              >
                {">"}
              </p>
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
      <Carousel slidesToShow={3} arrows dotPosition="bottom" infinite={true}>
        {ReserveCars?.map((item) => (
          <div className="text-center p-12">
            <img src={createCarImage(item)} alt="" />
            <h1>{item.make}</h1>
            <h1>{item.model}</h1>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
