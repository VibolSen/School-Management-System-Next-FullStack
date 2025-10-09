"use client";
import { useState, ReactNode } from "react";
import Header from "../../components/nav/Header";
import FacultySidebar from "@/components/sidebar/FacultySidebar";



export default function FacultyLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - pass all required props */}
      <FacultySidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
