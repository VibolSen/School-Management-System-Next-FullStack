"use client";

import React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Search, Filter, Group, Award } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return direction === "asc" ? (
    <ChevronUp className="w-3 h-3 text-blue-600" />
  ) : (
    <ChevronDown className="w-3 h-3 text-blue-600" />
  );
};

export default function CertificateTable({
  certificates,
  getCourseName,
  handleEditCertificate,
  handleDeleteCertificate,
  sortField,
  sortOrder,
  handleSort,
  searchTerm,
  setSearchTerm,
  filterCourse,
  setFilterCourse,
  courses,
  isLoading,
  onBulkIssueClick,
}) {
  const renderSortIcon = (field) => {
    if (sortField === field) {
      return <SortIndicator direction={sortOrder} />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-indigo-600 rounded-full" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Credential Registry</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative group flex-1 md:w-48">
            <input
              type="text"
              placeholder="Find recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm appearance-none"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={12} />
          </div>
          
          <div className="relative group flex-1 md:w-48">
             <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={12} />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
          </div>

          <button
            onClick={onBulkIssueClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Group size={14} />
            Group Issue
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th
                className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors"
                onClick={() => handleSort("recipient")}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Recipient Identity {renderSortIcon("recipient")}
                </div>
              </th>
              <th
                className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors"
                onClick={() => handleSort("course")}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course Metadata {renderSortIcon("course")}
                </div>
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {isLoading && certificates.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                      <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Records...</span>
                    </div>
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <Award size={32} className="mx-auto text-slate-200 mb-3" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Credentials found</h3>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Institutional records are currently unpopulated</p>
                  </td>
                </tr>
              ) : (
                certificates.map((cert, index) => (
                  <motion.tr
                    key={cert.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(index * 0.02, 0.4) }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-black text-[10px] shrink-0 border border-slate-200 group-hover:bg-white group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
                            {cert.recipient.charAt(0)}
                          </div>
                          <span className="text-[13px] font-black text-slate-800 tracking-tight">
                            {cert.recipient}
                          </span>
                       </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                       <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest border border-slate-200 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-all">
                          {getCourseName(cert.course.id)}
                       </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/admin/certificate-management/${cert.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Document"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => handleEditCertificate(cert)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit Profile"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Purge Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
