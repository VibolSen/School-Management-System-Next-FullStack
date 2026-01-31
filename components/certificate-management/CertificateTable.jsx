import React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return direction === "asc" ? (
    <ChevronUp className="w-4 h-4 inline ml-1" />
  ) : (
    <ChevronDown className="w-4 h-4 inline ml-1" />
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
  courses, // All available courses for the filter dropdown
  isLoading,
  onBulkIssueClick, // New prop for bulk issue
}) {
  const renderSortIcon = (field) => {
    if (sortField === field) {
      return <SortIndicator direction={sortOrder} />;
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-blue-700 transition-colors duration-300">
          Certificate Directory
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by recipient, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <button
            onClick={onBulkIssueClick}
            className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Issue to Group
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-6 py-3 text-left cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                onClick={() => handleSort("recipient")}
              >
                <div className="flex items-center gap-1.5">
                  Recipient {renderSortIcon("recipient")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                onClick={() => handleSort("course")}
              >
                <div className="flex items-center gap-1.5">
                  Course {renderSortIcon("course")}
                </div>
              </th>
              <th className="px-6 py-3 text-center hover:bg-slate-200 transition-colors duration-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="py-12">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <LoadingSpinner size="md" />
                    <p className="text-slate-400 font-medium animate-pulse">Fetching certificates...</p>
                  </div>
                </td>
              </tr>
            ) : certificates.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-slate-500">
                  No certificates found.
                </td>
              </tr>
            ) : (
              certificates.map((certificate) => (
                <tr
                  key={certificate.id}
                  className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {certificate.recipient}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {getCourseName(certificate.course.id)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-3 text-center">
                    <Link
                      href={`/admin/certificate-management/${certificate.id}`}
                      className="inline-block"
                      title="View Certificate"
                    >
                      <button className="text-blue-600 hover:text-blue-800 transition-all duration-200">
                        <Eye className="w-5 h-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleEditCertificate(certificate)}
                      className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                      title="Edit Certificate"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(certificate)}
                      className="text-red-600 hover:text-red-800 transition-all duration-200"
                      title="Delete Certificate"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
