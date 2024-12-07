"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useEffect, useState } from "react";
import axios from "axios";

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
  console.log(orders);

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
    <div className="bg-slate-800 min-h-screen h-full  w-full p-20 grid grid-cols-4 gap-4 jsutify-center ">
      {orders?.map((item: orderType) => (
        <div
          key={item._id}
          className="border rounded-xl bg-slate-500 text-center"
        >
          <h1 className="text-xl"> Cost: {item.TotalPrice}</h1>
          <h1 className="text-xl"> subTotal Days: {item.TotalDays}</h1>
          <h1 className="text-xl"> street: {item.street}</h1>
          <h1 className="text-xl"> city: {item.city}</h1>
          <h1 className="text-xl">
            data: {item.createdAt.split("T").join(" ")}
          </h1>
        </div>
      ))}
    </div>
  );
}
