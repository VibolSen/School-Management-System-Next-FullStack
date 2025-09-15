"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link"; // ✅ Import Link from Next.js

export default function GroupsTable({ groups, onEdit, onDelete, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = useMemo(() => {
    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.course?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  if (isLoading && groups.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading groups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Search & Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Groups</h2>
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Group Name</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3 text-center">Students</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No groups found.
                </td>
              </tr>
            ) : (
              filteredGroups.map((group) => (
                <tr
                  key={group.id}
                  className="bg-white border-b hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {group.name}
                  </td>
                  <td className="px-6 py-4">{group.course?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/admin/groups/${group.id}`}
                      className="hover:underline"
                    >
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {group._count?.students ?? 0}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center space-x-4">
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
