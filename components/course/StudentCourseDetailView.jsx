"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpenIcon, 
  UserIcon, 
  CalendarIcon, 
  InfoIcon,
  MessageSquareIcon,
  ArrowLeftIcon,
  MailIcon,
  ChevronRightIcon
} from "lucide-react";
import Link from "next/link";
import AnnouncementsView from "@/components/announcements/AnnouncementsView";
import { motion } from "framer-motion";

export default function StudentCourseDetailView({ courseId, loggedInUser }) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`/api/courses?id=${courseId}`);
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <InfoIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <p className="text-slate-500 mt-2">We couldn't retrieve the details for this course.</p>
        <Link href="/student/courses" className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <ArrowLeftIcon size={16} className="mr-2" /> back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section - More Compact */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <Link href="/student/courses" className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-sm group/back">
              <ArrowLeftIcon size={14} className="mr-1.5 group-hover/back:-translate-x-0.5 transition-transform" /> back to My Courses
            </Link>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                {course.courseDepartments[0]?.department?.name || "Academic"}
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {course.name}
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">COURSE ID: {course.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
              <BookOpenIcon size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements Card - Compact */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <MessageSquareIcon size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Latest Announcements</h2>
            </div>
            <div className="px-5 py-2">
              <AnnouncementsView courseId={courseId} loggedInUser={loggedInUser} hideHeader />
            </div>
          </section>

          {/* About This Course Card - Compact */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About this Course</h2>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "No detailed description provided for this course yet."
            </p>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Instructor Card - Compact */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Your Instructor</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <UserIcon size={22} />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 leading-tight">
                    {course.leadBy ? `${course.leadBy.firstName} ${course.leadBy.lastName}` : "Unassigned"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">Course Lead</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <MailIcon size={14} className="text-slate-400" />
                  <span>instructor@step.education</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <CalendarIcon size={14} className="text-slate-400" />
                  <span>Available: Mon - Fri</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions - Unique Brand Color Gradient */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200/50">
            <h3 className="text-[10px] font-black text-blue-100/50 uppercase tracking-widest mb-4">Course Quick Access</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 rounded-xl text-left transition-all border border-white/5 flex items-center justify-between group text-sm">
                <span className="font-bold">Course Resources</span>
                <ChevronRightIcon size={16} className="text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 rounded-xl text-left transition-all border border-white/5 flex items-center justify-between group text-sm">
                <span className="font-bold">Assignment List</span>
                <ChevronRightIcon size={16} className="text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

