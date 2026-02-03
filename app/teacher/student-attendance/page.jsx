"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import StatusMessage from "@/components/StatusMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Save, 
  Search,
  BookOpen
} from "lucide-react";

const StudentAttendancePage = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/teacher/my-groups?teacherId=${user.id}`)
        .then((res) => res.json())
        .then(setGroups)
        .catch((error) => {
          console.error("Failed to fetch groups:", error);
          setStatus({
            type: "error",
            message: "Failed to fetch your groups.",
          });
        });
    }
  }, [user]);

  useEffect(() => {
    if (selectedGroup && date) {
      setLoadingStudents(true);
      Promise.all([
        fetch(`/api/teacher/groups/${selectedGroup}/students`)
          .then((res) => res.json())
          .then(setStudents)
          .catch((error) => {
            console.error("Failed to fetch students:", error);
            setStatus({
              type: "error",
              message: "Failed to fetch students for the selected group.",
            });
            return { students: [] };
          }),
        fetch(`/api/teacher/groups/${selectedGroup}/attendance?date=${date}`)
          .then((res) => res.json())
          .then((data) => {
            const newAttendance = {};
            data.forEach((att) => {
              newAttendance[att.studentId] = att.status;
            });
            setAttendance(newAttendance);
            return data;
          })
          .catch((error) => {
            console.error("Failed to fetch attendance:", error);
            return [];
          }),
      ]).finally(() => setLoadingStudents(false));
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedGroup, date]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!selectedGroup || !date) {
      setStatus({ type: "error", message: "Please select a group and date." });
      return;
    }

    setSubmitting(true);

    const attendances = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId],
    }));

    try {
      const response = await fetch(
        `/api/teacher/groups/${selectedGroup}/attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, attendances }),
        }
      );

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Attendance submitted successfully!",
        });
      } else {
        const errorData = await response.json();
        setStatus({
          type: "error",
          message:
            errorData.error || "An error occurred while submitting attendance.",
        });
      }
    } catch (error) {
      console.error("Submit attendance error:", error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to count current stats
  const stats = {
    present: Object.values(attendance).filter(s => s === 'PRESENT').length,
    late: Object.values(attendance).filter(s => s === 'LATE').length,
    absent: Object.values(attendance).filter(s => s === 'ABSENT').length,
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Class Attendance
          </h1>
          <p className="text-[13px] font-medium text-slate-500">
            Record and manage student attendance for your active classes.
          </p>
        </div>
      </div>

      {status && (
        <div className="max-w-4xl mx-auto">
          <StatusMessage type={status.type} message={status.message} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Controls Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label htmlFor="group-select" className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Select Class Group
              </label>
              <div className="relative">
                <select
                  id="group-select"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300"
                  required
                >
                  <option value="">-- Choose Group --</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="date-picker" className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Attendance Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date-picker"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:border-indigo-300"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end md:justify-start">
               {/* Placeholder for alignment, button is now sticky at bottom or logic driven */}
            </div>
          </div>
        </div>

        {/* Student List */}
        {loadingStudents ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <LoadingSpinner size="lg" color="blue" />
            <p className="mt-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider animate-pulse">Loading Class Roster...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[14px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Student Roster ({students.length})
              </h2>
              
              {/* Live Scoped Stats */}
              <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold uppercase tracking-wide">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Present: {stats.present}
                </div>
                <div className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Late: {stats.late}
                </div>
                <div className="flex items-center gap-1.5 text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Absent: {stats.absent}
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <div key={student.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center text-[14px] font-black border border-white shadow-sm shrink-0">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                      <p className="text-[12px] text-slate-500">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(student.id, "PRESENT")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all ${
                        attendance[student.id] === "PRESENT"
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                          : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(student.id, "LATE")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all ${
                        attendance[student.id] === "LATE"
                          ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                          : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(student.id, "ABSENT")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all ${
                        attendance[student.id] === "ABSENT"
                          ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                          : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!selectedGroup || students.length === 0 || submitting}
              >
                {submitting ? (
                  <LoadingSpinner size="xs" color="white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting ? 'Saving Records...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm opacity-60">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-bold text-sm">No Class Selected</p>
             <p className="text-[12px] text-slate-400 mt-1">Select a group and date to verify attendance.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentAttendancePage;