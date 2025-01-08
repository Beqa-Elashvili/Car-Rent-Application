"use client";

import { GiCarKey } from "react-icons/gi";
import UserProfile from "@/app/Components/userInfo/page";
import { useRouter } from "next/navigation";
import { RiMenuFold2Fill } from "react-icons/ri";
import { RiMenuFoldFill } from "react-icons/ri";
import { useState, useEffect, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";

import Image from "next/image";
import { Input, Select, Spin } from "antd";
import axios from "axios";
import {
  CarsType,
  TCollecttion,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

export function Header() {
  const [searchResults, setSearchResults] = useState<CarsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const { collections } = useGlobalProvider();
  const router = useRouter();

  const getSearchResults = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (!value) {
        setSearchResults([]);
        return;
      }
      params.append("model", value);
      if (brand && brand !== "All") {
        params.append("brand", brand);
      }
      const url = `/api/cars?${params.toString()}`;
      const resp = await axios.get(url);
      setSearchResults(resp.data.cars);
      setLoading(false);
    } catch (error) {
      setSearchResults([]);
      console.log("error while fetch SearchResult", error);
    } finally {
      setLoading(false);
    }
  }, [brand, value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getSearchResults();
    }, 300);
    return () => clearTimeout(timeout);
  }, [brand, value]);

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

  const handleCar = (id: string) => {
    setValue("");
    setSearchResults([]);
    router.push(`/pages/solocar/${id}`);
  };

  const handleSearchResults = (brand: string, model: string) => {
    setValue("");
    if (!value) {
      alert("input the model");
      return;
    } else {
      router.push(`/pages/brands/${!brand ? "All" : brand}/${model}/All`);
    }
  };

  return (
    <div className="w-full bg-slate-800 text-white relative h-full text-2xl">
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
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
          className={`absolute z-10 top-16 flex flex-col items-start p-4 gap-2 left-0 w-64 min-h-screen h-full bg-gray-700
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
        </div>
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 justify-center hover:cursor-pointer lg:justify-start"
        >
          <Image
            height={500}
            width={1000}
            className="w-16 object-contain rounded-full"
            src="/websiteLogo.webp"
            alt="logo"
          />
          <p className="flex flex-col text-sm font-medium">
            LUXURY <span className="text-red-400">DRIVE</span>
          </p>
        </div>
        <div className="relative flex w-1/2 items-center text-black">
          <Select
            onChange={(value: string) => setBrand(value)}
            placeholder="Brand"
            className={`absolute left-0 w-40 z-40 border-none border-l ${
              searchResults.length !== 0 && "rounded-bl-none"
            }`}
          >
            <Select.Option value="All">All</Select.Option>
            {collections?.map((item: TCollecttion) => (
              <Select.Option key={item.img} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search the car"
            className={`w-full px-44 z-30 ${
              searchResults.length !== 0 && "rounded-b-none"
            }`}
          />
          {loading && <Spin className="z-40 absolute right-14" />}
          <button
            onClick={() => handleSearchResults(brand, value)}
            className={`z-40 hover:bg-cyan-600 absolute right-0 border-none border-l h-full ${
              searchResults.length !== 0 ? "rounded-tr" : "rounded-r"
            } hover:border-none bg-cyan-500 px-4 `}
          >
            <IoSearchSharp className="text-slate-800 " />
          </button>
          {searchResults.length !== 0 && (
            <div className="bg-white w-full max-h-96 overflow-y-scroll p-2 flex flex-col gap-2 rounded-b absolute top-8 z-30">
              <div className="flex flex-col gap-2">
                {searchResults?.map((item: CarsType) => (
                  <div
                    key={item._id}
                    onClick={() => handleCar(item._id)}
                    className="bg-orange-600 rounded w-full hover:bg-orange-800 cursor-pointer p-2 flex justify-between items-center gap-12"
                  >
                    <div className="flex items-center">
                      <Image
                        src={item.img}
                        alt="img"
                        width={500}
                        height={1000}
                        className="w-40 h-20 object-contain"
                      />
                      <div className="text-white">
                        <p>{item.make}</p>
                        <p>{item.model}</p>
                      </div>
                    </div>
                    <h1 className="text-orange-200 font-serif">
                      $ {item.dayPrice}/Day
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <UserProfile />
      </div>
      <div className="hidden lg:inline">
        <div className="flex px-12 p-2 gap-4 bg-slate-700 justify-between">
          <div
            onClick={() => router.push("/")}
            className="hover:text-green-400 cursor-pointer"
          >
            MAIN
          </div>
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
            <p>COLLECTION</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
