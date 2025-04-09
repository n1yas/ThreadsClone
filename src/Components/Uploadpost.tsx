import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { GoLocation, GoSmiley } from "react-icons/go";
import { ImSpinner3 } from "react-icons/im";
import { IoMdImages } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import Modal from "react-modal";
import { useToast } from "@/app/hooks/useToast";
import apiClient from "@/api/axiosInstance";
import { UserType } from "@/redux/slices/AuthSlice";
import { CgMoreO } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";

Modal.setAppElement(document.body);
interface UploadProps {
  plusIsOpen: boolean;
  setPlusIsOpen: (value: boolean) => void;
  user: UserType | null;
}

const UploadpostModal: React.FC<UploadProps> = ({
  plusIsOpen,
  setPlusIsOpen,
  user,
}) => {
  const LoggedUserId = localStorage.getItem("userId") || "";

  const [postData, setPostData] = useState({
    userId: "",
    text: "",
    image: null as File | null | string,
  });
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPostData((prev) => ({
        ...prev,
        image: file,
      }));

      setImage(imageUrl);
    }
  };

  const postMutatioin = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post("/posts", formData,{headers:{
        "Content-Type":"multipart/form-data"
      }});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showSuccess("Posted");
      setPlusIsOpen(false);
      setPostData({
        userId: "",
        text: "",
        image: null as File | null,
      });
    },
    onError: (error: any) => {
      showError(error?.response.data.error || "error uploading file");
      console.log(error);
    },
  });

  const handlePost = () => {
    const Post = new FormData();
    Post.append("userId", LoggedUserId);
    Post.append("text", postData.text);

    if (postData.image) {
      Post.append("image", postData.image);
    } else {
      console.log("no image select");
    }
    postMutatioin.mutate(Post);
  };

  return (
    <div>
      <Modal
        isOpen={plusIsOpen}
        onRequestClose={() => setPlusIsOpen(false)}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 md:mx-auto p-6 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex justify-between items-center border-b  ">
          <button
            onClick={() => setPlusIsOpen(false)}
            className="px-2 py-2 m-3 text-black "
          >
            Cancel
          </button>
          <h2 className="flex items-center text-base font-semibold  ">New Thread</h2>
          <div>
          <CgMoreO className="text-2xl"/>
          </div>
        </div>

        <div className="flex">
          <IoPersonCircleOutline className="text-6xl px-1 text-gray-400" />
          <p className="flex m-2 text-base font-semibold">{user?.username} 
            <div className="flex text-gray-500 font-normal ml-2">  Add a topic </div>
          </p>
        </div>

        <input
          type="text"
          className="w-full outline-none rounded-md px-3 mt-2"
          value={postData.text}
          onChange={(e) => setPostData({ ...postData, text: e.target.value })}
          placeholder="What's new?"
        />
        <div className="flex justify-center items-center">
          {postMutatioin.isPending ? (
            <ImSpinner3 className="animate-spin " />
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <IoMdImages className="text-2xl m-2 text-gray-400" />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <button>
              <GoSmiley className="text-2xl m-2 text-gray-400" />
            </button>
            <button>
            <GoLocation className="text-2xl m-2 text-gray-400"/>
            </button>
          </div>
        </div>
        {image && (
          <img
            src={image}
            alt="newPost"
            className=" w-[80%] h-[300px] object-contain rounded-lg"
          />
        )}

        <div>
          <input
            type="text"
            placeholder="add threads"
            className=" w-full outline-none px-3 rounded-md"
          />
        </div>

        <div className="flex justify-end px-3 py-2 ">
          <button
            className="px-4 py-2 text-gray-400 border rounded-lg"
            onClick={handlePost}
            disabled={postMutatioin.isPending}
          >
            Post
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UploadpostModal;
