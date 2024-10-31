"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
import { TCollecttion } from "@/app/Providers/GlobalProvider/GlobalContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { collections } = useGlobalProvider();
  const router = useRouter();
  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center flex-wrap gap-2">
      {collections?.map((item: TCollecttion, index: number) => (
        <div
          onClick={() => router.push(`/pages/brands/${item.name}`)}
          className="p-2 flex flex-col items-center border object-contain rounded-xl transition duration-300 hover:bg-gray-500  hover:cursor-pointer"
        >
          <img
            key={index}
            className="h-60 w-60 object-contain"
            src={item.logo}
            alt="brand-logo"
          />
          <h1 className="text-3xl font-medium text-white">
            {item.name?.toUpperCase()}
          </h1>
        </div>
      ))}
    </div>
  );
}
