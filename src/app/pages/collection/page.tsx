"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { TCollecttion } from "@/app/Providers/GlobalProvider/GlobalContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Page() {
  const { collections } = useGlobalProvider();
  const router = useRouter();
  return (
    <div className="bg-gray-800 min-h-screen h-full items-center p-4 grid grid-cols-2 md:grid-cols-4 items-center justify-center  gap-2 ">
      {collections?.map((item: TCollecttion, index: number) => (
        <div
          key={index}
          onClick={() => router.push(`/pages/brands/${item.name}/All/All`)}
          className="p-2 overflow-hidden flex flex-col items-center border object-contain rounded-xl transition duration-300 hover:bg-gray-500  hover:cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              key={index}
              width={1000}
              height={500}
              className="h-60 w-60 object-contain"
              src={item.img || ""}
              alt="brand-logo"
            />
          </motion.div>
          <h1 className="text-lg md:text-3xl font-medium text-white">
            {item.name?.toUpperCase()}
          </h1>
        </div>
      ))}
    </div>
  );
}
