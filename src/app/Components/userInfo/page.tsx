"use client";

import { signOut, useSession } from "next-auth/react";
import { Popover, Avatar } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const UserProfile = () => {
  const rounter = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  const content = (
    <div className="flex flex-col gap-2">
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
          <h1 className="text-xl ml-2">Sign Up</h1>
          <span className="absolute right-0 border border-gray-400 h-full"></span>
        </button>
      ) : (
        <>
          <Popover content={content} placement="bottom" trigger="hover">
            <button>
              <Avatar.Group>
                <Avatar style={{ backgroundColor: "#f56a00" }}>
                  {(
                    session.user.username?.[0] ||
                    session.user.name?.[0] ||
                    ""
                  ).toUpperCase()}
                </Avatar>
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
              </Avatar.Group>
            </button>
          </Popover>
        </>
      )}
    </div>
  );
};

export default UserProfile;
