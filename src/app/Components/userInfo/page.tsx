"use client";

import { signOut, useSession } from "next-auth/react";
import { Popover, Avatar } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { CiUser } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import { FaCarTunnel } from "react-icons/fa6";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";

const UserProfile = () => {
  const rounter = useRouter();
  const { data: session, status } = useSession();

  const { ReserveCars } = useGlobalProvider();

  if (status === "loading") {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  const content = (
    <div>
      <button
        className="font-medium p-2 rounded hover:text-red-500"
        onClick={() => signOut()}
      >
        Log Out
      </button>
    </div>
  );

  return (
    <div className="flex items-center">
      {!session ? (
        <button
          onClick={() => rounter.push("/register")}
          className="p-1 px-2 relative text-white border-none flex items-center"
        >
          <span className="absolute left-0 border  border-gray-400 h-full"></span>
          <Avatar className="bg-orange-700" icon={<UserOutlined />} />
          <h1 className="text-xl hidden lg:inline ml-2">Sign Up</h1>
          <span className="absolute right-0 border border-gray-400 h-full"></span>
        </button>
      ) : (
        <div className="flex gap-4">
          <Popover content={content} placement="bottom" trigger="hover">
            <button className="hover:text-green-500 w-6">
              <CiUser className="size-8" />
            </button>
          </Popover>
          <button className="hover:text-green-500 w-6">
            <MdFavoriteBorder className="size-8" />
          </button>
          <button className="hover:text-green-500 relative p-2">
            <FaCarTunnel className="size-8" />
            <div className="absolute top-0 right-0 bg-yellow-500 p-2 rounded-full h-6 w-6 flex items-center justify-center">
              {ReserveCars?.length}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
