"use client";

// ✅ ADD useCallback to your imports
import React, { useState, useEffect, useCallback } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Library, Users } from "lucide-react";

import Link from "next/link";

export default function TeacherDashboard({ loggedInUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIX #1: Extract the user's ID into a stable primitive variable.
  const teacherId = loggedInUser?.id;

  // ✅ FIX #2: Wrap your data fetching logic in a useCallback hook.
  // This tells React to only recreate this function if `teacherId` changes.
  const fetchTeacherDashboardData = useCallback(async () => {
    // We can now safely check for the teacherId here.
    if (!teacherId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/teacher?teacherId=${teacherId}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teacherId]); // The dependency is now the stable ID string.

  // ✅ FIX #3: The main useEffect hook now depends on the stable `fetchTeacherDashboardData` function.
  // This will only run once when the component loads (or if the user actually changes).
  useEffect(() => {
    fetchTeacherDashboardData();
  }, [fetchTeacherDashboardData]);

  if (loading) {
    return <div className="p-8 text-center">Loading your dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }
  if (!dashboardData) {
    return <div className="p-8 text-center">No data available.</div>;
  }

  const welcomeName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Teacher";

  // The rest of your JSX remains the same
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {welcomeName}!
        </h1>
        <p className="text-green-100">Here is your daily teaching summary.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/teacher/courses">
          <DashboardCard
            title="My Courses"
            value={dashboardData.totalCourses}
            icon={<Library className="text-green-600" />}
            colorClass="bg-green-100"
          />
        </Link>
        <Link href="/teacher/students">
          <DashboardCard
            title="My Students"
            value={dashboardData.totalStudents}
            icon={<Users className="text-teal-600" />}
            colorClass="bg-teal-100"
          />
        </Link>
        <Link href="/teacher/groups">
          <DashboardCard
            title="My Groups"
            value={dashboardData.totalGroups}
            icon={<Users className="text-purple-600" />}
            colorClass="bg-purple-100"
          />
        </Link>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2 text-slate-800">
          Next Steps
        </h2>
        <p className="text-slate-500">
          Navigate to the "Groups" section to manage your student rosters for
          each course.
        </p>
      </div>
    </div>
  );
}
