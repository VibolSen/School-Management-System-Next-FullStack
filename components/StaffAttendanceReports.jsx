"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const StaffAttendanceReports = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetch(`/api/staff-attendance?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch staff attendance data');
      }
      const data = await res.json();
      setAttendanceData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Staff Attendance Reports</h1>
      <div className="flex items-center mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        <button
          onClick={fetchAttendanceData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Filter
        </button>
      </div>
      {loading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {error && <div className="text-red-500">Error: {error}</div>}
      {attendanceData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#82ca9d" />
              <Bar dataKey="absent" fill="#ff0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StaffAttendanceReports;
