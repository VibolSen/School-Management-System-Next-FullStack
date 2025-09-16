"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
// Using lucide-react for icons. Replace with your actual icon components if different.
import { Library, Group, Users } from "lucide-react";

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
          // ✅ CORRECT: Fetching from the new, specific teacher dashboard API
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
    return <div className="p-8 text-center">Loading...</div>;
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Courses I Lead"
          value={dashboardData.totalCourses}
          icon={<Library className="text-green-600" />}
        />
        <DashboardCard
          title="Total Groups"
          value={dashboardData.totalGroups}
          icon={<Group className="text-teal-600" />}
        />
        <DashboardCard
          title="Total Students"
          value={dashboardData.totalStudents}
          icon={<Users className="text-cyan-600" />}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          My Assigned Courses
        </h2>
        {dashboardData.courseList && dashboardData.courseList.length > 0 ? (
          <ul className="space-y-2">
            {dashboardData.courseList.map((course) => (
              <li key={course.id} className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-700">{course.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-4">
            You are not currently assigned to lead any courses.
          </p>
        )}
      </div>
    </div>
  );
}
