"use client";

import React, { useState, useMemo } from "react";

export default function CoursesTable({ courses, onEdit, onDelete, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (course.teacher &&
          `${course.teacher.firstName} ${course.teacher.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [courses, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Course List</h2>
        <input
          type="text"
          placeholder="Search by course, department, or teacher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Course Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Lead Teacher</th>
              <th className="px-6 py-3 text-center">Groups</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No courses found.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="bg-white border-b hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {course.department?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {course.teacher ? (
                      `${course.teacher.firstName} ${course.teacher.lastName}`
                    ) : (
                      <span className="italic text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                      {course._count.groups}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-4 text-center">
                    <button
                      onClick={() => onEdit(course)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(course)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
