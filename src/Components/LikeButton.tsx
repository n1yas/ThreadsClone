import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/axiosInstance";
import { usePathname } from "next/navigation";

const LikeButton = ({ item, userId }) => {
  const pathname = usePathname()
  const queryClient = useQueryClient();
 const likeMutation = useMutation({
      mutationKey: ["like"],
      mutationFn: async (id) => {
        await apiClient.post(`/posts/like/${id}`, {
          userId: userId,
        });
      },
      onSuccess: () => {
        const querykey = pathname === "/"
        ? "allPost"
        : pathname.startsWith("/user")
          ? "posts"
          : "userspost";
      
              queryClient.invalidateQueries({ queryKey: [querykey] });
      },
    });
  
    const unLikeMutation = useMutation({
      mutationKey: ["unlike"],
      mutationFn: async (id) => {
        await apiClient.post(`/posts/unlike/${id}`, {
          userId: userId,
        });
      },
      onSuccess: () => {
        const querykey = pathname.includes("/user") ? "posts" : pathname === "/"  ? "allPost"  : "userspost" ;
        queryClient.invalidateQueries({ queryKey: [querykey] });
      },
    });
  
    const handleUnLikeClick = (item:string) => {
      unLikeMutation.mutate(item?._id);
    };
  
    const handleLikeClick = (item:string) => {
        likeMutation.mutate(item?._id);
    };

  return (
    <>
        {item?.likes?.includes(userId) ? (
          <button
            onClick={() => handleUnLikeClick(item)}
            disabled={unLikeMutation.isPending}
            className="p-2 text-lg sm:text-xl text-gray-400 hover:bg-gray-100 transition-transform hover:scale-90 duration-300 rounded-full group relative"
          >
            <FaHeart className="text-red-500" />
            <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Unlike
            </span>
          </button>

        ) : (
          <button
            onClick={() => handleLikeClick(item)}
            className="p-2 text-lg sm:text-xl text-gray-400 hover:bg-gray-100 transition-transform hover:scale-90 duration-300 rounded-full group relative"
          >
            <FiHeart />
            <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Like
            </span>
          </button>
        )
}
    </>
  );
};

export default LikeButton;
