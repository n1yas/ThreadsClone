"use client";

import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ImSpinner3 } from "react-icons/im";
import { useDebounce } from "use-debounce";
import FollowButton from "@/Components/FollowButton";
import apiClient from "@/api/axiosInstance";

const fetchUsers = async (searchText: string) => {
  if (!searchText.trim()) return [];

  const response = await apiClient.get("/users");
  return response.data.users || [];
};

export default function SearchBar() {
  interface User {
    name: string;
    username: string;
    profilePic: string;
    bio: string;
  }

  const [text, setText] = useState("");

  const [debounceText] = useDebounce(text, 1000);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", debounceText],
    queryFn: () => fetchUsers(debounceText),
    enabled: !!debounceText.trim(),
  });

  const searchedUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(text.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-black ">
      <div className="flex justify-center py-6">
        <h1 className="text-lg font-semibold text-black dark:text-white">
          Search
        </h1>
      </div>
      <div
        className="flex flex-col items-center max-w-2xl mx-auto rounded-[30px] border dark:bg-black dark:border-gray-200 dark:text-white
       border-gray-300 py-2 px-4 sm:px-6 md:px-8 bg-white w-full sm:w-[90%] md:w-[80%] lg:w-[70%]"
      >
        <div className="relative flex items-center w-full p-5">
          <FiSearch className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search "
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border px-10 py-2 flex-grow outline-none w-full  rounded-[15px] bg-gray-50 dark:bg-black dark:border-gray-300"
          />
        </div>

        {isLoading && <ImSpinner3 className="animate-spin text-lg" />}

        {isError && <p className="mt-4 text-red-500">Error fetching users.</p>}

        <div className=" flex flex-col mt-4 w-full">
          {searchedUsers.length > 0 ? (
            <ul className=" rounded-lg p-4">
              {searchedUsers.map((user: any) => (
                <li key={user._id} className="flex  p-2 border-b py-3">
                  <img
                    src={user.profilePic || "defaultImage.jpg"}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover mx-3 "
                  />
                  <div className="flex flex-col">
                    <Link href={`@${user.username}/${user._id}`}>
                      {user.username}
                    </Link>
                    <p className="text-gray-400">{user.name}</p>
                    <p>{user.bio}</p>
                  </div>
                  <div className="flex justify-end  items-center w-full">
                    <div className="w-28">
                      <FollowButton user={user} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-10 flex justify-center">No user found</p>
          )}
        </div>
      </div>
    </div>
  );
}
