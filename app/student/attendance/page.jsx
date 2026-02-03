'use client';
import { useState, useEffect } from "react";
import AttendanceView from "@/components/student/AttendanceView";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("/api/student/attendance");
        if (!response.ok) {
          throw new Error("Failed to fetch attendance");
        }
        const data = await response.json();
        setAttendance(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <LoadingSpinner size="lg" color="blue" className="mb-4" />
        <p className="text-slate-500 font-bold tracking-tight animate-pulse uppercase text-[11px]">Synchronizing Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4F6] pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto p-4 md:p-6 space-y-6"
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-2">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Attendance Tracking</h1>
            <p className="text-slate-500 font-medium text-sm">Monitor your academic presence and consistency.</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
            <Calendar size={20} />
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 font-bold text-sm">
            {error}
          </div>
        ) : (
          <AttendanceView attendance={attendance} />
        )}
      </motion.div>
    </div>
  );
}
