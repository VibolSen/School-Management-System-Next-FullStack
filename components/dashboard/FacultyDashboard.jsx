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
} from "lucide-react";
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

export default function FacultyDashboard({ loggedInUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemWideDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!dashboardData) {
    return (
      <p className="p-8 text-center text-slate-500">
        No dashboard data available.
      </p>
    );
  }

  const welcomeName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "User";

  return (
    <div className="space-y-6 animate-fade-in p-6 md:p-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {welcomeName}!
        </h1>
        <p className="text-gray-300">
          Here is a complete overview of the school system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Students"
          value={dashboardData.studentCount}
          icon={<Users />}
        />
        <DashboardCard
          title="Total Teachers"
          value={dashboardData.teacherCount}
          icon={<UserCheck />}
        />
        <DashboardCard
          title="Total Staff"
          value={dashboardData.staffCount}
          icon={<Briefcase />}
        />
        <DashboardCard
          title="Total Departments"
          value={dashboardData.departmentCount}
          icon={<Building2 />}
        />
        <DashboardCard
          title="Total Courses"
          value={dashboardData.courseCount}
          icon={<Library />}
        />
        <DashboardCard
          title="Total Groups"
          value={dashboardData.groupCount}
          icon={<Group />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Courses by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.coursesByDepartment}
              margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                height={50}
                interval={0}
                fontSize={12}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Number of Courses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Students per Group
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.studentsPerGroup}
              margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                height={50}
                interval={0}
                fontSize={12}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}