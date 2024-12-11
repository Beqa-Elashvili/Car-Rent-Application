"use client";

import { GiCarKey } from "react-icons/gi";
import UserProfile from "@/app/Components/userInfo/page";
import { useRouter } from "next/navigation";
import { RiMenuFold2Fill } from "react-icons/ri";
import { RiMenuFoldFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import Image from "next/image";

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="w-full text-white relative h-full text-2xl">
      <div className="flex justify-between p-2 text-xl h-full items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl mr-2 inline lg:hidden"
        >
          {isOpen ? (
            <RiMenuFoldFill className="size-8" />
          ) : (
            <RiMenuFold2Fill className="size-8" />
          )}
        </button>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -100 }}
          transition={{ duration: 0.5 }}
          className={`absolute z-30 top-14 flex flex-col items-start p-4 gap-2 left-0 w-64 h-full bg-gray-700
           }`}
        >
          <button className="hover:text-yellow-300 cursor-pointer bg-green-600 rounded p-2 w-full">
            MAIN
          </button>
          <button className="hover:text-yellow-300 cursor-pointer  bg-green-600  rounded p-2 w-full">
            BEST
          </button>
          <button className="hover:text-yellow-300 cursor-pointer  bg-green-600  rounded p-2 w-full">
            CONDITIONS
          </button>
          <button
            onClick={() => router.push("/pages/collection")}
            className="flex items-center justify-center gap-2 text-xl hover:text-yellow-300 cursor-pointer  bg-green-600 rounded p-2 w-full"
          >
            <GiCarKey />
            <p>Collection</p>
          </button>
        </motion.div>
        <div
          onClick={() => router.push("/")}
          className="flex justify-center hover:cursor-pointer lg:justify-start"
        >
          <Image
            height={500}
            width={1000}
            className="w-24"
            src="/car-stainless-logo-png.webp"
            alt=""
          />
          <p className="flex flex-col text-sm font-medium">
            LUXURY <span className="text-red-400">DRIVE</span>
          </p>
        </div>
        <div className="hidden lg:inline">
          <div className="flex gap-4 justify-between">
            <div
              onClick={() => router.push("/")}
              className="hover:text-green-400 cursor-pointer"
            >
              MAIN
            </div>
            <span className="border bg-gray-500"></span>
            <div className="hover:text-green-400 cursor-pointer">BEST</div>
            <span className="border bg-gray-500"></span>
            <div
              onClick={() => router.push("/pages/conditions")}
              className="hover:text-green-400 cursor-pointer"
            >
              CONDITIONS
            </div>
            <span className="border bg-gray-500"></span>
            <Link
              href="/pages/collection"
              className="flex items-center gap-2 text-xl hover:text-green-400 cursor-pointer "
            >
              <GiCarKey />
              <p>Collection</p>
            </Link>
          </div>
        </div>
        <UserProfile />
      </div>
    </div>
  );
}
