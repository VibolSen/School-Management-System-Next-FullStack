"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2 } from "lucide-react";

// Helper component for sort direction arrows for a cleaner look
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
  currentUserRole,
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

  // Role color mapping
  const roleColors = {
    ADMIN: "bg-purple-100 text-purple-800",
    HR: "bg-blue-100 text-blue-800",
    TEACHER: "bg-amber-100 text-amber-800",
    STUDENT: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 transition-all duration-300 ease-in-out">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
        <h2 className="text-lg font-semibold text-blue-700 transition-colors duration-300">
          Staff Directory
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-44 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          >
            <option value="All">All Roles</option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {currentUserRole === "ADMIN" && (
            <button
              onClick={onAddStaffClick}
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Add Staff
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-4 py-2.5 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
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
              <th
                className="px-4 py-2.5 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                onClick={() => handleSort("email")}
              >
                Email{" "}
                <SortIndicator
                  direction={
                    sortConfig.key === "email" ? sortConfig.direction : null
                  }
                />
              </th>
              <th
                className="px-4 py-2.5 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
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
              <th className="px-4 py-2.5 text-center">Actions</th>
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
                <tr
                  key={staff.id}
                  className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-[10px] mr-3">
                        {staff.firstName.charAt(0)}
                        {staff.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-xs">
                          {`${staff.firstName} ${staff.lastName}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{staff.email}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        roleColors[staff.role] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium space-x-3 text-center">
                    {currentUserRole === "ADMIN" && (
                      <button
                        onClick={() => onEditClick(staff)}
                        className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                        disabled={isLoading}
                        title="Edit Staff"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {currentUserRole && (
                      <Link 
                        href={`/${currentUserRole.toLowerCase()}/users/${staff.id}`}
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
                    {currentUserRole === "ADMIN" && (
                      <button
                        onClick={() => onDeleteClick(staff.id)}
                        className="text-red-600 hover:text-red-800 transition-all duration-200"
                        disabled={isLoading}
                        title="Delete Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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