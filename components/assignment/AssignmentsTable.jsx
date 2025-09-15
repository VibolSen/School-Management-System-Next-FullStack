// AssignmentsTable.jsx
"use client";

import React, { useState, useMemo } from "react";

const getStatusBadge = (statusName) => {
  const styleMap = {
    Submitted: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Late: "bg-red-100 text-red-800",
    Graded: "bg-blue-100 text-blue-800",
  };
  const style = styleMap[statusName] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style}`}>
      {statusName}
    </span>
  );
};

export default function AssignmentsTable({
  assignments = [],
  onAddClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssignments = useMemo(() => {
    return assignments.filter(
      (a) =>
        (a.assignment?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (a.student?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (a.assignment?.course?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (a.groupAssignment?.group?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [assignments, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Assignment
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Course</th>
              <th className="p-3">Student</th>
              <th className="p-3">Group</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && assignments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No assignments found.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {a.assignment?.title || "N/A"}
                  </td>
                  <td className="p-3">
                    {a.assignment?.course?.title || "N/A"}
                  </td>
                  <td className="p-3">{a.student?.name || "N/A"}</td>
                  <td className="p-3">
                    {a.groupAssignment?.group?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {a.assignment?.dueDate
                      ? new Date(a.assignment.dueDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{getStatusBadge(a.status?.name)}</td>
                  <td className="p-3">{a.grade ?? "Not Graded"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => onEditClick(a)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(a.id)}
                      className="text-red-600 hover:underline"
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
