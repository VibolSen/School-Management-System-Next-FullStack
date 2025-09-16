"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";

// Using lucide-react for icons. Make sure it's installed: npm install lucide-react
import {
  Users,
  Briefcase,
  Building2,
  Library,
  Group,
  UserCheck,
} from "lucide-react";

// This component will now show a system-wide overview, just like the admin dashboard.
export default function FacultyDashboard({ loggedInUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DATA FETCHING EFFECT
  useEffect(() => {
    // This function now fetches the same data as the admin dashboard.
    const fetchSystemWideDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ CORRECTED: Fetching from the main, system-wide dashboard API.
        const res = await fetch("/api/dashboard");
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch dashboard data");
        }
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemWideDashboardData();
  }, []); // No dependency on loggedInUser needed as it fetches global data.

  // RENDER LOGIC: Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  // RENDER LOGIC: Error State
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  // RENDER LOGIC: No Data State
  if (!dashboardData) {
    return (
      <p className="p-8 text-center text-slate-500">
        No dashboard data available.
      </p>
    );
  }

  // Construct the welcome message.
  const welcomeName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "User";

  // RENDER LOGIC: Success State
  return (
    <div className="space-y-6 animate-fade-in p-6 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {welcomeName}!
        </h1>
        <p className="text-indigo-100">
          Here is a complete overview of the school system.
        </p>
      </div>

      {/* ✅ CORRECTED: Dashboard Cards now show the total system counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Students"
          value={dashboardData.studentCount}
          icon={<Users className="text-blue-600" />}
          gradient="from-blue-500 to-blue-700"
        />
        <DashboardCard
          title="Total Teachers"
          value={dashboardData.teacherCount}
          icon={<UserCheck className="text-green-600" />}
          gradient="from-green-500 to-green-700"
        />
        <DashboardCard
          title="Total Staff"
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
          icon={<Library className="text-sky-600" />}
          gradient="from-sky-500 to-sky-700"
        />
        <DashboardCard
          title="Total Groups"
          value={dashboardData.groupCount}
          icon={<Group className="text-pink-600" />}
          gradient="from-pink-500 to-pink-700"
        />
      </div>
    </div>
  );
}
