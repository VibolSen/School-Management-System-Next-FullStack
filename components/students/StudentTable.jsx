"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function StudentTable({
  students = [],
  onAddStudentClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
  currentUserRole,
  canManageStudents,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [students, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 transition-all duration-300 ease-in-out">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-blue-700 transition-colors duration-300">Student Roster</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          {canManageStudents && (
            <button
              onClick={onAddStudentClick}
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              {canManageStudents && <th className="px-6 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs mr-3">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{`${student.firstName} ${student.lastName}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                      {student.role}
                    </span>
                  </td>
                  {canManageStudents && (
                    <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                      <button
                        onClick={() => onEditClick(student)}
                        className="text-indigo-600 hover:text-indigo-900 hover:scale-105 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(student.id)}
                        className="text-red-600 hover:text-red-900 hover:scale-105 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}