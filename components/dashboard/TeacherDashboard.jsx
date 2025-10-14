"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Users, Library, Award } from "lucide-react";
import { FiClipboard, FiAward } from "react-icons/fi";

const TeacherDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/teacher/dashboard?teacherId=${loggedInUser.id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
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

    fetchData();
  }, [loggedInUser]);

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const welcomeName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Teacher";

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="bg-white p-8 rounded-2xl shadow-lg text-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Welcome back, {welcomeName}!
              </h1>
              <p className="text-gray-600 text-lg">
                Here is an overview of your teaching activities.
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
                href="/teacher/assignment"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FiClipboard className="w-4 h-4" />
                <span className="font-medium">Assignments</span>
              </Link>
              <Link
                href="/teacher/gradebook"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FiAward className="w-4 h-4" />
                <span className="font-medium">Gradebook</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="My Students"
            value={dashboardData.totalStudents}
            icon={<Users className="w-6 h-6 text-blue-500" />}
            description="Total students assigned to you"
          />
          <DashboardCard
            title="My Courses"
            value={dashboardData.totalCourses}
            icon={<Library className="w-6 h-6 text-green-500" />}
            description="Courses you are currently teaching"
          />
          <DashboardCard
            title="Average Grade"
            value={`${dashboardData.averageGrade}%`}
            icon={<Award className="w-6 h-6 text-purple-500" />}
            description="Overall average grade of your students"
          />
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Students per Course */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Students per Course
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.studentsPerCourse}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="studentCount"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Grade Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
