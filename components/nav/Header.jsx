"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'; // Ensure js-cookie is installed

import { useUser } from "@/context/UserContext";

export default function Header({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");


  const router = useRouter();

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const { user, loading } = useUser();

  const handleLogout = () => {
    // ✅ MODIFIED: Remove the cookie on logout
    Cookies.remove("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="hidden md:block ml-2">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-slate-200 rounded mt-1 animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 md:hidden mr-4"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Search bar can remain as is */}
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-slate-500 hidden md:block">
          {currentDate}
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            <img
              className="h-9 w-9 rounded-full object-cover border border-slate-300"
              src={user?.profile?.avatar || "/default-cover.jpg"}
              alt={user?.name || "Guest"}
              onError={(e) =>
                (e.currentTarget.src = "/default-cover.jpg")
              }
            />
            <div className="hidden md:block text-left">
              <div className="font-semibold text-sm text-slate-700">
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </div>
              <div className="text-xs text-slate-500">{user ? user.role?.name : "Guest"}</div>
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <button
                onClick={() =>
                  user && router.push(`/${user.role.name.toLowerCase()}/profile`)
                } // Dynamic profile link
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}