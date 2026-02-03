import React from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, Calendar } from "lucide-react";

const AttendanceRow = ({ record, index }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "PRESENT":
        return { 
          bg: "bg-emerald-50", 
          text: "text-emerald-700", 
          border: "border-emerald-100",
          icon: Check,
          label: "Present"
        };
      case "ABSENT":
        return { 
          bg: "bg-rose-50", 
          text: "text-rose-700", 
          border: "border-rose-100",
          icon: X,
          label: "Absent"
        };
      case "LATE":
        return { 
          bg: "bg-amber-50", 
          text: "text-amber-700", 
          border: "border-amber-100",
          icon: Clock,
          label: "Late"
        };
      default:
        return { 
          bg: "bg-slate-50", 
          text: "text-slate-700", 
          border: "border-slate-100",
          icon: Check,
          label: status
        };
    }
  };

  const config = getStatusConfig(record.status);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
      className="group hover:bg-slate-50/50 transition-colors"
    >
      <td className="px-5 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">
            {new Date(record.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </td>
      <td className="px-5 py-3 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800 tracking-tight">{record.group.name}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Assigned Group</span>
        </div>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-right">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
          <config.icon size={11} strokeWidth={3} />
          {config.label}
        </span>
      </td>
    </motion.tr>
  );
};

export default AttendanceRow;
