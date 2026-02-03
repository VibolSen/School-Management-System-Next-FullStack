"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, UserPlus, Search, Filter, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="text-indigo-600 ml-1">
      {direction === "ascending" ? "↑" : "↓"}
    </span>
  );
};

export default function GroupsTable({
  groups = [],
  courses = [],
  onAddGroupClick,
  onEdit,
  onDelete,
  onManageMembers,
  isLoading,
  role,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  const processedGroups = useMemo(() => {
    const filtered = groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.courses?.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCourse =
        courseFilter === "All" || group.courses?.some(c => c.id === courseFilter);
      return matchesSearch && matchesCourse;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "course.name") {
          aValue = a.courses?.map(c => c.name).join(", ") || "";
          bValue = b.courses?.map(c => c.name).join(", ") || "";
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Filters Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Cohorts</h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find groups..."
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
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-tight focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="All">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="normal-case font-medium">{course.name}</option>
              ))}
            </select>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-indigo-700 text-[10px] font-black uppercase tracking-tight rounded-lg border border-blue-100 shrink-0">
            {processedGroups.length} Total Groups
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/10 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">
                  Group Designation
                  <SortIndicator direction={sortConfig.key === "name" ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell cursor-pointer" onClick={() => handleSort("course.name")}>
                <div className="flex items-center gap-1">
                  Assigned Curriculum
                  <SortIndicator direction={sortConfig.key === "course.name" ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && processedGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 border-none">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Cohorts...</span>
                  </div>
                </td>
              </tr>
            ) : processedGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                   <div className="flex flex-col items-center opacity-40">
                     <Users size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active groups found</p>
                   </div>
                </td>
              </tr>
            ) : (
              processedGroups.map((group, index) => (
                <motion.tr 
                  key={group.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.4) }}
                  className="group hover:bg-blue-50/20 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-700 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-200 shadow-sm shadow-blue-100 uppercase">
                        {group.name.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{group.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Academic Group</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {group.courses?.map((c) => (
                        <span key={c.id} className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-800 bg-blue-50 border border-blue-100 rounded">
                          {c.name}
                        </span>
                      )) || <span className="text-slate-400 italic text-[10px]">No courses</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <span className="px-2 py-0.5 text-[10px] font-black text-blue-700 bg-blue-50 rounded-md border border-blue-100">
                      {group._count?.students ?? 0} Students
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/${role}/groups/${group.id}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Group"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => onManageMembers(group)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Manage Members"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(group)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Quick Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(group)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove Group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
