import apiClient from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useParams, usePathname } from "next/navigation";
import {
  FiMessageCircle,
  FiMoreHorizontal,
  FiRepeat,
  FiSend,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import LikeButton from "./LikeButton";
import HoverCard from "./HoverCard";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Repost() {
  const [hoveredUserId, setHoveredUserId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { id: currentUserId } = useParams();
  const pathname = usePathname();
  const dynamicUserId =
    pathname.includes("/user") && user?._id ? user._id : currentUserId;

  const { data: repost, error } = useQuery({
    queryKey: ["repost"],
    queryFn: async () => {
      const response = await apiClient.get(`/posts/repost/${dynamicUserId}`);
      console.log("repost", response.data)
      return response.data.posts;
    },
  });
  const timeoutRef = useRef(null);

  const handleMouseEnter = (postid) => {
    setHoveredUserId(postid);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredUserId(null);
    }, 300);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white ">
        {repost && repost.length > 0 ? (
          repost?.map((item) => (
            <div
              key={item._id}
              className="flex flex-col space-y-2 pb-6 border-b border-gray-300 last:border-b-0 "
            >
              <div className="flex items-center justify-between space-x-3 p-3">
                <div className="flex gap-2">
                  <img
                    src={item.postById.profilePic || "/defaultImage.jpg"}
                    alt="profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <div className="flex ">
                    <div className="flex">
                      <div className="font-medium">
                        <Link
                          onMouseEnter={() => handleMouseEnter(item._id)}
                          onMouseLeave={handleMouseLeave}
                          href={`/@${item.postById.username}/${item.postById._id}`}
                          className="hover:underline"
                        >
                          {item.postById.name}
                        </Link>
                        <div className="text-xs sm:text-sm text-gray-800">
                          {item.text}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-1">
                      {formatDistanceToNow(new Date(item.createdOn)).replace(
                        "about ",
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xl flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-200 transition cursor-pointer">
                  <FiMoreHorizontal />
                </div>
              </div>

              {hoveredUserId === item._id && (
                <HoverCard userId={item.postById._id} />
              )}

              {item.image && (
                <div className="flex justify-center">
                  <img
                    src={item.image}
                    alt="image"
                    className="w-full max-w-[90%] sm:max-w-[80%] h-auto rounded-lg"
                  />
                </div>
              )}

              <div className="relative flex ml-6 sm:ml-14 gap-2 sm:gap-4">
                <LikeButton userId={user?._id} item={item} />

                <div className="p-2 text-lg sm:text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                  <FiMessageCircle />
                  <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Comment
                  </span>
                </div>

                <div className="p-2 text-lg sm:text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                  <FiRepeat />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Repeat
                  </span>
                </div>

                <div className="p-2 text-lg sm:text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                  <FiSend />
                  <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Share
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-center text-gray-500">
            No repost yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
