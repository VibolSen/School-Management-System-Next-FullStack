'use client';
import { useState, useEffect } from "react";
import AttendanceView from "@/components/student/AttendanceView";

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
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <AttendanceView attendance={attendance} />}
    </div>
  );
}
