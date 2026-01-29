// app/admin/dashboard/page.jsx or AdministratorDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building2,
  Library,
  Group,
  UserCheck,
  BarChart3,
  Activity,
  Shield,
  TrendingUp,
  Megaphone,
  ClipboardList,
  FileText,
  Book,
  DollarSign,
  Calendar,
} from "lucide-react";
import AnalyticsChart from "./AnalyticsChart";

export default function AdministratorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchCurrentUser()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <LoadingSpinner size="md" color="blue" className="mx-auto" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <Shield className="w-12 h-12 text-red-500 mb-4" />
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

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Administrator";

  const chartData = [
    { name: "Students", count: dashboardData.studentCount },
    { name: "Teachers", count: dashboardData.teacherCount },
    { name: "Staff", count: dashboardData.staffCount },
    { name: "Departments", count: dashboardData.departmentCount },
    { name: "Courses", count: dashboardData.courseCount },
    { name: "Groups", count: dashboardData.groupCount },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-medium text-gray-800">{welcomeName}</span>
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Students"
            value={dashboardData.studentCount}
            icon={<Users className="w-5 h-5 text-blue-500" />}
            description="Active enrolled students"
            href="/admin/students"
          />
          <DashboardCard
            title="Teachers"
            value={dashboardData.teacherCount}
            icon={<UserCheck className="w-5 h-5 text-green-500" />}
            description="Teaching staff"
            href="/admin/teachers"
          />
          <DashboardCard
            title="Staff"
            value={dashboardData.staffCount}
            icon={<Briefcase className="w-5 h-5 text-purple-500" />}
            description="Administrative staff"
            href="/admin/staff"
          />
          <DashboardCard
            title="Departments"
            value={dashboardData.departmentCount}
            icon={<Building2 className="w-5 h-5 text-orange-500" />}
            description="Academic departments"
            href="/admin/departments"
          />
          <DashboardCard
            title="Courses"
            value={dashboardData.courseCount}
            icon={<Library className="w-5 h-5 text-indigo-500" />}
            description="Available courses"
            href="/admin/courses"
          />
          <DashboardCard
            title="Groups"
            value={dashboardData.groupCount}
            icon={<Group className="w-5 h-5 text-pink-500" />}
            description="Student groups"
            href="/admin/groups"
          />
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              Quick Actions
            </h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              {
                label: "Manage Users",
                icon: Users,
                href: "/admin/users",
              },
              {
                label: "View Reports",
                icon: BarChart3,
                href: "/admin/reports",
              },
              {
                label: "Settings",
                icon: Shield,
                href: "/admin/settings",
              },
              {
                label: "Analytics",
                icon: Activity,
                href: "/admin/course-analytics",
              },
              {
                label: "Announcements",
                icon: Megaphone,
                href: "/admin/announcements",
              },
              {
                label: "Assignments",
                icon: ClipboardList,
                href: "/admin/assignment-management",
              },
              {
                label: "Exams",
                icon: FileText,
                href: "/admin/exam-management",
              },
              {
                label: "E-Library",
                icon: Book,
                href: "/admin/e-library",
              },
              {
                label: "Payroll",
                icon: DollarSign,
                href: "/admin/payroll",
              },
              {
                label: "Schedule",
                icon: Calendar,
                href: "/admin/schedule",
              },
            ].map((action, i) => (
              <Link
                href={action.href}
                key={i}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border hover:bg-gray-50 transition"
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
        <section className="bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            School Overview
          </h3>
          <AnalyticsChart data={chartData} />
        </section>
      </div>
    </div>
  );
}
