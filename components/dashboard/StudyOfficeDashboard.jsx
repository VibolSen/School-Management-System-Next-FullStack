"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Users,
  Briefcase,
  Building2,
  Library,
  BookOpen,
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  UserCheck,
  Users as Group,
} from "lucide-react";
import AnalyticsChart from "./AnalyticsChart";

export default function StudyOfficeDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudyOfficeDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/study-office");
        if (!response.ok) {
          throw new Error("Failed to fetch Study Office dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch current user");
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([fetchStudyOfficeDashboardData(), fetchCurrentUser()]).finally(
      () => setLoading(false)
    );
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Study Office Manager";

  const chartData = [
    { name: "Students", count: dashboardData.studentCount || 0 },
    { name: "Teachers", count: dashboardData.teacherCount || 0 },
    { name: "Courses", count: dashboardData.courseCount || 0 },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Study Office Dashboard
            </h1>
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
            title="Total Students"
            value={dashboardData.studentCount?.toString() || "N/A"}
            icon={<Users className="w-6 h-6 text-blue-500" />}
            description="All enrolled students"
            href="/study-office/students"
          />
          <DashboardCard
            title="Total Teachers"
            value={dashboardData.teacherCount?.toString() || "N/A"}
            icon={<UserCheck className="w-6 h-6 text-green-500" />}
            description="All teaching staff"
            href="/study-office/teachers"
          />
          <DashboardCard
            title="Total Courses"
            value={dashboardData.courseCount?.toString() || "N/A"}
            icon={<Library className="w-6 h-6 text-indigo-500" />}
            description="All available courses"
            href="/study-office/courses"
          />
          <DashboardCard
            title="Total Departments"
            value={dashboardData.departmentCount?.toString() || "N/A"}
            icon={<Building2 className="w-6 h-6 text-orange-500" />}
            description="All academic departments"
            href="/study-office/departments"
          />
          <DashboardCard
            title="Total Faculties"
            value={dashboardData.facultyCount?.toString() || "N/A"}
            icon={<Briefcase className="w-6 h-6 text-purple-500" />}
            description="All faculties"
            href="/study-office/faculty"
          />
          <DashboardCard
            title="Total Groups"
            value={dashboardData.groupCount?.toString() || "N/A"}
            icon={<Group className="w-6 h-6 text-pink-500" />}
            description="All student groups"
            href="/study-office/groups"
          />
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Manage Students",
                icon: Users,
                href: "/study-office/students",
              },
              {
                label: "Manage Teachers",
                icon: UserCheck,
                href: "/study-office/teacher",
              },
              {
                label: "Manage Courses",
                icon: Library,
                href: "/study-office/courses",
              },
              {
                label: "Manage Schedules",
                icon: Calendar,
                href: "/study-office/schedule",
              },
              {
                label: "Student Performance",
                icon: TrendingUp,
                href: "/study-office/student-performance",
              },
              {
                label: "E-Library",
                icon: BookOpen,
                href: "/study-office/e-library",
              },
              {
                label: "Reports & Analytics",
                icon: BarChart3,
                href: "/study-office/reports",
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

        {/* Analytics Chart */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Study Office Overview
          </h3>
          <AnalyticsChart data={chartData} />
        </section>
      </div>
    </div>
  );
}
