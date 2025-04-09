import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import {
  FiBookmark,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiRepeat,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import Modal from "react-modal";
import LikeButton from "./LikeButton";
import { useToast } from "@/app/hooks/useToast";
import apiClient from "@/api/axiosInstance";
import { RiPencilLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";

export default function PostDetails() {

  interface Post {
    _id: string;
    text: string;
    likes: string[];
    image: string;
    createdOn: string;
    postById: {
      name: string;
      profilePic: string;
      _id: string;
    };
  }


  const [moreOption, setMoreOption] = useState(false);
  const [selectedItem, setSeletedItem] = useState<string>("");
  const queryClient = useQueryClient();
  const{showError,showSuccess}=useToast()

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
  }, []);

  const { data: Userspost } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await apiClient.get(`/posts/${userId}`);
      return response.data?.post ?? [];
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/posts/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      showSuccess("Post Deleted")
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      showError("Post Could not delete")
      console.log(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(selectedItem);
    setMoreOption(false);
  };

  const handelMoreOption = (id: string) => {
    setSeletedItem(id);
    setMoreOption(true);
  };
  
  return (
    <>
      <div>
        {Userspost?.map((item: Post) => (
          <div
            key={item._id}
            className="flex flex-col space-y-2 pb-6 border-b border-gray-300 last:border-b-0 "
          >
            <div className="flex item-center justify-between space-x-3 p-3">
              <div className="flex gap-2">
                <img
                  src={item.postById.profilePic || "defaultImage.jpg"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex items-center space-x-2">
                  <div className="font-medium">
                    {item.postById.name}
                    <div className="text-sm text-gray-800 ">{item.text}</div>
                  </div>
                  <div className="text-xs text-gray-500 -mt-5">
                    {formatDistanceToNow(new Date(item.createdOn)).replace(
                      "about ",
                      ""
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => handelMoreOption(item._id)}>
                <div className=" text-xl flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-200 transition cursor-pointer">
                  <span>
                    <FiMoreHorizontal />
                  </span>
                </div>
              </button>
            </div>
            <Modal
              isOpen={moreOption}
              onRequestClose={() => setMoreOption(false)}
              className="bg-white rounded-lg shadow-lg w-96 md:w-1/4 p-4 outline-none"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col space-y-3">
              <button className="flex justify-center  items-center text-xl p-2 hover:bg-gray-100 font-semibold  rounded">
                  Save
                  <FiBookmark className="ml-3" />
                </button>
                <button
                  onClick={() => handleDelete()}
                  className="flex justify-center items-center text-xl p-2 hover:bg-gray-100 font-semibold rounded text-red-500"
                >
                  Delete
                  <FiTrash2  className="text-red-500 ml-3" />
                </button>
                
                <button className="flex justify-center items-center text-xl p-2 hover:bg-gray-100 font-semibold  rounded">
                  Edit
                  <RiPencilLine className="ml-3" />
                </button>
              </div>
            </Modal>

            {item.image && (
              <div className="flex justify-center">
                <img
                  src={item.image}
                  alt="image"
                  className="w-full max-w-[80%] h-auto rounded-lg "
                />
              </div>
            )}
            <div className="relative flex ml-14">
              <div className=" text-xl text-gray-400 hover:bg-gray-100 rounded-full transition-transform hover:scale-90 duration-300 group relative">


                <LikeButton item={item} userId={userId} />
              

               

              </div>
              <div className="p-2 text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                <FiMessageCircle />
                <span className="absolute top-10 left-1/2 transform -translate-x-1/2  text-gray-600 text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Comment
                </span>
              </div>
              <div className="p-2 text-xl text-gray-400 hover:bg-gray-100 rounded-full group relative">
                <FiRepeat />
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-gray-600 text-xs px-2 py-1 opacity-0 group-hover:opacity-100  ">
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
          </div>
        ))}
      </div>
    </>
  );
}
