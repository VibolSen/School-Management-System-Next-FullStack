"use client";

import React, { useState, useMemo } from "react";

const MAX_COURSES_DISPLAY = 2;

const getStatusBadge = (isActive) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function TeacherTable({
  teachers = [],
  onAddTeacherClick,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
  allCourses = [],
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" ? teacher.isActive : !teacher.isActive);
      const matchesCourse =
        courseFilter === "All" ||
        (teacher.courses || []).some((c) => c.id === courseFilter);
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [teachers, searchTerm, statusFilter, courseFilter]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Teacher Roster</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="All">All Courses</option>
            {allCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={onAddTeacherClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            Add Teacher
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Assigned Courses</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No teachers found.
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{teacher.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="px-2 py-1 text-xs font-semibold text-teal-800 bg-teal-100 rounded-full">
                      {teacher.role?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-wrap items-center gap-1">
                      {(teacher.courses || [])
                        .slice(0, MAX_COURSES_DISPLAY)
                        .map((course) => (
                          <span
                            key={course.id}
                            className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full whitespace-nowrap"
                          >
                            {course.name}
                          </span>
                        ))}
                      {(teacher.courses || []).length > MAX_COURSES_DISPLAY && (
                        <span
                          className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-200 rounded-full cursor-pointer"
                          title={(teacher.courses || [])
                            .slice(MAX_COURSES_DISPLAY)
                            .map((c) => c.name)
                            .join(", ")}
                        >
                          +
                          {(teacher.courses || []).length - MAX_COURSES_DISPLAY}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(teacher.isActive)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(teacher)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        onToggleStatus(teacher.id, teacher.isActive)
                      }
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {teacher.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => onDeleteClick(teacher)}
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
