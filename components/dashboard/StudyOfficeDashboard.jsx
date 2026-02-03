"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Users,
  Briefcase,
  Building2,
  Library,
  BookOpen,
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  UserCheck,
  Users as Group,
  ChevronRight,
} from "lucide-react";
import AnalyticsChart from "./AnalyticsChart";

export default function StudyOfficeDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudyOfficeDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/study-office");
        if (!response.ok) {
          throw new Error("Failed to fetch Study Office dashboard data");
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

    Promise.all([fetchStudyOfficeDashboardData(), fetchCurrentUser()]).finally(
      () => setLoading(false)
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" color="blue" className="mx-auto" />
          <p className="text-slate-500 font-bold tracking-tight animate-pulse">Accessing Academic Records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 border border-rose-100">
          <Activity size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Service Offline</h2>
        <p className="text-slate-500 max-w-sm mb-8 text-sm font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200">Retry Connection</button>
      </div>
    );
  }

  if (!dashboardData) return null;

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Study Lead";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const chartData = [
    { name: "Students", count: dashboardData.studentCount || 0 },
    { name: "Teachers", count: dashboardData.teacherCount || 0 },
    { name: "Courses", count: dashboardData.courseCount || 0 },
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
              {getGreeting()}, <span className="text-indigo-600">{welcomeName}</span>!
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Academic coordination, student performance, and curriculum monitoring.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Academic Systems Live</span>
          </div>
        </motion.header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Total Students", val: dashboardData.studentCount, icon: Users, color: "blue", href: "/study-office/students" },
            { title: "Total Teachers", val: dashboardData.teacherCount, icon: UserCheck, color: "indigo", href: "/study-office/teachers" },
            { title: "Total Courses", val: dashboardData.courseCount, icon: Library, color: "violet", href: "/study-office/courses" },
            { title: "Departments", val: dashboardData.departmentCount, icon: Building2, color: "sky", href: "/study-office/departments" },
            { title: "Faculties", val: dashboardData.facultyCount, icon: Briefcase, color: "cyan", href: "/study-office/faculty" },
            { title: "Groups", val: dashboardData.groupCount, icon: Group, color: "slate", href: "/study-office/groups" },
          ].map((stat) => (
            <motion.div variants={itemVariants} key={stat.title} whileHover={{ y: -3 }}>
              <Link href={stat.href} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.title}</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{stat.val || 0}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Academic Controls</h3>
                <TrendingUp size={16} className="text-slate-300" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Students", icon: Users, href: "/study-office/students", bg: "bg-blue-50", text: "text-blue-600" },
                  { label: "Teachers", icon: UserCheck, href: "/study-office/teacher", bg: "bg-indigo-50", text: "text-indigo-600" },
                  { label: "Courses", icon: Library, href: "/study-office/courses", bg: "bg-violet-50", text: "text-violet-600" },
                  { label: "Schedules", icon: Calendar, href: "/study-office/schedule", bg: "bg-sky-50", text: "text-sky-600" },
                  { label: "Performance", icon: TrendingUp, href: "/study-office/student-performance", bg: "bg-cyan-50", text: "text-cyan-600" },
                  { label: "E-Library", icon: BookOpen, href: "/study-office/e-library", bg: "bg-slate-50", text: "text-slate-600" },
                  { label: "Analytics", icon: BarChart3, href: "/study-office/reports", bg: "bg-blue-50", text: "text-blue-600" },
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

            {/* Analytics Chart */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 tracking-tight mb-5">Academic Growth</h3>
              <div className="h-[280px]">
                <AnalyticsChart data={chartData} />
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section variants={itemVariants} className="bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                     <TrendingUp size={14} className="text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-50">Academic Intelligence</span>
                 </div>
                 
                 <h4 className="text-lg font-black leading-tight">
                    Academy coordination is overseeing {dashboardData.studentCount} active students.
                 </h4>
                 <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                    With {dashboardData.courseCount} courses currently active, the academic workflow is operating at full capacity.
                 </p>
                 
                 <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-indigo-200 uppercase tracking-tighter">Student/Teacher Ratio</p>
                       <p className="text-sm font-black">
                         {(dashboardData.studentCount / (dashboardData.teacherCount || 1)).toFixed(1)} : 1
                       </p>
                    </div>
                    <Link href="/study-office/reports" className="h-8 w-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <ChevronRight size={16} />
                    </Link>
                 </div>
               </div>
               <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
            </motion.section>

            <motion.section variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
               <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-sm">
                 <Group size={28} />
               </div>
               <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{welcomeName}</h4>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Coordinator</p>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-none">Global</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Scope</p>
                  </div>
                  <div className="h-4 w-px bg-slate-100" />
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-none">Active</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Status</p>
                  </div>
               </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
