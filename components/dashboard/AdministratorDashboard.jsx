"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building2,
  Library,
  Users as Group,
  UserCheck,
  BarChart3,
  Activity,
  Shield,
  TrendingUp,
  Megaphone,
  ClipboardList,
  FileText,
  Book,
  DollarSign,
  Calendar,
  ChevronRight,
} from "lucide-react";
import AnalyticsChart from "./AnalyticsChart";

export default function AdministratorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchCurrentUser()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" color="blue" className="mx-auto" />
          <p className="text-slate-500 font-bold tracking-tight animate-pulse">Initializing Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <Shield size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Systems Unreachable</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium text-sm">
          We couldn't establish a secure connection to the dashboard services.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Reconnect
        </button>
      </div>
    );
  }

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Admin";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const chartData = [
    { name: "Students", count: dashboardData.studentCount },
    { name: "Teachers", count: dashboardData.teacherCount },
    { name: "Staff", count: dashboardData.staffCount },
    { name: "Depts", count: dashboardData.departmentCount },
    { name: "Courses", count: dashboardData.courseCount },
    { name: "Groups", count: dashboardData.groupCount },
  ];

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
              {getGreeting()}, <span className="text-indigo-600">{welcomeName}</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage school operations and monitor academic performance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              System Core: Operational
            </span>
          </div>
        </motion.header>

        {/* Stats Section - More Compact */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { title: "Students", val: dashboardData.studentCount, icon: Users, color: "blue", href: "/admin/students" },
            { title: "Teachers", val: dashboardData.teacherCount, icon: UserCheck, color: "indigo", href: "/admin/teachers" },
            { title: "Staff", val: dashboardData.staffCount, icon: Briefcase, color: "slate", href: "/admin/staff" },
            { title: "Departments", val: dashboardData.departmentCount, icon: Building2, color: "sky", href: "/admin/departments" },
            { title: "Courses", val: dashboardData.courseCount, icon: Library, color: "violet", href: "/admin/courses" },
            { title: "Groups", val: dashboardData.groupCount, icon: Group, color: "cyan", href: "/admin/groups" },
          ].map((stat, i) => (
            <motion.div variants={itemVariants} key={stat.title} whileHover={{ y: -3 }}>
              <Link href={stat.href} className="group flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.title}</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{stat.val}</p>
                </div>
                <div className={`h-9 w-9 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shrink-0`}>
                  <stat.icon size={18} />
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions - Compact Grid */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">System Controls</h3>
                <TrendingUp size={16} className="text-slate-300" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { label: "Users", icon: Users, href: "/admin/users", bg: "bg-blue-50", text: "text-blue-600" },
                  { label: "Reports", icon: BarChart3, href: "/admin/reports", bg: "bg-indigo-50", text: "text-indigo-600" },
                  { label: "Settings", icon: Shield, href: "/admin/settings", bg: "bg-slate-50", text: "text-slate-600" },
                  { label: "Announce", icon: Megaphone, href: "/admin/announcements", bg: "bg-violet-50", text: "text-violet-600" },
                  { label: "Payroll", icon: DollarSign, href: "/admin/payroll", bg: "bg-emerald-50", text: "text-emerald-600" },
                  { label: "Schedule", icon: Calendar, href: "/admin/schedule", bg: "bg-sky-50", text: "text-sky-600" },
                  { label: "Exams", icon: FileText, href: "/admin/exam-management", bg: "bg-purple-50", text: "text-purple-600" },
                  { label: "Lib", icon: Book, href: "/admin/e-library", bg: "bg-cyan-50", text: "text-cyan-600" },
                  { label: "Grades", icon: ClipboardList, href: "/admin/assignment-management", bg: "bg-teal-50", text: "text-teal-600" },
                  { label: "History", icon: Activity, href: "/admin/course-analytics", bg: "bg-blue-50", text: "text-blue-600" },
                ].map((action) => (
                  <Link
                    href={action.href}
                    key={action.label}
                    className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-slate-50/50 transition-all active:scale-95"
                  >
                    <div className={`p-3 ${action.bg} ${action.text} rounded-lg group-hover:bg-white transition-all shadow-sm`}>
                      <action.icon size={20} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 text-center tracking-tight leading-none px-1">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* School Overview Chart */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 tracking-tight mb-5">
                School Overview
              </h3>
              <div className="h-[280px]">
                <AnalyticsChart data={chartData} />
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area - Insights */}
          <div className="space-y-6">
            <motion.section variants={itemVariants} className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200/50 overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                    <TrendingUp size={14} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-50">Intelligence Report</span>
                </div>
                
                {dashboardData.studentsPerGroup?.length > 0 ? (
                  <>
                    <h4 className="text-lg font-black leading-tight">
                      {dashboardData.studentsPerGroup.sort((a, b) => b.count - a.count)[0].name} is currently your largest group.
                    </h4>
                    <p className="text-xs text-blue-100 font-medium leading-relaxed">
                      With {dashboardData.studentsPerGroup[0].count} students, this group represents a significant portion of your active student body.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-black leading-tight">System population overview: {dashboardData.studentCount} Students.</h4>
                    <p className="text-xs text-blue-100 font-medium leading-relaxed">Ensure all academic schedules are optimized for the current enrollment levels.</p>
                  </>
                )}

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                   <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-blue-200 uppercase tracking-tighter">Student/Teacher Ratio</p>
                      <p className="text-sm font-black">
                        {(dashboardData.studentCount / (dashboardData.teacherCount || 1)).toFixed(1)} : 1
                      </p>
                   </div>
                   <Link href="/admin/reports" className="h-8 w-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                     <ChevronRight size={16} />
                   </Link>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-10 top-0 h-40 w-40 bg-indigo-400/20 rounded-full blur-3xl" />
            </motion.section>

            <motion.section variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
               <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-sm">
                 <Shield size={28} />
               </div>
               <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{welcomeName}</h4>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Control</p>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-none">High</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Security</p>
                  </div>
                  <div className="h-4 w-px bg-slate-100" />
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-none">v4.2</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Version</p>
                  </div>
               </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
