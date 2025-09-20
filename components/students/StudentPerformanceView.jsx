"use client";

import React, { useState, useEffect } from "react";

const StudentPerformanceView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentPerformance = async () => {
      try {
        const res = await fetch("/api/student-performance");
        if (!res.ok) {
          throw new Error("Failed to fetch student performance");
        }
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentPerformance();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Performance</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Attendance Rate</th>
              <th className="py-2 px-4 border-b">Average Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="py-2 px-4 border-b">{`${student.firstName} ${student.lastName}`}</td>
                <td className="py-2 px-4 border-b">{student.attendanceRate}%</td>
                <td className="py-2 px-4 border-b">{student.averageGrade}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPerformanceView;