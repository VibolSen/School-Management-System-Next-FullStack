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
import { Users, Library, Award, TrendingUp } from "lucide-react";
import { FiClipboard, FiAward, FiCalendar, FiUsers, FiFileText, FiTrendingUp } from "react-icons/fi";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-gray-800">{welcomeName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 shadow-sm">
            <FiClipboard className="w-5 h-5" /> {/* Using FiClipboard as a generic icon for operational status */}
            <span className="text-sm font-medium">All systems operational</span>
          </div>
        </header>

        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="My Students"
            value={dashboardData.totalStudents}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            description="Total students assigned to you"
            bgColor="bg-blue-50"
          />
          <DashboardCard
            title="My Courses"
            value={dashboardData.totalCourses}
            icon={<Library className="w-6 h-6 text-green-600" />}
            description="Courses you are currently teaching"
            bgColor="bg-green-50"
          />
          <DashboardCard
            title="Average Grade"
            value={`${dashboardData.averageGrade}%`}
            icon={<Award className="w-6 h-6 text-purple-600" />}
            description="Overall average grade of your students"
            bgColor="bg-purple-50"
          />
        </section>

        {/* Quick Actions */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <Link
                href="/teacher/assignment"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <FiClipboard className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    Assignments
                  </span>
              </Link>
              <Link
                href="/teacher/gradebook"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <FiAward className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    Gradebook
                  </span>
              </Link>
              <Link
                href="/teacher/schedule"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <FiCalendar className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    My Schedules
                  </span>
              </Link>
              <Link
                href="/teacher/students"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <FiUsers className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    My Students
                  </span>
              </Link>
              <Link
                href="/teacher/student-performance"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <FiTrendingUp className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    Student Performance
                  </span>
              </Link>
              <Link
                href="/teacher/courses"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <Library className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    My Courses
                  </span>
              </Link>
              <Link
                href="/teacher/exam"
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <FiFileText className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    Exams
                  </span>
              </Link>
            </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Students per Course */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200">
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
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200">
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
