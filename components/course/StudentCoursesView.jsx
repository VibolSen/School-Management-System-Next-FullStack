"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  UserIcon,
  SearchIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react";

export default function StudentCoursesView({ loggedInUser }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const studentId = loggedInUser?.id;

  const fetchStudentCourses = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/my-courses?studentId=${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch your courses.");
      setCourses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentCourses();
  }, [fetchStudentCourses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseDepartments[0]?.department?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (course.leadBy &&
          `${course.leadBy.firstName} ${course.leadBy.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [courses, searchTerm]);

  const stats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter(c => (c.progress || 0) >= 100).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  }, [courses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="space-y-6 p-2 md:p-4 bg-slate-50/20 rounded-2xl">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div 
          initial={{ x: -15, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100/50 mb-1">
            <BookOpenIcon size={12} />
            Learning Journey
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            My Courses
          </h1>
          <p className="text-slate-500 text-sm max-w-md">
            Track your education and continue where you left off.
          </p>
        </motion.div>

        <motion.div 
          initial={{ x: 15, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="relative group max-w-sm w-full"
        >
          <SearchIcon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 text-sm font-medium rounded-xl border border-slate-200
                       shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
          />
        </motion.div>
      </div>

      {/* Stats Section */}
      {!isLoading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Enrolled", value: stats.total, color: "blue", icon: BookOpenIcon },
            { label: "Active", value: stats.inProgress, color: "orange", icon: ClockIcon },
            { label: "Completed", value: stats.completed, color: "emerald", icon: CheckCircleIcon },
          ].map((stat, i) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5"
              >
                <div className={`h-10 w-10 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 leading-tight">{stat.value}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 rounded-xl bg-white border border-slate-100 flex flex-col p-4 animate-pulse"
            >
              <div className="h-20 bg-slate-50 rounded-lg mb-4" />
              <div className="h-5 w-3/4 bg-slate-50 rounded-md mb-2" />
              <div className="h-3 w-1/2 bg-slate-50 rounded-md mb-6" />
              <div className="mt-auto h-1.5 w-full bg-slate-50 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed rounded-2xl border-slate-200">
          <BookOpenIcon size={32} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredCourses.map((course, idx) => {
            const progress = course.progress || 0;
            const gradients = [
              "from-blue-600 to-indigo-600",
              "from-purple-600 to-pink-600",
              "from-emerald-600 to-teal-600",
              "from-orange-600 to-red-600",
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <motion.div
                key={course.id}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl bg-white border border-slate-200 shadow-sm
                           transition-all duration-300 hover:shadow-md hover:border-blue-500/40 overflow-hidden flex flex-col"
              >
                {/* Compact Visual Header */}
                <div className={`h-16 bg-gradient-to-br ${gradient} p-3 flex items-start justify-between overflow-hidden relative`}>
                  <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <BookOpenIcon size={64} />
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white border border-white/20 z-10">
                    <UserIcon size={10} className="opacity-80" />
                    <span className="text-[10px] font-bold truncate max-w-[100px]">
                      {course.leadBy ? `${course.leadBy.firstName} ${course.leadBy.lastName}` : "Lead"}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col h-full grow">
                  {/* Category & Progress % */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {course.courseDepartments[0]?.department?.name || "General"}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                      {progress}%
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/student/courses/${course.id}`} className="mb-3 grow group/title">
                    <h3 className="text-[15px] font-bold text-slate-900 leading-snug
                                   group-hover/title:text-blue-600 transition-colors line-clamp-2">
                      {course.name}
                    </h3>
                  </Link>

                  {/* Progress Bar - Thinner */}
                  <div className="mb-4">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Footer Action - Compact */}
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Group</span>
                      <span className="text-[10px] font-bold text-slate-600 leading-none">{course.groupName || "N/A"}</span>
                    </div>
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="flex items-center gap-0.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
                    >
                      Enter
                      <ChevronRightIcon size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
