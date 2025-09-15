"use client";

import React, { useState, useMemo } from "react";

export default function DepartmentsTable({
  departments,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Department List
        </h2>
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md text-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              {/* ✅ ADDED: New column for Courses */}
              <th scope="col" className="px-6 py-3 text-center">
                Courses
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && departments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {dept.name}
                  </td>
                  {/* ✅ ADDED: Display the course count from the API */}
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {dept._count.courses}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-4 text-center">
                    <button
                      onClick={() => onEditClick(dept)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(dept)}
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
