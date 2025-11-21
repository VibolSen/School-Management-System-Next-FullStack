// app/faculty/dashboard/FacultyDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import Link from "next/link";
import {
  Book,
  Users,
  ClipboardList,
  BarChart2,
  Calendar,
  Settings,
  User,
  Activity,
  Building2,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import AnalyticsChart from "./AnalyticsChart";
import { useUser } from "@/context/UserContext";

export default function FacultyDashboard() {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard"); // Adjust API endpoint if needed
      if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <Activity className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Dashboard data unavailable
        </h2>
        <p className="text-gray-600 mb-4">
          Please check your connection or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const welcomeName = user
    ? `${user.firstName} ${user.lastName}`
    : "Faculty Member";

  const chartData = [
    { name: "Courses", count: dashboardData.courseCount || 0 },
    { name: "Students", count: dashboardData.studentCount || 0 },
    { name: "Assignments", count: dashboardData.assignmentCount || 0 },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{welcomeName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border rounded-md px-4 py-2 shadow-sm">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">
              All systems operational
            </span>
          </div>
        </header>

        {/* Cards Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  <DashboardCard
                    title="My Students"
                    value={dashboardData.studentCount || 0}
                    icon={<Users className="w-6 h-6 text-green-500" />}
                    description="Students in your courses"
                    href="/faculty/students"
                  />
                  <DashboardCard
                    title="My Courses"
                    value={dashboardData.courseCount || 0}
                    icon={<Book className="w-6 h-6 text-blue-500" />}
                    description="Courses you are teaching"
                    href="/faculty/courses"
                  />
                  <DashboardCard
                    title="My Departments"
                    value={dashboardData.departmentCount || 0}
                    icon={<Building2 className="w-6 h-6 text-purple-500" />}
                    description="Departments you are associated with"
                    href="/faculty/departments"
                  />
                  <DashboardCard
                    title="My Groups"
                    value={dashboardData.groupCount || 0}
                    icon={<Users className="w-6 h-6 text-green-500" />}
                    description="Groups you manage"
                    href="/faculty/groups"
                  />
                </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              {
                label: "My Profile",
                icon: User,
                href: "/faculty/profile",
              },
              {
                label: "My Schedule",
                icon: Calendar,
                href: "/faculty/schedule",
              },
              {
                label: "Gradebook",
                icon: BarChart2,
                href: "/faculty/gradebook",
              },
              {
                label: "Settings",
                icon: Settings,
                href: "/faculty/settings",
              },
              {
                label: "Course Management",
                icon: Book,
                href: "/faculty/courses",
              },
              {
                label: "Student Performance",
                icon: TrendingUp,
                href: "/faculty/student-performance",
              },
              {
                label: "Reports & Analytics",
                icon: BarChart2,
                href: "/faculty/reports",
              },
              {
                label: "E-Library",
                icon: BookOpen,
                href: "/faculty/e-library",
              },
            ].map((action, i) => (
              <Link
                href={action.href}
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition"
              >
                <div className="p-2 bg-gray-100 rounded-md">
                  <action.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* My Schedule */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Schedule
          </h3>
          <div className="space-y-4">
            {dashboardData.schedule?.length > 0 ? (
              dashboardData.schedule.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="font-semibold text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
                    {item.time}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.course}</p>
                    <p className="text-sm text-gray-500">{item.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No classes scheduled for today.</p>
            )}
          </div>
        </section>

        {/* Analytics Chart */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Overview
          </h3>
          <AnalyticsChart data={chartData} />
        </section>
      </div>
    </div>
  );
}