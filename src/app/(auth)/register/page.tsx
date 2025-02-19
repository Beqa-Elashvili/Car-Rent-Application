"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GiTridentShield } from "react-icons/gi";
import dynamic from "next/dynamic";
import { FaMapMarkedAlt } from "react-icons/fa";

const GoogleMap = dynamic(
  () => import("@/app/Components/GoogleMap/GoogleMap"),
  {
    ssr: false,
  }
);
import { Input, Button, Form, Modal, Checkbox } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import axios from "axios";

function Register() {
  const [form] = Form.useForm();
  const { location } = useGlobalProvider();
  const router = useRouter();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAdminRegistration, setIsAdminRegistration] = useState(false);

  const toggleAdminRegistration = () => {
    setIsAdminRegistration((prev) => !prev);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  type FormValues = {
    phonenumber: string;
    password: string;
    repeatPassword: string;
    email: string;
    city: string;
    street: string;
    isAdmin?: boolean;
    adminSecret?: string;
  };

  const handleSubmit = async (values: FormValues) => {
    const { phonenumber, password, repeatPassword, email, city, street } =
      values;

    if (phonenumber.length !== 9) {
      form.setFields([
        {
          name: "phonenumber",
          errors: ["ნომერი უნდა შედგებოდეს 9 რიცხვისაგან"],
        },
      ]);
      return;
    }

    if (password !== repeatPassword) {
      form.setFields([
        {
          name: "repeatPassword",
          errors: ["შემოყვანილი პაროლი არ ემთხვევა არსებულს"],
        },
      ]);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const payload: FormValues = {
      ...values,
      isAdmin: isAdminRegistration ? true : false,
      ...(isAdminRegistration && {
        adminSecret: values.adminSecret,
      }),
    };

    try {
      setPending(true);
      const res = await axios.post("/api/register", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status >= 200 && res.status < 300) {
        localStorage.setItem("city", city);
        localStorage.setItem("street", street);
        router.push("/login");
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (error: any) {
      console.error("error", error);
      setError(error.response.data.message);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (location.city) {
      form.setFieldsValue({ city: location.city });
    }
    if (location.street) {
      form.setFieldsValue({ street: location.street });
    }
  }, [location, form]);

  return (
    <div className="text-white bg-green-600 w-full h-full relative flex items-center justify-center gap-12 py-8">
      <div className="absolute left-0 top-0 flex items-center gap-2">
        <GiTridentShield className="text-orange-500 size-20" />
        <h1 className="text-white text-3xl font-medium">REGISTRATION</h1>
      </div>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, #168361 20%, transparent 80%)",
        }}
        className="w-11/12 mt-20 p-4 lg:p-12 rounded-xl m-auto flex justify-center items-center"
      >
        <div
          style={{
            boxShadow: "0 10px 100px rgba(0, 0, 10, 5)",
            backgroundImage:
              "linear-gradient(to right, #2fa07c 20%, transparent 80%)",
          }}
          className="relative flex-wrap justify-center  rounded-xl p-4 lg:p-12 flex gap-12 flex w-full lg:w-10/12"
        >
          <div className="absolute inset-0 backdrop-blur-lg z-10 rounded-lg"></div>
          <Form
            form={form}
            layout="vertical"
            className="w-full text-white relative z-20"
            name="basic"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <h1 className="text-2xl mb-4">Please Input all Providers</h1>
            <div className="flex items-center gap-2">
              <Checkbox
                type="checkbox"
                checked={isAdminRegistration}
                onChange={toggleAdminRegistration}
              />
              <label className="text-white">Register as Admin</label>
            </div>
            {isAdminRegistration && (
              <Form.Item
                name="adminSecret"
                rules={[
                  {
                    required: true,
                    message: "Please provide the admin secret!",
                  },
                ]}
              >
                <Input
                  className="border rounded p-2"
                  type="password"
                  placeholder="Admin Secret"
                />
              </Form.Item>
            )}
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                name="username"
                className="border rounded p-2"
                placeholder="UserName"
              />
            </Form.Item>
            <Form.Item
              name="lastname"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input className="border rounded p-2" placeholder="LastName" />
            </Form.Item>
            <Form.Item
              name="phonenumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input
                className="border rounded p-2"
                type="number"
                maxLength={9}
                placeholder="PhoneNumber"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}
            >
              <Input className="border rounded p-2" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                className="border rounded p-2"
                type="password"
                autoComplete="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="repeatPassword"
              rules={[
                { required: true, message: "Please repeat your password!" },
              ]}
            >
              <Input
                className="border rounded p-2"
                type="password"
                autoComplete="repeatPassword"
                placeholder="repeatPassword"
              />
            </Form.Item>
            <div>Location:</div>
            <Form.Item
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input className="border rounded p-2" placeholder="City" />
            </Form.Item>
            <div>Street:</div>
            <Form.Item
              name="street"
              rules={[{ required: true, message: "Please input your street!" }]}
            >
              <Input className="border rounded p-2" placeholder="Street" />
            </Form.Item>
            {error && (
              <div className="text-red-700 bg-red-200 border border-white rounded-xl p-4 w-40 text-center mt-2">
                {error}
              </div>
            )}
            <>
              <Button
                className="flex items-center"
                type="primary"
                onClick={showModal}
              >
                Open Map
                <FaMapMarkedAlt className="size-6" />
              </Button>
              <Modal
                title={
                  <>
                    <div className="flex gap-2 items-center text-2xl">
                      <FaMapMarkedAlt className="text-yellow-500" />
                      <h1 className="text-black">Add your Current Position</h1>
                    </div>
                  </>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <GoogleMap />
              </Modal>
            </>
            <div className="w-full flex flex-col items-center gap-2">
              <Button
                className="border-none font-medium flex items-center gap-2 rounded-xl w-full py-5 text-white bg-blue-500 hover:bg-blue-600 hover:shadow-xl mt-4"
                type="primary"
                loading={pending}
                htmlType="submit"
              >
                Submit
              </Button>
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-400"></div>
                <p className="text-gray-300 mb-1">Already Member?</p>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>
              <Button
                onClick={() => router.push("/login")}
                className="flex items-center py-5 rounded-xl bg-blue-500 border-none text-white font-medium w-full"
              >
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
