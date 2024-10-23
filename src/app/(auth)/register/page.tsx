"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GiTridentShield } from "react-icons/gi";
import { GoogleMap } from "@/app/Components/GoogleMap";
import { Input, Button, Spin, Form } from "antd";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

function Register() {
  const [form] = Form.useForm();
  const { location } = useGlobalProvider();
  const router = useRouter();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (values: any) => {
    const {
      username,
      email,
      password,
      repeatPassword,
      lastname,
      phonenumber,
      city,
      street,
    } = values;

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
    <div className="text-white bg-gray-800 w-full h-full relative flex items-center justify-center flex-wrap gap-12 py-8">
      <div
        style={{
          boxShadow: "0 10px 100px rgba(0, 0, 10, 5)",
        }}
        className="mt-20 border rounded-xl p-12 flex gap-12 flex-wrap w-10/12"
      >
        <div className="absolute left-0 top-0 flex items-center gap-2">
          <GiTridentShield className="text-orange-500 size-20" />
          <h1 className="text-white text-3xl font-medium">REGISTRATION</h1>
        </div>

        <Form
          form={form}
          className="flex flex-col w-full text-white lg:w-2/4"
          name="basic"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <h1 className="text-2xl mb-4">Please Input all Providers</h1>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
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
            rules={[{ required: true, message: "Please input your password!" }]}
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
          <Button
            className="border-none flex items-center gap-2 rounded-xl w-full py-5 text-white bg-blue-500 hover:bg-blue-600 hover:shadow-xl mt-4"
            type="primary"
            loading={pending}
            htmlType="submit"
          >
            Submit
          </Button>
        </Form>
        <GoogleMap />
      </div>
    </div>
  );
}

export default Register;
