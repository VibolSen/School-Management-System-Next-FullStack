"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'; // Ensure js-cookie is installed

export default function Header({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState({
    name: "Guest",
    role: "Guest",
    image: "/illustration/default.jpg",
  });

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

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      // ✅ MODIFIED: Get token from cookies for consistency with middleware
      const token = Cookies.get("token");
      if (!token) {
        // If no token, maybe redirect or just show guest state
        return;
      }

      try {
        // ✅ MODIFIED: The API now gets the token from the cookie, so we don't need to send it
        const res = await fetch("/api/me");

        if (!res.ok) {
          // If the token is invalid (e.g., expired), log the user out
          if (res.status === 401) {
            handleLogout();
          }
          return;
        }

        const data = await res.json();
        
        // ✅ MODIFIED: Logic to handle the new user data structure
        setUser({
          name: `${data.user.firstName} ${data.user.lastName}` || "Guest User",
          // Format the role for display (e.g., "ADMIN" -> "Admin")
          role: data.user.role
            ? data.user.role.charAt(0).toUpperCase() +
              data.user.role.slice(1).toLowerCase()
            : "Guest",
          image: data.user.image || "/illustration/default.jpg", // Assuming image field might exist later
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // ✅ MODIFIED: Remove the cookie on logout
    Cookies.remove("token");
    router.push("/login");
  };

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
              src={user.image}
              alt={user.name}
              onError={(e) =>
                (e.currentTarget.src = "/illustration/default.jpg")
              }
            />
            <div className="hidden md:block text-left">
              <div className="font-semibold text-sm text-slate-700">
                {user.name}
              </div>
              <div className="text-xs text-slate-500">{user.role}</div>
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
                  router.push(`/${user.role.toLowerCase()}/profile`)
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