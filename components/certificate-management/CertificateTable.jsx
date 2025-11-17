import React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  onAddCertificateClick, // New prop for add button
  searchTerm,
  setSearchTerm,
  filterCourse,
  setFilterCourse,
  courses, // All available courses for the filter dropdown
}) {
  const renderSortIcon = (field) => {
    if (sortField === field) {
      return <SortIndicator direction={sortOrder} />;
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-slate-800">Certificate Management</h2>
              <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by recipient, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={onAddCertificateClick}
                  className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Add New Certificate
                </button>
              </div>
            </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => handleSort("recipient")}
              >
                <div className="flex items-center gap-1.5">
                  Recipient {renderSortIcon("recipient")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => handleSort("course")}
              >
                <div className="flex items-center gap-1.5">
                  Course {renderSortIcon("course")}
                </div>
              </th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-3 px-4 text-center text-gray-500">
                  No certificates found.
                </td>
              </tr>
            ) : (
              certificates.map((certificate) => (
                <tr
                  key={certificate.id}
                  className="hover:bg-slate-50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/certificate-management/${certificate.id}`}
                      className="text-blue-600 hover:underline font-medium text-slate-800"
                    >
                      {certificate.recipient}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {getCourseName(certificate.course.id)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditCertificate(certificate)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(certificate)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
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
