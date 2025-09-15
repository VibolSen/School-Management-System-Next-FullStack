"use client";

import React, { useState, useMemo } from "react";

// ✅ REMOVED: getStatusBadge is no longer needed.

export default function UserTable({
  users = [],
  onAddUserClick,
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // ✅ MODIFIED: Search logic for new schema
      const fullName = `${user.firstName} ${user.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // ✅ MODIFIED: Role filter logic for new schema
      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      // ✅ REMOVED: Status filter is gone
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
        <h2 className="text-xl font-semibold text-slate-800">User Directory</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="..."
          />
          {/* ✅ MODIFIED: Role filter now uses simple string values */}
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
          {/* ✅ REMOVED: Status filter select is gone */}
          <button onClick={onAddUserClick} disabled={isLoading} className="...">
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              {/* ✅ MODIFIED: Table headers updated for new schema */}
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
            {isLoading && users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b hover:bg-slate-50"
                >
                  {/* ✅ MODIFIED: Table data updated for new schema */}
                  <td className="px-6 py-4 font-medium text-slate-900">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(user.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                    {/* ✅ REMOVED: Toggle Status button is gone */}
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
