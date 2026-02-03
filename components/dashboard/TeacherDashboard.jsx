"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
  Cell,
} from "recharts";
import {
  Users,
  Library,
  Award,
  TrendingUp,
  ClipboardList,
  Calendar,
  FileText,
  ChevronRight,
  Activity,
} from "lucide-react";

const TeacherDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" color="blue" className="mx-auto" />
          <p className="text-slate-500 font-bold tracking-tight animate-pulse">Gathering Classroom Insights...</p>
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
        <h2 className="text-xl font-black text-slate-900 mb-2">Sync Failed</h2>
        <p className="text-slate-500 max-w-sm mb-8 text-sm font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200">Retry Connection</button>
      </div>
    );
  }

  if (!dashboardData) return null;

  const welcomeName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Teacher";

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
              {getGreeting()}, <span className="text-indigo-600">Prof. {welcomeName}</span>!
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Empower your students and manage your curriculum with ease.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 border-l-indigo-500">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Teaching Mode Active</span>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "My Students", val: dashboardData.totalStudents, icon: Users, color: "blue" },
            { title: "My Courses", val: dashboardData.totalCourses, icon: Library, color: "indigo" },
            { title: "Avg Grade", val: `${dashboardData.averageGrade}%`, icon: Award, color: "violet" },
          ].map((stat) => (
            <motion.div variants={itemVariants} key={stat.title} whileHover={{ y: -3 }}>
              <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">{stat.val}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shrink-0`}>
                  <stat.icon size={22} />
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Academic Tools</h3>
                <TrendingUp size={16} className="text-slate-300" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { label: "Assigned", icon: ClipboardList, href: "/teacher/assignment", bg: "bg-blue-50", text: "text-blue-600" },
                  { label: "Grades", icon: Award, href: "/teacher/gradebook", bg: "bg-indigo-50", text: "text-indigo-600" },
                  { label: "Schedule", icon: Calendar, href: "/teacher/schedule", bg: "bg-sky-50", text: "text-sky-600" },
                  { label: "Students", icon: Users, href: "/teacher/students", bg: "bg-violet-50", text: "text-violet-600" },
                  { label: "Courses", icon: Library, href: "/teacher/courses", bg: "bg-slate-50", text: "text-slate-600" },
                  { label: "Exams", icon: FileText, href: "/teacher/exam", bg: "bg-purple-50", text: "text-purple-600" },
                  { label: "Stats", icon: TrendingUp, href: "/teacher/student-performance", bg: "bg-cyan-50", text: "text-cyan-600" },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Students per Course</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.studentsPerCourse}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="studentCount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Grade Distribution</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.section variants={itemVariants} className="bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200/40 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                     <Activity size={14} className="text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-50">Classroom Intel</span>
                 </div>

                 <h4 className="text-lg font-black leading-tight">
                    Average class performance is currently at {dashboardData.averageGrade}%.
                 </h4>
                 <p className="text-xs text-blue-100 font-medium leading-relaxed italic">
                    "The art of teaching is the art of assisting discovery." - You are managing {dashboardData.totalStudents} students effectively.
                 </p>
                 
                 <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-blue-200 uppercase tracking-tighter">Engagement Scope</p>
                       <p className="text-sm font-black">
                         {dashboardData.totalCourses} Active Courses
                       </p>
                    </div>
                    <Link href="/teacher/student-performance" className="h-8 w-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <ChevronRight size={16} />
                    </Link>
                 </div>
               </div>
               <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
            </motion.section>

            <motion.section variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
               <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-sm">
                 <Users size={28} />
               </div>
               <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{welcomeName}</h4>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Certified Instructor</p>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-none">{dashboardData.totalCourses}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Courses</p>
                  </div>
                  <div className="h-4 w-px bg-slate-100" />
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-none">{dashboardData.totalStudents}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Students</p>
                  </div>
               </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
