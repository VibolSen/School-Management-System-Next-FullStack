"use client";

import React, { useState, useMemo } from "react";

// ✅ REMOVED: getStatusBadge is obsolete.

export default function StaffTable({
  staffList,
  onAddStaffClick,
  onEditClick,
  onDeleteClick,
  allRoles = [],
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const fullName = `${staff.firstName} ${staff.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || staff.role === roleFilter;
      // ✅ REMOVED: Status filter logic is gone.
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
    if (sortConfig.key === key && sortConfig.direction === "ascending")
      direction = "descending";
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? "↑"
        : "↓"
      : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Staff Directory
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="..."
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="..."
          >
            <option value="All">All Roles</option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {/* ✅ REMOVED: Status filter is gone. */}
          <button
            onClick={onAddStaffClick}
            disabled={isLoading}
            className="..."
          >
            Add Staff
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              {/* ✅ MODIFIED: Table headers updated. */}
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("firstName")}
              >
                Name {getSortIndicator("firstName")}
              </th>
              <th className="px-6 py-3">Email</th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role {getSortIndicator("role")}
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && staffList.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  Loading...
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
                <tr
                  key={staff.id}
                  className="bg-white border-b hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{`${staff.firstName} ${staff.lastName}`}</td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(staff)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(staff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    {/* ✅ REMOVED: Toggle status button is gone. */}
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
