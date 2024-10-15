"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

export default function Page() {
  const { collections } = useGlobalProvider();
  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center flex-wrap">
      {collections.map((item) => (
        <img className="w-40" src={item.logo} alt="" />
      ))}
    </div>
  );
}
