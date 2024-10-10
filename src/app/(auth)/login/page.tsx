"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import UserProfile from "@/app/Components/userInfo/page";

function SignIn() {
  const [info, setInfo] = useState({ email: "", password: "" });
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
    if (!info.email || !info.password) {
      setError("please input all providers");
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
      }
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        <h1>Sign In</h1>
        <div>
          <input
            className="border rounded p-2"
            name="email"
            type="text"
            onChange={handleInput}
            autoComplete="username"
            placeholder="Username"
          />
        </div>
        <div>
          <input
            className="border rounded p-2"
            name="password"
            type="password"
            onChange={handleInput}
            autoComplete="password"
            placeholder="Password"
          />
        </div>
        {error && <div>{error}</div>}

        <button
          onSubmit={handleSubmit}
          className="border w-40 text-white bg-blue-500 mt-4"
          type="submit"
        >
          {pending ? "loging" : "log in"}
        </button>
      </form>
      <UserProfile />
    </div>
  );
}
export default SignIn;
