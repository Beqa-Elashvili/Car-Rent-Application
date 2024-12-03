"use client";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { CiUser } from "react-icons/ci";

import { useSession } from "next-auth/react";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { useEffect, useState } from "react";
import { GoogleMap } from "@/app/Components/GoogleMap";

export default function Chackout() {
  const { ReserveCars, location } = useGlobalProvider();
  const { data: session, status } = useSession();
  const [SubTotal, setSubtotal] = useState<number>(0);
  const [value, setValue] = useState<number>();
  const [PromoCode, setPromoCode] = useState<number[]>([]);
  const [randomNumber, setRandomNumber] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userValues = {
    username: session?.user.username,
    email: session?.user.email,
    city: location?.city,
    street: location?.street,
    drivingLicense: "",
  };
  // const reserveTotalPrice = localStorage.getItem("reserveTotalPrice");

  const handlePromoCode = () => {
    if (value && value.toString().length === 4 && !PromoCode.includes(value)) {
      setPromoCode((prevCodes) => [...prevCodes, value]);
      handleButtonClick();
      setValue(0);
    } else {
      alert("Invalid or duplicate promo code");
    }
  };

  // useEffect(() => {
  //   const generateRandomNumber = () => {
  //     return Math.floor(Math.random() * (100 - 30 + 1)) + 30;
  //   };
  //   setRandomNumber(generateRandomNumber());
  //   setSubtotal(reserveTotalPrice ? parseFloat(reserveTotalPrice) : 0);
  // }, []);

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

  const [form] = Form.useForm();

  type FieldType = {
    username: string;
    email: string;
    city: string;
    street: string;
    drivinglicense: string;
  };

  const onFinish = (values: FieldType) => {
    if (values.drivinglicense.length !== 9) {
      form.setFields([
        {
          name: "drivinglicense",
          errors: ["ნომერი უნდა შედგებოდეს 9 რიცხვისაგან"],
        },
      ]);
      return;
    }
    console.log(values);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-800 min-h-screen h-full p-20 px-40">
      <div className="bg-white flex gap-4 w-full p-12 rounded-xl h-screen">
        {session?.user && location.city && location.street ? (
          <Form<FieldType>
            form={form}
            initialValues={userValues}
            autoComplete="on"
            className="w-8/12"
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
                <Input value={session?.user?.username || ""} />
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
                <Input value={session?.user?.email || ""} />
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
                <Input value={location?.city || ""} />
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
                <Input value={location?.street || ""} />
              </div>
            </Form.Item>
            <Button className="mb-2" type="primary" onClick={showModal}>
              Open Map
            </Button>
            <Form.Item
              name="drivinglicense"
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
                <Input maxLength={9} placeholder="*********" />
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

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) : (
          "loading"
        )}
        <div className="border-l w-2/6 p-4">
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
