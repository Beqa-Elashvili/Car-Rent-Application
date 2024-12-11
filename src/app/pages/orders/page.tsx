"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button, Input } from "antd";

interface orderType {
  TotalDays: string;
  TotalPrice: string;
  cardName: string;
  cardNumber: string;
  cardunlock: string;
  city: string;
  createdAt: string;
  cvc: string;
  drivingLicense: string;
  email: string;
  expiry: string;
  street: string;
  updatedAt: string;
  userId: string;
  username: string;
  __v: number;
  _id: string;
}
export default function Orders() {
  const [orders, setOrders] = useState<orderType[]>([]);
  const { userId } = useGlobalProvider();
  const [code, setCode] = useState<string>("");

  async function GetOrders() {
    try {
      if (userId) {
        const resp = await axios.get("/api/orders", {
          params: { userId },
        });
        setOrders(resp.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    GetOrders();
  }, [userId]);

  return (
    <div className="bg-slate-800 min-h-screen h-full  w-full p-20 grid grid-cols-4 gap-4">
      {orders?.map((item: orderType) => (
        <div
          key={item._id}
          className="border rounded-xl flex flex-col gap-2 p-2 bg-white bg-slate-500"
        >
          <div className="flex justify-between items-center">
            <Image
              height={500}
              width={1000}
              className="w-24"
              src="/car-stainless-logo-png.webp"
              alt="logoPng"
            />
            <p>NO. {item._id.replace(/\D/g, "").slice(-2)}</p>
          </div>
          <h1 className="text-4xl font-medium">INVOICE</h1>
          <p>Date: {item.createdAt.split("T").slice(0, -1)}</p>
          <div>
            <h1 className="font-medium">Billed to:</h1>
            <p>
              {item.city}, {item.street}
            </p>
            <p>{item.email}</p>
            <p>Driving License: {item.drivingLicense}</p>
          </div>
          <div className="bg-slate-300 flex justify-between p-2">
            <p className="w-12">Item</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Amount</p>
          </div>
          <div className="flex text-gray-700 justify-between">
            <p className="w-12">SubDays:</p>
            <p>{item.TotalDays}</p>
            <p>${item.TotalPrice}</p>
            <p>${item.TotalPrice}</p>
          </div>
          <div className="h-px bg-gray-500 w-full"></div>
          <div className="flex font-medium justify-between">
            <h1>TOTAL</h1>
            <h1>${item.TotalPrice}</h1>
          </div>
          <div className="h-px bg-gray-500 w-full"></div>
          <div>
            <h1 className="font-medium">Card</h1>
            <div className="relative mt-2 flex overflow-hidden items-center">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                placeholder="Unlock Code"
                className="w-full"
              />
            </div>
            <div
              className={`${
                code === item.cardunlock ? "block" : "hidden"
              } font-medium flex flex-col gap-1 mt-2 `}
            >
              <div className="flex justify-between border p-1 rounded">
                <p>Name</p>
                <p>{item.cardName}</p>
              </div>
              <div className="flex justify-between border p-1 rounded">
                <p>cvc</p>
                <p>{item.cvc}</p>
              </div>
              <div className="flex justify-between border p-1 rounded">
                <p>expiry</p>
                <p>{item.expiry}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
