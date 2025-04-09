"use client";

import { loginSuccess } from "@/redux/slices/AuthSlice";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiHeart, FiPlus, FiSearch } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { HiBars2 } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { LuPin } from "react-icons/lu";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { usePathname, useRouter } from "next/navigation";
import UploadpostModal from "./Uploadpost";
import ThemeSwitcher from "./Theme";
import apiClient from "@/api/axiosInstance";

const fetchUser = async (userid: string | number) => {
  const res = await apiClient.get(`/users/${userid}`);

  return res.data.user;
};

const Sidebar = () => {
  const LoggedUserId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const router = useRouter();

  const pathname = usePathname();


  const [plusIsOpen, setPlusIsOpen] = useState(false);
  const [barIsOpen, setBarIsOpen] = useState(false);
  const [themeBar, setThemeBar] = useState(false);

  const allModalClose = () => {
    setBarIsOpen(false);
    setThemeBar(false);
  };

  const { data: user } = useQuery({
    queryKey: ["user", LoggedUserId],
    queryFn: () => fetchUser(LoggedUserId),
    enabled: !!LoggedUserId,
  });
  useEffect(() => {
    if (LoggedUserId) {
      dispatch(loginSuccess(user));
    }
  }, [LoggedUserId, user]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setBarIsOpen(false);
    router.push("/login");
  };

  
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  if(!LoggedUserId){
    return router.replace("/login")
  }

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0  min-h-screen w-20 flex-col items-center py-4">
        <div className="flex items-center h-28">
          <Image
            src="/threadsLogo.jpg"
            alt="threads-logo"
            width={40}
            height={40}
          />
        </div>

        <div className="flex flex-col flex-grow justify-around items-center w-full ">
          <div className="w-14 h-12 flex items-center justify-center hover:bg-gray-200 rounded-lg cursor-pointer  dark:hover:bg-slate-900">
            <a href="/">
              <GrHomeRounded className="text-3xl text-gray-400" />
            </a>
          </div>
          <div className="p-4">
            <Link href="/search">
              <button className="w-14 h-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-900 rounded-lg">
                <FiSearch className="text-2xl text-gray-400" />
              </button>
            </Link>
          </div>

          <div className="w-14 h-12 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-slate-950">
            <button onClick={() => setPlusIsOpen(true)}>
              <FiPlus className="text-2xl text-gray-400 hover:text-black " />
            </button>
            <UploadpostModal
              setPlusIsOpen={setPlusIsOpen}
              plusIsOpen={plusIsOpen}
              user={user}
            />
          </div>

          <div className="w-14 h-12 flex items-center justify-center hover:bg-gray-200 rounded-lg  dark:hover:bg-slate-900">
            <FiHeart className="text-2xl text-gray-400" />
          </div>
          <Link href={"/user"}>
            <div className="w-14 h-12 flex items-center justify-center hover:bg-gray-200 rounded-lg  dark:hover:bg-slate-900">
              <IoPersonOutline className="text-2xl text-gray-400" />
            </div>
          </Link>

          <div className="h-28 mt-12 space-y-2">
            <div className="w-14 h-12 flex items-center justify-center hover:bg-gray-200 rounded-lg  dark:hover:bg-slate-900">
              <LuPin className="text-xl text-gray-400" />
            </div>

            <button onClick={() => setBarIsOpen(true)}>
              <div className="w-14 h-12 flex items-center justify-center  dark:hover:bg-slate-900 rounded-md">
                <HiBars2 className="text-2xl text-gray-400 hover:text-black" />
              </div>
            </button>

            <Modal
              isOpen={barIsOpen && !themeBar}
              onRequestClose={() => setBarIsOpen(false)}
              className="bg-white  rounded-lg shadow-lg w-60 m-10 outline-none"
              overlayClassName="fixed inset-0 bg-black  bg-opacity-50 flex items-end justify-start"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => setThemeBar(true)}
                  className="text-base font-semibold text-black m-2 hover:bg-gray-200 rounded-lg p-3"
                >
                  Appearance
                </button>

                <button
                  onClick={handleLogout}
                  className="text-base font-semibold text-red-600 m-2 hover:bg-gray-200 rounded-lg p-3"
                >
                  Log Out
                </button>
              </div>
            </Modal>
            <ThemeSwitcher themeBar={themeBar} allModalClose={allModalClose} />
          </div>
        </div>
      </aside>

      <div className="fixed md:hidden bottom-0 left-0 w-full bg-gray-100 flex justify-around items-center py-3">
        <div className="py-2 px-4 hover:bg-gray-200 rounded-lg">
          <Link href={"/"}>
            <GrHomeRounded className="text-2xl" />
          </Link>
        </div>
        <div className="py-2 px-4 hover:bg-gray-200  rounded-lg">
          <Link href={"/search"}>
            <FiSearch className="text-2xl" />
          </Link>
        </div>
        <button
          onClick={() => setPlusIsOpen(true)}
          className=" bg-gray-200 px-4 py-2 rounded-lg"
        >
          <FiPlus className="text-2xl" />
        </button>
        <div className=" hover:bg-gray-200 px-4 py-2  rounded-lg">
          <FiHeart className="text-2xl" />
        </div>
        <div className="py-2 px-4 hover:bg-gray-200  rounded-lg">
          <Link href={"/user"}>
            <IoPersonOutline className="text-2xl" />
          </Link>
        </div>
      </div>
      <div className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-black ">
        <button onClick={() => setBarIsOpen(true)}>
          <HiBars2 className="text-2xl transition-transform duration-300 hover:scale-110 " />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
