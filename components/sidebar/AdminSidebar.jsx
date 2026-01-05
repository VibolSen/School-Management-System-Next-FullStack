"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiBookOpen,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiBriefcase,
  FiUser,
  FiGrid,
  FiHash,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";

// -------------------------
// Single Nav Item Component
// -------------------------
const NavLink = ({ icon, label, href, isCollapsed, isActive }) => (
  <li>
    <Link
      href={href}
      className={`group flex items-center gap-3 my-1 p-3 rounded-xl transition-all duration-300 relative
        ${
          isActive
            ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md scale-[1.02]"
            : "text-slate-300 hover:text-white hover:bg-blue-800/60 hover:shadow-lg hover:scale-[1.05]"
        }
      `}
      title={isCollapsed ? label : ""}
    >
      <span
        className={`transition-all duration-300 ${
          isActive
            ? "text-yellow-300"
            : "group-hover:text-blue-300 text-slate-300"
        }`}
      >
        {icon}
      </span>

      <span
        className={`ml-1 font-medium transition-all duration-300 ease-in-out
          ${
            isCollapsed
              ? "opacity-0 absolute left-full ml-2 bg-blue-900 text-white px-2 py-1 rounded text-sm invisible group-hover:visible group-hover:opacity-100 z-50 shadow-md"
              : "opacity-100"
          }`}
      >
        {label}
      </span>
    </Link>
  </li>
);

// -------------------------
// Sidebar Item Definitions
// -------------------------
const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/admin/users",
  },
  {
    label: "Staff",
    icon: <FiBriefcase className="w-5 h-5" />,
    href: "/admin/staff",
  },
  {
    label: "Job Postings",
    icon: <FiBriefcase className="w-5 h-5" />,
    href: "/admin/job-postings",
  },
  {
    label: "Teachers",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/admin/teachers",
  },
  {
    label: "Students",
    icon: <FiUser className="w-5 h-5" />,
    href: "/admin/students",
  },
  {
    label: "Departments",
    icon: <FiGrid className="w-5 h-5" />,
    href: "/admin/departments",
  },
  {
    label: "Faculty",
    icon: <FiBook className="w-5 h-5" />,
    href: "/admin/faculty",
  },
  {
    label: "Courses",
    icon: <FiBook className="w-5 h-5" />,
    href: "/admin/courses",
  },
  {
    label: "Assignment Management",
    icon: <FiBookOpen className="w-5 h-5" />,
    href: "/admin/assignment-management",
  },
  {
    label: "Exam Management",
    icon: <FiBook className="w-5 h-5" />,
    href: "/admin/exam-management",
  },
  {
    label: "Course Analytics",
    icon: <FiBarChart2 className="w-5 h-5" />,
    href: "/admin/course-analytics",
  },
  {
    label: "Groups",
    icon: <FiHash className="w-5 h-5" />,
    href: "/admin/groups",
  },
  {
    label: "E-Library",
    icon: <FiBookOpen className="w-5 h-5" />,
    href: "/admin/e-library",
  },
  {
    label: "Student Performance",
    icon: <FiTrendingUp className="w-5 h-5" />,
    href: "/admin/student-performance",
  },
  {
    label: "Points Management",
    icon: <FiAward className="w-5 h-5" />,
    href: "/admin/points-management",
  },
  {
    label: "Attendance",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/admin/attendance",
  },
  {
    label: "Payroll",
    icon: <FiCreditCard className="w-5 h-5" />,
    href: "/admin/payroll",
  },
  {
    label: "Financial Management",
    icon: <FiDollarSign className="w-5 h-5" />,
    href: "/admin/finance",
  },
  {
    label: "Schedule",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/admin/schedule",
  },
  {
    label: "Certificate Management",
    icon: <FiBookOpen className="w-5 h-5" />,
    href: "/admin/certificate-management",
  },
  {
    label: "Settings",
    icon: <FiSettings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

// -------------------------
// Main Sidebar Component
// -------------------------
export default function AdminSidebar({ initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const pathname = usePathname();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState !== null) setIsOpen(JSON.parse(savedState));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const isCollapsed = !isOpen;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col fixed md:relative transition-all duration-500 ease-in-out z-40 h-full shadow-2xl
          ${isOpen ? "min-w-max" : "w-16"} overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`flex items-center p-4 border-b border-blue-800 h-16 transition-all duration-300 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2 animate-fadeIn">
              <svg
                className="h-8 w-8 text-blue-300 animate-pulse"
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
              <h1 className="text-xl font-bold text-white tracking-wide">
                Admin Portal
              </h1>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <FiChevronLeft className="w-4 h-4 text-white" />
            ) : (
              <FiChevronRight className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
                isActive={pathname === item.href}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 animate-gradient-x" />
      </aside>
    </>
  );
}
