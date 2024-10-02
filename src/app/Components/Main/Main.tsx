import { motion } from "framer-motion";

export function Main() {
  return (
    <div className="relative flex items-center justify-center">
      <img
        className="w-full object-contain"
        src="/mclaren.jpeg"
        alt="mclaren"
      />
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
  );
}
