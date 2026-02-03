"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

const UpcomingActivities = ({ assignmentsCount, examsCount }) => {
  const activities = [
    {
      type: "Assignment",
      count: assignmentsCount,
      icon: ClipboardList,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/student/assignments",
      label: assignmentsCount === 1 ? "assignment due" : "assignments due",
    },
    {
      type: "Exam",
      count: examsCount,
      icon: FileText,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      href: "/student/exams",
      label: examsCount === 1 ? "exam pending" : "exams pending",
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-md font-black text-slate-800 tracking-tight">Activities</h3>
        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Next 7 Days</span>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Link 
              href={activity.href}
              className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${activity.bgColor} ${activity.color} flex items-center justify-center`}>
                  <activity.icon size={18} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-900 leading-tight">
                    {activity.count} {activity.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Stay on track</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>
        ))}
        
        {assignmentsCount === 0 && examsCount === 0 && (
          <div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-[11px] text-slate-400 font-medium">All caught up! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingActivities;
