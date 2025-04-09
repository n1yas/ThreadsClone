"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiInstagram } from "react-icons/fi";
import { BiBarChartSquare } from "react-icons/bi";
import { BsAppIndicator } from "react-icons/bs";
import { FiCamera } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import Link from "next/link";
import UploadpostModal from "@/Components/Uploadpost";
import EditProfile from "@/Components/EditProfile";
import PostDetails from "@/Components/PostDetails";
import Repost from "@/Components/Repost";
import apiClient from "@/api/axiosInstance";
import Image from "next/image";
import Replies from "@/Components/Replies";

const fetchUsers = async (userId: string | null) => {
  if (!userId) {
    throw new Error("User is not found");
  }
  const response = await apiClient.get(`/users/${userId}`);

  return response.data?.user;
};

export default function User() {
  const [selected, setSelected] = useState("Threads");

  const [userId, setUserId] = useState<string | null>(null);

  const [plusIsOpen, setPlusIsOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
  }, []);

  const { data: user } = useQuery({
    queryKey: ["currentUser", userId],
    queryFn: () => fetchUsers(userId),
    enabled: !!userId,
  });

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {plusIsOpen && (
          <UploadpostModal
            plusIsOpen={plusIsOpen}
            setPlusIsOpen={setPlusIsOpen}
            user={user}
          />
        )}
        <div className="flex justify-center py-4 ">
          <h3 className="text-base font-semibold">Profile</h3>
        </div>
        <div className="flex flex-col border max-w-2xl rounded-[30px] py-2 mt-8 mx-auto bg-white ">
          <div className="flex flex-col w-full p-5">
            <div className="flex  justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{user?.name}</p>
                <p>{user?.username}</p>
                <p className="mt-4">{user?.bio}</p>
                <p className="text-gray-400 mt-5">
                  {user?.following.length} followers
                </p>
              </div>
              <div className="flex flex-col">
                <Image
                height={80}
                width={80}
                  src={user?.profile ? user.profilePic : "/defaultImage.jpg"}
                  alt="profilepic"
                  className=" object-cover rounded-full"
                />
                <div className="flex justify-center py-4 ">
                  <BiBarChartSquare className="text-3xl m-1" />
                  <Link href={"https://www.instagram.com"}>
                    <FiInstagram className="text-3xl m-1 " />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setEditOpen(true)}
                className="w-full border rounded-lg  font-bold p-2"
              >
                Edit profile
              </button>
              <EditProfile editOpen={editOpen} setEditOpen={setEditOpen} />
            </div>
          </div>
          <div className="flex justify-around font-bold text-base">
            {["Threads", "Replies", "Repost"].map((item) => (
              <div
                key={item}
                className={`flex-1 text-center cursor-pointer border-b ${
                  selected === item
                    ? "text-black font-semibold border-b border-black"
                    : "text-gray-400"
                }`}
                onClick={() => setSelected(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <div>
            {selected === "Threads" && (
                  <>
              <div className=" mx-auto bg-white  rounded-lg">
                <div className="flex justify-between items-center border-b py-4 px-6 ">
                  <p className="text-gray-500 font-medium">What's new?</p>
                  <button
                    onClick={() => setPlusIsOpen(true)}
                    className="w-20 bg-black text-white rounded-lg font-semibold border-2 p-2 ml-auto"
                  >
                    Post
                  </button>
                </div>

                <div className="p-6">
                  <p className="font-bold text-lg mb-4">Finish your Profile</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-5 rounded-lg text-center shadow-sm">
                      <div className="flex justify-center items-center bg-white w-16 h-16 rounded-full shadow-md mx-auto">
                        <BsAppIndicator className="text-2xl text-gray-600" />
                      </div>
                      <h2 className="font-semibold mt-3">Create Threads</h2>
                      <p className="text-sm text-gray-500">
                        Say what's on your mind or share a recent highlight.
                      </p>
                      <button
                        onClick={() => setPlusIsOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg mt-3"
                      >
                        Create
                      </button>
                    </div>

                    <div className="bg-gray-100 p-5 rounded-lg text-center ">
                      <div className="flex justify-center items-center bg-white w-16 h-16 rounded-full mx-auto">
                        <FiCamera className="text-2xl text-gray-600" />
                      </div>
                      <h2 className="font-semibold mt-3">Add Profile Photo</h2>
                      <p className="text-sm text-gray-500">
                        Make it easier for people to recognize you.
                      </p>
                      <button
                        onClick={() => setEditOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg mt-8 "
                      >
                        Add
                      </button>
                      <EditProfile
                        editOpen={editOpen}
                        setEditOpen={setEditOpen}
                      />
                    </div>

                    <div className="bg-gray-100 p-5 rounded-lg text-center shadow-sm">
                      <div className="flex justify-center items-center bg-white w-16 h-16 rounded-full shadow-md mx-auto">
                        <RiPencilLine className="text-2xl text-gray-600" />
                      </div>
                      <h2 className="font-semibold mt-3">Add Bio</h2>
                      <p className="text-sm text-gray-500">
                        Introduce yourself and tell people what you're into.
                      </p>
                      <button
                        onClick={() => setEditOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg mt-3"
                      >
                        Add
                      </button>

                      <EditProfile
                        editOpen={editOpen}
                        setEditOpen={setEditOpen}
                      />

                    </div>
                  </div>
                </div>
              </div>
             <PostDetails /> 
              </>
            )}
          </div>
           {selected === "Repost" && <Repost />}
           {selected === "Replies" && <Replies/>}
        </div>
      </div>
    </>
  );
}
