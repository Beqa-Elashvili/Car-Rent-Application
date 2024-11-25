"use client";

import { CarsType } from "@/app/Providers/GlobalProvider/GlobalContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { createCarImage } from "@/app/CreateCarImage";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Car({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<CarsType>();
  const [selectedSection, setSelectedSection] = useState<string>("Information");
  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 },
  };
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
            <p>{car?.displacement}</p>
            <p>{car?.cylinders}</p>
            <p>{car?.transmission.toUpperCase()}</p>
          </motion.div>
        );
      case "Class":
        return (
          <motion.div
            {...fadeInOut}
            className="flex text-xl text-gray-400 gap-12 justify-center items-center"
          >
            <p>{car?.class.toUpperCase()}</p>
            <p>{car?.fuel_type.toUpperCase()}</p>
            <p>{car?.combination_mpg}</p>
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

  console.log(car);
  return (
    <>
      {car && (
        <div className="bg-gray-900 h-screen w-full text-white p-12 flex justify-center items-center gap-12">
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
            <img
              className="w-full h-96 object-contain"
              src={createCarImage(car)}
              alt="Car Image"
            />{" "}
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
    </>
  );
}
