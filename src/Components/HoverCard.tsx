import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/axiosInstance";

export default function HoverCard({  userId }) {
  const popupRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${userId}`);
      console.log(response.data);
      
      return response.data.user;
    },
    enabled:!!userId
  });

  return (
    <div className="absolute inline-block">

      {user && (
        <div
          ref={popupRef}
          className="absolute ml-14 left-0 top-10 w-64 bg-white shadow-lg rounded-lg p-4 z-50 border  "
        >
          <div className="flex items-center space-x-3 ">
            <img
              src={user?.profilePic || "defaultImage.jpg"}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover "
            />
            <div>
              <p className="py-1">{user?.name}</p>
              <p className="text-gray-500">@{user?.username}</p>
              <p className="py-1">{user?.bio}</p>
              <p>{user?.following?.length} Followers </p>
            </div>
          </div>
          <button className="mt-3 w-full bg-black text-white py-1 px-3 rounded">
            Follow
          </button>
        </div>
      )}
    </div>
  );
}
