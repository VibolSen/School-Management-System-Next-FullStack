import React from "react";
import AttendanceTable from "./attendance/AttendanceTable";
import { CheckCircle2, XCircle, Clock, BarChart3, PieChart } from "lucide-react";
import { motion } from "framer-motion";

const AttendanceView = ({ attendance }) => {
  const total = attendance?.length || 0;
  const present = attendance?.filter(r => r.status === "PRESENT").length || 0;
  const absent = attendance?.filter(r => r.status === "ABSENT").length || 0;
  const late = attendance?.filter(r => r.status === "LATE").length || 0;
  
  const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  // Explicit color mapping for Tailwind safety
  const stats = [
    { label: "Total Classes", value: total, icon: BarChart3, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Present", value: present, icon: CheckCircle2, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Absent", value: absent, icon: XCircle, color: "rose", bg: "bg-rose-50", text: "text-rose-600" },
    { label: "Late Records", value: late, icon: Clock, color: "amber", bg: "bg-amber-50", text: "text-amber-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Summary Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-1 hover:shadow-md hover:border-blue-100 transition-all cursor-default"
          >
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.text} mb-1 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Main Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-[13px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Recent Activity
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live History</span>
              </div>
            </div>
            <AttendanceTable attendance={attendance} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200/50 relative overflow-hidden h-full min-h-[300px]"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                  <PieChart size={20} className="text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-50">Presence Analytics</span>
              </div>

              <div className="space-y-1.5 pt-4">
                <p className="text-5xl font-black tracking-tighter leading-none">{attendanceRate}%</p>
                <p className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Overall Attendance</p>
              </div>

              <div className="pt-4 space-y-3">
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${attendanceRate}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full ${parseFloat(attendanceRate) >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  />
                </div>
                <p className="text-[12px] text-blue-50/80 font-medium leading-relaxed">
                  {parseFloat(attendanceRate) >= 90 
                    ? "Exceptional consistency! You're in the top tier of active students."
                    : parseFloat(attendanceRate) >= 75
                    ? "Good progress. Keep attending regularly to maintain your scores."
                    : "Low attendance detected. Please coordinate with the Study Office."}
                </p>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-10 top-0 h-40 w-40 bg-indigo-400/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceView;