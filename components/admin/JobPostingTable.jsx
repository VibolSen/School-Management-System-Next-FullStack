"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Search, Filter, ChevronDown, Briefcase, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return direction === "ascending" ? (
    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );
};

export default function JobPostingTable({
  jobPostings = [],
  onAddJobClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
  currentUserRole,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "applicationDeadline",
    direction: "descending",
  });

  const canManage = currentUserRole === 'ADMIN' || currentUserRole === 'HR';

  const filteredJobPostings = useMemo(() => {
    return jobPostings.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobPostings, searchTerm, statusFilter]);

  const sortedJobPostings = useMemo(() => {
    if (!sortConfig.key) return filteredJobPostings;
    return [...filteredJobPostings].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredJobPostings, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const configs = {
      OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-500/10',
      CLOSED: 'bg-rose-50 text-rose-700 border-rose-100 shadow-sm shadow-rose-500/10',
      ARCHIVED: 'bg-slate-50 text-slate-600 border-slate-200 shadow-sm shadow-slate-500/5',
    };
    return configs[status] || 'bg-slate-50 text-slate-500 border-slate-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-blue-600 rounded-full" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Vacancy Register</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative group flex-1 md:w-48">
            <input
              type="text"
              placeholder="Find vacancy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={12} />
          </div>
          
          <div className="relative group flex-1 md:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={12} />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("title")}>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Position <SortIndicator direction={sortConfig.key === "title" ? sortConfig.direction : null}/>
                </div>
              </th>
              <th className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("location")}>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Site <SortIndicator direction={sortConfig.key === "location" ? sortConfig.direction : null}/>
                </div>
              </th>
              <th className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("employmentType")}>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Type <SortIndicator direction={sortConfig.key === "employmentType" ? sortConfig.direction : null}/>
                </div>
              </th>
              <th className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("applicationDeadline")}>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Deadline <SortIndicator direction={sortConfig.key === "applicationDeadline" ? sortConfig.direction : null}/>
                </div>
              </th>
              <th className="px-5 py-3 text-left cursor-pointer group hover:bg-slate-100/50 transition-colors" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status <SortIndicator direction={sortConfig.key === "status" ? sortConfig.direction : null}/>
                </div>
              </th>
              {canManage && <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Control</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {isLoading && sortedJobPostings.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                      <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Postings...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedJobPostings.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className="py-20 text-center">
                    <Briefcase size={32} className="mx-auto text-slate-200 mb-3" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Vacancies found</h3>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Institutional requirement is currently fulfilled</p>
                  </td>
                </tr>
              ) : (
                sortedJobPostings.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(index * 0.02, 0.4) }}
                    className="group hover:bg-slate-50/50 transition-colors cursor-default"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">
                       <div className="flex flex-col">
                          <span className="text-[13px] font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Position ID: {job.id.slice(-6)}</span>
                       </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tight">
                        <MapPin size={10} className="text-slate-400" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tight">
                        <Clock size={10} className="text-slate-400" />
                        {job.employmentType}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase tracking-tight">
                        {format(new Date(job.applicationDeadline), "MMM dd, yyyy")}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditClick(job)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Listing"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteClick(job.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Purge Listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
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