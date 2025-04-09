import apiClient from "@/api/axiosInstance";
import { UserType } from "@/redux/slices/AuthSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImSpinner3 } from "react-icons/im";
import { useSelector } from "react-redux";

export default function FollowButton({user}:{ user : UserType}) {
  const queryClient = useQueryClient();
  const loggeduserid = localStorage.getItem("userId");
  const {user: Loggeduser} = useSelector((state) => state.auth);  

  const followMutation = useMutation({
    mutationFn: async (userid: string) => {
      const response = await apiClient.post(
        `/users/follow/${loggeduserid}`,
        { userFollowId: userid }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleFollow = (userid: string) => {
    followMutation.mutate(userid);
  };

  const UnfollowMutation = useMutation({
    mutationKey: ["unfollow"],
    mutationFn: async (userid: string) => {
      const response = await apiClient.post(
        `/users/unfollow/${loggeduserid}`,
        { userUnfollowId: userid }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleUnFollow = (userid: string) => {
    UnfollowMutation.mutate(userid);
  };

  return (
    <>
       {Loggeduser?.following?.includes(user?._id) ? (
                      <button
                        className=" bg-gray-100 text-gray-400 border w-full h-10 rounded-lg "
                        onClick={() => handleUnFollow(user?._id)}
                        disabled={UnfollowMutation.isPending}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        className=" bg-black text-white w-full h-10 rounded-lg dark:bg-white dark:text-black "
                        onClick={() => handleFollow(user?._id)}
                        disabled={followMutation.isPending}
                      >
                        {followMutation.isPending ? 
                        <ImSpinner3 className="animate-spin flex w-full justify-center items-center"/>
                         : "Follow"}
                      </button>
                    )}
    </>
  );
}
