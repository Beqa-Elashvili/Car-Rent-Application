"use client";

import {
  CarsType,
  Ttracks,
} from "@/app/Providers/GlobalProvider/GlobalContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { createCarImage } from "@/app/CreateCarImage";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Carousel } from "antd";
import Image from "next/image";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

export default function Car({ params }: { params: { id: number } }) {
  const { tracks } = useGlobalProvider();
  const router = useRouter();

  const currentTrack = tracks[params.id];

  return (
    <div className="bg-gray-900 w-full min-h-screen flex flex-col h-full p-12">
      {currentTrack && (
        <div className="bg-gray-900 min-h-screen h-full w-full text-white flex flex-col gap-2 items-center">
          <h1 className="text-3xl text-orange-500 font-serif">
            {currentTrack.title}
          </h1>
          <h1 className="text-sm font-mono text-orange-300">
            {currentTrack.location}
          </h1>
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col">
              <div className="flex justify-between text-3xl font-bold font-mono">
                <div>
                  <h1 className="text-orange-400">START WITH</h1>
                  <div className="h-px bg-gray-700"></div>
                  <h1>{currentTrack.rentPrice} $ LAP</h1>
                </div>
                <div>
                  <h1 className="text-orange-400">LOOP</h1>
                  <div className="h-px bg-gray-700"></div>
                  <h1>{currentTrack.loop}KM</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 w-7/12">
            <Button className="rounded-full bg-orange-500 text-white border-none transition duration-300 hover:scale-105 font-mono font-bold w-24 h-24 ">
              LAP/{currentTrack.rentPrice}$
            </Button>
            <Image
              src={currentTrack.img}
              width={2000}
              height={2000}
              alt="trackImage"
              className="w-full mt-2 rounded-xl shadow transition duration-300  hover:scale-105 cursor-pointer"
            />
            <Button className="rounded-full bg-orange-500 border-none text-white transition duration-300 hover:scale-105 font-mono font-bold w-24 h-24 ">
              DAY/{currentTrack.dayRentPrice}$
            </Button>
          </div>
          <div className="text-center text-balance mt-2 text-sm font-mono text-orange-300">
            {currentTrack.description}
          </div>
          <div className="text-center w-full flex flex-col gap-4">
            <h1 className="text-3xl text-mono text-orange-500">
              FAMOUS EVENTS
            </h1>
            <div className="h-px bg-gray-700 w-full"></div>
            <h1 className="text-xl text-orange-300">
              {currentTrack.famousEvents}
            </h1>
          </div>
          <div className="h-px bg-gray-700 w-full"></div>
          <div>
            <h1 className="text-orange-500 font-mono">{currentTrack.notes}</h1>
          </div>
        </div>
      )}
      <Carousel
        className="p-12"
        slidesToShow={4}
        arrows
        infinite
        autoplay
        dotPosition="bottom"
      >
        {tracks.map((item: Ttracks) => (
          <div
            onClick={() =>
              router.push(`/pages/track/${item.index}/${item.title}`)
            }
            key={item.index}
          >
            <Image
              src={item.img}
              width={2000}
              height={2000}
              alt="trackImage"
              className="w-60 h-40 m-auto rounded-xl shadow transition duration-300  hover:scale-105 cursor-pointer"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
