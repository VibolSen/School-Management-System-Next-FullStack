"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiHome, FiChevronLeft, FiChevronRight, FiUsers } from "react-icons/fi";
import NavLink from "@/components/nav/NavLink";

// ... (rest of the component code)

const STUDY_OFFICE_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/study-office/dashboard",
  },
  {
    label: "Student Management",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/study-office/students",
  },
];

export default function StudyOfficeSidebar({ initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const isCollapsed = !isOpen;

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedState = localStorage.getItem("sidebarState");
  //     if (savedState !== null) {
  //       setIsOpen(JSON.parse(savedState));
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("sidebarState", JSON.stringify(isOpen));
  // }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`bg-blue-900 text-white flex flex-col fixed md:relative transition-all duration-300 ease-in-out z-40 h-full ${
          isOpen ? "w-64" : "w-16"
        } overflow-hidden`}
      >
        <div className="flex items-center p-4 border-b border-blue-800 h-16 relative">
          {!isCollapsed ? (
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v11.494m-5.22-8.242l10.44 4.99m-10.44-4.99l10.44 4.99M3 10.519l9-4.266 9 4.266"
                />
              </svg>
              <h1 className="ml-2 text-xl font-bold">Study Office</h1>
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors absolute right-2"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <FiChevronLeft className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul>
            {STUDY_OFFICE_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
