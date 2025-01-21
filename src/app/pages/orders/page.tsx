"use client";

import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";

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
  const [code, setCode] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleCodeChange = (id: string, value: string) => {
    setCode((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const [pending, setPending] = useState<boolean>(false);

  const GetOrders = useCallback(async () => {
    try {
      setPending(true);
      if (userId) {
        const resp = await axios.get("/api/orders", {
          params: { userId },
        });
        setOrders(resp.data.orders);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setPending(false);
    }
  }, [userId]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      GetOrders();
      return () => clearTimeout(timeOut);
    }, 30);
  }, [userId]);

  async function DeleteOrder(userId?: string, _id?: string) {
    try {
      const url = userId
        ? `/api/orders?userId=${userId}`
        : `/api/orders?id=${_id}`;

      await axios.delete(url);
      await GetOrders();
    } catch (error) {
      console.error("something get wrong while delete order/orders");
    }
  }

  return (
    <div className="bg-slate-800 min-h-screen">
      {!pending ? (
        <>
          {orders.length === 0 && (
            <div className="text-white flex flex-col p-12 gap-4 items-cente font-mono">
              <h1 className="text-6xl text-center">No Orders</h1>
              {userId ? (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      className="bg-orange-500 w-40 text-white font-mono border-none px-14"
                      onClick={() => router.push("/pages/collection")}
                    >
                      Explore
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => router.push("/register")}
                        className="w-40 bg-orange-500 font-mono text-white border-none"
                      >
                        Sign up
                      </Button>
                      <Button
                        onClick={() => router.push("/login")}
                        className="w-40 bg-orange-500 font-mono text-white border-none"
                      >
                        Sign in
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="bg-slate-800 min-h-screen h-full w-full items-start p-4 md:p-20 grid grid-cols-1 md:grid-cols-4 gap-4">
            {orders?.map((item: orderType) => {
              const inputCode = code[item._id] || "";
              return (
                <div
                  key={item._id}
                  className="border rounded-xl flex flex-col gap-2 p-2 bg-white bg-slate-500"
                >
                  <div className="flex justify-between">
                    <Image
                      height={500}
                      width={1000}
                      className="w-24"
                      src="/car-logo-png-25.png"
                      alt="logoPng"
                    />
                    <div>
                      <p className="text-end">
                        NO. {item._id.replace(/\D/g, "").slice(-2)}
                      </p>
                      <Button
                        onClick={() => DeleteOrder("", item._id)}
                        type="dashed"
                        className="border rounded bg-red-500 font-semibold text-white"
                      >
                        Delete
                      </Button>
                    </div>
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
                        value={inputCode}
                        onChange={(e) =>
                          handleCodeChange(item._id, e.target.value)
                        }
                        maxLength={4}
                        placeholder="Unlock Code"
                        className="w-full"
                      />
                    </div>
                    <div
                      className={`${
                        inputCode === item.cardunlock ? "block" : "hidden"
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
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Spin
            className="text-center w-full p-14"
            style={{ fontSize: 48 }}
            indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
          />
        </>
      )}
    </div>
  );
}
