"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Grid, // for Departments
  Hash, // for Groups
  Briefcase, // for Teachers/Faculty
  User, // for Students
  Send,
  Code,
  Calendar,
  FileText, // for Exams
  ClipboardList, // for Assignments
} from "lucide-react";
import { usePathname } from "next/navigation";

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

const STUDY_OFFICE_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <Home />,
    href: "/study-office/dashboard",
  },
  {
    label: "Faculty",
    icon: <Briefcase />,
    href: "/study-office/faculty",
  },
  {
    label: "Departments",
    icon: <Grid />,
    href: "/study-office/departments",
  },
  {
    label: "Courses",
    icon: <Book />,
    href: "/study-office/courses",
  },
  {
    label: "Groups",
    icon: <Hash />,
    href: "/study-office/groups",
  },
  {
    label: "Teachers",
    icon: <Users />,
    href: "/study-office/teacher",
  },
  {
    label: "Students",
    icon: <User />,
    href: "/study-office/students",
  },
  {
    label: "Schedule Management",
    icon: <Calendar />,
    href: "/study-office/schedule",
  },
  {
    label: "Gradebook",
    icon: <BookOpen />,
    href: "/study-office/gradebook",
  },
  {
    label: "Assignments",
    icon: <ClipboardList />,
    href: "/study-office/assignments",
  },
  {
    label: "Exams",
    icon: <FileText />,
    href: "/study-office/exams",
  },
  {
    label: "Student Performance",
    icon: <TrendingUp />,
    href: "/study-office/student-performance",
  },
  {
    label: "Reports & Analytics",
    icon: <BarChart2 />,
    href: "/study-office/reports",
  },
  {
    label: "Course Analytics",
    icon: <BarChart2 />,
    href: "/study-office/course-analytics",
  },
  {
    label: "E-Library",
    icon: <BookOpen />,
    href: "/study-office/e-library",
  },
  {
    label: "My Attendance",
    icon: <Calendar />,
    href: "/study-office/my-attendance",
  },
];

export default function StudyOfficeSidebar({ initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const isCollapsed = !isOpen;
  const pathname = usePathname();

  useEffect(() => {
    const savedState = localStorage.getItem("studyOfficeSidebarState");
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studyOfficeSidebarState", JSON.stringify(isOpen));
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
                <Briefcase size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight leading-none text-slate-800">
                  Academic<span className="text-blue-600">Portal</span>
                </h1>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Study Office</span>
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
            {STUDY_OFFICE_NAV_ITEMS.map((item) => (
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

        <div className="px-3 py-4 border-t border-slate-200">
          <NavLink
            icon={<Settings size={20} />}
            label="Settings"
            href="/study-office/settings"
            isActive={pathname === "/study-office/settings"}
            isCollapsed={isCollapsed}
          />
        </div>
      </aside>
    </>
  );
}
