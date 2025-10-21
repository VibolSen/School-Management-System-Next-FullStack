"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
// ✅ 1. Imported the new icons
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiBookOpen,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiBriefcase, // For Staff
  FiUser, // For Students
  FiGrid, // For Departments
  FiHash, // For Groups
  FiTag, // For Types
  FiFlag, // For Status
  FiTrendingUp,
  FiCalendar,
  FiCheckSquare,
} from "react-icons/fi";
import { usePathname } from "next/navigation";

const NavLink = ({ icon, label, href, isCollapsed, isActive }) => (
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

// ✅ 2. Updated the nav items with more descriptive icons
const AnnouncementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L10 6.364 3.447 2.106A1 1 0 002 3v14a1 1 0 001.447.894L10 13.636l6.553 4.258A1 1 0 0018 17V3z" clipRule="evenodd" />
  </svg>
);

const AssignmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const ExamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
  </svg>
);

const HrPayrollIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2v12zm0 0V4h4v3a1 1 0 001 1h3v7a3 3 0 01-3 3H8z" />
  </svg>
);

const RolesPermissionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const ScheduleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

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
    label: "Announcements",
    icon: <AnnouncementIcon />,
    href: "/admin/announcements",
  },
  {
    label: "Assignments",
    icon: <AssignmentIcon />,
    href: "/admin/assignments",
  },
  {
    label: "Exams",
    icon: <ExamIcon />,
    href: "/admin/exam",
  },
  {
    label: "Staff",
    icon: <FiBriefcase className="w-5 h-5" />, // Icon for professional staff
    href: "/admin/staff",
  },
  {
    label: "Students",
    icon: <FiUser className="w-5 h-5" />, // Singular user icon for students
    href: "/admin/students",
  },
  {
    label: "Departments",
    icon: <FiGrid className="w-5 h-5" />, // Icon for organizational structure
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
    label: "Course Analytics",
    icon: <FiBarChart2 className="w-5 h-5" />,
    href: "/admin/course-analytics",
  },
  {
    label: "Groups",
    icon: <FiHash className="w-5 h-5" />, // Icon representing a group or channel
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
    label: "HR & Payroll",
    icon: <HrPayrollIcon />,
    href: "/admin/hr",
  },
  {
    label: "Roles & Permissions",
    icon: <RolesPermissionsIcon />,
    href: "/admin/roles",
  },
  {
    label: "Schedule",
    icon: <ScheduleIcon />,
    href: "/admin/schedule",
  },
  {
    label: "My Attendance",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/admin/my-attendance",
  },
  {
    label: "Settings",
    icon: <FiSettings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

export default function AdminSidebar({ initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const isCollapsed = !isOpen;
  const pathname = usePathname();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isOpen));
  }, [isOpen]);

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
              <h1 className="ml-2 text-xl font-bold">Admin Portal</h1>
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
      </aside>
    </>
  );
};

