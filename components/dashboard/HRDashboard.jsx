"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  ChevronRight,
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

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#0ea5e9", "#64748b"];

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
        setError(err instanceof Error ? err.message : "An unknown error occurred");
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <FullPageLoading message="Synchronizing HR Intel..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 border border-rose-100">
          <Activity size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mb-8 text-sm font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200">Retry Connection</button>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    totalStaff,
    staffByStatus,
    totalDepartments,
    coursesByDepartment,
    studentsPerGroup,
  } = dashboardData;

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "HR Lead";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-slate-50/20 pb-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto p-3 md:p-6 space-y-6"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
              {getGreeting()}, <span className="text-indigo-600">{welcomeName}</span>!
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Overview of academy staff, departments, and resource allocation.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">HR Systems Connected</span>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: "Total Staff", val: totalStaff, icon: Briefcase, color: "blue", href: "/hr/staff" },
            { title: "Departments", val: totalDepartments, icon: Building2, color: "indigo", href: "/hr/reports" },
            { title: "Teachers", val: dashboardData.totalTeachers || 0, icon: Users, color: "violet", href: "/hr/staff" },
            { title: "Open Roles", val: 0, icon: UserPlus, color: "sky", href: "/hr/job-postings" },
          ].map((stat) => (
            <motion.div variants={itemVariants} key={stat.title} whileHover={{ y: -3 }}>
              <Link href={stat.href} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.title}</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{stat.val}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Quick Actions */}
        <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">HR Operations</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Management</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Staff", icon: Users, href: "/hr/staff", bg: "bg-blue-50", text: "text-blue-600" },
              { label: "Attendance", icon: CalendarCheck, href: "/hr/attendance", bg: "bg-indigo-50", text: "text-indigo-600" },
              { label: "Analytics", icon: BarChart3, href: "/hr/reports", bg: "bg-violet-50", text: "text-violet-600" },
              { label: "Careers", icon: ClipboardList, href: "/hr/job-postings", bg: "bg-sky-50", text: "text-sky-600" },
              { label: "Hire", icon: UserPlus, href: "/hr/manage-attendance", bg: "bg-cyan-50", text: "text-cyan-600" },
              { label: "Portal", icon: Settings, href: "/hr/settings", bg: "bg-slate-50", text: "text-slate-600" },
            ].map((action) => (
              <Link
                href={action.href}
                key={action.label}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-slate-50/50 transition-all active:scale-95"
              >
                <div className={`p-3.5 ${action.bg} ${action.text} rounded-xl group-hover:bg-white transition-all shadow-sm`}>
                  <action.icon size={20} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 text-center tracking-tight leading-none px-1">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Staffing Levels</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={staffByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={45}
                    paddingAngle={5}
                  >
                    {staffByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Curriculum Distribution</h3>
              <p className="text-[10px] font-bold text-slate-400">Total Courses by Department</p>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coursesByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    fontWeight={700}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* Students per Group - Compact Bar Chart */}
        <motion.section variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Group Density</h3>
            <TrendingUp size={16} className="text-slate-300" />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsPerGroup}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default HRDashboard;
