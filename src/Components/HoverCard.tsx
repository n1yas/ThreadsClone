import { useState, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function HoverCard({ userId, children }) {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axios.get(`/api/external/users/${userId}`);
      return response.data;
    },
  });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 200); 
  };

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer hover:underline"
      >
        {children}
      </span>

      {showPopup && user && (
        <div
          ref={popupRef}
          className="absolute left-0 top-10 w-64 bg-white shadow-lg rounded-lg p-4 z-50 border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-3">
            <img
              src={user?.image || "defaultImage.jpg"}
              alt={user?.name}
              className="w-12 h-12 rounded-full "
            />
            <div>
              <p>{user?.name}</p>
              <p className="text-gray-500">@{user?.username}</p>
              <p>{user?.bio}</p>
              <p>Followers{user?.following?.length}</p>
            </div>
          </div>
          <button className="mt-3 w-full bg-black text-white py-1 px-3 rounded">
            Follow
          </button>
        </div>
      )}
    </div>
  );
}
