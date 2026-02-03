"use client";

import { useState, useEffect } from "react";
import StatusMessage from "@/components/StatusMessage";
import AttendanceControls from "./attendance/AttendanceControls";
import StudentList from "./attendance/StudentList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AttendanceView() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/teacher/groups");
        if (res.ok) {
          const data = await res.json();
          setGroups(data);
        } else {
          console.error("Failed to fetch groups:", res.status);
          setGroups([]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroups([]);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const fetchStudents = async () => {
        setIsLoading(true);
        const res = await fetch(
          `/api/teacher/groups/${selectedGroup}/students`
        );
        const data = await res.json();
        setStudents(data);
        setIsLoading(false);
      };
      fetchStudents();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup && date) {
      const fetchAttendance = async () => {
        const res = await fetch(
          `/api/teacher/groups/${selectedGroup}/attendance?date=${date}`
        );
        const data = await res.json();
        const attendanceMap = {};
        data.forEach((att) => {
          attendanceMap[att.studentId] = att.status;
        });
        setAttendance(attendanceMap);
      };
      fetchAttendance();
    }
  }, [selectedGroup, date]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    const attendances = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId],
    }));

    try {
      const res = await fetch(
        `/api/teacher/groups/${selectedGroup}/attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, attendances }),
        }
      );

      if (res.ok) {
        setStatusMessage({
          type: "success",
          message: "Attendance saved successfully!",
        });
      } else {
        const errorData = await res.json();
        setStatusMessage({
          type: "error",
          message: errorData.error || "Failed to save attendance.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "ABSENT":
        return "bg-red-100 text-red-800 border-red-200";
      case "LATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-0.5 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Attendance Registry
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Track student presence, manage academic participation, and maintain institutional records.
          </p>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mb-6">
            <StatusMessage
              type={statusMessage.type}
              message={statusMessage.message}
            />
          </div>
        )}

        <AttendanceControls
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          date={date}
          setDate={setDate}
          handleSaveAttendance={handleSaveAttendance}
          isSaving={isSaving}
          students={students}
        />

        {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <div className="flex justify-center mb-4 relative">
              <div className="absolute -inset-4 bg-blue-100/50 rounded-full blur-2xl animate-pulse" />
              <LoadingSpinner size="lg" color="blue" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Enrollment...</p>
          </div>
        ) : selectedGroup && students.length > 0 ? (
          <StudentList
            students={students}
            attendance={attendance}
            handleAttendanceChange={handleAttendanceChange}
            getStatusColor={getStatusColor}
          />
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center opacity-60">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">No Students Found</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No participants registered in this group yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Select a Group
            </h3>
            <p className="text-gray-500">
              Choose a group from the dropdown above to view and manage
              attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}