"use client";

import { signOut, useSession } from "next-auth/react";
import { Popover, Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { GiTridentShield } from "react-icons/gi";
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
        className="bg-rose-500 p-2 rounded hover:bg-rose-400"
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
          className="p-1 px-4 bg-orange-400 text-white border-none rounded-xl hover:shadow: hover:bg-orange-600 flex items-center"
        >
          <h1 className="text-xl">Sign Up</h1>
          <GiTridentShield />
        </button>
      ) : (
        <>
          <Popover content={content} placement="bottom" trigger="click">
            <button>
              <Avatar.Group>
                <Avatar style={{ backgroundColor: "#f56a00" }}>
                  {session.user.username}
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
