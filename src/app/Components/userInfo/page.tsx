"use client";

import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in</div>;
  }

  return (
    <div className="px-2">
      <h1>Welcome, {session?.user?.username}</h1>
      <p>Email: {session?.user?.email}</p>
      <button
        className="bg-rose-500 p-2 w-20  rounded-xl hover:bg-rose-400"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
