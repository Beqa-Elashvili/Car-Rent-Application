"use client";

import { signOut, useSession } from "next-auth/react";
import { Popover, Avatar, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { CiUser } from "react-icons/ci";
import { FaCarTunnel } from "react-icons/fa6";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

const UserProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { ReserveCars, reservedTracks } = useGlobalProvider();

  if (status === "loading") {
    return (
      <div>
        <Spin indicator={<LoadingOutlined spin />} />
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const content = (
    <div className="flex flex-col gap-2">
      <Button
        className="font-medium p-2 rounded hover:text-red-500"
        onClick={() => router.push("/pages/orders")}
      >
        orders
      </Button>
      <Button
        className="font-medium text-red-600 p-2 rounded hover:text-red-500"
        onClick={() => handleSignOut()}
      >
        Log Out
      </Button>
    </div>
  );

  return (
    <div className="flex items-center">
      {!session ? (
        <button
          onClick={() => router.push("/login")}
          className="p-2 rounded-full font-mono text-white hover:bg-orange-600 bg-orange-500 relative text-white border-none flex items-center"
        >
          <Avatar className="bg-orange-700" icon={<UserOutlined />} />
          <h1 className="text-xl hidden lg:inline ml-2">Sign in</h1>
        </button>
      ) : (
        <div className="flex gap-4">
          <Popover content={content} placement="bottom" trigger="hover">
            <button className="hover:text-green-500 w-6">
              <CiUser className="size-8" />
            </button>
          </Popover>
          <button
            onClick={() => router.push("/pages/reserveCars")}
            className="hover:text-green-500 relative p-2"
          >
            <FaCarTunnel className="size-8" />
            <div className="absolute top-0 right-0 bg-yellow-500 p-2 rounded-full h-6 w-6 flex items-center justify-center">
              {reservedTracks.length + ReserveCars.length}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
