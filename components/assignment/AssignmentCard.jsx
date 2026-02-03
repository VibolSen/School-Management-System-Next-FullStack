"use client";

import React from "react";
import { Edit, Trash2, Calendar, ShieldCheck, ClipboardCheck, Clock, Layers, Users } from "lucide-react";
import { motion } from "framer-motion";

const AssignmentCard = ({
  assignment,
  onNavigate,
  onEdit,
  onDelete,
  showActions = true,
  status,
  userRole,
}) => {
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  // Premium status configuration
  const getStatusTheme = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "submitted":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-100",
          icon: <ClipboardCheck size={10} />,
          label: "Submitted"
        };
      case "graded":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-100",
          icon: <ShieldCheck size={10} />,
          label: "Graded"
        };
      case "late":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-100",
          icon: <Clock size={10} />,
          label: "Overdue"
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-600",
          border: "border-slate-100",
          icon: <Layers size={10} />,
          label: status || "Assigned"
        };
    }
  };

  const theme = getStatusTheme(status || (isOverdue ? "late" : "pending"));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full"
    >
      {/* Decorative Top Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
      
      <div className="p-4 flex-1 flex flex-col">
        {/* Header: Badges */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-[9px] font-black uppercase tracking-wider">
            <Users size={10} />
            {assignment.group?.name || "Global Cohort"}
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 ${theme.bg} ${theme.text} ${theme.border} rounded-lg border text-[9px] font-black uppercase tracking-wider`}>
            {theme.icon}
            {theme.label}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1">
          <h3 
            onClick={onNavigate}
            className="text-sm font-black text-slate-800 tracking-tight leading-snug cursor-pointer group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {assignment.title}
          </h3>
          {assignment.description && (
            <p className="mt-1.5 text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
              {assignment.description}
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-1.5 text-[10px]">
               <Calendar size={12} className={isOverdue ? "text-rose-500" : "text-slate-400"} />
               <span className={`font-black uppercase tracking-tight ${isOverdue ? "text-rose-600" : "text-slate-600"}`}>
                 {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No Deadline"}
               </span>
             </div>
             {assignment.points && (
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                 {assignment.points} Points Available
               </div>
             )}
          </div>

          {(userRole === "ADMIN" || userRole === "TEACHER") && (
            <div className="flex items-center gap-1">
              <button 
                onClick={onEdit}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Modify"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={onDelete}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar (if submissions exist) */}
        {assignment.submissionCount !== undefined && assignment.totalStudents > 0 && (
          <div className="mt-3">
             <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-0.5">
               <span>Engagement</span>
               <span>{Math.round((assignment.submissionCount / assignment.totalStudents) * 100)}%</span>
             </div>
             <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` }}
                 className="h-full bg-emerald-500" 
               />
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentCard;
