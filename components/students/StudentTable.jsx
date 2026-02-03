"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentTable({
  students = [],
  onAddStudentClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
  currentUserRole,
  canManageStudents,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [students, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header & Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3 bg-slate-50/30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-indigo-600 rounded-full" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Student Roster</h2>
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
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact Information</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
              {canManageStudents && <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 transition-all">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                   <div className="flex flex-col items-center opacity-40">
                     <Trash2 size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No matching students found</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.4) }}
                  className="group hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{student.firstName} {student.lastName}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Student</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="text-[13px] font-semibold text-slate-600">{student.email}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-[9px] font-black text-indigo-700 bg-indigo-50 rounded-md border border-indigo-100 uppercase tracking-wide">
                      {student.role}
                    </span>
                  </td>
                  {canManageStudents && (
                    <td className="px-5 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        {(currentUserRole === "ADMIN" || currentUserRole === "STUDY_OFFICE") && (
                          <button
                            onClick={() => onEditClick(student)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Quick Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {currentUserRole && (
                          <Link 
                            href={`/${currentUserRole.toLowerCase()}/users/${student.id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        {(currentUserRole === "ADMIN" || currentUserRole === "STUDY_OFFICE") && (
                          <button
                            onClick={() => onDeleteClick(student.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Remove Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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