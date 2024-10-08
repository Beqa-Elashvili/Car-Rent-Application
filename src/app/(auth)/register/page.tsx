"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();
  const [info, setInfo] = useState({ username: "", email: "", password: "" });
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
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        <div>
          <input
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
          <input
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
          <input
            className="border rounded p-2"
            name="password"
            type="password"
            value={info.password}
            onChange={handleInput}
            autoComplete="current-password"
            placeholder="Password"
          />
        </div>
        {error && (
          <div className="text-red-700 bg-red-200 border border-white rounded-xl p-4 w-40 text-center mt-2">
            {error}
          </div>
        )}
        <button
          className="border w-40 text-white bg-blue-500 mt-4"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Register;
