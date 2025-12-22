"use client";

import React, { useState, useMemo } from "react";

export default function DepartmentsTable({
  departments,
  onAddDepartmentClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = useMemo(() => {
    if (!Array.isArray(departments)) return [];
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 transition-all duration-300 ease-in-out">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-blue-700 transition-colors duration-300">
          Department List
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <button
            onClick={onAddDepartmentClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Add Department
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200">
                Name
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200">
                Faculty
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Courses
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Loading departments...
                </td>
              </tr>
            ) : filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {dept.faculty?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {dept._count?.departmentCourses ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(dept)}
                      className="text-indigo-600 hover:text-indigo-900 hover:scale-105 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(dept)}
                      className="text-red-600 hover:text-red-900 hover:scale-105 transition-all duration-200"
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