// HRSidebar.tsx
"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiBarChart2,
  FiSend,
  FiSettings,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";

const NavLink = ({
  icon,
  label,
  isCollapsed,
  isActive,
  href,
}) => (
  <li>
    <Link
      href={href}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full text-left group relative ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-200 hover:bg-blue-800 hover:text-white"
      }`}
      title={isCollapsed ? label : ""}
    >
      {icon}
      <span
        className={`ml-3 transition-all duration-300 ${
          isCollapsed
            ? "opacity-0 absolute left-full ml-2 bg-blue-900 text-white px-2 py-1 rounded text-sm invisible group-hover:visible group-hover:opacity-100 z-50"
            : "opacity-100 relative"
        }`}
      >
        {label}
      </span>
    </Link>
  </li>
);

const HR_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/hr/dashboard",
  },
  {
    label: "Staff",
    icon: <FiBriefcase className="w-5 h-5" />,
    href: "/hr/staff",
  },
  { label: "Leave", icon: <FiSend className="w-5 h-5" />, href: "/hr/leave" },
  {
    label: "Attendance",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/hr/attendance",
  },
  {
    label: "Reports",
    icon: <FiBarChart2 className="w-5 h-5" />,
    href: "/hr/reports",
  },
];

const HRSidebar = ({ isOpen, setIsOpen }) => {
  const isCollapsed = !isOpen;
  const pathname = usePathname();

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
              <h1 className="ml-2 text-xl font-bold">HR Portal</h1>
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
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
            {HR_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </nav>

        <div className="px-2 py-4 border-t border-blue-800">
          <NavLink
            icon={<FiSettings className="w-5 h-5" />}
            label="Settings"
            href="/settings"
            isActive={pathname === "/settings"}
            isCollapsed={isCollapsed}
          />
        </div>
      </aside>
    </>
  );
};

export default HRSidebar;