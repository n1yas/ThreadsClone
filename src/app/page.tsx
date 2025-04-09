"use client";

import { useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FiMessageCircle } from "react-icons/fi";
import { FiRepeat } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";
import Uploadpost from "@/Components/Uploadpost";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImSpinner3 } from "react-icons/im";
import { IoPersonCircle } from "react-icons/io5";
import Link from "next/link";
import HoverCard from "@/Components/HoverCard";
import LikeButton from "@/Components/LikeButton";
import apiClient from "@/api/axiosInstance";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
interface Post {
  _id: string;
  text: string;
  likes: string[];
  image: string;
  createdOn: string;
  postById: {
    name: string;
    username: string;
    profilePic: string;
    _id: string;
  };
}

export default function Home() {
  const timeoutRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const { user } = useSelector((state) => state.auth);
  const router = useRouter()

  const [hoveredUserId, setHoveredUserId] = useState(null);

  const [plusIsOpen, setPlusIsOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["allPost"],
    queryFn: async () => {
      const res = await apiClient.get("/posts");
      return res.data.posts;
    },
  });

  const handleMouseEnter = (postid) => {
    setHoveredUserId(postid);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredUserId(null);
    }, 300);
  };

  
  
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const handleChange = (e) => {
    setCommentText(e.target.value);
  };
  
  const commentMutation = useMutation<unknown, unknown, CommentPayload>({
    mutationKey: ["comment"],
    mutationFn: async ({ postId, replyData }) => {
      const response = await apiClient.post(
        `/posts/${postId}/reply`,
        replyData
      );
      console.log("re", replyData);
      return response.data;
    },
  });

  const hanldePost = (postid:string)=> {
    router.push(`/post/${postid}`)
  }


  return (
    <div className="flex flex-col min-h-screen p-3 bg-gray-50">
      <div className="text-center text-black text-base font-semibold py-4">
        For you
      </div>

      <div className="flex justify-center">
        <main className="flex flex-grow justify-center w-full max-w-2xl mx-auto rounded-[30px] border bg-white p-4 sm:p-6 ">
          <div className="flex flex-col w-full space-y-4">
            <div className="flex border-b justify-between p-3 sm:p-5">
              <button onClick={() => setPlusIsOpen(true)}>
                <IoPersonCircle className="text-gray-300 text-4xl sm:text-5xl" />
              </button>
              <Uploadpost
                plusIsOpen={plusIsOpen}
                setPlusIsOpen={setPlusIsOpen}
              />

              <p className="text-gray-400 font-medium flex items-center text-sm sm:text-base">
                What's new
              </p>

              <button
                onClick={() => setPlusIsOpen(true)}
                className="w-16 sm:w-20 text-black rounded-lg font-semibold border-2 p-2 ml-auto"
              >
                Post
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center w-full min-h-[60vh]">
                <ImSpinner3 className="animate-spin text-xl" />
              </div>
            ) : (
              posts?.map((item) => (
                <div
                  onClick={()=> hanldePost(item._id)}                                  
                  key={item._id}
                  className=" flex flex-col space-y-2 pb-6 border-b border-gray-300 last:border-b-0"
                >
                  <div className=" flex items-center justify-between space-x-3 p-3">
                    <div className="flex gap-2">
                      <img
                        src={item.postById.profilePic || "defaultImage.jpg"}
                        alt="profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">
                          <Link
                            onMouseEnter={() => handleMouseEnter(item._id)}
                            onMouseLeave={handleMouseLeave}
                            href={`@${item.postById.username}/${item.postById._id}`}
                            className="hover:underline"
                          >
                            {item.postById.name}
                          </Link>
                          <div className="text-xs sm:text-sm text-gray-800">
                            {item.text}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 -mt-4">
                          {formatDistanceToNow(
                            new Date(item.createdOn)
                          ).replace("about ", "")}
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
                    <div
                    onClick={(e)=> e.stopPropagation()}
                    className="flex justify-center">
                      <img
                        src={item.image}
                        alt="image"
                        className="w-full max-w-[90%] sm:max-w-[80%] h-auto rounded-lg"
                      />
                    </div>
                  )}

                  <div 
                                      onClick={(e)=> e.stopPropagation()}

                  className="relative flex ml-6 sm:ml-14 gap-2 sm:gap-4">
                    <LikeButton userId={userId} item={item} />

                    <div
                      onClick={() => setCommentModal(true)}
                      className="p-2 text-lg sm:text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative"
                    >
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
