"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GiTridentShield } from "react-icons/gi";
import { GoogleMap } from "@/app/Components/GoogleMap";
import { Input, Button, Form, Modal } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { FaMapMarkedAlt } from "react-icons/fa";

function Register() {
  const [form] = Form.useForm();
  const { location } = useGlobalProvider();
  const router = useRouter();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values: any) => {
    const { email, city, street } = values;

    if (values.phonenumber.length !== 9) {
      form.setFields([
        {
          name: "phonenumber",
          errors: ["ნომერი უნდა შედგებოდეს 9 რიცხვისაგან"],
        },
      ]);
      return;
    }
    if (values.password !== values.repeatPassword) {
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

    try {
      setPending(true);
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        localStorage.setItem("city", city);
        localStorage.setItem("street", street);
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.log("error", error);
      setError("An error occurred while registering.");
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
  }, [location]);

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
        className="w-11/12 mt-20 p-2 lg:p-12 rounded-xl m-auto flex justify-center items-center"
      >
        <div
          style={{
            boxShadow: "0 10px 100px rgba(0, 0, 10, 5)",
            backgroundImage:
              "linear-gradient(to right, #2fa07c 20%, transparent 80%)",
          }}
          className="relative flex-wrap jsutify-center  rounded-xl p-12 flex gap-12 flex w-10/12"
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
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input className="border rounded p-2" placeholder="UserName" />
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
              <Button type="primary" onClick={showModal}>
                Open Modal
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
                <p className="text-gray-300 mb-1">or</p>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>
              <Button
                onClick={() => signIn("google")}
                className="flex items-center font-medium py-5 rounded-xl w-full"
              >
                <FcGoogle className="size-6" />
                Sign up with Google
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
