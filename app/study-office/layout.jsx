"use client";
import { useState } from "react";
import Header from "../../components/nav/Header";
import StudyOfficeSidebar from "@/components/sidebar/StudyOfficeSidebar";

export default function StudyOfficeLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <StudyOfficeSidebar isOpen={sidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
