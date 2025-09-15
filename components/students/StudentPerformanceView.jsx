"use client";

import React, { useState, useEffect, useMemo } from "react";

// A basic placeholder for the performance view.
export default function StudentPerformanceView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch students");
        const allUsers = await res.json();
        // This component now shows ALL students, as course data isn't available
        // to filter by "my" students.
        setStudents(allUsers.filter((u) => u.role === "STUDENT"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Student Performance</h1>
      <p className="text-slate-500">
        This is a list of all students. Performance metrics like attendance and
        course alerts require Course and Attendance models in the database
        schema.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 mb-4 px-3 py-2 border border-slate-300 rounded-md"
        />
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="bg-white border-b hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">{`${student.firstName} ${student.lastName}`}</td>
                <td className="px-6 py-4">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
