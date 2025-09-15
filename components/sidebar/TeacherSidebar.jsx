// TeacherSidebar.jsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// ✅ 1. Imported new, more specific icons
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiBookOpen,
  FiTrendingUp,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard, // For Assignments
  FiFileText, // For Exams
  FiCheckSquare, // For Attendance
} from "react-icons/fi";

// ✅ 2. Refactored NavLink to be a proper list item for semantic HTML
const NavLink = ({ icon, label, isCollapsed, isActive, href }) => (
  <li title={isCollapsed ? label : ""}>
    <Link
      href={href}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full text-left group relative ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-200 hover:bg-blue-800 hover:text-white"
      }`}
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

// ✅ 3. Updated the navigation items with the new icons
const TEACHER_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/teachers/dashboard",
  },
  {
    label: "My Students",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/teachers/students",
  },
  {
    label: "My Courses",
    icon: <FiBook className="w-5 h-5" />,
    href: "/teachers/courses",
  },
  {
    label: "Assignments",
    icon: <FiClipboard className="w-5 h-5" />,
    href: "/teachers/assignment",
  },
  {
    label: "Exams",
    icon: <FiFileText className="w-5 h-5" />, // Differentiated from Assignments
    href: "/teachers/exam",
  },
  {
    label: "Course Analytics",
    icon: <FiBarChart2 className="w-5 h-5" />,
    href: "/teachers/course-analytics",
  },
  {
    label: "Student Performance",
    icon: <FiTrendingUp className="w-5 h-5" />,
    href: "/teachers/student-performance",
  },
  {
    label: "Attendance",
    icon: <FiCheckSquare className="w-5 h-5" />, // More specific for tracking
    href: "/teachers/attendance",
  },
  {
    label: "E-Library",
    icon: <FiBookOpen className="w-5 h-5" />,
    href: "/teachers/e-library",
  },
  {
    label: "Settings",
    icon: <FiSettings className="w-5 h-5" />,
    href: "/teachers/settings",
  },
];

export default function TeacherSidebar({ isOpen, setIsOpen }) {
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
        className={`bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out z-40 h-full ${
          isOpen ? "w-64" : "w-20"
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
              <h1 className="ml-2 text-xl font-bold whitespace-nowrap">
                Teacher Portal
              </h1>
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors absolute right-2 top-1/2 -translate-y-1/2"
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
            {TEACHER_NAV_ITEMS.map((item) => (
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
      </aside>
    </>
  );
}
