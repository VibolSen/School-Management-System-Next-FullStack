"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Book,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  User,
  LayoutGrid,
  Hash,
  TrendingUp,
  Calendar,
  Award,
  DollarSign,
  FileText, // For Exam Management
  Library, // For E-Library
  ClipboardList // For Assignment Management
} from "lucide-react";

// -------------------------
// Single Nav Item Component
// -------------------------
const NavLink = ({ icon, label, href, isCollapsed, isActive }) => (
  <li>
    <Link
      href={href}
      className={`group flex items-center gap-3 my-1 p-3 rounded-xl transition-all duration-300 relative overflow-hidden
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
            : "text-slate-500 hover:text-blue-700 hover:bg-white"
        }
      `}
      title={isCollapsed ? label : ""}
    >
      <span
        className={`transition-all duration-300 relative z-10 ${
          isActive
            ? "text-white"
            : "group-hover:text-blue-300"
        }`}
      >
        {React.cloneElement(icon, { size: 20 })}
      </span>

      <span
        className={`ml-1 font-medium transition-all duration-300 ease-in-out
          ${
            isCollapsed
              ? "opacity-0 absolute left-full ml-2 bg-slate-800 text-white px-2 py-1 rounded text-sm invisible group-hover:visible group-hover:opacity-100 z-50 shadow-md"
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
    icon: <Home />,
    href: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: <Users />,
    href: "/admin/users",
  },
  {
    label: "Staff",
    icon: <Briefcase />,
    href: "/admin/staff",
  },
  {
    label: "Teachers",
    icon: <Users />,
    href: "/admin/teachers",
  },
  {
    label: "Students",
    icon: <User />,
    href: "/admin/students",
  },
  {
    label: "Faculty",
    icon: <Book />,
    href: "/admin/faculty",
  },
  {
    label: "Departments",
    icon: <LayoutGrid />,
    href: "/admin/departments",
  },
  {
    label: "Courses",
    icon: <Book />,
    href: "/admin/courses",
  },
  {
    label: "Groups",
    icon: <Hash />,
    href: "/admin/groups",
  },
  {
    label: "Assignment Management",
    icon: <ClipboardList />,
    href: "/admin/assignment-management",
  },
  {
    label: "Exam Management",
    icon: <FileText />,
    href: "/admin/exam-management",
  },
  {
    label: "Course Analytics",
    icon: <BarChart3 />,
    href: "/admin/course-analytics",
  },
  {
    label: "E-Library",
    icon: <Library />,
    href: "/admin/e-library",
  },
  {
    label: "Student Performance",
    icon: <TrendingUp />,
    href: "/admin/student-performance",
  },
  {
    label: "Gradebook",
    icon: <BookOpen />,
    href: "/admin/gradebook",
  },
  {
    label: "Attendance",
    icon: <Calendar />,
    href: "/admin/attendance",
  },
  {
    label: "Financial Management",
    icon: <DollarSign />,
    href: "/admin/finance",
  },
  {
    label: "Schedule",
    icon: <Calendar />,
    href: "/admin/schedule",
  },
  {
    label: "Certificates",
    icon: <Award />,
    href: "/admin/certificate-management",
  },
  {
    label: "Job Postings",
    icon: <Briefcase />,
    href: "/admin/job-postings",
  },
  {
    label: "Settings",
    icon: <Settings />,
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
        className={`bg-[#EBF4F6] border-r border-slate-200 text-slate-800 flex flex-col fixed md:relative transition-all duration-500 ease-in-out z-40 h-full shadow-2xl
          ${isOpen ? "min-w-max" : "w-20"} overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`flex items-center p-5 border-b border-slate-200 h-20 transition-all duration-300 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-3 animate-fadeIn">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6.253v11.494m-5.22-8.242l10.44 4.99m-10.44-4.99l10.44 4.99M3 10.519l9-4.266 9 4.266"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                  Admin<span className="text-blue-600">Portal</span>
                </h1>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Workspace</span>
              </div>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-all border border-slate-200 hover:border-slate-300"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
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
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-gradient-x" />
      </aside>
    </>
  );
}
