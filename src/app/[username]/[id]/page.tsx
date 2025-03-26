"use client";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FiInstagram } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { CgMoreO } from "react-icons/cg";
import { useFollow } from "@/app/hooks/useFollow";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdMoreHoriz } from "react-icons/md";
import PostDetails from "@/Components/PostDetails";

export default function UserProfilePage() {
  const { id } = useParams();

  const loggeduser = localStorage.getItem("userId");

  const { data: user } = useQuery({
    queryKey: ["singleUsers", id],
    queryFn: async () => {
      const response = await axios.get(`/api/external/users/${id}`);
      console.log("response", response.data.user);
      return response.data.user;
    },
    enabled: !!id,
  });

  const { data: notifi } = useQuery({
    queryKey: ["notofication", loggeduser],
    queryFn: async () => {
      const response = await axios.get(
        `api/external/users/notification/${loggeduser}`
      );
      return response.data;
    },
    enabled: !!loggeduser,
  });

  const followMutation = useFollow();
  const router=useRouter()

  return (
    <>
      <div className="bg-gray-50 min-h-screen ">
        <div className="flex justify-between items-center py-4 max-w-2xl mx-auto">
          <button className="transition-transform duration-300 hover:scale-110 "
               onClick={()=>router.back()}>
            <IoArrowBackOutline  className="text-xl shadow-md rounded-full w-6 h-6" />
          </button>

          <h1 className=" text-xl">{user?.username}</h1>
          <div className="mr-3 transition-transform duration-300 hover:scale-110">
            <MdMoreHoriz  className="text-xl shadow-md rounded-full w-6 h-6  " />
          </div>
        </div>
        <div className="relative flex flex-col border max-w-2xl rounded-[30px]   mx-auto bg-white shadow-sm ">
          <div className=" absolute top-4 right-4">
            <img
              src={user?.profilePic || "defaultImage.jpg"}
              alt="profile"
              className="w-20 h-20 rounded-full m-5 object-cover"
            />
            <div className="flex justify-around mt-8">
              <button>
                <FiInstagram className="text-2xl font-semibold" />
              </button>
              <button>
                <GoBell className="text-2xl font-semibold" />
              </button>
              <button>
                <CgMoreO className="text-2xl font-semibold" />
              </button>
            </div>
          </div>
          <div className="flex flex-col px-8 py-6">
            <div className="font-bold text-2xl">{user?.name}</div>
            <div className="text-lg">{user?.username}</div>
            <div className="py-4 text-lg">{user?.bio}</div>
            <div className="text-lg text-gray-300">
              {user?.followers.length} followers
            </div>
          </div>
          <div className="flex justify-around w-full p-3">
            <div className="m-3 w-full">
              <button
                onClick={() => followMutation.mutate(user._id)}
                className="bg-black text-white w-full rounded-lg font-semibold  py-2"
              >
                Follow
              </button>
            </div>
            <div className="m-3 w-full ">
              <button className="border font-semibold w-full rounded-lg  py-2 ">
                Mention
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}
