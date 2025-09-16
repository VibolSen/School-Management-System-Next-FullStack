"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

// The main view component for the teacher's student list
export default function MyStudentsView({ loggedInUser }) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ FIX #1: Extract the user ID into a stable variable.
  // This string value will not change between re-renders unless the user prop itself changes.
  const teacherId = loggedInUser?.id;

  // ✅ FIX #2: Wrap the data fetching logic in a useCallback hook.
  // This tells React to "memoize" this function. It will only be recreated if
  // its dependency (`teacherId`) changes, which prevents an infinite loop.
  const fetchMyStudents = useCallback(async () => {
    if (!teacherId) return; // Don't fetch if there's no user ID

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/teacher/my-students?teacherId=${teacherId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch your students.");
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      // In a real app, you might set an error state here to show a message
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]); // The dependency is the stable ID string

  // ✅ FIX #3: The main useEffect hook now depends on the stable `fetchMyStudents` function.
  // It will run once on mount and only again if the teacherId ever changes.
  useEffect(() => {
    fetchMyStudents();
  }, [fetchMyStudents]);

  // Memoized filtering for the search input remains the same
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <h1 className="text-3xl font-bold text-slate-800">My Students</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Student Roster
          </h2>
          <input
            type="text"
            placeholder="Search my students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">
                    You have no students in your courses.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                        {student.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
