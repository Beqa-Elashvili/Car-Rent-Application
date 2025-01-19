"use client";
import dynamic from "next/dynamic";

const GoogleMap = dynamic(
  () => import("@/app/Components/GoogleMap/GoogleMap"),
  {
    ssr: false,
  }
);

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { CgMail } from "react-icons/cg";
import { IoLocation } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { TConditions } from "@/app/Providers/GlobalProvider/GlobalContext";
import { motion } from "framer-motion";

export default function Conditions() {
  const { data: session } = useSession();
  const router = useRouter();
  const { conditions, location } = useGlobalProvider();

  // console.log(location);

  return (
    <div className="bg-gray-900 h-full w-full text-white">
      <div className="relative w-full bg-gray-800 flex flex-wrap overflow-hidden p-2 lg:p-16 items-center py-28">
        <h1 className="text-[200px] lg:text-9xl flex flex-col bg-gradient-to-r from-green-700 to-transparent text-transparent bg-clip-text text-balance absolute">
          LUXURY <span>DRIVE</span>
        </h1>
        <div className="z-20 lg:px-40 text-white">
          <h1 className="text-4xl font-bold">
            Conditions for renting a car in Georgia
          </h1>
          <p className="mt-6 text-2xl max-w-2xl">
            Find out the key conditions for renting a car in Georgia:
            requirements, insurance, traffic rules. Plan safe and comfortable
            trips with our information
          </p>
        </div>
      </div>
      <div className="py-12 w-10/12 m-auto">
        <h1 className="text-2xl font-medium mb-4">
          ADD YOUR LOCATION FOR BETTER CONVERSATION
        </h1>
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-12">
          <div className="inline-flex w-full lg:w-1/2 flex-col">
            <div className="bg-gray-800 h-full flex flex-col justify-between text-2xl p-8 rounded-xl">
              <div>
                <div className="flex gap-2">
                  <IoLocation className="mt-1" />
                  <div>
                    <h1>Address:</h1>
                    <p className="text-green-600 text-lg">
                      {location.city},{location.street}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CgMail className="mt-1" />
                  <div>
                    <h1>E-Mail:</h1>
                    <p className="text-green-600 text-lg">
                      {session ? session?.user?.email : "Not Registered"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CiUser className="mt-1" />
                  <div>
                    <h1>Username:</h1>
                    <p className="text-green-600 text-lg">
                      {session ? session.user?.username : "Not registered"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => router.push("/register")}
                  className="flex items-center py-5 rounded-xl bg-blue-500 border-none text-white font-medium w-full"
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <GoogleMap />
          </div>
        </div>
        <div className="w-full overflow-hidden block md:flex md:flex-col gap-8 mt-8">
          <h1 className="text-center my-4 text-4xl">Car rental conditions</h1>
          <div className="block md:hidden bg-gray-200 h-px w-full my-2"></div>
          {conditions.map((item: TConditions, index: number) => (
            <div
              key={index}
              className="md:flex justify-between w-full text-center md:text-start gap-4"
            >
              <motion.h1
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-5xl md:text-6xl w-full"
              >
                {item.title}
              </motion.h1>
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 100 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="bg-gray-800 text-xl text-start md:text-center mt-4 rounded-xl p-8 w-full md:max-w-3xl flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="size-6 text-green-500" />
                  <p>{item.text1}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.icon2 && (
                    <item.icon2 className="size-6 text-green-500" />
                  )}
                  <p>{item.text2}</p>
                </div>
                <div className="h-px w-full mt-2 bg-green-500"></div>
                <p className="text-lg">{item.description}</p>
                <div className="flex flex-col gap-2">
                  {item.rules?.map((item: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <span>&#8226;</span> <p>{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
