'use client';
import { useState, useEffect } from "react";
import AttendanceView from "@/components/student/AttendanceView";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Attendance</h1>
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Retrieving your attendance records...</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <AttendanceView attendance={attendance} />}
    </div>
  );
}
