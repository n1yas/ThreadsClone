"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar  
      closeButton={false}  
      pauseOnHover={false}
      draggable
      theme="dark"
      icon={false} 
      toastClassName="bg-black text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold flex justify-center items-center w-[150px] mx-auto"
      
    />
  );
}
