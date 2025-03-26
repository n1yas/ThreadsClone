import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { GoSmiley } from "react-icons/go";
import { ImSpinner3 } from "react-icons/im";
import { IoMdImages } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import Modal from "react-modal";

Modal.setAppElement(document.body);

const UploadpostModal = ({ plusIsOpen, setPlusIsOpen, user }) => {
  const [postData, setPostData] = useState({
    userId: "",
    text: "",
    image: null as File | null,
  });
  const queryClient = useQueryClient();

  const [image, setImage] = useState(null);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPostData((prev) => ({
        ...prev,
        image: file,
      }));

      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  

  const postMutatioin = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("api/external/posts", formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["allPost"] });
      setPlusIsOpen(false);
      setPostData({
        userId: "",
        text: "",
        image: null as File | null,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handlePost = () => {
    const Post = new FormData();
    Post.append("userId", user?._id);
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
        <div className="flex  items-center border-b ">
          <button
            onClick={() => setPlusIsOpen(false)}
            className="px-2 py-2 m-3 text-black "
          >
            Cancel
          </button>
          <h2 className=" text-base font-semibold  ">New Thread</h2>
        </div>

        <div className="flex">
          <IoPersonCircleOutline className="text-6xl px-1 text-gray-400" />
          <p className="m-2 text-sm font-semibold">{user?.username}</p>
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
          >
            Post
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UploadpostModal;
