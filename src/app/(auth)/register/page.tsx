"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHandPeace } from "react-icons/fa";
import { GiTridentShield } from "react-icons/gi";
import { GoogleMap } from "@/app/Components/GoogleMap";
import { Input, Button } from "antd";

function Register() {
  const router = useRouter();
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
    lastname: "",
    phonenumber: "",
  });
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const handleInput = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  async function handleSubmit(e: {
    [x: string]: any;
    preventDefault: () => void;
  }) {
    e.preventDefault();
    const { username, email, password } = info;
    if (!username || !email || !password) {
      setError("please input all providers");
      return;
    }
    try {
      setPending(true);
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      if (res.ok) {
        setPending(false);
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        setPending(false);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  }

  return (
    <div className="text-white bg-gray-800 w-full h-screen relative flex items-center justify-center flex-wrap gap-12">
      <div className=" mt-20 border rounded-xl p-12 flex gap-12 flex-wrap w-10/12">
        <div className="absolute left-0 top-0 flex items-center gap-2">
          <GiTridentShield className="text-orange-500 size-20" />
          <h1 className="text-white text-3xl font-medium">REGISTRATION</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full lg:w-2/4"
        >
          <h1 className="text-2xl ">Please Input all Providers</h1>
          <div>
            <Input
              className="border rounded p-2"
              name="username"
              type="text"
              value={info.username}
              onChange={handleInput}
              autoComplete="username"
              placeholder="UserName"
            />
          </div>
          <div>
            <Input
              className="border rounded p-2"
              name="lastname"
              type="text"
              value={info.lastname}
              onChange={handleInput}
              autoComplete="username"
              placeholder="LastName"
            />
          </div>
          <div>
            <Input
              className="border rounded p-2"
              name="phonenumber"
              type="number"
              value={info.phonenumber}
              onChange={handleInput}
              autoComplete="phoneNumber"
              placeholder="PhoneNumber"
            />
          </div>
          <div>
            <Input
              className="border rounded p-2"
              name="email"
              type="email"
              value={info.email}
              onChange={handleInput}
              autoComplete="email"
              placeholder="Email"
            />
          </div>
          <div>
            <Input
              className="border rounded p-2"
              name="password"
              type="password"
              value={info.password}
              onChange={handleInput}
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>

          <Button
            className="border-none rounded-xl  w-full py-4 text-white bg-blue-500 hover:bg-blue-600 hover:shadow-xl mt-4"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <div className="h-12">
            {error && (
              <div className="text-red-700 bg-red-200 border border-white rounded-xl p-4 w-40 text-center mt-2">
                {error}
              </div>
            )}
          </div>
        </form>
        <GoogleMap />
      </div>
    </div>
  );
}

export default Register;
