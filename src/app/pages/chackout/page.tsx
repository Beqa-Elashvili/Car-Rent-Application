"use client";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { CiUser } from "react-icons/ci";

import { useSession } from "next-auth/react";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { getRandomValues } from "crypto";
import { useEffect, useState } from "react";

export default function Chackout() {
  const { ReserveCars } = useGlobalProvider();
  const { data: session, status } = useSession();
  const [SubTotal, setSubtotal] = useState<number>(0);
  const [value, setValue] = useState<number>();
  const [PromoCode, setPromoCode] = useState<number[]>([]);
  const [randomNumber, setRandomNumber] = useState<number>();
  const reserveTotalPrice = localStorage.getItem("reserveTotalPrice");

  const handlePromoCode = () => {
    if (value && value.toString().length === 4 && !PromoCode.includes(value)) {
      setPromoCode((prevCodes) => [...prevCodes, value]);
      handleButtonClick();
      setValue(0);
    } else {
      alert("Invalid or duplicate promo code");
    }
  };

  useEffect(() => {
    const generateRandomNumber = () => {
      return Math.floor(Math.random() * (100 - 30 + 1)) + 30;
    };
    setRandomNumber(generateRandomNumber());
    setSubtotal(reserveTotalPrice ? parseFloat(reserveTotalPrice) : 0);
  }, []);

  const handleButtonClick = () => {
    const newRandomNumber = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    setSubtotal((_prevSubTotal) => SubTotal - newRandomNumber);
  };

  const getSubTotal = () => {
    const total = ReserveCars.reduce((accumulator, car) => {
      return accumulator + car.carDayCount;
    }, 0);
    return total;
  };

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="bg-slate-800 min-h-screen h-full p-20 px-40">
      <div className="bg-white flex gap-4 w-full p-12 rounded-xl h-screen">
        <Form className="w-8/12">
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <p className="mb-2 flex items-center gap-2 text-gray-600">
              <CiUser className="size-6" />
              Username
            </p>
            <Input value={session?.user.username} disabled />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <p className="mb-2 flex items-center gap-2 text-gray-600">
              <CiUser className="size-6" />
              Email
            </p>
            <Input value={session?.user.email} disabled />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className="border-l w-2/6 p-4">
          <h1 className="text-gray-600 mb-2">CARS SUMMARY</h1>
          <div className="flex font-bold text-sm justify-between">
            <h1>Subtotal </h1>
            <h1>{SubTotal} $</h1>
          </div>
          <div className="flex font-bold text-sm justify-between">
            <h1>Taxes</h1>
            <h1>{randomNumber} $</h1>
          </div>
          <div className="flex font-bold text-sm justify-between">
            <h1>Reserved</h1>
            <h1>({ReserveCars.length})</h1>
          </div>
          <div className="flex font-bold text-sm justify-between">
            <h1>Subdays</h1>
            <h1>{getSubTotal()}</h1>
          </div>
          <div className="w-full bg-gray-900 h-px mt-2"></div>
          <h1 className="flex justify-between w-full text-lg">
            Total <p>{SubTotal && randomNumber && SubTotal + randomNumber}</p>
          </h1>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Apply a Promo Code or Discount (one per order)
            </p>
            <div className="relative w-full mt-2 flex items-center">
              <Input
                type="number"
                maxLength={4}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="p-0 pl-2 h-8"
                placeholder="Promo Code"
              />
              <Button
                onClick={() => handlePromoCode()}
                className="absolute rounded-none rounded-r right-0 px-2 h-full border-l"
              >
                APPLY
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
