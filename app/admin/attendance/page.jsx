"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, CheckCircle2, XCircle, Clock, Search, RefreshCcw } from "lucide-react";

export default function AdminManageAttendancePage() {
  const { user: currentUser } = useUser();
  const [staffUsers, setStaffUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStaffUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users?roleType=nonStudent");
      if (!response.ok) throw new Error("Failed to fetch staff users.");
      const data = await response.json();
      setStaffUsers(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAttendanceForDate = useCallback(async () => {
    if (!selectedDate || staffUsers.length === 0) return;
    setIsLoading(true);
    try {
      const userIds = staffUsers.map((u) => u.id);
      const response = await fetch("/api/attendance/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, date: selectedDate }),
      });
      if (!response.ok) throw new Error("Failed to fetch attendance.");
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, staffUsers]);

  useEffect(() => {
    fetchStaffUsers();
  }, [fetchStaffUsers]);

  useEffect(() => {
    fetchAttendanceForDate();
  }, [fetchAttendanceForDate]);

  const handleManualAttendanceChange = async (userId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update attendance.");
      }
      setAttendanceRecords((prev) => ({
        ...prev,
        [userId]: { status: newStatus, date: new Date().toISOString() },
      }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staffUsers.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: Object.values(attendanceRecords).filter(r => r.status === 'PRESENT').length,
    late: Object.values(attendanceRecords).filter(r => r.status === 'LATE').length,
    absent: Object.values(attendanceRecords).filter(r => r.status === 'ABSENT').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Presence Management
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Monitor institutional attendance, record daily staff participation, and oversee personnel logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{staffUsers.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Personnel</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{stats.present}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Confirmed Present</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{stats.late}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Late Arrivals</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{stats.absent}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Absentees</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Personnel Roster</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative group flex-1 md:w-48">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 cursor-pointer"
                max={new Date().toISOString().split("T")[0]}
              />
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
            </div>
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 hover:border-slate-300"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
            </div>
            <button
               onClick={fetchAttendanceForDate}
               className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-tight rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
               title="Refresh Feed"
            >
               <RefreshCcw size={12} className={isLoading ? "animate-spin" : ""} />
               <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel Identity</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Contact Details</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Entry</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Exit</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {isLoading && filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Attendance Stream...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                       <Users size={32} className="mx-auto text-slate-200 mb-3" />
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Personnel Found</h3>
                       <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Refine your search parameters</p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff, index) => {
                    const record = attendanceRecords[staff.id];
                    const status = record?.status || "N/A";
                    return (
                      <motion.tr
                        key={staff.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(index * 0.02, 0.4) }}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100">
                              {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 tracking-tight">{staff.firstName} {staff.lastName}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Staff User</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap hidden lg:table-cell">
                          <span className="text-[11px] font-semibold text-slate-500">{staff.email}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                           <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest border border-blue-100 inline-block">
                             {staff.role}
                           </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-center">
                          <span className="text-[11px] font-bold text-slate-600">
                            {record?.checkInTime ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(record.checkInTime)) : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-center">
                          <span className="text-[11px] font-bold text-slate-600">
                            {record?.checkOutTime ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(record.checkOutTime)) : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight border shadow-sm transition-all ${
                            status === "PRESENT" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            status === "ABSENT" ? "bg-rose-50 text-rose-700 border-rose-100" :
                            status === "LATE" ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-slate-50 text-slate-400 border-slate-100"
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-center">
                          <select
                            value={status === "N/A" ? "" : status}
                            onChange={(e) => handleManualAttendanceChange(staff.id, e.target.value)}
                            className="px-2 py-1 text-[10px] font-black uppercase tracking-tight bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all cursor-pointer text-slate-700 hover:border-slate-300 shadow-sm"
                            disabled={isLoading}
                          >
                            <option value="" disabled>Adjust Log</option>
                            <option value="PRESENT">Confirmed Present</option>
                            <option value="ABSENT">Mark Absent</option>
                            <option value="LATE">Mark Late</option>
                          </select>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
