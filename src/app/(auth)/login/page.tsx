"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Form, Input, Button, Typography } from "antd";
import { GiTridentShield } from "react-icons/gi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

function SignIn() {
  const [info, setInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  async function handleSubmit() {
    if (!info.email || !info.password) {
      setError("Please input all fields");
      return;
    }
    try {
      setPending(true);
      const resp = await signIn("credentials", {
        email: info.email,
        password: info.password,
        redirect: false,
      });
      if (resp?.error) {
        setError("Invalid input values");
        setPending(false);
        return;
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      setError("Invalid input values");
      setPending(false);
      console.log("error", error);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex relative text-white py-16  bg-green-600 justify-center h-screen">
      <div className="absolute left-0 top-0 flex items-center gap-2">
        <GiTridentShield className="text-orange-500 size-20" />
        <h1 className="text-white text-3xl font-medium">SIGN IN</h1>
      </div>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, #168361 20%, transparent 80%)",
        }}
        className="relative w-11/12 mt-4 h-10/12 flex items-center justify-center rounded-xl p-2"
      >
        <Image
          className="absolute top-60 object-contain lg:w-3/6 left-0 top-20 z-10"
          src="/pngimg.com - lamborghini.png"
          alt="img"
          width={1000}
          height={300}
        />
        <div className="relative w-10/12 md:w-1/2">
          <div className="absolute inset-0 backdrop-blur-lg z-10 rounded-lg"></div>
          <Form
            onFinish={handleSubmit}
            layout="vertical"
            style={{
              boxShadow: "0 10px 100px rgba(0, 0, 10, 5)",
            }}
            className=" p-4 z-20 relative h-fit text-white rounded shadow-lg flex flex-col"
          >
            <h1 className="text-center text-3xl font-medium">
              Log in your Account
            </h1>

            <p className="mb-2">Email:</p>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                name="email"
                type="text"
                onChange={handleInput}
                autoComplete="email"
                placeholder="Enter your email"
              />
            </Form.Item>
            <p className="mb-2">Password:</p>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                name="password"
                onChange={handleInput}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </Form.Item>

            {error && (
              <Text className="mb-2" type="danger">
                {error} !
              </Text>
            )}
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={pending}
            >
              {pending ? "Logging in..." : "Log in"}
            </Button>
            <p className="text-center text-gray-200 py-2">dont have account?</p>
            <div className="h-px bg-gray-500 w-full mb-4"></div>
            <Button
              onClick={() => router.push("/register")}
              type="primary"
              className="w-full"
            >
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
