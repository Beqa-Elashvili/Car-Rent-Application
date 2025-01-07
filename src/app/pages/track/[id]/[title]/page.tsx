"use client";

import { Ttracks } from "@/app/Providers/GlobalProvider/GlobalContext";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import { Carousel, Calendar, Modal } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Image from "next/image";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useState } from "react";
import axios from "axios";

export default function Track({ params }: { params: { id: number } }) {
  const { tracks, userId } = useGlobalProvider();
  const router = useRouter();
  const currentTrack = tracks[params.id];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    PostReserveTrack();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [reserveTrackValue, setReserveTrackValue] = useState({
    dayStart: "",
    dayEnd: "",
    rentPrice: 0,
    dayRentPrice: 0,
    totalPrice: 0,
    dayCount: 0,
    oneLap: false,
  });

  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const onDateChange = (value: Dayjs) => {
    if (reserveTrackValue.rentPrice > 0) {
      setReserveTrackValue((prev) => ({
        ...prev,
        dayStart: value.format("YYYY-MM-DD"),
        dayEnd: value.format("YYYY-MM-DD"),
        dayRentPrice: 0,
        oneLap: true,
        dayCount: 1,
      }));
    } else {
      if (!startDate || (startDate && value.isBefore(startDate))) {
        setStartDate(value);
        setReserveTrackValue((prev) => ({
          ...prev,
          dayStart: value.format("YYYY-MM-DD"),
          dayCount: 1,
        }));
      } else if (startDate && value.isAfter(startDate)) {
        setReserveTrackValue((prev) => ({
          ...prev,
          dayEnd: value.format("YYYY-MM-DD"),
          dayCount: 1,
        }));

        if (startDate) {
          const diff = value.diff(startDate, "day");
          setReserveTrackValue((prev) => ({
            ...prev,
            dayEnd: value.format("YYYY-MM-DD"),
            dayCount: diff + 1,
          }));
        }
      }
    }
  };

  const handleDayOrDays = (key: string, value: number) => {
    if (reserveTrackValue.rentPrice > 0 || reserveTrackValue.dayRentPrice > 0) {
      const yesOrno = confirm(
        `you alreay choose ${
          reserveTrackValue.rentPrice > 0 ? "oneLap" : "whole day/days"
        } : if you need change, clear the sentance`
      );
      if (yesOrno) {
        setReserveTrackValue({
          dayStart: "",
          dayEnd: "",
          rentPrice: 0,
          dayRentPrice: 0,
          totalPrice: 0,
          dayCount: 0,
          oneLap: false,
        });
        setStartDate(null);
        return;
      }
    }
    setIsModalOpen(true);
    setReserveTrackValue((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const disableBeforeToday = (current: any) => {
    return current && current.isBefore(dayjs(), "day");
  };

  async function PostReserveTrack() {
    try {
      if (!reserveTrackValue || !currentTrack) {
        console.log("Missing data for reserveTrackValue or currentTrack");
        return;
      }

      const totalPrice = reserveTrackValue.dayRentPrice
        ? reserveTrackValue.dayRentPrice * reserveTrackValue.dayCount
        : reserveTrackValue.rentPrice * reserveTrackValue.dayCount;

      if (!userId) {
        console.log("User ID is missing");
        return;
      }
      const requestData = {
        track: {
          title: currentTrack.title,
          loop: currentTrack.loop, 
          rentPrice: currentTrack.rentPrice, 
          dayRentPrice: reserveTrackValue.dayRentPrice, 
          location: currentTrack.location, 
          description: currentTrack.description, 
          dayStart: reserveTrackValue.dayStart, 
          dayEnd: reserveTrackValue.dayEnd, 
          dayCount: reserveTrackValue.dayCount, 
          oneLap: reserveTrackValue.oneLap, 
          totalPrice: totalPrice,
        },
        userId,
      };

      const resp = await axios.post("/api/reservedtracks", requestData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-900 w-full min-h-screen flex flex-col h-full p-12">
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Calendar
          disabledDate={disableBeforeToday}
          fullscreen={false}
          onChange={onDateChange}
        />
      </Modal>
      {currentTrack && (
        <div className="bg-gray-900 min-h-screen h-full w-full text-white flex flex-col gap-2 items-center">
          <h1 className="text-3xl text-orange-500 font-serif">
            {currentTrack.title}
          </h1>
          <h1 className="text-sm font-mono text-orange-300">
            {currentTrack.location} : {currentTrack.established}
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
            <Button
              onClick={() =>
                handleDayOrDays("rentPrice", currentTrack.rentPrice)
              }
              className="rounded-full bg-orange-500 text-white border-none transition duration-300 hover:scale-105 font-mono font-bold w-24 h-24 "
            >
              LAP/{currentTrack.rentPrice}$
            </Button>
            <Image
              src={currentTrack.img}
              width={2000}
              height={2000}
              alt="trackImage"
              className="w-full mt-2 rounded-xl shadow transition duration-300  hover:scale-105 cursor-pointer"
            />
            <Button
              onClick={() =>
                handleDayOrDays("dayRentPrice", currentTrack.dayRentPrice)
              }
              className="rounded-full bg-orange-500 border-none text-white transition duration-300 hover:scale-105 font-mono font-bold w-24 h-24 "
            >
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
              {currentTrack.famousEvents.map((item: string, index: number) =>
                index === currentTrack.famousEvents.length - 1
                  ? item
                  : item + " : "
              )}
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
function moment(): any {
  throw new Error("Function not implemented.");
}
