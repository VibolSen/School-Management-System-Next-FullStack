"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";
import FullPageLoading from "@/components/ui/FullPageLoading";
import {
  Briefcase,
  Building2,
  Users,
  CalendarCheck,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
  ClipboardList,
  Send,
  UserPlus,
  DollarSign,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const HRDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHRDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/hr");
        if (!response.ok) {
          throw new Error("Failed to fetch HR dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch current user");
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([fetchHRDashboardData(), fetchCurrentUser()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return <FullPageLoading message="Synchronizing dashboard data..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const {
    totalStaff,
    staffByStatus,
    totalDepartments,
    coursesByDepartment,
    studentsPerGroup,
  } = dashboardData;
  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "HR Manager";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 space-y-5">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              HR Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-gray-800">{welcomeName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 shadow-sm">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">All systems operational</span>
          </div>
        </header>

        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Staff"
            value={totalStaff.toString()}
            icon={<Briefcase className="w-5 h-5 text-purple-500" />}
            description="All staff members"
            href="/hr/staff"
          />
          <DashboardCard
            title="Total Departments"
            value={totalDepartments.toString()}
            icon={<Building2 className="w-5 h-5 text-orange-500" />}
            description="All departments"
            href="/hr/reports"
          />
          <DashboardCard
            title="Total Teachers"
            value={dashboardData.totalTeachers?.toString() || "N/A"}
            icon={<Users className="w-5 h-5 text-blue-500" />}
            description="Total teaching staff"
            href="/hr/staff"
          />
        </section>

        {/* Quick Actions */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              Quick Actions
            </h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: "Manage Staff", icon: Users, href: "/hr/staff" },
              { label: "Attendance", icon: CalendarCheck, href: "/hr/attendance" },
              { label: "Reports", icon: BarChart3, href: "/hr/reports" },
              { label: "Settings", icon: Settings, href: "/hr/settings" },
              { label: "Job Postings", icon: ClipboardList, href: "/hr/job-postings" },
              { label: "Manage Attendance", icon: UserPlus, href: "/hr/manage-attendance" },
            ].map((action, i) => (
              <Link
                href={action.href}
                key={i}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-colors">
                  <action.icon className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                    {action.label}
                  </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Staff by Role
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={staffByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {staffByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Courses by Department
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={coursesByDepartment}
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
                <Bar dataKey="count" fill="#3b82f6" name="Number of Courses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Students per Group
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={studentsPerGroup}
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
                <Bar dataKey="count" fill="#8884d8" name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HRDashboard;
