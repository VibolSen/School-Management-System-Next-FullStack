"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, Search, ShieldCheck, Filter, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="text-indigo-600 ml-1">
      {direction === "ascending" ? "↑" : "↓"}
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

  const roleColors = {
    ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-100",
    HR: "bg-blue-50 text-blue-700 border-blue-100",
    TEACHER: "bg-emerald-50 text-emerald-700 border-emerald-100",
    STUDENT: "bg-indigo-50 text-indigo-700 border-indigo-100",
    STUDY_OFFICE: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Filters Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
           <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Personnel</h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all text-slate-700"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={12} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm shrink-0">
            <Filter size={12} className="text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-tight focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="All">All Roles</option>
              {allRoles
                .filter((role) => role !== "ADMIN")
                .map((role) => (
                  <option key={role} value={role} className="normal-case font-medium">{role}</option>
                ))}
            </select>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-indigo-700 text-[10px] font-black uppercase tracking-tight rounded-lg border border-blue-100 shrink-0">
            {filteredUsers.length} Total Users
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/10 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort("firstName")}>
                <div className="flex items-center gap-1">
                  User Identity
                  <SortIndicator direction={sortConfig.key === "firstName" ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell cursor-pointer" onClick={() => handleSort("email")}>
                <div className="flex items-center gap-1">
                  Access Point
                  <SortIndicator direction={sortConfig.key === "email" ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer" onClick={() => handleSort("role")}>
                <div className="flex items-center gap-1">
                  System Role
                  <SortIndicator direction={sortConfig.key === "role" ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 border-none">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authenticating Data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                   <div className="flex flex-col items-center opacity-40">
                     <ShieldCheck size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No personnel records found</p>
                   </div>
                </td>
              </tr>
            ) : (
              sortedUsers.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.4) }}
                  className="group hover:bg-blue-50/20 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-700 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-200 shadow-sm shadow-blue-100">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{user.firstName} {user.lastName}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">System Personnel</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="text-[13px] font-semibold text-slate-600">{user.email}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border uppercase tracking-wide ${roleColors[user.role] || "bg-slate-50 text-slate-700 border-slate-100"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      {(currentUserRole === "ADMIN" || currentUserRole === "HR") && (
                        <button
                          onClick={() => onEditClick(user)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          disabled={isLoading}
                          title="Quick Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {currentUserRole && (
                        <Link 
                          href={`/${currentUserRole.toLowerCase()}/users/${user.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {(currentUserRole === "ADMIN" || currentUserRole === "HR") && (
                        <button
                          onClick={() => onDeleteClick(user.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          disabled={isLoading}
                          title="Remove Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
