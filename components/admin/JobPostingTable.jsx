"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

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

  const statusColors = {
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800",
    ARCHIVED: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Job Postings</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          {canManage && (
            <button
              onClick={onAddJobClick}
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            >
              Add Job
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("title")}>
                    <div className="flex items-center gap-1.5">Title <SortIndicator direction={sortConfig.key === "title" ? sortConfig.direction : null}/></div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("location")}>
                    <div className="flex items-center gap-1.5">Location <SortIndicator direction={sortConfig.key === "location" ? sortConfig.direction : null}/></div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("employmentType")}>
                    <div className="flex items-center gap-1.5">Employment Type <SortIndicator direction={sortConfig.key === "employmentType" ? sortConfig.direction : null}/></div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("applicationDeadline")}>
                    <div className="flex items-center gap-1.5">Application Deadline <SortIndicator direction={sortConfig.key === "applicationDeadline" ? sortConfig.direction : null}/></div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1.5">Status <SortIndicator direction={sortConfig.key === "status" ? sortConfig.direction : null}/></div>
                </th>
                {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && sortedJobPostings.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="text-center py-8 text-gray-500">
                  Loading job postings...
                </td>
              </tr>
            ) : sortedJobPostings.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="text-center py-8 text-gray-500">
                  No job postings found.
                </td>
              </tr>
            ) : (
              sortedJobPostings.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.employmentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(job.applicationDeadline), "PPP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[job.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  {canManage && <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditClick(job)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClick(job.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>}
                </tr>
              ))
            )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
