// UserTable.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

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

export default function UserTable({
  users = [],
  onAddUserClick,
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

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
    FACULTY: "bg-green-100 text-green-800",
    TEACHER: "bg-amber-100 text-amber-800",
    STUDENT: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 transition-all duration-300 ease-in-out">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-blue-700 transition-colors duration-300">
          User Directory
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          >
            <option value="All">All Roles</option>
            {allRoles
              .filter((role) => role !== "ADMIN")
              .map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
          </select>
          {currentUserRole === "ADMIN" && (
            <button
              onClick={onAddUserClick}
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Add User
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
                className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
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
                className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
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
                className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
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
            {isLoading && sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs mr-3">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">
                          {`${user.firstName} ${user.lastName}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        roleColors[user.role] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    {currentUserRole === "ADMIN" && (
                      <button
                        onClick={() => onEditClick(user)}
                        className="text-indigo-600 hover:text-indigo-900 hover:scale-105 transition-all duration-200"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                    )}
                    {currentUserRole && (
                      <Link href={`/${currentUserRole.toLowerCase()}/users/${user.id}`}>
                        <button
                          className="text-blue-600 hover:text-blue-800 hover:scale-105 transition-all duration-200"
                          disabled={isLoading}
                        >
                          View Profile
                        </button>
                      </Link>
                    )}
                    {currentUserRole === "ADMIN" && (
                      <button
                        onClick={() => onDeleteClick(user.id)}
                        className="text-red-600 hover:text-red-800 hover:scale-105 transition-all duration-200"
                        disabled={isLoading}
                      >
                        Delete
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
