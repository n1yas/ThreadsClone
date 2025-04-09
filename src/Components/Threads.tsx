import { FiMessageCircle, FiRepeat, FiSend } from "react-icons/fi";
import LikeButton from "./LikeButton";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/axiosInstance";
import { useParams, } from "next/navigation";
import { useState } from "react";

export default function Threads() {

    interface Post {
        id: string;
        text: string;
        image: string;
        likes: string;
        createdOn: string;
        postById:{
            profilePic:string;
        }
      }
      const[imageFull,setImageFull]=useState(false)

    const{username:user}=useParams()
    const userId=localStorage.getItem("userId")

    const currentUser= typeof user === "string" && user.replace("%40", "")
    const{id}=useParams()

     const { data: post } = useQuery({
        queryKey: ["userspost", id],
        queryFn: async () => {
          const response = await apiClient.get(`/posts/${id}`);
          console.log("post",response.data)
          return response.data.post;
        },
      });


  return (
    <>
      <div>
          <div className="flex flex-col space-y-2 pb-6 w-full mx-auto">
            {post?.length > 0 ? (
              post.map((item: Post) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg mb-4 mx-auto"
                >
                  <div className="flex items-center w-full px-4 py-2">
                    <img
                    onClick={()=>setImageFull(true)}
                      src={item?.postById?.profilePic || "/defaultImage.jpg"}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3 mt-4 flex flex-col">
                      <div className="flex items-center">
                        <div className="font-semibold">{currentUser}</div>
                        <div className="text-xs text-gray-500 ml-2">
                          {formatDistanceToNow(
                            new Date(item?.createdOn)
                          ).replace("about ", "")}
                        </div>
                      </div>
                      <div className="text-gray-800 text-sm">{item.text}</div>
                    </div>
                  </div>

                  {item?.image && (
                    <div className="mt-3 flex justify-center w-full">
                      <img
                        src={item.image}
                        alt="Post Image"
                        className="w-full max-w-[80%] sm:max-w-[80%] h-auto rounded-lg"
                      />
                    </div>
                  )}

                  <div className="relative flex ml-14">
                    <div className="transition-transform hover:scale-90 duration-300 text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">

                      <LikeButton userId={userId} item={item} />

                    </div>
                    <div className="p-2 text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                      <FiMessageCircle />
                      <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Comment
                      </span>
                    </div>
                    <div className="p-2 text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                      <FiRepeat />
                      <span className="absolute top-10 left-1/2 -translate-x-1/2 text-gray-600 text-xs px-2 py-1 opacity-0 group-hover:opacity-100">
                        Repeat
                      </span>
                    </div>
                    <div className="p-2 text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                      <FiSend />
                      <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs opacity-0 text-gray-600 px-2 py-1 group-hover:opacity-100 transition-opacity">
                        Share
                      </span>
                    </div>
                  </div>

                  <div className="border-b border-gray-300 mt-3 w-full"></div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center min-h-[300px]">
                <p className=" text-gray-500">No threads yet.</p>
              </div>
            )}
          </div>
      </div>
    </>
  );
}
