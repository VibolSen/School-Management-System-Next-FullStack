"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import Cookies from "js-cookie";

// ✅ MODIFIED: Import real icons from the lucide-react library
import { Users, Briefcase, Building2, Library } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load data.
      </div>
    );
  }

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {welcomeName}!
          </h1>
          <p className="text-blue-100">
            Here's a snapshot of your school's key metrics.
          </p>
        </div>

        {/* ✅ MODIFIED: Use the new icons in the DashboardCard components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Enrolled Students"
            value={dashboardData.studentCount}
            icon={<Users className="text-blue-600" />}
            gradient="from-blue-500 to-blue-700"
          />
          <DashboardCard
            title="Total Staff Members"
            value={dashboardData.staffCount}
            icon={<Briefcase className="text-purple-600" />}
            gradient="from-purple-500 to-purple-700"
          />
          <DashboardCard
            title="Total Departments"
            value={dashboardData.departmentCount}
            icon={<Building2 className="text-amber-600" />}
            gradient="from-amber-500 to-amber-700"
          />
          <DashboardCard
            title="Total Courses"
            value={dashboardData.courseCount}
            icon={<Library className="text-green-600" />}
            gradient="from-green-500 to-green-700"
          />
        </div>
      </div>
    </div>
  );
}
