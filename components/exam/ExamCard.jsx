"use client";

import React from "react";
import { Edit, Trash2, Eye, Calendar, ShieldCheck, ClipboardList, Clock, Layers, Users } from "lucide-react";
import { motion } from "framer-motion";

const ExamCard = ({
  exam,
  onNavigate,
  onEdit,
  onDelete,
  status,
  showActions = false,
}) => {
  // Premium status configuration
  const getStatusTheme = (statusName) => {
    switch (statusName?.toUpperCase()) {
      case "SUBMITTED":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-100",
          icon: <ClipboardList size={10} />,
          label: "Submitted"
        };
      case "GRADED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-100",
          icon: <ShieldCheck size={10} />,
          label: "Graded"
        };
      case "PENDING":
      default:
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-100",
          icon: <Clock size={10} />,
          label: status || "Pending"
        };
    }
  };

  const theme = getStatusTheme(status);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col h-full"
    >
      {/* Decorative Top Bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
      
      <div className="p-4 flex-1 flex flex-col">
        {/* Header: Badges */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-[9px] font-black uppercase tracking-wider">
            <Users size={10} />
            {exam.group?.name || "Open Group"}
          </div>
          {status && (
            <div className={`flex items-center gap-1 px-2 py-1 ${theme.bg} ${theme.text} ${theme.border} rounded-lg border text-[9px] font-black uppercase tracking-wider`}>
              {theme.icon}
              {theme.label}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3 
            onClick={onNavigate}
            className="text-sm font-black text-slate-800 tracking-tight leading-snug cursor-pointer group-hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {exam.title || "Standard Assessment"}
          </h3>
        </div>

        {/* Info & Footer */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px]">
            <Calendar size={12} className="text-slate-400" />
            <span className="font-black uppercase tracking-tight text-slate-600">
              {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "TBD"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNavigate();
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="View Results"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {showActions && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Modify"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamCard;