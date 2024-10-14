"use client";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

export default function Page() {
  const { saleProducts } = useGlobalProvider();
  return <button className="sfdfd ">this is view</button>;
}
