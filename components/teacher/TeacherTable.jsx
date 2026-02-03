"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, Search, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherTable({
  teachers = [],
  onAddTeacherClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
  canManageTeachers,
  currentUserRole,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.email &&
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [teachers, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header & Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3 bg-slate-50/30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-indigo-600 rounded-full" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Department Faculty List</h2>
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-64 group">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={12} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructor Profile</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact Information</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Assignments</th>
              {canManageTeachers && <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && teachers.length === 0 ? (
              <tr>
                <td colSpan={canManageTeachers ? 4 : 3} className="py-12">
                   <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                   <div className="flex flex-col items-center opacity-40">
                     <Users size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No matching faculty found</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <motion.tr 
                  key={teacher.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.4) }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100">
                        {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{teacher.firstName} {teacher.lastName}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Academic Instructor</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="text-[13px] font-semibold text-slate-600">{teacher.email}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <span className="px-2 py-0.5 text-[10px] font-black text-amber-700 bg-amber-50 rounded-md border border-amber-100 uppercase tracking-wide">
                      {teacher._count?.ledCourses ?? 0} Courses
                    </span>
                  </td>
                  {canManageTeachers && (
                    <td className="px-5 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditClick(teacher)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Quick Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {currentUserRole && (
                          <Link 
                            href={`/${currentUserRole.toLowerCase()}/users/${teacher.id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => onDeleteClick(teacher)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Remove Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}