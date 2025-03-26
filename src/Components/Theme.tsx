"use client";

import { useTheme } from "next-themes";
import Modal from "react-modal"; 
import { IoSunnyOutline } from "react-icons/io5";
import { BsMoon } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function ThemeSwitcher({ themeBar, allModalClose }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <Modal
      isOpen={themeBar}
      onRequestClose={allModalClose}
      className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg w-60 m-10 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-start"
    >
      <div className="flex h-16 justify-around items-center p-3">
        <button
          className={`rounded-lg px-3 hover:bg-gray-200 dark:hover:bg-gray-700 h-12 border ${
            theme === "light" ? "bg-gray-300" : ""
          }`}
          onClick={() => setTheme("light")}
        >
          <IoSunnyOutline className="text-2xl" />
        </button>

        <button
          className={`rounded-lg px-3 hover:bg-gray-200 dark:hover:bg-gray-700 h-12 border ${
            theme === "dark" ? "bg-gray-300" : ""
          }`}
          onClick={() => setTheme("dark")}
        >
          <BsMoon className="text-2xl" />
        </button>

        <button
          className={`text-xl rounded-lg p-1 hover:bg-gray-200 dark:hover:bg-gray-700 h-12 border ${
            theme === "system" ? "bg-gray-300" : ""
          }`}
          onClick={() => setTheme("system")}
        >
          Auto
        </button>
      </div>
    </Modal>
  );
}
