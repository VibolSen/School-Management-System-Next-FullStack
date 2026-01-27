"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2 } from "lucide-react";

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
    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 transition-all duration-300 ease-in-out">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
        <h2 className="text-lg font-semibold text-blue-700 transition-colors duration-300">Student Roster</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-44 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          {canManageStudents && (
            <button
              onClick={onAddStudentClick}
              className="w-full md:w-auto bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
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
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Role</th>
              {canManageStudents && <th className="px-4 py-2.5 text-center">Actions</th>}
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
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-[10px] mr-3">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-xs">{`${student.firstName} ${student.lastName}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{student.email}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                      {student.role}
                    </span>
                  </td>
                  {canManageStudents && (
                    <td className="px-4 py-2.5 text-sm font-medium space-x-3 text-center">
                      {(currentUserRole === "ADMIN" || currentUserRole === "STUDY_OFFICE") && (
                        <button
                          onClick={() => onEditClick(student)}
                          className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {currentUserRole && (
                        <Link 
                          href={`/${currentUserRole.toLowerCase()}/users/${student.id}`}
                          className="inline-block"
                          title="View Profile"
                        >
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                            disabled={isLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      )}
                      {(currentUserRole === "ADMIN" || currentUserRole === "STUDY_OFFICE") && (
                        <button
                          onClick={() => onDeleteClick(student.id)}
                          className="text-red-600 hover:text-red-800 transition-all duration-200"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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