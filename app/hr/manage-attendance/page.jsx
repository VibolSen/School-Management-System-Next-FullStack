"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { 
  Calendar, 
  Search, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical,
  Filter
} from "lucide-react";

export default function HRManageAttendancePage() {
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
      if (!response.ok) {
        throw new Error("Failed to fetch staff users.");
      }
      const data = await response.json();
      setStaffUsers(data);
    } catch (error) {
      console.error("Error fetching staff users:", error);
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

      if (!response.ok) {
        throw new Error("Failed to fetch attendance records.");
      }
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleManualAttendanceChange = async (userId, newStatus) => {
    // Optimistic update
    setAttendanceRecords((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], status: newStatus, date: new Date().toISOString() },
    }));

    try {
      const response = await fetch("/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: selectedDate,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      // Revert on error (could implement more robust rollback here)
      fetchAttendanceForDate(); 
    }
  };

  const filteredStaff = staffUsers.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: Object.values(attendanceRecords).filter(r => r.status === 'PRESENT').length,
    late: Object.values(attendanceRecords).filter(r => r.status === 'LATE').length,
    absent: Object.values(attendanceRecords).filter(r => r.status === 'ABSENT').length,
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6] p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Manage Staff Attendance
          </h1>
          <p className="text-[13px] font-medium text-slate-500">
            Track daily presence and manage attendance records for all staff members.
          </p>
        </div>
        
        {/* Date Picker */}
        <div className="relative group">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none cursor-pointer hover:border-blue-300"
          />
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none">{staffUsers.length}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Staff</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats.present}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Present</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats.late}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Late</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none">{stats.absent}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Absent</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
                <Filter className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colspan="6" className="py-20 text-center text-slate-500">
                    <LoadingSpinner size="md" color="blue" />
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                   <td colspan="6" className="py-20 text-center">
                     <div className="flex flex-col items-center justify-center opacity-50">
                        <Users className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium text-sm">No staff members found</p>
                     </div>
                   </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const record = attendanceRecords[staff.id];
                  const status = record?.status || "N/A";
                  
                  return (
                    <tr key={staff.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center text-[12px] font-black border border-white shadow-sm">
                              {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-slate-800">{staff.firstName} {staff.lastName}</p>
                              <p className="text-[11px] text-slate-500">{staff.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[13px] font-medium text-slate-600">
                          {record?.checkInTime ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(record.checkInTime)) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[13px] font-medium text-slate-600">
                          {record?.checkOutTime ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(record.checkOutTime)) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border shadow-sm ${
                            status === "PRESENT" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            status === "ABSENT" ? "bg-rose-50 text-rose-600 border-rose-100" :
                            status === "LATE" ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                           value={status === "N/A" ? "" : status}
                           onChange={(e) => handleManualAttendanceChange(staff.id, e.target.value)}
                           className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-slate-300 transition-all shadow-sm"
                        >
                           <option value="" disabled>Action</option>
                           <option value="PRESENT">Mark Present</option>
                           <option value="LATE">Mark Late</option>
                           <option value="ABSENT">Mark Absent</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
