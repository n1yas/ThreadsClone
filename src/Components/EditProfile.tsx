import { useSelector } from "react-redux";
import Modal from "react-modal";
import { IoPersonAdd } from "react-icons/io5";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";



export default function EditProfile({ editOpen, setEditOpen }) {

  const queryClient = useQueryClient();
  const [profileEdit, setProfileEdit] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profilePic: ""
  });

  const[profileModal,setProfileModal]=useState(false)

  const loggedUserId = localStorage.getItem("userId");

  const editMutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: async (formData:FormData) => {
      const response = await axios.patch(`api/external/users/${loggedUserId}`,formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["editProfile"] });
      setProfileEdit({
        name: "",
        username: "",
        email:"",
        bio: "",
        profilePic: "",
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [profileImage,setProfileImage]=useState(null)

  const handleEdit=()=>{
    const Edit=new FormData()
    Edit.append("name",profileEdit?.name)
    Edit.append("username",profileEdit?.username)

    if(profileEdit.email){
      Edit.append("email",profileEdit?.email)
    }

    Edit.append("bio",profileEdit?.bio)

    if(profileEdit.profilePic){
      Edit.append("profilePic",profileEdit?.profilePic)
    }
    setEditOpen(false)
    editMutation.mutate(Edit)
  }

  const handleChange=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file=event.target.files?.[0];
    if(file){
      setProfileImage((prev)=>({
        ...prev,
        profileImage:file
      }));

      const imageUrl=URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  const fileInputRef=useRef()
 
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
                <button onClick={()=>setProfileModal(true)}
                className=" flex justify-center items-center w-12 h-12 rounded-full bg-gray-200">
                  <IoPersonAdd className="text-gray-600 text-2xl" />
                </button>
                <Modal
                isOpen={profileModal}
                onRequestClose={()=>setProfileModal(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="flex justify-center bg-white rounded-lg shadow-lg w-60 mx-4 md:mx-auto px-4 outline-none"
                >
                  <button onClick={handleUploadClick}
                  className="text-base font-semibold w-56 text-black  hover:bg-gray-200 rounded-lg py-4 m-2"
                   >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Upload image
                  </label>
                  <input 
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  />
                  </button>
                </Modal>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mt-2">Name</h3>
              <input type="text"
              name="name"
              value={profileEdit.name}
              onChange={handleChange} 
              autoComplete="off"
              className="w-full p-2 border-b border-gray-300 outline-none"/>
            <h3 className="text-lg font-medium text-gray-700 mt-2">UserName</h3>
              <input
               type="text"
              name="username"
              value={profileEdit.username}
              onChange={handleChange} 
              autoComplete="off"
              className="w-full p-2 border-b border-gray-300 outline-none"/>

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

            <button onClick={handleEdit} 
            className=" text-white flex justify-center items-center bg-black rounded-lg w-full py-4 mb-3" >
              Done</button>
          
        </div>
      </Modal>
    </>
  );
}
