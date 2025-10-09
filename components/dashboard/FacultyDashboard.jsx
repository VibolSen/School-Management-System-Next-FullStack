"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Users,
  Briefcase,
  Building2,
  Library,
  Group,
  UserCheck,
  Calendar,
  Bell,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function FacultyDashboard({ loggedInUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchSystemWideDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch dashboard data");
        }
        const data = await res.json();
        setDashboardData(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemWideDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-semibold text-slate-600 animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-600">
            Unable to Load Dashboard
          </h2>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-500">
            No dashboard data available
          </p>
        </div>
      </div>
    );
  }

  const welcomeName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Faculty Member";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative z-10 p-6 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg text-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Welcome back, {welcomeName}!
              </h1>
              <p className="text-gray-600 text-lg">
                Here is a complete overview of the school system.
              </p>
              {lastUpdated && (
                <p className="text-gray-500 text-sm">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/faculty/schedule"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Schedule</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="font-medium">Alerts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1">
          <div className="flex space-x-1">
            {[
              { name: "overview", href: "#" },
              { name: "analytics", href: "#" },
              { name: "courses", href: "/faculty/courses" },
              { name: "students", href: "/faculty/students" },
            ].map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md font-medium transition-all text-sm ${
                  activeTab === tab.name
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-8">
          {/* System Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/faculty/students">
              <DashboardCard
                title="Total Students"
                value={dashboardData.studentCount}
                icon={<Users className="w-6 h-6" />}
                gradient="from-blue-500/20 to-blue-600/10"
                description="Currently enrolled students"
              />
            </Link>
            <Link href="/faculty/teacher">
              <DashboardCard
                title="Total Teachers"
                value={dashboardData.teacherCount}
                icon={<UserCheck className="w-6 h-6" />}
                gradient="from-emerald-500/20 to-emerald-600/10"
                description="Active teaching staff"
              />
            </Link>
            <Link href="/faculty/staff">
              <DashboardCard
                title="Total Staff"
                value={dashboardData.staffCount}
                icon={<Briefcase className="w-6 h-6" />}
                gradient="from-purple-500/20 to-purple-600/10"
                description="Non-teaching staff members"
              />
            </Link>
            <Link href="/faculty/departments">
              <DashboardCard
                title="Total Departments"
                value={dashboardData.departmentCount}
                icon={<Building2 className="w-6 h-6" />}
                gradient="from-amber-500/20 to-amber-600/10"
                description="Academic departments"
              />
            </Link>
            <Link href="/faculty/courses">
              <DashboardCard
                title="Total Courses"
                value={dashboardData.courseCount}
                icon={<Library className="w-6 h-6" />}
                gradient="from-sky-500/20 to-sky-600/10"
                description="Available courses offered"
              />
            </Link>
            <Link href="/faculty/groups">
              <DashboardCard
                title="Total Groups"
                value={dashboardData.groupCount}
                icon={<Group className="w-6 h-6" />}
                gradient="from-rose-500/20 to-rose-600/10"
                description="Student study groups"
              />
            </Link>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Courses by Department */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Courses by Department
                </h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dashboardData.coursesByDepartment}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                    tick={{ fill: "#4b5563" }}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    name="Number of Courses"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Students per Group */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Students per Group
                </h2>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dashboardData.studentsPerGroup}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                    tick={{ fill: "#4b5563" }}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#10b981"
                    name="Number of Students"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">System operational</span>
          </div>
          <div className="text-sm text-gray-500">Faculty Dashboard</div>
        </div>
      </div>
    </div>
  );
}
