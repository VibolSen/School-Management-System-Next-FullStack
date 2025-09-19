"use client";

import React, { useState, useMemo } from "react";

// Helper component for sort direction arrows
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

export default function StaffTable({
  staffList = [],
  onAddStaffClick,
  onEditClick,
  onDeleteClick,
  allRoles = [],
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "ascending",
  });

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const fullName = `${staff.firstName} ${staff.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || staff.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staffList, searchTerm, roleFilter]);

  const sortedStaff = useMemo(() => {
    if (!sortConfig.key) return filteredStaff;
    return [...filteredStaff].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredStaff, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Role color mapping for consistency
  const roleColors = {
    ADMIN: "bg-purple-100 text-purple-800",
    HR: "bg-blue-100 text-blue-800",
    FACULTY: "bg-green-100 text-green-800",
    TEACHER: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Staff Roster</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Roles</option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={onAddStaffClick}
            disabled={isLoading}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Add Staff
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
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center gap-1.5">
                  Name{" "}
                  <SortIndicator
                    direction={
                      sortConfig.key === "firstName"
                        ? sortConfig.direction
                        : null
                    }
                  />
                </div>
              </th>
              <th className="px-6 py-3">Email</th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center gap-1.5">
                  Role{" "}
                  <SortIndicator
                    direction={
                      sortConfig.key === "role" ? sortConfig.direction : null
                    }
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && sortedStaff.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Loading staff...
                </td>
              </tr>
            ) : sortedStaff.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No staff members found.
                </td>
              </tr>
            ) : (
              sortedStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs mr-3">
                        {staff.firstName.charAt(0)}
                        {staff.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{`${staff.firstName} ${staff.lastName}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        roleColors[staff.role] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(staff)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(staff.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isLoading}
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
