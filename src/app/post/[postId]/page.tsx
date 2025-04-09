"use client"

import apiClient from "@/api/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import Modal from "react-modal"
import { useSelector } from "react-redux";

export default function Comment(){

    
  type CommentPayload = {
    postId: string;
    replyData: {
      userId: string;
      text: string;
      userProfilePic: string;
      username: string;
    };
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
  const { user } = useSelector((state) => state.auth);


     const [commentModal, setCommentModal] = useState(false);
      const [commentText, setCommentText] = useState("");
      
      const handleChange = (e) => {
        setCommentText(e.target.value);
      };

  const handleComment = (postId: string) => {
    commentMutation.mutate({
      postId,
      replyData: {
        userId: user?._id,
        text: commentText,
        userProfilePic: user?.profilePic,
        username: user?.username,
      },
    });
    setCommentModal(false);
    setCommentText("");
  };

    const {postId} = useParams()

   const {data} = useQuery({
    queryKey:["allcommant"],
    queryFn:async()=>{
        const response=await apiClient.get(`/posts/${postId}`)
        console.log("all",response.data)
        return response.data
    }

   })

   return(
    <>
    <Modal
                    isOpen={commentModal}
                    onRequestClose={() => setCommentModal(false)}
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    className="flex flex-col justify-center bg-white rounded-lg shadow-lg w-96 mx-4 md:mx-auto p-4 outline-none"
                  >
                    <div className="p-3">
                      <div className="text-xl font-normal">
                        {user?.username}
                      </div>
                      <input
                        type="text"
                        value={commentText}
                        onChange={handleChange}
                        placeholder="reply to "
                        className="w-full p-2 outline-none"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleComment(item?._id)}
                          className="text-gray py-2 px-4 border rounded-md"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </Modal>
    </>
   )

}