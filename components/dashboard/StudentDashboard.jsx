"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Users,
  Calendar,
  Library,
  TrendingUp,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import UpcomingActivities from "./UpcomingActivities";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" color="blue" className="mx-auto" />
          <p className="text-slate-500 font-bold tracking-tight animate-pulse">Setting up your space...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <Shield size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Can't load your dashboard</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          We encountered a technical hiccup. Please try refreshing to get back on track.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { myProfile, pendingAssignmentsCount, pendingExamsCount } = dashboardData;
  const totalCourses = Array.from(new Set(myProfile.groups.flatMap(group => group.courses.map(course => course.id)))).length;

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
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-slate-50/20 pb-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto p-3 md:p-6 space-y-6"
      >
        {/* Header Section */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
              {getGreeting()}, <span className="text-indigo-600">{myProfile.firstName}</span>!
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Track your academy journey and stay ahead.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700">Academics in good standing</span>
          </div>
        </motion.header>

        {/* Dynamic Greeting/Quote Card - More Compact */}
        <motion.section variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 md:p-10 text-white shadow-xl shadow-blue-200/40">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">Daily Motivation</span>
            <h2 className="text-xl md:text-2xl font-black leading-tight italic">
              "Excellence is not a gift, but a skill that takes practice. Keep pushing forward."
            </h2>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link href="/student/courses" className="px-5 py-2 bg-white text-blue-700 font-black rounded-lg text-[12px] shadow-sm hover:bg-slate-50 transition-colors">Continue Learning</Link>
              <Link href="/student/schedule" className="px-5 py-2 bg-blue-600 text-white font-black rounded-lg text-[12px] border border-white/10 hover:bg-blue-500 transition-colors">View Schedule</Link>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 h-full w-1/4 bg-white/5 skew-x-12 -translate-y-6" />
        </motion.section>

        {/* Stats Grid - Smaller Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Courses", value: totalCourses, icon: BookOpen, color: "blue", href: "/student/courses" },
            { label: "Assignments", value: pendingAssignmentsCount, icon: ClipboardList, color: "indigo", href: "/student/assignments" },
            { label: "Pending Exams", value: pendingExamsCount, icon: FileText, color: "violet", href: "/student/exams" },
            { label: "My Groups", value: myProfile.groups.length, icon: Users, color: "sky", href: "/student/profile" },
          ].map((stat, i) => (
            <motion.div variants={itemVariants} key={stat.label} whileHover={{ y: -5 }}>
              <Link href={stat.href} className="group flex flex-col p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`h-10 w-10 md:h-11 md:w-11 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-3 transition-transform group-hover:scale-105`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-black text-slate-900 leading-none">{stat.value}</span>
                  {stat.value > 0 && <span className="text-[9px] font-bold text-slate-400 mb-0.5">active</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions More Compact */}
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Quick Actions</h3>
                <Link href="/student/settings" className="text-[10px] font-bold text-blue-600 hover:text-blue-800">Preferences</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Schedule", icon: Calendar, href: "/student/schedule", color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Library", icon: Library, href: "/student/e-library", color: "text-indigo-500", bg: "bg-indigo-50" },
                  { label: "Finance", icon: FileText, href: "/student/invoices", color: "text-slate-500", bg: "bg-slate-50" },
                  { label: "Points", icon: TrendingUp, href: "/student/points", color: "text-violet-500", bg: "bg-violet-50" },
                ].map((action) => (
                  <Link
                    href={action.href}
                    key={action.label}
                    className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
                  >
                    <div className={`p-3 ${action.bg} ${action.color} rounded-xl group-hover:bg-opacity-80 transition-all`}>
                      <action.icon size={22} />
                    </div>
                    <span className="text-[12px] font-black text-slate-700 tracking-tight">{action.label}</span>
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* Groups & Community - Compact UI */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">My Study Groups</h3>
                  <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Community & Groups</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myProfile.groups.map((group) => (
                  <div key={group.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-white hover:border-blue-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase text-[12px]">
                        {group.name}
                      </span>
                      <div className="flex -space-x-1.5">
                        {group.students.slice(0, 3).map((s, i) => (
                          <div key={s.id} className={`h-6 w-6 rounded-full bg-slate-200 border-2 border-slate-50 flex items-center justify-center text-[8px] font-black ${i === 0 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {s.firstName[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrolled in:</span>
                       <span className="text-[9px] font-bold text-slate-600">{group.courses?.length || 0} Courses</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Upcoming Activities Side Card */}
            <motion.div variants={itemVariants}>
              <UpcomingActivities 
                assignmentsCount={pendingAssignmentsCount} 
                examsCount={pendingExamsCount} 
              />
            </motion.div>

            {/* Profile Glance - Small Card */}
            <motion.section variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
               <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white shadow-sm">
                 <Users size={32} />
               </div>
               <h4 className="text-md font-black text-slate-900">{myProfile.firstName} {myProfile.lastName}</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{myProfile.role}</p>
               <div className="mt-4 pt-4 border-t border-slate-50">
                 <Link href="/student/profile" className="text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-1.5">
                   Edit Profile Page
                   <ChevronRight size={13} />
                 </Link>
               </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;