// AdministratorDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";

import {
  Users,
  Briefcase,
  Building2,
  Library,
  Group,
  UserCheck,
  Sparkles,
  TrendingUp,
  BarChart3,
  Activity,
  Shield,
} from "lucide-react";

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
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700">
              Loading Dashboard
            </p>
            <p className="text-gray-500">Preparing your analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Data Unavailable
            </h3>
            <p className="text-gray-600">
              We're unable to load your dashboard data at the moment. Please try
              again later.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome back, {welcomeName}!
                </h2>
                <p className="text-gray-600 max-w-2xl">
                  Here's an overview of your school's performance metrics and
                  system status.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  System Status
                </span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Enhanced Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Total Students"
              value={dashboardData.studentCount}
              icon={<Users className="w-6 h-6" />}
              trend="+12%"
              description="Active enrolled students"
              gradient="from-blue-500 to-blue-600"
              delay="0"
            />

            <DashboardCard
              title="Total Teachers"
              value={dashboardData.teacherCount}
              icon={<UserCheck className="w-6 h-6" />}
              trend="+5%"
              description="Teaching staff"
              gradient="from-green-500 to-green-600"
              delay="100"
            />

            <DashboardCard
              title="Total Staff"
              value={dashboardData.staffCount}
              icon={<Briefcase className="w-6 h-6" />}
              trend="+3%"
              description="Administrative staff"
              gradient="from-purple-500 to-purple-600"
              delay="200"
            />

            <DashboardCard
              title="Total Departments"
              value={dashboardData.departmentCount}
              icon={<Building2 className="w-6 h-6" />}
              description="Academic departments"
              gradient="from-orange-500 to-orange-600"
              delay="300"
            />

            <DashboardCard
              title="Total Courses"
              value={dashboardData.courseCount}
              icon={<Library className="w-6 h-6" />}
              trend="+8%"
              description="Available courses"
              gradient="from-indigo-500 to-indigo-600"
              delay="400"
            />

            <DashboardCard
              title="Total Groups"
              value={dashboardData.groupCount}
              icon={<Group className="w-6 h-6" />}
              description="Student groups"
              gradient="from-pink-500 to-pink-600"
              delay="500"
            />
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Manage Users", icon: Users, color: "blue" },
                { label: "View Reports", icon: BarChart3, color: "green" },
                { label: "Settings", icon: Shield, color: "purple" },
                { label: "Analytics", icon: Activity, color: "orange" },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div
                    className={`p-3 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}
                  >
                    <action.icon
                      className={`w-6 h-6 text-${action.color}-600`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
