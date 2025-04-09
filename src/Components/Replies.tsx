import apiClient from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import LikeButton from "./LikeButton";
import { FiMessageCircle, FiRepeat, FiSend } from "react-icons/fi";
import Link from "next/link";

export default function Replies() {
  const { user } = useSelector((state) => state.auth);

  const pathname = usePathname();
  const { id: currentUserId } = useParams();
  const { username: currentUserName } = useParams();

  const dynamicUsersId =
    pathname.includes("/user") && user?._id ? user._id : currentUserId;
  const dynamicUserName =
    pathname.includes("/user") && user?.username
      ? user.username
      : currentUserName;
  const finalName = dynamicUserName.replace("%40", "");

  const { data: replies } = useQuery({
    queryKey: ["usersReplies"],
    queryFn: async () => {
      const response = await apiClient.get(`/posts/replys/${dynamicUsersId}`);
      console.log("replies niyas ", response.data);
      return response.data.posts;
    },
  });

  return (
    <>
      <div className="max-w-2xl items-center justify-center">
        {replies?.length > 0 ? (
          replies?.map((item) =>
            item?.replies.map((reply) => (
              <div  key={reply._id}
              className="flex flex-col pb-3 border-b border-gray-300 mt-2">
                <div className="flex">
                  <img
                    src={reply?.profilePic || "/defaultImage.jpg"}
                    alt="profile"
                    className="w-10 h-10 object-cover m-5"
                  />
                  <Link href={`/@${reply.username}/${reply.userId}`}>
                  <div className=" m-5 -ml-3 ">
                    {reply?.username}
                    </div>
                  </Link>
                </div>
                <div>
                  <p className="text-gray-500 ml-16 -mt-3">Replying to @{finalName}</p>
                </div>
                <div className="ml-16">{reply?.text}</div>
                <div className="relative flex ml-14">
                  <div>
                    <LikeButton userId={user?._id} item={reply} />
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
            ))
          )
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className=" text-gray-500 text-center">No replies yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
