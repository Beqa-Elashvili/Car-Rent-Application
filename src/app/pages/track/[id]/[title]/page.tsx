"use client";

import { Ttracks } from "@/app/Providers/GlobalProvider/GlobalContext";

import { Button, Input } from "antd";
import { useRouter } from "next/navigation";
import { Carousel, Calendar, Modal, Spin } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Image from "next/image";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useState } from "react";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";

export default function Track({ params }: { params: { id: number } }) {
  const { tracks, userId, fetchReservedTrack } = useGlobalProvider();
  const router = useRouter();
  const currentTrack = tracks[params.id];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    if (reserveTrackValue.dayEnd === "") {
      alert("Please fill in the graphs");
      return;
    }
    PostReserveTrack();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
    setIsModalOpen(true);
    setReserveTrackValue((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const disableBeforeToday = (current: any) => {
    return current && current.isBefore(dayjs(), "day");
  };
  const [postTrackPending, setPostTrackPending] = useState<boolean>(false);
  async function PostReserveTrack() {
    try {
      setPostTrackPending(true);
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

      await axios.post("/api/reservedtracks", requestData);
      await fetchReservedTrack();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setReserveTrackValue({
        dayStart: "",
        dayEnd: "",
        rentPrice: 0,
        dayRentPrice: 0,
        totalPrice: 0,
        dayCount: 0,
        oneLap: false,
      });
      setPostTrackPending(false);
      setStartDate(null);
      setIsModalOpen(false);
    }
  }

  return (
    <div className="bg-gray-900 p-2 md:p-0">
      <div className="w-full p-6 md:p-12 min-h-screen flex flex-col ">
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              key="cancel"
              onClick={handleCancel}
              disabled={postTrackPending}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              disabled={postTrackPending}
            >
              {postTrackPending ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : (
                "OK"
              )}
            </Button>,
          ]}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="p-2 w-full border rounded h-8 flex items-center justify-center">
              {reserveTrackValue?.dayStart}
            </div>
            <div className="p-2 w-full border rounded h-8 flex items-center justify-center">
              {reserveTrackValue?.dayEnd}
            </div>
          </div>
          <Calendar
            disabledDate={disableBeforeToday}
            fullscreen={false}
            onChange={onDateChange}
          />
        </Modal>
        {currentTrack && (
          <div className="bg-gray-900 min-h-screen h-full w-full text-white flex flex-col gap-2 items-center">
            <h1 className="text-3xl text-center text-orange-500 font-serif">
              {currentTrack.title}
            </h1>
            <h1 className="text-sm font-mono text-orange-300">
              {currentTrack.location} : {currentTrack.established}
            </h1>
            <div className="flex flex-col w-full md:w-1/2">
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
            <div className="flex items-center justify-center gap-4 md:gap-6 w-7/12">
              <Button
                disabled={!userId}
                onClick={() =>
                  handleDayOrDays("rentPrice", currentTrack.rentPrice)
                }
                className="rounded-full bg-orange-500 text-white border-none transition duration-300 hover:scale-105 font-mono font-bold w-20 md:w-24 h-20 md:h-24 "
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
                disabled={!userId}
                onClick={() =>
                  handleDayOrDays("dayRentPrice", currentTrack.dayRentPrice)
                }
                className="rounded-full bg-orange-500 border-none text-white transition duration-300 hover:scale-105 font-mono font-bold w-20 md:w-24 h-20 md:h-24 "
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
              <h1 className="text-orange-500 text-center md:text-start font-mono">
                {currentTrack.notes}
              </h1>
            </div>
          </div>
        )}
      </div>

      <Carousel
        className="py-6 md:py-8 p-4  md:p-12"
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
            className="p-2"
            key={item.index}
          >
            <Image
              src={item.img}
              width={2000}
              height={2000}
              alt="trackImage"
              className="w-40 md:w-60 h-20 md:h-40 m-auto rounded-xl shadow transition duration-300  hover:scale-105 cursor-pointer"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
