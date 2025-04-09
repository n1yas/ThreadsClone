import { useSelector } from "react-redux";
import Modal from "react-modal";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/hooks/useToast";
import { ImSpinner3 } from "react-icons/im";
import apiClient from "@/api/axiosInstance";
import * as Yup from "yup"

export default function EditProfile({ editOpen, setEditOpen }) {
  const { user } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();
  const [profileEdit, setProfileEdit] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profilePic: user?.profilePic || "",
  });

  useEffect(() => {
    if (user) {
      setProfileEdit((prev) => ({
        ...prev,
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.bio || "",
        profilePic: typeof user?.profilePic === "string" ? user.profilePic : "",
      }));
    }
  }, [user]);

  const [profileModal, setProfileModal] = useState(false);

  const loggedUserId = localStorage.getItem("userId");
  const { showSuccess, showError } = useToast();

  const editMutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.patch(
        `/users/${loggedUserId}`,
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      setEditOpen(false);
      showSuccess("Profile Update");
      queryClient.invalidateQueries({ queryKey: ["editProfile"] });
      setProfileEdit((prev) => ({
        ...prev,
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        profilePic: user.profilePic || "",
      }));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleEdit = () => {
    const Edit = new FormData();
    Edit.append("name", profileEdit?.name);
    Edit.append("username", profileEdit?.username);

    if (profileEdit.email) {
      Edit.append("email", profileEdit?.email);
    }

    Edit.append("bio", profileEdit?.bio);

    if (profileEdit.profilePic) {
      console.log("first");
      Edit.append("profilePic", profileEdit?.profilePic);
    }

    editMutation.mutate(Edit);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileEdit((prev) => ({
        ...prev,
        profilePic: imageUrl,
      }));

      setProfileImage(imageUrl);
    }
    setProfileModal(false);
  };

  const fileInputRef = useRef();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    if (!profileImage) {
      showError("image is empty");
    }
    setProfileImage(null);
    setProfileModal(false);
  };

  return (
    <>
      <Modal
        isOpen={editOpen}
        onRequestClose={() => setEditOpen(false)}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 md:mx-auto px-4 outline-none"
      >
        <div className="w-full">
          <div className="flex flex-col w-full p-3">
            <div className="flex justify-end ">
              <button
                onClick={() => setProfileModal(true)}
                className="relative flex justify-center items-center w-12 h-12 rounded-full bg-gray-200"
              >
                <img
                  src={profileImage || "defaultImage.jpg"}
                  alt="profile"
                  className=" absolute w-12 h-12 rounded-full object-cover"
                />
              </button>
              <Modal
                isOpen={profileModal}
                onRequestClose={() => setProfileModal(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="flex flex-col justify-center bg-white rounded-lg shadow-lg w-60 mx-4 md:mx-auto p-4 outline-none"
              >
                <button
                  onClick={handleUploadClick}
                  className="text-base font-semibold text-black  hover:bg-gray-200 rounded-lg p-3"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Upload picture
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </button>
                <button
                  className="text-base font-semibold text-red-500  hover:bg-gray-200 rounded-lg p-3"
                  onClick={() => handleRemove()}
                >
                  Remove current picture
                </button>
              </Modal>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mt-2">Name</h3>
            <input
              type="text"
              name="name"
              value={profileEdit.name}
              onChange={handleChange}
              autoComplete="off"
              className="w-full p-2 border-b border-gray-300 outline-none"
            />
            <h3 className="text-lg font-medium text-gray-700 mt-2">UserName</h3>
            <input
              type="text"
              name="username"
              value={profileEdit.username}
              onChange={handleChange}
              autoComplete="off"
              className="w-full p-2 border-b border-gray-300 outline-none"
            />

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mt-2">Bio</h3>
              <input
                type="text"
                name="bio"
                value={profileEdit.bio}
                onChange={handleChange}
                autoComplete="off"
                placeholder="+Write bio"
                className="w-full p-2 border-b border-gray-300 outline-none "
              />
              <h3 className="text-lg font-medium text-gray-700 mt-2">Email</h3>
              <input
                type="email"
                name="email"
                value={profileEdit.email}
                onChange={handleChange}
                placeholder="+Add Email"
                autoComplete="off"
                className="w-full p-2 border-b border-gray-300 outline-none "
              />
            </div>
          </div>

          <button
            onClick={handleEdit}
            className=" text-white flex justify-center items-center bg-black rounded-lg w-full py-4 mb-3"
          >
            {editMutation.isPending ? (
              <ImSpinner3 className="animate-spin" />
            ) : (
              "Done"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
