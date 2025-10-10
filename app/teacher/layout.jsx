"use client";
import { useState, ReactNode } from "react";
import Header from "../../components/nav/Header";
import TeacherSidebar from "../../components/sidebar/TeacherSidebar";



export default function TeacherLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
