"use client";

import React from "react";
import { Button, Form, Input, Modal } from "antd";
import { CiUser } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useEffect, useState } from "react";
import { GoogleMap } from "@/app/Components/GoogleMap";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import axios from "axios";

export default function Chackout() {
  const { ReserveCars, location, deleteReservedCar } = useGlobalProvider();
  const { data: session, status } = useSession();
  const [SubTotal, setSubtotal] = useState<number>(0);
  const [value, setValue] = useState<number>();
  const [PromoCode, setPromoCode] = useState<number[]>([]);
  const [randomNumber, setRandomNumber] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reserveTotalPrice = localStorage.getItem("reserveTotalPrice");
  const userId = session?.user?.id;
  const [form] = Form.useForm();
  const router = useRouter();

  const [state, setState] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
    focus: "",
    cardunlock: "",
  });

  const userValues = {
    username: session?.user.username,
    email: session?.user.email,
    city: location?.city,
    street: location?.street,
    drivingLicense: "",
    cardNumber: state.cardNumber,
    expiry: state.expiry,
    cvc: state.cvc,
    cardName: state.cardName,
    cardunlock: state.cardunlock,
  };

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
    username: string;
    email: string;
    city: string;
    street: string;
    drivingLicense: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardName: string;
    cardunlock: string;
  };

  const onFinish = (values: FieldType) => {
    if (values.drivingLicense.length !== 9) {
      form.setFields([
        {
          name: "drivingLicense",
          errors: ["ნომერი უნდა შედგებოდეს 9 რიცხვისაგან"],
        },
      ]);
      return;
    }
    if (values.cardNumber.toString().length !== 16) {
      form.setFields([
        {
          name: "cardNumber",
          errors: ["გთხოვთ სწორად შეიყვანოთ ბარათის ნომერი"],
        },
      ]);
      return;
    }
    if (values.cvc.toString().length !== 3) {
      form.setFields([
        {
          name: "cvc",
          errors: ["გთხოვთ სწორად შეიყვანოთ ბარათის cvc კოდი"],
        },
      ]);
      return;
    }
    if (values.expiry.toString().length !== 4) {
      form.setFields([
        {
          name: "expiry",
          errors: ["გთხოვთ სწორად შეიყვანოთ ბარათის თარიღი"],
        },
      ]);
      return;
    }
    try {
      PostChackout(values);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (evt: { target: { name: any; value: any } }) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt: { target: { name: any } }) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  async function PostChackout(order: FieldType) {
    const totalDays = getSubTotal();
    try {
      const resp = await axios.post("/api/orders", {
        userId,
        order: {
          ...order,
          TotalPrice: SubTotal.toString(),
          TotalDays: totalDays.toString(),
        },
      });
      {
        userId && deleteReservedCar(userId, true, () => {});
      }
      router.push("/pages/orders");
    } catch (error: unknown) {
      console.log("error while post order", error);
    }
  }

  return (
    <div className="bg-slate-800 min-h-screen h-full lg:p-20 p-2 lg:px-40">
      <div className="bg-white mt-14 lg:flex gap-4 w-full p-12 rounded-xl">
        {session?.user && location.city ? (
          <Form<FieldType>
            form={form}
            initialValues={userValues}
            autoComplete="on"
            className=" w-full lg:w-8/12"
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <div>
                <p className="mb-2 flex items-center gap-2 text-gray-600">
                  <CiUser className="size-6" />
                  Username
                </p>
                <Input disabled value={session?.user?.username || ""} />
              </div>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <div>
                <p className="mb-2 flex items-center gap-2 text-gray-600">
                  <CiUser className="size-6" />
                  Email
                </p>
                <Input disabled value={session?.user?.email || ""} />
              </div>
            </Form.Item>

            <Form.Item
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <div>
                <p className="mb-2 flex items-center gap-2 text-gray-600">
                  City
                </p>
                <Input value={location?.city} />
              </div>
            </Form.Item>
            <Form.Item
              name="street"
              rules={[{ required: true, message: "Please input your street!" }]}
            >
              <div>
                <p className="mb-2 flex items-center gap-2 text-gray-600">
                  Street
                </p>
                {location?.street ? (
                  <Input value={location?.street || "..."} />
                ) : (
                  <Input value={"..."} />
                )}
              </div>
            </Form.Item>
            <Button className="mb-2" type="primary" onClick={showModal}>
              Open Map
            </Button>
            <Form.Item
              name="drivingLicense"
              rules={[
                {
                  required: true,
                  message: "Please input your driving license!",
                },
              ]}
            >
              <div>
                <p className="mb-2 flex items-center gap-2 text-gray-600">
                  APPLY YOUR DRIVING LICENSE NUMBER
                </p>
                <Input type="number" maxLength={9} placeholder="*********" />
              </div>
            </Form.Item>

            <Modal
              open={isModalOpen}
              footer={false}
              onCancel={() => setIsModalOpen(false)}
              title="Basic Modal"
            >
              <GoogleMap />
            </Modal>

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl">Payment Method</h1>
              <div className="border rounded flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-2">
                  <Input
                    className="border-none w-12 h-6"
                    checked
                    type="checkbox"
                  />
                  <p className="text-xl">Credit Cards</p>
                </div>
                <div>
                  <Image
                    src={"/Credit-Card-Icons.png"}
                    height={20}
                    className="h-12 w-60 object-contain"
                    width={1000}
                    alt={"CreditCards"}
                  />
                </div>
              </div>
              <div className="lg:flex gap-2">
                <div className="my-2">
                  <Cards
                    number={state.cardNumber}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    name={state.cardName}
                    focused={state.focus as Focused}
                  />
                </div>
                <div className="w-full flex-col">
                  <Form.Item
                    name="cardNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your card number",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="cardNumber"
                      maxLength={16}
                      placeholder="Card Number"
                      value={state.cardNumber}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </Form.Item>
                  <Form.Item
                    name="expiry"
                    rules={[
                      { required: true, message: "Please enter expiry date" },
                    ]}
                  >
                    <Input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      maxLength={4}
                      value={state.expiry}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </Form.Item>

                  <Form.Item
                    name="cvc"
                    rules={[{ required: true, message: "Please enter CVC" }]}
                  >
                    <Input
                      type="text"
                      name="cvc"
                      maxLength={3}
                      placeholder="CVC"
                      value={state.cvc}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </Form.Item>

                  <Form.Item
                    name="cardName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter cardholder name",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="cardName"
                      maxLength={16}
                      placeholder="Cardholder Name"
                      value={state.cardName}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </Form.Item>
                  <Form.Item
                    name="cardunlock"
                    rules={[
                      {
                        required: true,
                        message: "Please enter card unlock code",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="cardunlock"
                      value={state.cardunlock}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      maxLength={4}
                      placeholder="cardunlock code that used to be see card information in order"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <Form.Item className="mt-2" label={null}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) : (
          "loading"
        )}
        <div className="lg:border-l w-full lg:w-2/6 p-4">
          <div className="hidden">
            <GoogleMap />
          </div>
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
            Total <p>{SubTotal && randomNumber && SubTotal + randomNumber} $</p>
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
