import { motion } from "framer-motion";
import { SiLamborghini } from "react-icons/si";

export function Main() {
  return (
    <div>
      <div className="relative flex items-center justify-center">
        <div className="relative w-full">
          <img
            className="w-full object-contain"
            src="/mclaren.jpeg"
            alt="mclaren"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
        </div>
        <div className="absolute w-full text-white flex flex-col gap-16 ">
          <div className="relative w-full flex flex-col text-white">
            <p className="bg-white absolute top-[26px] w-full h-px"></p>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="text-3xl lg:text-9xl ml-36"
            >
              THE GOLD
            </motion.p>
            <p className="bg-white absolute bottom-[10px] w-full h-px"></p>
          </div>
          <div className="relative w-full">
            <p className="bg-white absolute mt-[22px] w-full h-px"></p>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="flex justify-between px-14 text-9xl"
            >
              Standards{" "}
              <motion.span
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 150 }}
                transition={{ duration: 1 }}
                className="mr-40"
              >
                in
              </motion.span>
            </motion.p>
            <p className="bg-white absolute bottom-[10px] w-full h-px"></p>
          </div>
          <div className="relative">
            <p className="bg-white absolute w-full top-[26px] h-px"></p>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-9xl float-end mr-36"
            >
              Luxury car
            </motion.p>
            <p className="bg-white absolute bottom-[10px] w-full h-px"></p>
          </div>
        </div>
      </div>
      <div className="bg-black text-white w-full">
        <div className="px-2 py-40 flex justify-between ">
          <div className="flex flex-col gap-20">
            <h1>RENTAL CARS</h1>
            <p className="w-3/4 text-6xl ">Experience is everything</p>
          </div>
          <p className=" w-2/6  flex items-end">
            Whether you're looking to elevate your business transportation,
            seeking a wedding getaway car, or are just ready to have an
            exhilarating experience, there is no better answer than Rental Cars.
          </p>
        </div>
        <div className="inline relative bg-red-200 h-[1000px]">
          <img className="object-contain" src="/porche.jpg" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black"></div>
        </div>
        <h1 className="px-2 flex items-end">Our Featured Rides</h1>
        <div className="relative flex flex-col items-center justify-center">
          <img className="w-full" src="/lamborgini.jpeg" alt="" />
          <div className="absolute  m-auto w-4/6">
            <h1 className="text-2xl mb-40">LAMBORGHINI</h1>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-20">
                <h1 className="text-9xl">REVUELTO</h1>
                <div className="flex gap-12 text-sm text-gray-400 font-medium">
                  <div>
                    <p>STARTING AT</p>
                    <h3 className="text-white text-xl">$1500</h3>
                  </div>
                  <div>
                    <p>TOP SPEED</p>
                    <h3 className="text-white text-xl">350</h3>
                  </div>
                  <div>
                    <p>0-100</p>
                    <h3 className="text-white text-xl">2.5s</h3>
                  </div>
                  <div>
                    <p>TORUE</p>
                    <h3 className="text-white text-xl">661Hp</h3>
                  </div>
                  <div>
                    <p>TRANSMISSION</p>
                    <h3 className="text-white text-xl">7</h3>
                  </div>
                  <div>
                    <p>SEAT</p>
                    <h3 className="text-white text-xl">2</h3>
                  </div>
                </div>
              </div>
              <div>
                <button className="border-none rounded-full w-40 h-40 font-medium text-2xl bg-blue-500 hover:shadow-lg">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-4/6 relative h-40 flex flex-col overflow-hidden justify-center m-auto">
          <SiLamborghini className="text-[200px] absolute" />
        </div>
      </div>
    </div>
  );
}
