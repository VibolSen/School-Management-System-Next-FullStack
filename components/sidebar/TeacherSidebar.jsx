"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Book,
  BarChart2,
  BookOpen,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  ClipboardList, // For Assignments
  FileText, // For Exams
  CheckSquare, // For Attendance
  Calendar,
} from "lucide-react";

import { useState, useEffect } from "react";

const NavLink = ({ icon, label, isCollapsed, isActive, href }) => (
  <li title={isCollapsed ? label : ""}>
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 my-1 rounded-xl transition-all duration-200 w-full text-left group relative ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
          : "text-slate-500 hover:bg-white hover:text-blue-700"
      }`}
    >
      {React.cloneElement(icon, { size: 20 })}
      <span
        className={`ml-3 transition-all duration-300 font-medium ${
          isCollapsed
            ? "opacity-0 absolute left-full ml-2 bg-slate-800 text-white px-2 py-1 rounded text-sm invisible group-hover:visible group-hover:opacity-100 z-50 whitespace-nowrap shadow-xl"
            : "opacity-100 relative"
        }`}
      >
        {label}
      </span>
    </Link>
  </li>
);

const TEACHER_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <Home />,
    href: "/teacher/dashboard",
  },
  {
    label: "My Schedules",
    icon: <Calendar />,
    href: "/teacher/schedule",
  },
  {
    label: "My Students",
    icon: <Users />,
    href: "/teacher/students",
  },
  {
    label: "My Attendance",
    icon: <CheckSquare />,
    href: "/teacher/my-attendance",
  },
  {
    label: "Student Attendance",
    icon: <CheckSquare />,
    href: "/teacher/student-attendance",
  },
  {
    label: "My Courses",
    icon: <Book />,
    href: "/teacher/courses",
  },
  {
    label: "Assignments",
    icon: <ClipboardList />,
    href: "/teacher/assignment",
  },
  {
    label: "Exams",
    icon: <FileText />, // Differentiated from Assignments
    href: "/teacher/exam",
  },
  {
    label: "Gradebook",
    icon: <BookOpen />,
    href: "/teacher/gradebook",
  },
  {
    label: "Student Performance",
    icon: <TrendingUp />,
    href: "/teacher/student-performance",
  },
  {
    label: "E-Library",
    icon: <BookOpen />,
    href: "/teacher/e-library",
  },
  {
    label: "Settings",
    icon: <Settings />,
    href: "/teacher/settings",
  },
];

export default function TeacherSidebar({ initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const isCollapsed = !isOpen;
  const pathname = usePathname();

  useEffect(() => {
    const savedState = localStorage.getItem("teacherSidebarState");
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teacherSidebarState", JSON.stringify(isOpen));
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
        className={`bg-[#EBF4F6] border-r border-slate-200 text-slate-800 flex flex-col transition-all duration-300 ease-in-out z-40 h-full shadow-2xl ${
          isOpen ? "min-w-max" : "w-20"
        } overflow-hidden`}
      >
        <div className="flex items-center p-5 border-b border-slate-200 h-20 relative">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight leading-none text-slate-800">
                  Teacher<span className="text-blue-600">Portal</span>
                </h1>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Faculty</span>
              </div>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-all border border-slate-200 hover:border-slate-300 absolute right-4 top-1/2 -translate-y-1/2"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
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
