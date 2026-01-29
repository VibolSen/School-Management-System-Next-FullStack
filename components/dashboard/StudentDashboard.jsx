"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Users,
  Calendar,
  Library,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";

const StudentDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      const fetchStudentDashboardData = async () => {
        try {
          const res = await fetch(
            `/api/dashboard/student?studentId=${loggedInUser.id}`
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

      fetchStudentDashboardData();
    }
  }, [loggedInUser]);

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

  if (error || !dashboardData) {
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

  const { myProfile, pendingAssignmentsCount, pendingExamsCount } =
    dashboardData;

  const totalCourses = Array.from(new Set(myProfile.groups.flatMap(group => group.courses.map(course => course.id)))).length;

  const welcomeName = myProfile
    ? `${myProfile.firstName} ${myProfile.lastName}`
    : "Student";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-gray-800">{welcomeName}</span>
            </p>
          </div>
          {/* A placeholder for system operational status, as student dashboard may not have one */}
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 shadow-sm">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Academics in good standing</span>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Courses"
            value={totalCourses.toString()}
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            description="Courses you are enrolled in"
            bgColor="bg-blue-50"
          />
          <DashboardCard
            title="Pending Assignments"
            value={pendingAssignmentsCount.toString()}
            icon={<ClipboardList className="w-6 h-6 text-orange-600" />}
            description="Assignments that are due"
            bgColor="bg-orange-50"
          />
          <DashboardCard
            title="Upcoming Exams"
            value={pendingExamsCount.toString()}
            icon={<FileText className="w-6 h-6 text-purple-600" />}
            description="Exams you need to take"
            bgColor="bg-purple-50"
          />
          <DashboardCard
            title="My Groups"
            value={myProfile.groups.length.toString()}
            icon={<Users className="w-6 h-6 text-pink-600" />}
            description="Groups you are a member of"
            bgColor="bg-pink-50"
          />
        </section>

        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Assignments",
                icon: ClipboardList,
                href: "/student/assignments",
              },
              { label: "Exams", icon: FileText, href: "/student/exams" },
              { label: "Schedule", icon: Calendar, href: "/student/schedule" },
              { label: "e-Library", icon: Library, href: "/student/e-library" },
              { label: "My Profile", icon: Users, href: "/student/profile" },
              { label: "My Courses", icon: BookOpen, href: "/student/courses" },
              {
                label: "My Certificates",
                icon: FileText,
                href: "/student/certificates",
              },
              {
                label: "My Points",
                icon: TrendingUp,
                href: "/student/points",
              },
            ].map((action, i) => (
              <Link
                href={action.href}
                key={i}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <action.icon className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    {action.label}
                  </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              My Groups
            </h2>
            <ul className="space-y-3">
              {myProfile.groups.map((group) => (
                <li
                  key={group.id}
                  className="p-3 bg-slate-50 rounded-lg"
                >
                  <p className="font-semibold text-slate-800">{group.name}</p>
                  <ul className="space-y-1 mt-2">
                    {group.students.map((student) => (
                      <li key={student.id} className="text-sm text-slate-500">
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;