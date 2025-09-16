"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard"; // Assuming this is the correct path
import { Library, Users } from "lucide-react"; // Using lucide-react for icons

export default function TeacherDashboard({ loggedInUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedInUser?.id) {
      const fetchTeacherDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch from our dedicated teacher dashboard API
          const res = await fetch(
            `/api/dashboard/teacher?teacherId=${loggedInUser.id}`
          );
          if (!res.ok) throw new Error("Failed to fetch dashboard data");
          const data = await res.json();
          setDashboardData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTeacherDashboardData();
    }
  }, [loggedInUser]);

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

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {welcomeName}!
        </h1>
        <p className="text-green-100">Here is your daily teaching summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="My Courses"
          value={dashboardData.totalCourses}
          icon={<Library className="text-green-600" />}
          colorClass="bg-green-100"
        />
        <DashboardCard
          title="My Students"
          value={dashboardData.totalStudents}
          icon={<Users className="text-teal-600" />}
          colorClass="bg-teal-100"
        />
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
