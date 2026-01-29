"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ReportsView = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchReportsData = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/faculty/reports?departmentId=${selectedDepartment}`);
          if (!res.ok) {
            throw new Error("Failed to fetch reports data");
          }
          const data = await res.json();
          setReportsData(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchReportsData();
    }
  }, [selectedDepartment]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      <div className="mb-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Select a Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" color="indigo" />
        </div>
      )}
      {error && <div className="text-red-500">Error: {error}</div>}

      {reportsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h2 className="text-lg font-bold mb-2">Student Performance Reports</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData.studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="grade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-lg font-bold mb-2">Attendance Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportsData.attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#82ca9d" />
                <Line type="monotone" dataKey="absent" stroke="#ff0000" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-lg font-bold mb-2">Class Participation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData.classParticipation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participation" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
