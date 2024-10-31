"use client";

import { IoIosMenu } from "react-icons/io";
import { GiCarKey } from "react-icons/gi";
import { FaHandPeace } from "react-icons/fa";
import UserProfile from "@/app/Components/userInfo/page";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <div className="bg-gray-900 w-full text-white h-full text-2xl">
      <div className="flex justify-between p-2 text-xl items-center">
        <div
          onClick={() => router.push("/")}
          className="flex hover:cursor-pointer"
        >
          <img className="w-24" src="/car-stainless-logo-png.webp" alt="" />
          <p className="flex flex-col text-sm font-medium">
            LUXURY <span className="text-red-400">DRIVE</span>
          </p>
        </div>
        <div className="w-2/6 m-auto">
          <div className="flex justify-between">
            <div className="hover:text-green-400 cursor-pointer">MAIN</div>
            <span className="border bg-gray-500"></span>
            <div className="hover:text-green-400 cursor-pointer">BEST</div>
            <span className="border bg-gray-500"></span>
            <div className="hover:text-green-400 cursor-pointer">
              CONDITIONS
            </div>
            <span className="border bg-gray-500"></span>
            <div
              onClick={() => router.push("/pages/collection")}
              className="flex items-center gap-2 text-xl hover:text-green-400 cursor-pointer "
            >
              <GiCarKey />
              <p>Collection</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserProfile />
          <FaHandPeace />
        </div>
      </div>
    </div>
  );
}
