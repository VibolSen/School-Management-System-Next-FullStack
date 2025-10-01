"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// Helper component for rendering sort direction arrows
const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="text-slate-500">
      {direction === "ascending" ? (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      )}
    </span>
  );
};

export default function GroupsTable({
  groups,
  courses, // Added for filtering
  onAddGroupClick,
  onEdit,
  onDelete,
  isLoading,
  role,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Combined filtering and sorting logic
  const processedGroups = useMemo(() => {
    const filtered = groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.course?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse =
        courseFilter === "All" || group.courseId === courseFilter;
      return matchesSearch && matchesCourse;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties for sorting (e.g., course.name)
        if (sortConfig.key === "course.name") {
          aValue = a.course?.name || "";
          bValue = b.course?.name || "";
        }

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [groups, searchTerm, courseFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header, Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Groups</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <button
            onClick={onAddGroupClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Add Group
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  Group Name{" "}
                  <SortIndicator
                    direction={
                      sortConfig.key === "name" ? sortConfig.direction : null
                    }
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("course.name")}
              >
                <div className="flex items-center gap-1.5">
                  Course{" "}
                  <SortIndicator
                    direction={
                      sortConfig.key === "course.name"
                        ? sortConfig.direction
                        : null
                    }
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-center">Students</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && processedGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">
                  Loading groups...
                </td>
              </tr>
            ) : processedGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">
                  No groups found.
                </td>
              </tr>
            ) : (
              processedGroups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {group.name}
                  </td>
                  <td className="px-6 py-4">{group.course?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    {role === "admin" ? (
                      <Link
                        href={`/admin/groups/${group.id}`}
                        className="hover:underline"
                      >
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          {group._count?.students ?? 0}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href={`/faculty/groups/${group.id}`}
                        className="hover:underline"
                      >
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          {group._count?.students ?? 0}
                        </span>
                      </Link>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => onEdit(group)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(group)}
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
